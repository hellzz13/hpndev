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

Definir componentes próprios para seletor e paleta, com catálogo de itens pesquisáveis separado da apresentação. Reaproveitar `Apps`, `Spaces`, `AppSpaces` e o fluxo `openApp`; documentar novas regras em `BUSINESS_RULES.md` quando implementadas. Validar teclado, toque, layout móvel, lint, tipos e build.
