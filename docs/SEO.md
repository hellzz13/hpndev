# Indexação do portfólio

## URL principal

A versão canônica é `https://hpndev.vercel.app/`, confirmada para esta entrega. O mesmo endereço aparece na tag canonical, no JSON-LD, no sitemap e no `robots.txt`. Se o domínio mudar, atualizar esses pontos juntos.

## Implementação

- `src/portfolio/seo.ts` centraliza título, descrição, URL, imagem social e dados estruturados `WebSite` e `Person`.
- `src/pages/index.tsx` emite metadados, canonical e Open Graph no HTML inicial.
- A seção **Trabalho em destaque** apresenta os dois projetos em HTML visível sem depender de abrir uma janela. O desktop permanece como forma principal de exploração.
- `public/sitemap.xml` lista a única página pública do portfólio. `public/robots.txt` permite rastreá-la e aponta para o sitemap.
- A rota demonstrativa `/api/hello` foi removida.

## Depois do deploy

1. Conferir `https://hpndev.vercel.app/robots.txt` e `/sitemap.xml`.
2. Usar a inspeção de URL no Google Search Console para verificar a página publicada e, se desejado, solicitar rastreamento.
3. Enviar o sitemap no Search Console e acompanhar o relatório de indexação.

Um sitemap ajuda na descoberta, mas não garante indexação ou posição nos resultados. A validação final do Google só pode ocorrer após a publicação.
