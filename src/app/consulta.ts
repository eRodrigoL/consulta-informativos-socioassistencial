export interface ItemConsulta {
  id: string;
  rotulo: string;
  titulo?: string;
  filhos?: ItemConsulta[];
  beneficio?: true;
}

export const arvoreConsulta: ItemConsulta[] = [
  {
    id: 'atualizacoes',
    rotulo: 'Atualizações',
  },
  {
    id: 'atendimentos',
    rotulo: 'Atendimentos do CRAS',
    filhos: [
      {
        id: 'PAIF',
        rotulo: 'PAIF',
        titulo: 'Serviço de Proteção e Atendimento Integral à Família',
      },
      {
        id: 'SCFV',
        rotulo: 'SCFV',
        titulo: 'Serviço de Convivência e Fortalecimento de Vínculos',
      },
      {
        id: 'orientacao',
        rotulo: 'Orientação e encaminhamentos',
      },
    ],
  },
  {
    id: 'cadastro-unico',
    rotulo: 'Cadastro Único',
    filhos: [
      {
        id: 'cadastro-maua',
        rotulo: 'Inscrição e atualização em Mauá',
      },
      {
        id: 'programas-cadastro',
        rotulo: 'Programas que usam o cadastro',
      },
    ],
  },
  {
    id: 'beneficios',
    rotulo: 'Benefícios',
    filhos: [
      {
        id: 'eventuais-maua',
        rotulo: 'Benefícios eventuais de Mauá',
        filhos: [
          {
            id: 'eventual-nascimento',
            rotulo: 'Nascimento',
            titulo: 'Benefício eventual por nascimento',
            beneficio: true,
          },
          {
            id: 'eventual-morte',
            rotulo: 'Morte de membro familiar',
            titulo: 'Benefício eventual por morte de membro familiar',
            beneficio: true,
          },
          {
            id: 'eventual-vulnerabilidade',
            rotulo: 'Vulnerabilidade temporária',
            titulo: 'Benefício eventual por vulnerabilidade temporária',
            beneficio: true,
          },
          {
            id: 'eventual-emergencia',
            rotulo: 'Emergência ou calamidade pública',
            titulo: 'Benefício eventual por emergência ou calamidade pública',
            beneficio: true,
          },
        ],
      },
      {
        id: 'bpc',
        rotulo: 'BPC',
        titulo: 'Benefício de Prestação Continuada (BPC)',
        beneficio: true,
      },
      {
        id: 'auxilio-inclusao',
        rotulo: 'Auxílio-Inclusão',
        beneficio: true,
      },
      {
        id: 'bolsa-familia',
        rotulo: 'Bolsa Família',
        titulo: 'Programa Bolsa Família',
        beneficio: true,
      },
      {
        id: 'gas-do-povo',
        rotulo: 'Gás do Povo',
        beneficio: true,
      },
    ],
  },
];

export function localizarItem(itens: ItemConsulta[], id: string): ItemConsulta | undefined {
  for (const item of itens) {
    if (item.id === id) return item;
    const filho = item.filhos && localizarItem(item.filhos, id);
    if (filho) return filho;
  }
  return undefined;
}
