# Janelas e arrasto

## De onde veio a estrutura

O `project-spec-starter` 1.0.0 foi executado a partir do checkout local com respostas JSON e gerou a base de `PROJECT.md`, `AGENTS.md` e `docs/`. Depois, os documentos foram ajustados às decisões deste portfólio. A CLI não ficou instalada como dependência: os arquivos gerados são editáveis e versionáveis por si só.

## Responsabilidades

```text
src/pages/index.tsx
  ├─ composição visual e conexão das ações
  ├─ content.ts: textos e listas apresentados
  ├─ constants.ts: IDs e parâmetros estáveis
  ├─ terminal.ts: regra pura para interpretar comandos
  ├─ ícones e dock chamam openApp(id), que seleciona a mesa e abre a janela
  └─ renderiza uma DesktopWindow para cada janela visível
       ├─ useWindowManager.ts: estado e ações
       └─ DesktopWindow.tsx: moldura, controles e pointer events
```

`useWindowManager` guarda uma lista de janelas. Cada item tem `id`, posição (`x`, `y`), camada (`z`) e `minimized`. O hook oferece `open`, `focus`, `minimize`, `close` e `move`. Abrir uma janela existente restaura e eleva a janela; abrir uma nova cria um item com posição levemente deslocada. O contador de camadas fica em um `ref`, pois não precisa renderizar conteúdo por si só.

A página guarda a mesa atual separadamente. `AppSpaces` associa cada aplicativo à mesa Início ou Projetos. Mudar de mesa preserva o estado das janelas; o filtro de renderização mostra apenas as da mesa ativa.

`DesktopWindow` recebe o estado e callbacks do hook. O cabeçalho recebe `pointerdown`, `pointermove`, `pointerup` e `pointercancel`. No início do arrasto, guarda a posição do ponteiro e da janela e captura o ponteiro no cabeçalho. Em cada movimento, calcula a diferença em relação ao ponto inicial e chama `onMove`. Os limites deixam parte da janela acessível mesmo perto das bordas. Ao soltar ou perder a captura, encerra o arrasto.

O arrasto começa apenas no cabeçalho e ignora cliques nos botões de fechar e minimizar. Em telas de até 760 px, não há arrasto: o CSS apresenta a janela como painel e o terminal começa fechado, disponível pelo dock. Isso evita que a mecânica de desktop atrapalhe o uso por toque.

## Exemplo de fluxo

1. Visitante clica em **Projetos** ou digita `projects`.
2. `index.tsx` seleciona a mesa Projetos e chama `open("projects")`.
3. `useWindowManager` cria ou restaura a janela e atualiza `z`.
4. `DesktopWindow` recebe posição, título, conteúdo e controles.
5. Se o visitante arrasta o cabeçalho, `DesktopWindow` calcula a nova posição e chama `move("projects", x, y)`.

O terminal interpreta somente comandos declarados em `terminal.ts`; ele não executa comandos do sistema operacional. O estado das janelas existe apenas na sessão React e é reiniciado ao recarregar a página.
