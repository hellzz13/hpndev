# Tokens visuais

`tailwind.config.js` é a fonte dos tokens usados pela home, pelas mesas, pelas janelas e pela 404. Os componentes usam utilitários Tailwind; `src/portfolio/styles.ts` reúne composições reutilizáveis para o desktop. As classes curtas como `app-window`, `menubar` e `show-projects` também servem como marcadores de interação e estado, sem regras próprias no CSS global.

## Cores por responsabilidade

| Uso | Tokens / exemplo |
| --- | --- |
| Destaque e foco | `accent`, `accent-hover`, `focus` → `text-accent` |
| Desktop e textos | `desktop`, `foreground`, `body-muted` → `bg-desktop` |
| Janelas | `window`, `window-border`, `window-bar`, `window-title` |
| Terminal | `terminal`, `terminal-text`, `terminal-output`, `terminal-input` |
| Projetos | `project-surface`, `project-text`, `project-muted`, `project-green`, `project-purple` |
| Dock e tooltips | `dock`, `dock-icon`, `tooltip`, `tooltip-border` |
| Recuperação / 404 | grupo `recovery` → `bg-recovery-background` |

A paleta preserva os tons e canais alfa existentes. Destaque e foco compartilham a mesma cor primitiva; gradientes e sombras referenciam a paleta. Antes de acrescentar uma cor, procurar o papel visual equivalente e reutilizar seu token. Não escrever hexadecimais, RGB ou cores arbitrárias em páginas e componentes.

## Espaçamento e medidas

Usar a escala Tailwind de 4 px: por exemplo, `gap-2` = 8 px, `p-4` = 16 px e `p-6` = 24 px. Os passos intermediários centralizados em `Spacing`, como `5.5` = 22 px, preservam a geometria original nesta migração. Eles não são motivo para criar medidas novas sem necessidade; preferir os passos já utilizados no contexto.

Medidas de layout usam nomes: `desktop-gutter`, `workspace`, `workspace-mobile`, `terminal`, `content-window`, `projects-window`, `window-mobile` e `recovery-gutter`. Larguras de texto usam `max-w-hero-copy`, `max-w-content-copy` e outros tokens de conteúdo. Expressões `calc`, `min` e `clamp` ficam no tema, não repetidas no JSX.

Tipografia (`font-sans`, `font-display`, `font-mono`, `text-type-*`), raios, elevações, transições e breakpoints também são centralizados no tema. Os breakpoints `compact`, `mobile` e `narrow` preservam os limites anteriores de 1000, 760 e 390 px.

## Revisão de alterações

- Reutilizar tokens existentes de cor, espaço e tipografia antes de ampliar o tema.
- Não usar valores arbitrários para cor, espaçamento ou medidas nos componentes. Seletores de estado e conteúdo de pseudo-elementos podem usar variantes Tailwind entre colchetes: eles não definem novos valores de design.
- Posição e camada das janelas durante o arrasto são dados de execução, mantidos em `style`; não são tokens estáticos.
- O global contém apenas fontes, diretivas Tailwind, reset, foco compartilhado e movimento reduzido. Exceções específicas exigem a justificativa descrita em `ENGINEERING.md`.
- Ao migrar ou alterar o tema, comparar desktop e celular, estados ativos, foco, tooltips, janelas e navegação antes de concluir.
