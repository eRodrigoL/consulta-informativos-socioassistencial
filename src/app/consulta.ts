export interface ItemConsulta {
  id: string;
  rotulo: string;
  titulo?: string;
  descricao?: string;
  fontes?: { titulo: string; url: string }[];
  filhos?: ItemConsulta[];
  beneficio?: true;
}

const planoMunicipal = {
  titulo: 'Plano Municipal de Assistência Social de Mauá 2026–2029',
  url: 'https://dom.maua.sp.gov.br/public/docs/b51b4c19cda3f3aacda77e7c14ec1b39.pdf',
};
const orientacoesPaif = {
  titulo: 'Orientações técnicas sobre o PAIF',
  url: 'https://aplicacoes.mds.gov.br/snas/documentos/orientacoes-tecnicas-sobre-o-paif-trabalho-social-com-familias.pdf',
};
const listaCadUnico = {
  titulo: 'Lista federal de programas que usam o Cadastro Único',
  url: 'https://www.gov.br/mds/pt-br/noticias-e-conteudos/publicacoes/cidadania/Lista_de_Programas_federais_Usuarios_do_Cadastro_abril_2025.pdf',
};
const beneficiosMaua = {
  titulo: 'Resolução CMAS Mauá nº 39/2020, arts. 4º a 10',
  url: 'https://dom.maua.sp.gov.br/public/docs/0ab1d70d-7947-427e-bf15-855d64dc9f43.pdf',
};

const loas = 'https://www.planalto.gov.br/ccivil_03/leis/l8742.htm';

