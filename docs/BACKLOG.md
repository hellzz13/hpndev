# Backlog do portfólio

## Ordem de prioridade

1. Português e inglês com seletor de idioma no padrão de sistema operacional — integrado em `e053411`.
2. Visão geral das mesas e janelas — primeira entrega integrada em `4c0a33b`.
3. Atalho de teclado para trocar de mesa — aprovado, aguardando publicação.
4. Prévias mais visuais das janelas na visão geral — aprovadas, aguardando publicação.
5. Transição mais fluida entre desktop e visão geral — aprovada, aguardando publicação.
6. Busca rápida com `⌘K` / `Ctrl+K`.
7. Jogo acessível pelo terminal.
8. Definir GitFlow e fluxo de publicação.
9. Explorar identidade pessoal com o asterisco do Hélio OS e as iniciais HPN.

## Identidade pessoal — asterisco e HPN

Status: identidade definitiva para explorar e refinar. Como aplicação provisória autorizada, o favicon usa um asterisco vetorial verde sobre fundo escuro, com fallback ICO; isso não define a marca final ou sua combinação com HPN.

Hélio gostou do asterisco que acompanha o nome Hélio OS e quer investigar seu uso como uma marca pessoal simples. As iniciais **HPN**, que já usa com frequência, também são uma referência para essa exploração.

Pontos para refinamento:

- Explorar o asterisco sozinho, uma assinatura com HPN e uma possível combinação entre os dois, sem assumir uma solução antes de comparar alternativas.
- Buscar uma identidade simples, reconhecível e legível em tamanhos pequenos, com versões monocromáticas e para fundos claros e escuros.
- Avaliar usos no portfólio, favicon, avatar e materiais pessoais, preservando a personalidade do Hélio OS.
- Verificar a consistência de renderização do símbolo atual entre fontes e plataformas; avaliar um desenho vetorial próprio para a marca final.
- Apresentar alternativas e refinar com Hélio antes de substituir a identidade existente. A escolha da marca e suas aplicações fica para uma entrega futura.

## Prioridade 1 — Idioma do sistema: português e inglês

Status: integrado em `e053411`. Menu de idioma na barra do sistema e na 404, catálogos PT/EN, rotas localizadas, preferência por cookie e metadados por idioma. A troca com janelas abertas preservou mesa, posição/camada, minimização, projeto selecionado e histórico nos testes do navegador. Novas respostas do terminal foram traduzidas; a 404 e o menu foram conferidos até 320 px.

Permitir que a pessoa troque de idioma a qualquer momento pelo menu superior do Hélio OS. Usar um controle de idioma integrado à barra do sistema, abrindo um menu com Português e English e indicação da opção ativa. O controle deve funcionar com clique, teclado e toque, mantendo a identidade do desktop.

Critérios de aceite:

- Traduzir home, mesas, menus, tooltips, títulos e controles das janelas, projetos, Sobre, Experiência, Contato, mensagens do terminal e 404, incluindo nomes acessíveis.
- A troca preserva a mesa atual, as janelas abertas, suas posições, o projeto selecionado e o histórico do terminal. Comandos permanecem estáveis; novas respostas usam o idioma ativo e o histórico anterior não é reescrito.
- Guardar somente a preferência de idioma no navegador, sem introduzir persistência das janelas. Definir a precedência entre idioma explícito na URL e preferência salva.
- Centralizar traduções em catálogos tipados, evitando textos espalhados e chaves ausentes entre os idiomas.
- Definir rotas por idioma e seus metadados antes de implementar; alinhar `lang`, título, descrição, canonical, `hreflang`, sitemap e dados estruturados ao conteúdo entregue no HTML, evitando divergência de hidratação.
- Revisar os textos em inglês e testar o crescimento dos rótulos no desktop e no celular. Reutilizar Tailwind e tokens existentes.

Estimativa inicial: complexidade média, aproximadamente 6–10 horas de implementação e validação no estado atual do projeto. A maior parte do trabalho está em centralizar os textos e preservar estado, acessibilidade e SEO; o seletor visual é a parte menor. Faixa de esforço, não prazo fechado.

## Simulação da regra de Tailwind

Status: concluída na 404. Os seletores `crash-*` foram removidos do global e substituídos por utilitários Tailwind, sem exceção técnica. A comparação dos retângulos e estilos computados em desktop e em 390 × 844 não apresentou diferenças. Foco por teclado e retorno à home foram validados no navegador.

A migração foi ampliada para home, mesas, terminal, Projetos, Sobre, Experiência e Contato. Cores e medidas foram centralizadas no tema, com escala de espaçamento documentada em `DESIGN_TOKENS.md`. O global ficou restrito à base compartilhada. Comparações em desktop e celular preservaram a geometria e as cores; arrasto, minimização, restauração e troca de mesa foram conferidos no navegador.

Usar a página 404 como primeiro exercício da regra de estilização registrada após sua publicação. Migrar as classes `crash-*` do global para Tailwind na página, preservando aparência e navegação para a home. Comparar desktop e celular, verificar foco por teclado, remover os seletores migrados do global e revisar o diff contra `ENGINEERING.md`. Validar lint, tipos e build. Registrar se houve alguma exceção técnica real; a existência do CSS legado não justifica mantê-lo em novas implementações.

