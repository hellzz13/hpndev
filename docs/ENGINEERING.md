# Engenharia do portfólio

## Stack existente

- Next.js 16 (Active LTS) com Pages Router, React 19 e TypeScript estrito.
- O build e o servidor local usam Webpack: o Turbopack falhou ao iniciar o processo de PostCSS neste ambiente.
- CSS global para a interface de desktop; componentes React para conteúdo e interações.
- npm e `package-lock.json`; sem dependência nova para a primeira entrega.
- Conteúdo local, sem API ou persistência.

## Organização

`src/pages/index.tsx` compõe a página e conecta as ações dos aplicativos. Em `src/portfolio/`, `constants.ts` reúne IDs e valores estáveis da interface; `content.ts` guarda os textos e listas apresentados; `terminal.ts` interpreta comandos sem depender de React; `useWindowManager.ts` controla o estado das janelas; e `DesktopWindow.tsx` desenha a moldura e implementa o arrasto. `src/styles/globals.css` contém a linguagem visual. O fluxo está explicado em [Janelas e arrasto](WINDOWS.md).

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
