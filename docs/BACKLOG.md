# Backlog do portfólio

## Próxima evolução da navegação

### Prévia das áreas de trabalho no seletor

Ao passar o mouse sobre o seletor de mesas no menu superior, mostrar uma pequena prévia visual de **Início** e **Projetos**, como o alternador de áreas de trabalho de um sistema operacional. Cada miniatura deve indicar a mesa ativa e permitir clicar para mudar de mesa. A prévia não deve cobrir os controles das janelas nem interromper o trabalho em uma mesa.

Critérios de aceite:

- Hover abre a prévia no desktop; clicar em uma miniatura muda para a mesa escolhida.
- Foco por teclado também abre a prévia, com nomes acessíveis e acionamento por Enter ou Espaço.
- Em telas de toque, há um modo equivalente por toque; trocar de mesa continua possível pelo seletor atual.
- As miniaturas refletem o conteúdo e o estado das mesas sem duplicar aplicativos interativos ou capturar dados da tela.
- Movimento reduzido é respeitado e a prévia pode ser fechada sem trocar de mesa.

### Atalho de teclado para trocar de mesa

Adicionar uma forma de alternar entre **Início** e **Projetos** pelo teclado, além do seletor superior. Escolher uma combinação que funcione no macOS e no Linux sem disputar atalhos do sistema, do navegador ou o `⌘K` da busca. O atalho muda somente a mesa ativa; os aplicativos do dock continuam abrindo janelas na mesa atual.

Critérios de aceite:

- A combinação escolhida e sua ação aparecem na interface e na documentação.
- O atalho funciona com foco fora de campos editáveis e não interfere na digitação do terminal ou da busca.
- A troca preserva a posição, o conteúdo e o estado das janelas em cada mesa.
- O seletor superior continua acessível por teclado e toque.

### Busca rápida com `⌘K`

Abrir uma paleta de busca por `⌘K` no macOS, `Ctrl+K` nas demais plataformas e por um controle visível. A busca deve encontrar projetos, seções, aplicativos e comandos do portfólio, com sugestões e autocomplete enquanto a pessoa digita. Selecionar um resultado abre a mesa ou janela correspondente.

Se não houver um resultado útil, oferecer **Pesquisar no Google por “…”**. Essa opção abre uma busca externa somente após clique ou Enter explícito; nunca envia o texto digitado automaticamente. Usar a URL de pesquisa do Google com a consulta codificada e avisar visualmente que o destino é externo.

Critérios de aceite:

- Atalho e controle visível abrem a paleta; Esc fecha; setas percorrem sugestões; Enter aciona a seleção.
- Sugestões locais aparecem para nomes, palavras relevantes e comandos, com estado vazio claro.
- Resultados abrem a mesa correta e restauram ou focam a janela quando aplicável.
- A opção do Google exige ação explícita e não é exibida para consulta vazia.
- A paleta funciona no celular, mantém foco acessível e não executa comandos arbitrários.

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
