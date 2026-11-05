# Instruções para agentes — portfólio

Leia `PROJECT.md`, `docs/ENGINEERING.md` e `docs/BUSINESS_RULES.md` antes de alterar o site. Preserve as decisões e mudanças locais existentes. Não invente capacidades dos projetos apresentados; confira seus repositórios ou peça o conteúdo necessário. Siga as convenções de constantes, condições nomeadas e exports no fim descritas em `docs/ENGINEERING.md`. Antes de concluir, confronte o diff com as regras aplicáveis desses documentos. Use npm e não adicione dependências sem necessidade. Valide lint, tipos e build antes de concluir mudanças de código. Não publique sem autorização específica.

Estilização: use Tailwind como padrão em páginas e componentes. CSS global específico exige uma exceção técnica forte, documentada conforme `docs/ENGINEERING.md`. Confira essa regra na revisão do diff.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
