import { writeFile } from 'node:fs/promises';

const { AIRTABLE_BASE_ID, AIRTABLE_TOKEN } = process.env;
if (!AIRTABLE_BASE_ID || !AIRTABLE_TOKEN) {
  throw new Error('Defina AIRTABLE_BASE_ID e AIRTABLE_TOKEN para exportar o catálogo.');
}

async function lerTabela(nome) {
  const url = new URL(`https://api.airtable.com/v0/${encodeURIComponent(AIRTABLE_BASE_ID)}/${encodeURIComponent(nome)}`);
  const registros = [];
  do {
    const resposta = await fetch(url, {
      headers: { Authorization: `Bearer ${AIRTABLE_TOKEN}` },
      signal: AbortSignal.timeout(30000),
    });
    if (!resposta.ok) throw new Error(`Falha ao ler ${nome}: HTTP ${resposta.status}.`);
    const { records, offset } = await resposta.json();
    registros.push(...records);
    if (!offset) return registros;
    url.searchParams.set('offset', offset);
  } while (true);
}

const [fichas, fundamentos, documentos, parametros] = await Promise.all(
  ['Fichas', 'Fundamentações', 'Fontes', 'Parâmetros'].map(lerTabela),
);

const fontes = new Map(documentos.map(({ id, fields }) => [id, fields]));

function referencia(ids, trecho) {
  const fonte = ids?.length === 1 ? fontes.get(ids[0]) : undefined;
  if (!fonte?.['URL oficial']?.startsWith('https://') || !fonte.Título || !trecho) {
    throw new Error('A publicação exige uma fonte oficial com referência específica.');
  }
  return { titulo: fonte.Título, url: fonte['URL oficial'], trecho };
}

const beneficios = fichas
  .filter(({ fields }) => fields.Tema === 'Benefícios' && fields.Situação === 'Aprovada')
  .map(({ id, fields }) => {
    const item = {
      id: fields.ID,
      titulo: fields.Título,
      abrangencia: fields.Abrangência,
      territorio: fields.Território,
      direito: fields['Direito concedido'],
      obtencao: fields['Critérios para obter'],
      manutencao: fields['Critérios para manter'],
      solicitacao: fields['Como solicitar'],
      fontes: fundamentos
        .filter(({ fields: fundamento }) => fundamento.Ficha?.includes(id))
        .map(({ fields: fundamento }) => referencia(fundamento.Fonte, fundamento['Referência específica'])),
    };
    if (!item.id || !item.titulo || !item.abrangencia || !item.direito ||
        !item.obtencao || !item.manutencao || !item.fontes.length) {
      throw new Error(`Ficha incompleta: ${fields.ID ?? id}.`);
    }
    return item;
  });

if (new Set(beneficios.map(({ id }) => id)).size !== beneficios.length) {
  throw new Error('As fichas aprovadas precisam ter IDs únicos.');
}

const salariosMinimos = parametros
  .filter(({ fields }) => fields.Nome === 'Salário mínimo nacional' && fields.Situação === 'Aprovado')
  .map(({ fields }) => {
    const centavos = fields['Valor em centavos'];
    const inicio = fields['Início da vigência'];
    const fim = fields['Fim da vigência'];
    if (!inicio || (fim && fim < inicio) || !Number.isSafeInteger(centavos) || centavos <= 0) {
      throw new Error('Parâmetro de salário mínimo inválido.');
    }
    return { inicio, fim, centavos, fonte: referencia(fields.Fonte, fields['Referência específica']) };
  });

if (new Set(salariosMinimos.map(({ inicio }) => inicio)).size !== salariosMinimos.length) {
  throw new Error('Datas de início duplicadas no parâmetro de salário mínimo.');
}

await writeFile(
  new URL('../public/beneficios.json', import.meta.url),
  JSON.stringify({ beneficios, salariosMinimos }, null, 2) + '\n',
);
