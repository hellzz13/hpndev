# Regras do portfólio

## BR-001 — Acesso direto ao conteúdo

Cada seção disponível no terminal também deve abrir por um controle visível. O visitante não precisa saber ou digitar comandos para chegar aos projetos e ao contato.

## BR-002 — Comandos do terminal

`help` lista comandos. `whoami` apresenta Hélio. `projects`, `about`, `career` e `contact` abrem as janelas correspondentes. `clear` apaga apenas o histórico visível da sessão. Um comando desconhecido informa que não foi encontrado e sugere `help`.

Implementação: `src/portfolio/terminal.ts` interpreta a entrada; `src/pages/index.tsx` aplica o resultado à interface.

## BR-003 — Estado das janelas

Abrir uma janela já aberta a traz para frente. Minimizar a esconde sem perder seu conteúdo; clicar no aplicativo novamente a restaura. Fechar remove a janela da sessão. Arrastar fica restrito ao cabeçalho em telas com espaço suficiente.

Implementação: `src/portfolio/useWindowManager.ts` controla o estado; `src/portfolio/DesktopWindow.tsx` valida o início do arrasto e move a janela.

## BR-004 — Projetos

DisciplineHub e project-spec-starter são apresentados como trabalhos distintos, com descrição, estado e links. Capacidades planejadas não devem ser descritas como entregues.

## BR-005 — Áreas de trabalho

Início e Projetos são mesas distintas. O visitante troca entre elas pelos controles visíveis no menu superior. Abrir um aplicativo no dock, no desktop ou no terminal abre sua janela na mesa atual, sem mudar de mesa. Uma janela já aberta em outra mesa é trazida para a mesa atual ao ser aberta novamente. Janelas abertas permanecem em estado e só aparecem na mesa correspondente. Os projetos continuam presentes no HTML para indexação.

Atalhos: `Alt + Shift + ←` vai para a mesa anterior e `Alt + Shift + →` para a próxima, sem circular nos extremos. Só alteram a mesa ativa: preservam janelas, posições, minimização e conteúdo. Ignoram campos editáveis, seletores, menu de idioma, composição de texto, repetição de tecla e eventos já tratados; ficam inativos com a visão geral ou outro diálogo modal aberto. Botões e toque continuam disponíveis.

## BR-006 — Página não encontrada

Rotas inexistentes exibem uma página 404 inspirada em uma tela azul do Hélio OS. O controle “Reiniciar Hélio OS” navega para a home no idioma ativo, iniciando uma nova sessão das janelas. A página informa o erro no idioma ativo e usa `noindex`.

## BR-007 — Idioma do sistema

Português e inglês podem ser escolhidos no menu de idioma do Hélio OS, inclusive na 404, com teclado ou toque. A troca preserva mesa, posição, camada e minimização das janelas, projeto selecionado e histórico do terminal. Rótulos e novos resultados são traduzidos, mas comandos permanecem estáveis e respostas antigas não são reescritas. As rotas `/` e `/en` entregam conteúdo e metadados localizados desde o HTML inicial. A preferência é salva no cookie `NEXT_LOCALE`; idioma explícito da URL prevalece e a entrada pela raiz negocia preferência salva, idioma do navegador e português como padrão.

## BR-008 — Visão geral das mesas e janelas

Os botões Início e Projetos no topo trocam de mesa diretamente, sem abrir a visão geral. Um botão de grade separado, ao lado deles, abre a visão geral por clique, teclado ou toque. Hover não abre o modal. A faixa superior apresenta as duas mesas e suas janelas em posições relativas; selecionar uma mesa encerra a visão geral e troca a mesa ativa. Ao abrir, o foco começa na mesa atual. Setas na faixa de mesas destacam a anterior/próxima sem mudar o desktop nem fechar o modal; a área principal acompanha essa prévia, incluindo janelas minimizadas com indicação explícita. Enter confirma a mesa focada, e clique mantém a seleção direta. Tab permite chegar às janelas e Enter selecioná-las. Fechar sem confirmar descarta a prévia; reabrir começa novamente na mesa ativa. Selecionar uma janela a restaura e foca na mesa de origem, preservando posição, conteúdo e projeto selecionado. Esc ou fechar retorna sem trocar de mesa, com restauração do foco anterior.

