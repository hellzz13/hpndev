# Teste de paleta roxa — Hélio OS

Status: ensaio local autorizado, pendente de avaliação visual. Sem publicação e sem commit do teste. O estado anterior, com busca e assinatura verde, está preservado no commit `a9cd1b7` da branch `codex/workspace-navigation`.

## Intenção

Explorar uma identidade mais pessoal a partir da preferência de Hélio por roxo e das referências musicais citadas (Black Sabbath e Prince). A interpretação usa ameixa profunda e violeta luminoso, mantendo o desenho geométrico do asterisco e a tipografia da assinatura. Não reproduz logotipos, capas ou identidades dos artistas.

| Papel                        | Cor do teste |
| ---------------------------- | ------------ |
| Fundo do desktop             | `#110E18`    |
| Destaque e foco              | `#C5A0FF`    |
| Texto de destaque preenchido | `#241331`    |
| Texto principal              | `#F3EDF9`    |
| Janela                       | `#19151F`    |
| Terminal                     | `#0B100D`    |

## Aplicação

- Atualizar os tokens existentes do tema para desktop, barra, janelas, dock, busca, mesas, foco e conteúdo. Não adicionar CSS global ou estilos arbitrários aos componentes.
- Distinguir os ícones por aplicativo: projetos em âmbar, sobre em lilás, experiência em azul e contato em coral. Manter janelas quase pretas com matiz roxo e terminal preto/verde, incluindo suas miniaturas.
- Sincronizar símbolo, assinatura horizontal/vertical, nome independente e favicon SVG/ICO com a paleta.
- Preservar os assets reais dos projetos e o avatar. Os controles nativos vermelho/amarelo/verde e a recuperação azul mantêm sua função semântica.
- Manter geometria, fontes, espaçamento e comportamento. A formatação dos arquivos foi aplicada conforme o editor.
- Os antigos tokens de cartão `project-green` e `project-purple` passam a `project-discipline` e `project-spec`, com seus foregrounds, para não atrelar o nome do token à cor experimental.

## Perfis preservados e retorno

Os tokens ficam em `theme/palettes/green.json` e `theme/palettes/purple.json`; `theme.config.json` seleciona o perfil consumido pelo Tailwind. Os assets correspondentes ficam em `theme/assets/<perfil>`.

- `npm run theme:green`: restaura os tokens originais e os arquivos verdes de logo e favicon.
- `npm run theme:purple`: aplica o teste roxo, incluindo terminal preto/verde e ícones contrastantes.

Os comandos sincronizam os assets públicos e invalidam a configuração Tailwind para recompilação local. A seleção é do projeto, em tempo de build; não cria preferência por visitante ou controle de tema na interface. Alterações de marca devem atualizar o perfil de origem e depois executar seu comando, para não serem perdidas na próxima troca.

## Validação

`npm run test:theme` verifica os dois perfis, troca e recuperação de seleção inválida, integridade dos assets e contrastes principais de texto (mínimo 4,5:1) e dos ícones (mínimo 3:1). Os testes usam diretórios temporários e não alteram o tema ativo do projeto. Isso não substitui a revisão visual dos estados e opacidades.

A comparação com o commit-base confirmou todos os valores originais do verde, normalizando somente os nomes dos tokens de projetos. Layout e geometria da marca foram preservados. Nenhum efeito React foi introduzido ou alterado.
