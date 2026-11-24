# Hélio OS — proposta de assinatura

Status: desenho da assinatura aprovado pelo usuário. A base verde está preservada no commit `a9cd1b7`; a árvore atual contém um teste de paleta roxa, ainda em avaliação, descrito em `PURPLE_THEME.md`. A assinatura está integrada à barra do portfólio, às miniaturas das mesas e ao rodapé da 404. A abertura usa símbolo e nome separados. A exploração de uma marca pessoal com HPN permanece separada.

## Direção

Preservar o asterisco verde existente e associá-lo ao nome Hélio OS, com uma assinatura curta e sem ornamentos. Oito pontas e terminais arredondados mantêm o centro visual estável durante a rotação. A tipografia é Space Grotesk, já escolhida pelo portfólio: Hélio em peso 600 e OS em peso 400, com espaçamento óptico ajustado.

A referência Impeccable foi consultada como orientação de simplificação e consistência com o sistema visual existente, sem instalar ferramentas ou dependências.

## Arquivos

| Arquivo em `public/brand/`   | Uso                                                                              |
| ---------------------------- | -------------------------------------------------------------------------------- |
| `helio-os-logo.svg`          | Assinatura horizontal principal, asterisco verde e nome claro sobre fundo escuro |
| `helio-os-symbol.svg`        | Símbolo verde transparente, independente e centralizado para animação            |
| `helio-os-wordmark.svg`      | Nome em contornos, independente do símbolo                                       |
| `helio-os-logo-stacked.svg`  | Composição vertical estática para referência de abertura                         |
| `helio-os-logo-on-light.svg` | Versão monocromática escura para fundo claro                                     |
| `SPACE-GROTESK-LICENSE.txt`  | Licença original da fonte de referência                                          |

As assinaturas são SVGs transparentes, sem imagens raster, scripts, referências externas ou dependência de carregamento de fonte. O texto foi convertido em contornos a partir da Space Grotesk do repositório oficial do Google Fonts. O arquivo original da fonte não foi adicionado ao runtime nem instalado no sistema.

Cores da base aprovada (antes do teste roxo): verde `#C7FA69`, nome `#F1F0E9` e fundo de referência `#171A20`, seguindo o tema existente. A versão para fundo claro usa `#171A20` também no símbolo para preservar contraste; não usar o verde claro diretamente sobre branco como única marca visível.

## Escala e aplicações

- Preferir a assinatura horizontal a partir de 120 px de largura na barra; conferir o espaço disponível junto do seletor e idioma antes de integrá-la.
- O símbolo independente atende usos pequenos e pode ser usado sozinho quando o nome não couber. Preservar sua caixa quadrada e centro.
- Não esticar, inclinar, adicionar brilho ou animar o nome junto com o símbolo.
- Manter área livre ao redor; não colocar o símbolo em uma cápsula adicional na assinatura principal.
- A composição vertical é indicada para a abertura; a horizontal permanece a assinatura compacta do sistema.

## Abertura implementada

A proposta de movimento mantém o asterisco parado por um instante, inicia o giro e acelera até a revelação da mesa Início. Animar somente um wrapper independente do símbolo, mantendo o nome fixo quando estiver visível. Os arquivos separados evitam sobrescrever transforms de posicionamento ou girar a assinatura inteira.

Foi criado um ensaio externo ao portfólio para avaliar o símbolo: 440 ms parado, seguido de aceleração ao longo de quatro voltas, em uma sequência total de 2,2 s. É um estudo, não uma decisão final de duração ou uma tela de boot implementada. O ensaio respeita movimento reduzido e não muda rotas ou simula carregamento real.

A implementação atual mantém 440 ms de repouso, acelera quatro voltas por 1,9 s e revela o desktop com fade ao final de 2,7 s. O nome fica parado. O roxo ativo acompanha o perfil selecionado. Enter no botão de entrada ou Esc pula a apresentação. Movimento reduzido a encerra sem rotação; mudanças dessa preferência durante a abertura também a encerram.

A abertura aparece a cada carregamento completo da home, inclusive ao reiniciar pela 404, e não ao trocar idioma, mesa ou janela. Não guarda preferências de janelas nem simula carregamento real. O desktop permanece no HTML inicial e é utilizável sem JavaScript; somente a apresentação usa renderização cliente do Next.

## Referências e origem

- [Impeccable](https://impeccable.style/) — simplificação, hierarquia e consistência de interfaces.
- [Space Grotesk no Google Fonts](https://github.com/google/fonts/tree/main/ofl/spacegrotesk) — fonte usada na assinatura, sob a licença incluída nos assets.
- Símbolo derivado diretamente do asterisco já autorizado em `public/favicon.svg`.

Os perfis completos de marca são preservados em `theme/assets/green` e `theme/assets/purple`. A troca sincronizada de logo, favicon e interface está documentada em `PURPLE_THEME.md`.
