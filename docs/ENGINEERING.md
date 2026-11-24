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

### Formatação antes da validação

Após cada alteração, formatar os arquivos alterados com o equivalente ao “Format Document”/format on save do VS Code. Respeitar a configuração do workspace, da linguagem e do formatter, incluindo opções de projeto quando existirem. A configuração atual do editor usa Prettier para TypeScript/TSX e `source.fixAll.eslint` ao salvar: aplicar formatação e correções do ESLint nesses arquivos, revisar o diff e só então executar os gates.

O repositório ainda não possui Prettier próprio nem script de formatação. Enquanto isso, usar a instalação disponível na extensão do VS Code, sem adicionar dependência implicitamente. Se o formatter estiver indisponível, informar a limitação; não declarar lint como equivalente à formatação. Evitar formatar arquivos sem relação com a mudança. Aplicar novamente o formatter após ajustes posteriores.

- `npx tsc --noEmit`
- `npm run lint`
- `npm run build`
- Revisão manual do desktop, terminal, projetos e layout móvel quando preview estiver disponível.

## Revisão das regras

O `project-spec-starter` gera documentos iniciais, mas não aplica suas convenções ao código nem cria um gate automático. Antes de concluir uma mudança, conferir o diff contra as regras aplicáveis deste documento e de `BUSINESS_RULES.md`: tipos derivados de conjuntos fechados, condições nomeadas, localização de constantes e conteúdo, exports no fim, acessibilidade e comportamento das janelas. Registrar exceções reais na entrega. Essa revisão faltou na primeira implementação do desktop e motivou a reorganização posterior.

Incluir nessa revisão a necessidade de cada efeito novo/alterado e a eventual duplicação de recursos do framework. A mesma revisão vale para entregas diretas, mesmo quando não houver PR.

## Visão geral das mesas

`WorkspaceOverview.tsx` apresenta mesas e prévias de janelas a partir do estado existente, sem instanciar `DesktopWindow` ou remontar aplicativos. As miniaturas de mesa usam posições relativas limitadas ao seu quadro; as prévias maiores usam grade responsiva sem sobreposição. Conteúdo é resumido a dados da sessão, incluindo o projeto selecionado e as duas últimas respostas do terminal. Abertura/seleção pertencem aos handlers da página; nenhum efeito novo foi necessário.

O `Dialog` do Headless UI, dependência já existente, oferece modal, isolamento do fundo, contenção/restauração de foco e Escape. Não duplicar esses comportamentos com listeners próprios. A transição usa Tailwind e respeita movimento reduzido. Os botões das mesas preservam a troca direta. O botão de grade abre a visão geral apenas por ação explícita; não usar hover para interromper a navegação rápida com um modal.

## Atalhos das mesas

`useWorkspaceShortcuts.ts` registra um listener de `keydown` no documento, com cleanup ao desmontar ou mudar sua ativação. O efeito sincroniza esse listener externo; o Next/React não implementa atalhos específicos do portfólio. A navegação usa atualização funcional da mesa para evitar closures antigas; não interfere no gerenciador de janelas. Chaves e rótulo ficam em `constants.ts`. Eventos de edição, composição, repetição, menus e diálogos são ignorados antes de chamar `preventDefault`. O listener só existe na home e não altera a 404.

A indicação do atalho usa `WorkspaceShortcutHint.tsx`, com elementos semânticos `kbd`, tokens Tailwind e nome acessível completo. A referência visual são os keycaps do shadcn/ui e a notação de teclas do macOS, sem incorporar biblioteca ou detectar a plataforma no render. O `help`/`ajuda` também apresenta a combinação e seu contexto de uso, a partir das mesmas constantes e mensagens PT/EN.

### Miniaturas visuais dos aplicativos

`WindowPreview.tsx` apresenta versões estáticas dos aplicativos com seus estilos compartilhados, avatar, logo e painel do projeto selecionado e últimas linhas/comando do terminal. Um `svg` com `foreignObject` escala uma área de referência por aplicativo, sem medir a viewport durante o render. Essas dimensões ficam no menor escopo do componente. A visão geral recebe uma função de apresentação e reutiliza as miniaturas na faixa de mesas e na grade, sem montar `DesktopWindow` ou outro terminal interativo.

