const Projects = [
  {
    name: "DisciplineHub",
    type: "Produto web · em desenvolvimento",
    number: "01",
    summary:
      "Um espaço para grupos de amigos acompanharem suas próprias disciplinas, fazerem check-ins e celebrarem a consistência juntos.",
    detail:
      "Disciplinas pessoais, streaks, feed do grupo e ranking calculado a partir da atividade de cada pessoa.",
    tags: ["React", "TypeScript", "Supabase"],
    links: [
      {
        label: "Ver código",
        href: "https://github.com/hellzz13/discipline-hub",
      },
      {
        label: "Acessar produto",
        href: "https://discipline-hub-xi.vercel.app",
      },
    ],
  },
  {
    name: "project-spec-starter",
    type: "CLI · versão 1.0.0",
    number: "02",
    summary:
      "Uma ferramenta para iniciar projetos com decisões explícitas: entrevista curta, documentação gerada e um ponto de partida claro para pessoas e agentes.",
    detail:
      "O bootstrap documental funciona por entrevista interativa ou respostas JSON versionadas. Geradores de código estão planejados para etapas futuras.",
    tags: ["Node.js", "TypeScript", "CLI"],
    links: [
      {
        label: "Abrir guia",
        href: "https://hellzz13.github.io/project-spec-starter/",
      },
      {
        label: "npm",
        href: "https://www.npmjs.com/package/project-spec-starter",
      },
      {
        label: "Código",
        href: "https://github.com/hellzz13/project-spec-starter",
      },
    ],
  },
];
const Experience = [
  {
    company: "WeFit",
    role: "Desenvolvedor Front-end",
    date: "2023 — atual",
    note: "Interfaces e manutenção de produtos com React, Next.js e AEM, em colaboração com UX/UI.",
  },
  {
    company: "QuikDev",
    role: "Desenvolvedor Front-end",
    date: "2022 — 2023",
    note: "Produtos web para fintech e educação, com foco em interfaces responsivas e acessibilidade.",
  },
  {
    company: "Devio",
    role: "Desenvolvedor Front-end",
    date: "2021 — 2022",
    note: "Desenvolvimento de interfaces web e mobile a partir de projetos de design.",
  },
  {
    company: "Unique",
    role: "Desenvolvedor Web",
    date: "2021",
    note: "Evolução e manutenção de um sistema de gestão em Angular.",
  },
];

const InitialTerminalLines = [
  {
    command: "whoami",
    output:
      "Hélio Palença — desenvolvedor front-end e criador de produtos para a web.",
  },
  {
    command: "welcome",
    output: "Bem-vindo ao meu espaço. Digite help ou use os ícones do desktop.",
  },
];

export { Projects, Experience, InitialTerminalLines };
