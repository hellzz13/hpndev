# Engenharia do portfólio

## Stack existente

- Next.js 16 (Active LTS) com Pages Router, React 19 e TypeScript estrito.
- O build e o servidor local usam Webpack: o Turbopack falhou ao iniciar o processo de PostCSS neste ambiente.
- Tailwind como padrão de estilização para páginas e componentes React. Desktop, mesas, janelas e 404 usam os tokens do tema e utilitários Tailwind.
- npm e `package-lock.json`; sem dependência nova para a primeira entrega.
- Conteúdo local, sem API ou persistência.

## Organização

`src/pages/index.tsx` compõe a página e conecta as ações dos aplicativos. Em `src/portfolio/`, `constants.ts` reúne IDs e valores estáveis da interface; `content.ts` guarda os textos e listas apresentados; `terminal.ts` interpreta comandos sem depender de React; `useWindowManager.ts` controla o estado das janelas; e `DesktopWindow.tsx` desenha a moldura e implementa o arrasto. `styles.ts` reúne as composições Tailwind; o tema centraliza tokens, e `src/styles/globals.css` contém somente a base compartilhada. O fluxo está explicado em [Janelas e arrasto](WINDOWS.md).

As mesas `HOME` e `PROJECTS` ficam em `src/portfolio/constants.ts`. A página mantém a mesa ativa e desloca o painel horizontal. `useWindowManager` guarda a mesa de cada janela; abrir um aplicativo a atribui à mesa atual, e a página renderiza somente as janelas dessa mesa. A seção de projetos segue no HTML inicial para indexação, mesmo quando a mesa está inativa.

## Estilização

Os tokens de cores, espaçamento, medidas, tipografia e estados ficam em `tailwind.config.js`. Usar nomes semânticos para cores e layout e a escala compartilhada de espaçamento, evitando valores arbitrários no JSX. As composições de utilitários do desktop ficam em `src/portfolio/styles.ts`. Consulte [Tokens visuais](DESIGN_TOKENS.md) para os papéis das cores, exemplos e critérios de revisão.

- Novos componentes, páginas e alterações de estilo devem usar utilitários Tailwind como primeira opção.
- `globals.css` fica reservado à base compartilhada (diretivas do Tailwind, fontes, reset e variáveis) e a exceções com justificativa técnica forte. Não adicionar estilos específicos de página ou componente por conveniência.
- Antes de uma exceção, demonstrar por que utilitários, variantes, valores arbitrários ou configuração do Tailwind não resolvem o caso de forma sustentável. Registrar a razão, o escopo e a alternativa avaliada nesta documentação e na entrega.
- O CSS global existente é legado, não precedente para novas exceções. Migrar em alterações delimitadas, preservando aparência, responsividade, foco e movimento reduzido.
- Na revisão do diff, conferir a estilização explicitamente: classes novas no global precisam de justificativa documentada. Lint, tipos e build não garantem essa regra por si só.

## Convenções para regras e constantes

- Conjuntos fechados, como IDs de aplicativos e comandos, usam objetos `as const`; o tipo correspondente é derivado do objeto.
- Valores estáveis compartilhados ficam no menor `constants.ts` coerente. Textos e listas de apresentação ficam em `content.ts`; regras de fluxo ficam em funções próprias, como `resolveTerminalCommand` em `terminal.ts`.
- Condições que decidem o fluxo recebem nomes que expressam a intenção (`canStartDrag`, `alreadyOpen`, `shouldClear`) antes de serem usadas.
- O módulo declara suas constantes, tipos e funções primeiro e reúne os exports no final. Páginas Next.js mantêm o `export default` no final.
- Não criar arquivos `constants.ts` globais ou separar valores usados uma única vez apenas para cumprir uma forma: a divisão deve ajudar a encontrar a responsabilidade.

## Comportamento e qualidade

- Comandos aceitos são uma lista fechada e jamais executam código do usuário.
- Estado das janelas vive na sessão React, sem armazenamento local.
- Controles têm nomes acessíveis, foco visível e suporte a teclado.
- Movimento respeita limites da viewport; em celular, janelas usam layout adaptado sem arrastar.
- Imagens têm texto alternativo e animações respeitam movimento reduzido.

## Gates

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- Revisão manual do desktop, terminal, projetos e layout móvel quando preview estiver disponível.

## Revisão das regras

O `project-spec-starter` gera documentos iniciais, mas não aplica suas convenções ao código nem cria um gate automático. Antes de concluir uma mudança, conferir o diff contra as regras aplicáveis deste documento e de `BUSINESS_RULES.md`: tipos derivados de conjuntos fechados, condições nomeadas, localização de constantes e conteúdo, exports no fim, acessibilidade e comportamento das janelas. Registrar exceções reais na entrega. Essa revisão faltou na primeira implementação do desktop e motivou a reorganização posterior.