## Próxima evolução da navegação

### Visão geral das mesas e janelas — referência Mission Control

Status: primeira entrega aprovada pelo usuário e integrada em `4c0a33b`. Duas mesas com miniaturas posicionais, prévias resumidas dos dados das janelas, restauração de minimizadas, troca direta pelos botões das mesas, visão geral opcional pelo botão de grade (clique/teclado/toque) e fechamento por Esc. Sem criação de mesas ou transferência de janelas. As prévias representam o estado da sessão sem duplicar componentes interativos; não reproduzem todos os pixels do aplicativo.

A gravação enviada em 22/11/2026 mostra uma visão geral do macOS: faixa superior com miniaturas das mesas e, abaixo, as janelas da mesa atual reduzidas e distribuídas no espaço. Essa é a referência para o portfólio, substituindo a interpretação anterior de um pequeno popover. A visão geral deve abrir a partir do seletor superior, com transição do desktop para esse modo e retorno ao selecionar uma mesa ou janela.

A referência também demonstra criação de uma mesa pelo botão `+` e transferência de uma janela para outra mesa. Essas funções formam uma extensão própria do item; exigem mesas dinâmicas e alterações nas regras atuais, que hoje têm apenas Início e Projetos. O portfólio só representa suas próprias mesas e aplicativos, sem acessar outras janelas do computador.

Critérios de aceite:

- Início e Projetos mantêm a troca rápida por clique. Um botão de grade separado abre a visão geral explicitamente; hover não interrompe a navegação com um modal. O painel permanece aberto até selecionar ou fechar.
- A faixa superior apresenta as mesas Início e Projetos, com identificação da ativa; clicar em uma delas muda de mesa e encerra a visão geral.
- A área principal organiza as janelas abertas da mesa atual em miniaturas que não se sobrepõem; selecionar uma restaura o desktop e foca a janela correspondente.
- Miniaturas refletem títulos, posição relativa e conteúdo/estado, sem montar cópias interativas que disparem efeitos, capturem foco ou executem mídia novamente. Definir uma representação para janelas minimizadas e mesas sem janelas.
- Oferecer abertura explícita por teclado e toque; Esc e um controle de fechar encerram o modo sem trocar de mesa, com restauração do foco. Respeitar movimento reduzido.
- Manter as posições originais das janelas após sair da visão geral e preservar o comportamento do dock na mesa atual.

Complexidade da primeira entrega (duas mesas existentes e seleção de janelas): média/alta, aproximadamente 8–16 horas, incluindo organização das miniaturas, transições, foco, teclado e celular. O estado atual das janelas ajuda, mas a composição da página ainda está concentrada em `index.tsx` e precisa ser separada para reutilizar conteúdo sem duplicar efeitos.

Extensão para reproduzir o botão `+` e arrastar janelas entre mesas: alta, com aproximadamente 12–20 horas adicionais. Antes de implementar, definir criação, nomes e remoção de mesas, destino das janelas ao remover uma mesa, relação das novas mesas com Início/Projetos e alternativas de transferência por teclado e toque. Essa extensão não deve entrar implicitamente na primeira entrega.

### Gestos de trackpad para visão geral e mesas

Status: implementação local para avaliação no dispositivo do usuário. `Alt + Shift` com rolagem vertical de dois dedos: para cima abre; para baixo fecha. Também funciona com eventos de roda do mouse; gestos nativos de três/quatro dedos não são capturados. Há limite mínimo, normalização de unidades, bloqueio de inércia e proteção de campos/menus. A direção física acompanha a configuração de rolagem natural. A rolagem lateral com os mesmos modificadores também troca entre Início/Projetos, sem circular; fica inativa na visão geral. O eixo dominante distingue navegação horizontal e abertura vertical. Pendente de validação física do trackpad e de publicação.

### Atalho de teclado para trocar de mesa

Status: implementado e aprovado pelo usuário, aguardando publicação. `Alt + Shift + ← / →`, sem circular nos extremos, com dicas nos botões e na home; ignora edição, menus, composição e diálogos.

Adicionar uma forma de alternar entre **Início** e **Projetos** pelo teclado, além do seletor superior. Escolher uma combinação que funcione no macOS e no Linux sem disputar atalhos do sistema, do navegador ou o `⌘K` da busca. O atalho muda somente a mesa ativa; os aplicativos do dock continuam abrindo janelas na mesa atual.

Critérios de aceite:

- A combinação escolhida e sua ação aparecem na interface e na documentação.
- O atalho funciona com foco fora de campos editáveis e não interfere na digitação do terminal ou da busca.
- A troca preserva a posição, o conteúdo e o estado das janelas em cada mesa.
- O seletor superior continua acessível por teclado e toque.

### Prévias mais visuais das janelas

Status: implementação local aprovada pelo usuário. Miniaturas estáticas escaladas, com avatar, identidade/painel do projeto selecionado e terminal, na grade e nas mesas. Aguardando publicação.

