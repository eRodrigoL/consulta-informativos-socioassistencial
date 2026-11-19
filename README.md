# Consulta de Informativos Socioassistenciais

Aplicação web em planejamento para profissionais do Sistema Único de Assistência Social (SUAS), com foco no atendimento nos Centros de Referência de Assistência Social (CRAS). O projeto tem como referência inicial o CRAS Parque das Américas, em Mauá (SP). O recorte inicial abrange o Serviço de Proteção e Atendimento Integral à Família (PAIF) e o Serviço de Convivência e Fortalecimento de Vínculos (SCFV).

## Consulta

A página será gratuita e aberta, sem cadastro ou login. A navegação será feita por uma árvore de assuntos e por busca textual. Cada ficha terá um link direto, uma resposta curta, a abrangência da orientação, a referência específica ao documento oficial e a data da última verificação.

A seção **Atualizações** reunirá mudanças relevantes em benefícios, critérios, documentação e fluxos. Cada registro indicará o que mudou, a abrangência, a data de início dos efeitos quando conhecida e a fonte oficial. Quando houver uma ficha relacionada, a atualização apontará para ela.

## Edição e publicação

A interface está prevista em Angular e Angular Material. O Airtable é a base editorial prevista para fichas, fontes, fundamentações e revisões. Cada fundamentação vincula uma ficha ao trecho que sustenta a informação, como um artigo, uma seção ou uma página.

Ferramentas de IA podem apoiar a identificação de mudanças em fontes oficiais. A publicação depende da conferência das fontes oficiais e de revisão humana. Orientações locais exigem documentação oficial aplicável à unidade. O histórico de revisões registra o conteúdo aprovado e suas referências.

A página estática será gerada a partir de uma exportação dos campos aprovados para publicação. O fluxo inicial será manual e não exigirá planos pagos. Credenciais, rascunhos e dados pessoais de pessoas atendidas ficam fora dos dados publicados. A base editorial também não armazena dados de atendimento.

## Estado do projeto

O projeto está em planejamento. O próximo marco é validar o modelo editorial com fichas de PAIF e SCFV antes de implementar a interface.

## Contribuição

Consulte as [convenções Git para branches e commits](https://github.com/eRodrigoL/docs/blob/main/conven%C3%A7%C3%B5es-git--branches-e-commits.md).

## Desenvolvimento local

Use Node.js 24. Instale as dependências com `npm ci` e inicie o servidor com `npm start`.

## Publicação estática

Execute `npm run build` para gerar a página. O diretório de publicação é `dist/consulta-cras/browser`. No Cloudflare Pages, configure esse diretório como saída e use `npm run build` como comando de compilação.

### Catálogo de benefícios

A compilação exporta o catálogo quando `AIRTABLE_BASE_ID` e `AIRTABLE_TOKEN` estão configurados no ambiente de build. Use um token com leitura de registros e acesso restrito à base editorial. O navegador recebe apenas o arquivo estático `beneficios.json`. Em desenvolvimento, `npm run exportar:beneficios` permite gerar esse arquivo antes de iniciar o servidor. Sem credenciais, o projeto usa o catálogo disponível no diretório `public`, que começa vazio.

O catálogo inclui fichas do tema **Benefícios** com situação **Aprovada** e referências específicas. O parâmetro **Salário mínimo nacional** usa valor em centavos, datas de vigência e fonte oficial. Marque-o como **Aprovado** após revisão. Use `{{sm:1/4}}` depois da expressão normativa para apresentar o equivalente em reais. Outros exemplos incluem `{{sm:1/2}}` e `{{sm:2}}`. Uma nova build é necessária após aprovar registros novos no Airtable.