O conteúdo das miniaturas é `inert`, decorativo para leitores de tela e não contém links, campos ou botões próprios; a seleção é um único botão externo com nome acessível. Não há IDs duplicados, novos efeitos ou listeners. As miniaturas não são capturas pixel a pixel do DOM nem reproduzem scroll interno; preservam a aparência principal e os dados atuais. A apresentação visual foi aprovada pelo usuário e deve ser mantida.

## Gestos de rolagem do desktop

`useDesktopGestures.ts` sincroniza um listener externo de `wheel`, com cleanup; React/Next não implementa o gesto específico do portfólio. O listener não passivo permite cancelar apenas a rolagem modificada reconhecida. Eventos não canceláveis são ignorados. As unidades `deltaMode` são normalizadas (pixels, linhas e páginas); amplitude, pausa, direção e cooldown vivem em ref, sem renderizações para cada evento. O efeito depende dos estados da mesa/visão geral e dos setters; a ref preserva o bloqueio de inércia nas transições. Não usar detecção de plataforma no render nem presumir que o navegador informa quantidade de dedos.

A combinação aparece na dica do botão de grade, no `help` e no rodapé da visão geral, em PT/EN. A implementação pode ser verificada com eventos simulados; sensibilidade, rolagem natural e atalhos reservados pelo sistema exigem teste no trackpad e navegador reais do usuário.

## Movimento da visão geral

A entrada e a saída coordenam escala/opacidade do desktop com `DialogBackdrop`, `DialogPanel` e `TransitionChild` do Headless UI já instalado. O desktop recua para 95%; o painel aproxima de 105% para 100%, e as miniaturas entram com deslocamento curto e atraso de 75 ms. A transição principal dura 300 ms, com saída das miniaturas mais rápida. Usar Tailwind e o ciclo nativo de transição do diálogo para preservar montagem, foco e eventos até a saída terminar, sem timers ou efeitos extras. Movimento reduzido desativa transforms e transições.

O gesto continua disparando após o limiar de rolagem; esta etapa suaviza a mudança de modo, sem implementar progresso contínuo vinculado à posição dos dedos. Trocar diretamente de mesa permanece independente dessa animação. O estado de posição das janelas não é alterado pela escala temporária do desktop.

Com `Alt + Shift`, o eixo horizontal troca de mesa (direita: próxima; esquerda: anterior) e o vertical abre/fecha a visão geral. O eixo precisa superar o outro em 25%; diagonais ambíguas não acionam ações. Mudança de eixo reinicia a amplitude acumulada, e o cooldown é compartilhado para impedir duas ações na mesma sequência por inércia. O gesto horizontal fica inativo na visão geral. `workspaceNavigation.ts` centraliza a ordem e os limites das mesas para teclado e rolagem, sem circular nos extremos e sem alterar estado das janelas. A ref conserva limiar e cooldown quando o listener é atualizado após a troca.

## Busca rápida

`search.ts` reúne tipos de ações, catálogo e filtro puro: deriva aplicativos de `AppIds`, projetos de `getContent`, mesas de `Spaces` e comandos de `TerminalCommandIds`. Metadados de aplicativos e mesas usam `Record` exaustivo; nomes PT/EN, aliases e conteúdo são normalizados sem acentos. O filtro exige todos os termos e prioriza nomes exatos, aliases e intenção de mesa. Google é criado pela apresentação somente quando não há resultado local e não existe consulta vazia. Não adicionar dependências nem chamadas de rede para sugestões.

