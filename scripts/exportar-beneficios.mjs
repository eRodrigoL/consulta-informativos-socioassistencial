import { mkdir, writeFile } from 'node:fs/promises';

const previa = process.argv.includes('--rascunhos');
if (previa && process.env.CF_PAGES) {
  throw new Error('A exportação de rascunhos está disponível apenas para prévia local.');
}

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

const [fichas, fundamentos, documentos, parametros, revisoes] = await Promise.all(
  ['Fichas', 'Fundamentações', 'Fontes', 'Parâmetros', 'Revisões'].map(lerTabela),
);

const fontes = new Map(documentos.map(({ id, fields }) => [id, fields]));

function referencia(ids, trecho) {
  const fonte = ids?.length === 1 ? fontes.get(ids[0]) : undefined;
  if (!fonte?.['URL oficial']?.startsWith('https://') || !fonte.Título || !trecho) {
    throw new Error('A publicação exige uma fonte oficial com referência específica.');
  }
  return { titulo: fonte.Título, url: fonte['URL oficial'], trecho };
}

function podeExportar(situacao, aprovada) {
  return situacao === aprovada || (previa && ['Rascunho', 'Em revisão'].includes(situacao));
}

function referenciasDaFicha(id) {
  return fundamentos
    .filter(({ fields }) => fields.Ficha?.includes(id))
    .map(({ fields }) => referencia(fields.Fonte, fields['Referência específica']));
}

const publicaveis = fichas.filter(({ fields }) =>
  ['Consulta', 'Benefícios'].includes(fields.Tema) && podeExportar(fields.Situação, 'Aprovada'),
);
const paginas = [];
const beneficios = [];
const ids = new Set();
for (const { id, fields } of publicaveis) {
  const item = {
    id: fields.ID,
    titulo: fields.Título,
    descricao: fields['Descrição'],
    fontes: referenciasDaFicha(id),
  };
  if (!item.id || !item.titulo || !item.fontes.length || ids.has(item.id)) {
    throw new Error(`Identificação ou fontes inválidas: ${fields.ID ?? id}.`);
  }
  ids.add(item.id);
  if (fields.Tema === 'Consulta') {
    if (!item.descricao) throw new Error(`Página sem descrição: ${item.id}.`);
    paginas.push(item);
    continue;
  }
  const beneficio = {
    ...item,
    abrangencia: fields.Abrangência,
    territorio: fields.Território,
    direito: fields['Direito concedido'],
    publico: fields['Quem tem direito'],
    obtencao: fields['Critérios para obter'],
    manutencao: fields['Critérios para manter'],
    solicitacao: fields['Como solicitar'],
  };
  if (!beneficio.abrangencia || !beneficio.direito || !beneficio.obtencao || !beneficio.manutencao) {
    throw new Error(`Ficha incompleta: ${item.id}.`);
  }
  beneficios.push(beneficio);
}

const salariosMinimos = parametros
  .filter(({ fields }) => fields.Nome === 'Salário mínimo nacional' && podeExportar(fields.Situação, 'Aprovado'))
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

const fundamentosPorId = new Map(fundamentos.map(({ id, fields }) => [id, fields]));
const atualizacoes = revisoes
  .filter(({ fields }) => fields.Situação === 'Publicada' && fields['Exibir em Atualizações'])
  .map(({ id, fields }) => ({
    id,
    titulo: fields.Título,
    resumo: fields['Resumo público'],
    publicadaEm: fields['Data de publicação'],
    efeitosEm: fields['Início dos efeitos'],
    fontes: (fields['Fundamentações da mudança'] ?? []).map((fundamentoId) => {
      const fundamento = fundamentosPorId.get(fundamentoId);
      return referencia(fundamento?.Fonte, fundamento?.['Referência específica']);
    }),
  }))
  .filter(({ titulo, resumo, publicadaEm, fontes }) => titulo && resumo && publicadaEm && fontes.length)
  .sort((a, b) => b.publicadaEm.localeCompare(a.publicadaEm));

if (previa) await mkdir(new URL('../.preview/', import.meta.url), { recursive: true });

await writeFile(
  new URL(previa ? '../.preview/beneficios.previa.json' : '../public/beneficios.json', import.meta.url),
  JSON.stringify({ paginas, beneficios, salariosMinimos, atualizacoes }, null, 2) + '\n',
);
