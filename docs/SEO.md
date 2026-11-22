# Indexação do portfólio

## URL principal

As versões canônicas são `https://hpndev.vercel.app/` em português e `https://hpndev.vercel.app/en` em inglês. Cada versão aponta para si na canonical e informa a alternativa por `hreflang`. Se o domínio mudar, atualizar o tema de SEO, o sitemap e o `robots.txt` juntos.

## Implementação

- `src/portfolio/seo.ts` centraliza título, descrição, URL, imagem social e dados estruturados `WebSite` e `Person`.
- `src/pages/index.tsx` emite metadados, canonical e Open Graph no HTML inicial.
- O Pages Router gera HTML localizado para cada idioma; título, descrição, Open Graph, `lang` e JSON-LD acompanham o locale, com alternativas `pt-BR`, `en` e `x-default` nos links da página.
- A segunda mesa, **Trabalho em destaque**, apresenta os dois projetos no HTML inicial sem depender de abrir uma janela. A troca de mesa deixa a lista visível na interface.
- `public/sitemap.xml` lista as duas versões da home e suas alternativas de idioma. `public/robots.txt` permite rastreá-las e aponta para o sitemap. As duas versões da 404 usam `noindex`.
- A rota demonstrativa `/api/hello` foi removida.

## Depois do deploy

1. Conferir `https://hpndev.vercel.app/robots.txt` e `/sitemap.xml`.
2. Usar a inspeção de URL no Google Search Console para verificar a página publicada e, se desejado, solicitar rastreamento.
3. Enviar o sitemap no Search Console e acompanhar o relatório de indexação.

Um sitemap ajuda na descoberta, mas não garante indexação ou posição nos resultados. A validação final do Google só pode ocorrer após a publicação.