`QuickSearch.tsx` usa os diálogos e transições do Headless UI já instalado para foco, Escape, isolamento do fundo e fechamento. O conteúdo da busca desmonta ao fechar, reiniciando consulta e seleção sem efeito de estado espelhado. O ciclo `afterLeave` aplica a ação local e preserva a restauração do foco; Google é acionado diretamente no evento explícito para manter a ativação de popup do navegador. `useSearchShortcut.ts` sincroniza somente o listener externo de teclado e faz cleanup. React/Next não implementa a combinação específica da paleta; não duplicar a gestão de foco do diálogo.

A página aplica as ações reutilizando `openApp`, `runCommand`, o gerenciador de janelas e o estado de mesa. Preservar `selectedProject`, histórico e posições ao abrir/fechar a busca. O `help` informa o atalho. Toda entrega deve revisar cobertura do catálogo conforme BR-011, incluindo aliases, traduções, nomes alterados e ação executada.

## Perfis de cores e marca

`theme/palettes` mantém os mesmos papéis semânticos nos perfis verde e roxo. `theme.config.json` seleciona o perfil para o Tailwind; os componentes continuam usando utilitários sem cores literais. `scripts/theme.mjs` aceita somente os IDs de `theme/constants.mjs`, copia uma lista explícita de assets e atualiza a seleção. Não depende de pacotes adicionais nem introduz efeitos React. O favicon inclui a seleção em sua versão de cache.

Após alterar um perfil ou os assets de origem, executar o comando correspondente e formatar os arquivos. Validar `npm run test:theme`, tipos, lint e build. Os testes de troca usam cópias temporárias para preservar o tema local. Os comandos e limites estão em `PURPLE_THEME.md`.

A navegação da faixa de mesas usa handlers de teclado e foco, sem efeito ou listener global adicional. `WorkspaceOverviewContent` mantém uma mesa de prévia local; setas reutilizam `moveWorkspace` e movem o foco real entre botões. Enter usa o clique nativo. O Dialog com `unmount` desmonta esse conteúdo após a saída e inicializa uma nova prévia na próxima abertura, preservando a transição e o gerenciamento de foco do Headless UI instalado. Nenhum estado das janelas ou mesa ativa muda antes da confirmação. A ação existente de visão geral continua acessível pela busca.

## Apresentação de inicialização

`Brand.tsx` reutiliza os SVGs do perfil ativo, com assinatura na barra e símbolo no celular. `BootScreen.tsx` usa `next/dynamic` com `ssr: false` (recurso nativo da versão instalada) somente para a apresentação: conteúdo e metadados do desktop continuam renderizados no servidor. O estado da home impede repetição em navegação cliente de idioma. Não há cookie de boot nem persistência de janelas.

