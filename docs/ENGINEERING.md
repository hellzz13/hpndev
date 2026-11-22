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

## Idiomas

O roteamento i18n nativo do Pages Router entrega português (`pt-BR`, `/`) e inglês (`en`, `/en`), inclusive HTML estático localizado e 404. `locales.ts` reúne os IDs e a preferência; `messages.ts` contém catálogos com o mesmo conjunto de chaves, verificado pelo TypeScript; `content.en.ts` traduz os textos dos projetos e da experiência. `useLanguage` lê o locale do router, e `LanguageSwitcher` apresenta o menu de idioma na barra do sistema e na 404.

A troca usa navegação cliente com o mesmo componente de página, sem chave por URL e sem reiniciar `useWindowManager`, o projeto selecionado ou o histórico do terminal. Novas respostas do terminal usam o idioma ativo; linhas anteriores preservam seu texto. O idioma explícito na URL prevalece; ao entrar pela raiz, o Next negocia primeiro o cookie `NEXT_LOCALE`, depois o idioma do navegador, com português como padrão. O cookie dura até um ano, é restrito ao mesmo site e não contém dados de janelas. Se o armazenamento for bloqueado, a troca continua disponível. O Next define `lang` no HTML inicial e o atualiza nas transições cliente; não é necessário sincronizá-lo com um efeito em `_app`. Metadados e sitemap acompanham as duas rotas.

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

## Efeitos e responsabilidades do framework

Antes de adicionar ou alterar um `useEffect`, responder:

1. Qual sistema externo precisa ser sincronizado com React? Identificar concretamente o timer, listener, DOM ou integração envolvida.
2. O resultado pode ser calculado durante o render ou tratado no evento que o causa? Evitar estado espelhado, cadeias de efeitos e efeitos usados somente para transformar dados.
3. A versão instalada do React/Next já realiza essa sincronização? Conferir a documentação local ou a implementação relevante antes de criar uma solução própria. Exemplo deste projeto: o router do Next já atualiza `document.documentElement.lang` ao mudar o locale.
4. As dependências estão completas e há cleanup quando necessário? Verificar criação/remoção de listeners, timers e assinaturas, inclusive a repetição de montagem em Strict Mode.

Na revisão do diff, examinar cada efeito novo ou alterado e relatar na entrega seu propósito e a evidência da necessidade. Caso a solução própria sobreponha um comportamento nativo, removê-la ou documentar a limitação concreta que justifica a exceção. Efeitos legítimos, como o timer do relógio e a sincronização da rolagem do terminal, continuam permitidos.

O ESLint já usa as regras de React Hooks fornecidas pelo Next. Elas ajudam com dependências e padrões incorretos, mas não provam que um efeito é necessário nem detectam toda duplicação de responsabilidade do framework. Essa verificação exige revisão explícita, também lembrada no template de pull request.

## Comportamento e qualidade

`ProjectIdentity.tsx` apresenta nome e logo; `StackTags.tsx` apresenta as tecnologias com ícones decorativos e nomes legíveis. O catálogo tipado `StackIcons` fica em `constants.ts`; logos e stacks são associados aos projetos em `content.ts`. As imagens locais em `public/projects/` vêm de `apps/web/src/assets/brand/disciplinehub-symbol.png` do checkout DisciplineHub e de `website/favicon.svg` do checkout project-spec-starter. O DisciplineHub usa uma versão editada com fundo externo transparente para remover os filetes brancos; o original foi preservado. O segundo usa o símbolo do site como identidade no portfólio. Não substituir por marcas inventadas sem uma decisão de identidade visual.

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

Incluir nessa revisão a necessidade de cada efeito novo/alterado e a eventual duplicação de recursos do framework. A mesma revisão vale para entregas diretas, mesmo quando não houver PR.