export const arvoreConsulta: ItemConsulta[] = [
  { id: 'atualizacoes', rotulo: 'Atualizações' },
  {
    id: 'atendimentos',
    rotulo: 'Atendimentos do CRAS',
    descricao:
      'O CRAS é uma unidade da Proteção Social Básica. O Plano Municipal registra a oferta de PAIF e SCFV no CRAS Parque das Américas.',
    fontes: [planoMunicipal],
    filhos: [
      {
        id: 'PAIF',
        rotulo: 'PAIF',
        titulo: 'Serviço de Proteção e Atendimento Integral à Família',
        descricao:
          'Trabalho social continuado com famílias. Entre as ações estão acolhida, atendimento e acompanhamento familiar, oficinas, ações comunitárias, atendimentos particularizados e encaminhamentos.',
        fontes: [orientacoesPaif, planoMunicipal],
      },
      {
        id: 'SCFV',
        rotulo: 'SCFV',
        titulo: 'Serviço de Convivência e Fortalecimento de Vínculos',
        descricao:
          'Serviço realizado em grupos, com atividades organizadas conforme os ciclos de vida. Complementa o trabalho social com famílias e fortalece a convivência familiar e comunitária.',
        fontes: [
          {
            titulo: 'Serviço de Convivência e Fortalecimento de Vínculos · MDS',
            url: 'https://www.gov.br/mds/pt-br/acoes-e-programas/SUAS/servicos-e-programas-1/convivencia-e-fortalecimento-de-vinculos',
          },
          planoMunicipal,
        ],
      },
      {
        id: 'orientacao',
        rotulo: 'Orientação e encaminhamentos',
        descricao:
          'O CRAS orienta sobre direitos, benefícios e serviços e encaminha demandas à rede. O Plano Municipal indica o CREAS Matriz como referência da Proteção Social Especial para o território do Parque das Américas.',
        fontes: [orientacoesPaif, planoMunicipal],
      },
    ],
  },
  {
    id: 'cadastro-unico',
    rotulo: 'Cadastro Único',
    descricao:
      'O Cadastro Único registra informações das famílias para acesso a políticas públicas. Cada programa aplica seus próprios critérios e procedimentos de seleção.',
    fontes: [listaCadUnico],
    filhos: [
      {
        id: 'cadastro-maua',
        rotulo: 'Inscrição e atualização em Mauá',
        descricao:
          'A Prefeitura orienta o agendamento pela Central do Cadastro Único. Quem não tem celular ou acesso à internet pode procurar o CRAS de referência para receber auxílio.',
        fontes: [
          {
            titulo: 'Cadastro Único em Mauá · Prefeitura',
            url: 'https://www.maua.sp.gov.br/Destaques/Detalhes/1',
          },
        ],
      },
      {
        id: 'programas-cadastro',
        rotulo: 'Programas que usam o cadastro',
        descricao:
          'Além de Bolsa Família, BPC e Gás do Povo, o Cadastro Único é utilizado por programas como a Tarifa Social de Energia Elétrica, a Tarifa Social de Água e Esgoto, a Carteira da Pessoa Idosa, o ID Jovem, o Pé-de-Meia e o Minha Casa Minha Vida. Consulte o canal de cada programa para conhecer suas regras.',
        fontes: [listaCadUnico],
      },
    ],
  },
  {
    id: 'beneficios',
    rotulo: 'Benefícios',
    descricao:
      'O acesso depende do benefício. A rede socioassistencial avalia os benefícios eventuais de Mauá. O INSS recebe os pedidos de BPC e Auxílio-Inclusão. Bolsa Família e Gás do Povo usam os dados do Cadastro Único para seleção.',
    fontes: [
      {
        titulo: 'Benefícios assistenciais · MDS',
        url: 'https://www.gov.br/mds/pt-br/acoes-e-programas/SUAS/beneficios-assistenciais',
      },
      listaCadUnico,
    ],
    filhos: [
      {
        id: 'eventuais-maua',
        rotulo: 'Benefícios eventuais de Mauá',
        descricao:
          'São provisões temporárias para situações de nascimento, morte, vulnerabilidade temporária, emergência ou calamidade. A equipe de referência da rede de Mauá avalia a situação e aplica a regulamentação municipal.',
        fontes: [beneficiosMaua],
        filhos: [
          {
            id: 'eventual-nascimento',
            rotulo: 'Nascimento',
            titulo: 'Benefício eventual por nascimento',
            descricao:
              'Apoio temporário relacionado ao nascimento, conforme a regulamentação de Mauá.',
            fontes: [
              { ...beneficiosMaua, titulo: 'Resolução CMAS Mauá nº 39/2020, arts. 11 a 13' },
            ],
            beneficio: true,
          },
          {
            id: 'eventual-morte',
            rotulo: 'Morte de membro familiar',
            titulo: 'Benefício eventual por morte de membro familiar',
            descricao:
              'Apoio para atender às necessidades urgentes da família após a morte de um de seus membros.',
            fontes: [
              { ...beneficiosMaua, titulo: 'Resolução CMAS Mauá nº 39/2020, arts. 14 a 17' },
            ],
            beneficio: true,
          },
          {
            id: 'eventual-vulnerabilidade',
            rotulo: 'Vulnerabilidade temporária',
            titulo: 'Benefício eventual por vulnerabilidade temporária',
            descricao:
              'Apoio temporário diante de situações como falta de alimentação ou dificuldade de acesso à documentação pessoal.',
            fontes: [
              { ...beneficiosMaua, titulo: 'Resolução CMAS Mauá nº 39/2020, arts. 18 a 25' },
            ],
            beneficio: true,
          },
          {
            id: 'eventual-emergencia',
            rotulo: 'Emergência ou calamidade pública',
            titulo: 'Benefício eventual por emergência ou calamidade pública',
            descricao:
              'Apoio temporário a pessoas e famílias atingidas por emergência ou calamidade pública.',
            fontes: [{ ...beneficiosMaua, titulo: 'Resolução CMAS Mauá nº 39/2020, art. 27' }],
            beneficio: true,
          },
        ],
      },
      {
        id: 'bpc',
        rotulo: 'BPC',
        titulo: 'Benefício de Prestação Continuada (BPC)',
        descricao:
          'Benefício assistencial mensal para pessoas idosas e pessoas com deficiência que cumprem os requisitos legais.',
        fontes: [{ titulo: 'LOAS, art. 20', url: loas }],
        beneficio: true,
      },
      {
        id: 'auxilio-inclusao',
        rotulo: 'Auxílio-Inclusão',
        descricao:
          'Benefício assistencial associado ao BPC para pessoas com deficiência que ingressam em atividade remunerada e cumprem os requisitos legais.',
        fontes: [{ titulo: 'LOAS, arts. 26-A a 26-F', url: loas }],
        beneficio: true,
      },
      {
        id: 'bolsa-familia',
        rotulo: 'Bolsa Família',
        titulo: 'Programa Bolsa Família',
        descricao:
          'Programa federal de transferência de renda. A seleção usa os dados das famílias inscritas no Cadastro Único.',
        fontes: [
          {
            titulo: 'Lei nº 14.601/2023, arts. 5º a 7º',
            url: 'https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14601.htm',
          },
        ],
        beneficio: true,
      },
      {
        id: 'gas-do-povo',
        rotulo: 'Gás do Povo',
        descricao:
          'Programa federal que disponibiliza vale para recarga de gás de cozinha em revenda credenciada. A seleção usa os dados do Cadastro Único.',
        fontes: [
          {
            titulo: 'Gás do Povo · MDS',
            url: 'https://www.gov.br/mds/pt-br/acoes-e-programas/gas-do-povo/gas-do-povo',
          },
        ],
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