Movimento fica em keyframes e animações nomeadas do Tailwind. O fim da animação externa, clique ou Escape encerra a apresentação. O único efeito novo sincroniza um timeout de segurança de 3,4 s e a preferência externa `matchMedia`: sem movimento, sai imediatamente; mudança para movimento reduzido também encerra. React/Next não executam esses comportamentos da apresentação; o efeito remove listener e timer no cleanup, inclusive ao pular/desmontar. O callback é estável. Headless UI mantém isolamento e foco do diálogo, sem listeners de teclado ou foco duplicados. Verificar abertura, saída automática, opção de pular, teclado, celular e PT/EN. Referência de acabamento: [Impeccable](https://impeccable.style/), sem instalação ou dependências novas.

O boot é uma apresentação automática, sem nova rota ou comando; seu controle de entrada é interno. A busca continua cobrindo todas as ações navegáveis existentes e não precisa de item para fechar a apresentação.

## Jogo Snake

`snake/engine.ts` concentra regras puras e o estado inicial determinístico; sorteio de comida recebe uma amostra fornecida pelo evento de timer, nunca pelo render ou reducer. `SnakeBoard` desenha SVG estático compartilhado entre jogo e miniaturas; `SnakeGame` contém controles de teclado/toque e handlers de foco. Estado em `useSnake` na home sobrevive à desmontagem por minimização/troca de mesa. Fechar reseta a partida por handler. Mesa por teclado/gesto também usa `navigateSpace` para pausar antes de trocar.

Dois efeitos novos em `useSnake` sincronizam sistemas externos: um intervalo de movimento apenas quando a janela está ativa e a partida em execução; outro registra `visibilitychange` e `window.blur` para pausar ao sair da aba/app. Ambos removem seus recursos no cleanup; dependências refletem a ativação e nenhum estado é espelhado por efeito. React/Next não fornecem o loop nem as regras de pausa do jogo. Eventos do tabuleiro, foco e controles tratam as demais transições, sem listener global de teclas do jogo.

`npm run test:snake` usa o runner nativo do Node (Node 24 ou versão com suporte nativo a TypeScript). Cobre reversão, múltiplos comandos no mesmo tick, colisões, cauda que se move, crescimento, comida livre, vitória e reinício. Validar também terminal, busca, minimização, mesas, overview e layout 320 px. Sem novos estilos globais ou dependências.

A descoberta do Snake é intencional: `isSnakeUnlocked` na home libera os ícones de desktop/dock após a primeira abertura, inclusive pela busca. O catálogo da busca e comandos continuam disponíveis desde o início. A flag vive somente na sessão React, sem efeito ou armazenamento; fechar não a remove e recarregar reinicia.

## Maximização de janelas

`useWindowManager` guarda `maximized` e expõe `setMaximized`. A posição normal não é alterada ao maximizar. `DesktopWindow` aplica dimensões/posição por variantes Tailwind no breakpoint desktop; o transform de arrasto só usa coordenadas normais. O botão verde é nativo, com nome PT/EN, estado pressionado e foco; duplo clique ignora controles e celular. Maximizado bloqueia início do arrasto. Não houve efeitos novos ou alterações na sincronização dos existentes; mudanças de viewport são resolvidas pelo CSS. O catálogo da busca contempla as duas ações por aplicativo.

A maximização preserva o conteúdo e estado da sessão; Snake mantém seu tabuleiro quadrado limitado e pausa ao perder foco. Validar restauração da geometria após arrasto, minimização, mesas, idiomas e viewport móvel, incluindo miniaturas da visão geral. O tamanho maximizado deixa margem e espaço para o dock, usando tokens compartilhados e sem CSS global.

## Redimensionamento pelas bordas

`windowResize.ts` concentra a regra pura de geometria, limites, direções e passo de teclado. `DesktopWindow` captura o ponteiro nas oito alças e mede a janela/área útil somente no evento de início; a função calcula dimensões e deslocamento com a borda oposta preservada. `useWindowManager.resize` aplica a geometria normal e ignora janelas maximizadas. `width`/`height` são dados opcionais da sessão, não tokens fixos. Estilos inline representam esses dados de execução, como já ocorre com o arrasto; as alças usam utilitários Tailwind. Não foram adicionados efeitos, observadores de tamanho ou listeners globais. `pointerup`, `pointercancel` e perda da captura limpam a interação.

A alternativa de teclado usa botões nomeados em PT/EN, foco visível e setas. Alças ficam ocultas no celular e ausentes quando maximizado. Redimensionamento é um controle interno da janela; maximizar/restaurar continua no catálogo da busca. Prévias das mesas mantêm escala limitada, independente do tamanho personalizado, sem montar aplicativos. `npm run test:windows` valida âncoras, mínimos, limites nas oito direções e viewport curta; verificar também arrasto real e restauração após maximização.

Snake usa composição flexível: tabuleiro limitado pela área/altura disponível e controles laterais quando couberem; em janelas estreitas, controles abaixo e rolagem preservam o acesso. Tokens do tema centralizam medidas estruturais. Não há efeito para medir/redimensionar o jogo e nenhuma regra de gameplay é alterada.

Na visão geral, a grade limita cada cartão a `max-w-sm` e cada SVG a `max-h-64`/`max-w-full`, preservando a proporção intrínseca do app. A moldura acompanha o SVG, sem quadro adicional ou faixas vazias. Maximização e dimensões personalizadas não mudam a escala das prévias. A seleção preserva a geometria real no desktop. Sem efeitos ou medições novas.