As prévias são representações de dados da sessão: projeto selecionado, últimas respostas/comando do terminal e textos dos aplicativos. Não são cópias interativas nem capturas exatas do DOM. A visão geral não cria mesas nem transfere janelas; o dock mantém a abertura de aplicativos na mesa atual.

## Dados

Esta entrega não coleta dados pelo site. Contato abre o cliente de e-mail do visitante; links externos abrem os destinos declarados.

O cookie de preferência guarda somente o código do idioma, sem persistir conteúdo do terminal ou das janelas.

## BR-009 — Gesto de rolagem para a visão geral

Com `Alt + Shift`, uma rolagem vertical para cima abre a visão geral; para baixo a fecha. O navegador recebe rolagem de dois dedos como eventos `wheel`, também disponíveis na roda do mouse; não há detecção de quantidade de dedos nem interceptação de gestos nativos de três/quatro dedos do sistema. A direção física depende da configuração de rolagem natural do dispositivo.

O gesto exige deslocamento mínimo acumulado de 60 pixels equivalentes, reinicia após 250 ms sem eventos ou mudança de direção e bloqueia novas ações por 700 ms para reduzir acionamentos por inércia. Rolagem sem os modificadores, movimento diagonal sem eixo dominante, zoom/pinça, edição de texto, menus, eventos já tratados e outros modais não acionam a visão geral. Nenhuma janela é movida ou reiniciada. Botão de grade, Esc e controles existentes permanecem disponíveis.

## BR-010 — Troca de mesa por rolagem lateral

`Alt + Shift` com rolagem horizontal para a direita vai para Projetos; para a esquerda, Início. Mantém os mesmos limites e o estado de janelas dos atalhos de teclado. Sem os modificadores, a rolagem normal não é interceptada. Edição, menus, outros modais e a própria visão geral bloqueiam a troca lateral. O gesto vertical continua abrindo/fechando a visão geral. Os eixos usam deslocamento mínimo e cooldown compartilhados; diagonais ambíguas não acionam os dois modos. A direção física dos dedos depende da configuração de rolagem natural.

## BR-011 — Busca rápida e cobertura de novos recursos

A busca abre pela lupa no dock ou por `⌘K`/`Ctrl+K`, inclusive durante edição do terminal; o mesmo atalho a fecha. Não compete com a visão geral: o atalho fica inativo enquanto ela estiver aberta. A paleta recebe foco, oferece sugestões locais, navegação por setas, seleção por Enter e fechamento por Esc com restauração do foco. Texto de busca e seleção são locais à paleta e não persistem após fechá-la.

Aplicativos e projetos abrem na mesa atual; projetos abrem com a aba correspondente selecionada. Um resultado de mesa troca de área de trabalho. Comandos são exclusivamente os reconhecidos pelo terminal, com a mesma interpretação e efeitos; texto livre não é executado. A seleção de uma ação local ocorre ao terminar o fechamento, evitando sobreposição de diálogos e perda de foco. Google é oferecido somente para consulta não vazia sem resultado local, indica destino externo e abre em nova aba só após clique ou Enter explícito. Digitar não envia consultas à rede.

Todo novo aplicativo, projeto, mesa, comando ou ação navegável deve entrar na busca, com nome, termos PT/EN e ação coerente com o acesso direto. Os catálogos existentes são a fonte para geração dos itens; metadados específicos e aliases são mantidos junto da busca. Remoções e renomeações devem atualizar os resultados. Verificar cobertura e destino na revisão de cada entrega. Controles internos da própria paleta não são resultados pesquisáveis.

## BR-012 — Abertura do sistema

A home apresenta o símbolo do perfil de cor ativo em repouso e depois acelerando, com nome fixo, antes de revelar a mesa. A sequência dura aproximadamente 2,7 s e pode ser pulada pelo botão de entrada (clique/Enter) ou Escape. Não simula progresso de carregamento. Movimento reduzido entra diretamente no desktop. Recarregar ou reiniciar pela 404 apresenta novamente; trocar idioma, mesa ou janela não. Conteúdo permanece no HTML e acessível sem JavaScript. A abertura não cria persistência de janelas nem altera seu estado.