Evoluir os resumos atuais para representações visuais reconhecíveis de cada aplicativo: avatar no Sobre, identidade do projeto selecionado e aparência própria do terminal. Preservar a troca direta entre mesas e a abertura opcional da visão geral.

Critérios de aceite:

- Refletir projeto selecionado, histórico/comando do terminal e estado de minimização da sessão.
- Usar dados e componentes de apresentação sem montar cópias interativas dos aplicativos ou duplicar efeitos, foco e mídia.
- Manter títulos acessíveis, seleção por teclado/toque e legibilidade no celular.
- Reutilizar Tailwind e tokens existentes, sem exigir capturas exatas do DOM.

### Transição mais fluida para a visão geral

Status: implementação aprovada pelo usuário, aguardando publicação. Zoom coordenado do desktop/painel e entrada suave das miniaturas, com transição de 300 ms e suporte a movimento reduzido. Funciona tanto pelo botão quanto pelo gesto; o limiar do gesto permanece, sem progresso contínuo vinculado aos dedos. Aprovação visual concluída.

Dar a sensação de afastar o desktop ao abrir a visão geral e retornar à janela escolhida ao sair. A animação deve complementar a navegação rápida, sem atrasar a troca direta de mesa.

Critérios de aceite:

- Coordenar entrada e saída do desktop, miniaturas e janela escolhida sem saltos visuais.
- Preservar posições, conteúdo, foco e minimização; fechar por Esc continua sem mudar de mesa.
- Respeitar movimento reduzido, com alternativa imediata ou discreta.
- Validar fluidez no desktop e celular, sem duplicar aplicativos durante a transição.

### Busca rápida com `⌘K`

Abrir uma paleta de busca por `⌘K` no macOS, `Ctrl+K` nas demais plataformas e por um controle visível. A busca deve encontrar projetos, seções, aplicativos e comandos do portfólio, com sugestões e autocomplete enquanto a pessoa digita. Selecionar um resultado abre a mesa ou janela correspondente.

Se não houver um resultado útil, oferecer **Pesquisar no Google por “…”**. Essa opção abre uma busca externa somente após clique ou Enter explícito; nunca envia o texto digitado automaticamente. Usar a URL de pesquisa do Google com a consulta codificada e avisar visualmente que o destino é externo.

Critérios de aceite:

- Atalho e controle visível abrem a paleta; Esc fecha; setas percorrem sugestões; Enter aciona a seleção.
- Sugestões locais aparecem para nomes, palavras relevantes e comandos, com estado vazio claro.
- Resultados abrem a mesa correta e restauram ou focam a janela quando aplicável.
- A opção do Google exige ação explícita e não é exibida para consulta vazia.
- A paleta funciona no celular, mantém foco acessível e não executa comandos arbitrários.

## Jogo no portfólio

### Abrir o jogo por comando do terminal

Adicionar o jogo criado por Hélio ao portfólio como aplicativo. Um comando próprio, listado em `help`, deve abri-lo em uma janela na mesa atual, seguindo o comportamento dos demais aplicativos. O jogo também precisa de um controle visível para quem não usa o terminal.

Antes de implementar, confirmar o nome do jogo, onde está o código ou a versão publicada, como ele pode ser incorporado ao site e quais controles exige. Escolher então se a janela executa o jogo diretamente ou apresenta um acesso à versão externa.

Critérios de aceite:

- O comando escolhido aparece em `help` e abre o jogo sem executar código arbitrário.
- Há um ícone ou outro controle visível para abrir o mesmo conteúdo.
- A janela pode ser focada, minimizada, fechada e movida como as demais no desktop.
- O jogo e seus controles funcionam em tela pequena ou oferecem uma alternativa clara quando houver limitação técnica.
- Nome, descrição e links correspondem à versão real do jogo.

## Dependências de implementação

Definir componentes próprios para seletor e paleta, com catálogo de itens pesquisáveis separado da apresentação. Reaproveitar `Apps`, `Spaces` e o fluxo `openApp`; documentar novas regras em `BUSINESS_RULES.md` quando implementadas. Validar teclado, toque, layout móvel, lint, tipos e build.

## Fluxo de contribuição e entrega

### Definir GitFlow para o portfólio

Evoluir o fluxo mínimo de `docs/GITFLOW.md` para um processo claro de desenvolvimento, revisão e publicação. Decidir se este repositório precisa do GitFlow clássico, com branches `develop`, `release/*` e `hotfix/*`, ou se um fluxo mais leve com branches curtas e PRs atende melhor ao ritmo do portfólio. Registrar a escolha e como ela se conecta ao deploy automático da Vercel.

Critérios de aceite:

- Documentar o papel de `main`, o padrão de nomes das branches e o caminho para integrar funcionalidades e correções urgentes.
- Definir quando abrir PR, quais revisões e gates são exigidos e quem pode integrar.
- Separar preview, produção e rollback, incluindo a relação entre branch e ambiente na Vercel.
- Configurar as proteções e verificações automáticas acordadas no GitHub e testar o fluxo com uma mudança pequena.
- Atualizar `AGENTS.md` e `docs/GITFLOW.md` para que agentes e pessoas sigam o mesmo processo.
