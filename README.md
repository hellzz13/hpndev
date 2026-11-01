# Hélio Palenca — portfólio

Portfólio pessoal em forma de desktop, inspirado em macOS e Linux. O visitante pode explorar projetos, experiência e contato por ícones, dock ou comandos do terminal.

## Desenvolvimento

```bash
npm ci
npm run dev
```

Abra `http://localhost:3000`. Para validar a entrega:

```bash
npx tsc --noEmit
npm run build
```

## Conteúdo

Os projetos em destaque são DisciplineHub e project-spec-starter. Descrições e links ficam em `src/portfolio/content.ts`. Os IDs e limites das janelas ficam em `constants.ts`, e as regras de comandos em `terminal.ts`. Consulte `PROJECT.md` para escopo e critérios de aceite, `docs/BUSINESS_RULES.md` para o comportamento e `docs/ENGINEERING.md` para decisões técnicas.

## Como o desktop funciona

Veja [docs/WINDOWS.md](docs/WINDOWS.md) para entender abertura, camadas, minimização e arrasto das janelas. O `project-spec-starter` foi executado uma vez a partir do checkout local para gerar a base documental; ele não é uma dependência necessária para rodar o portfólio.

Para a URL canônica, sitemap e verificação após o deploy, veja [docs/SEO.md](docs/SEO.md).
