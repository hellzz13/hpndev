import type { PortfolioProject, ProjectName, ProjectLinkLabel, Projects } from "./content";

const EnglishProjectText = {
  DisciplineHub: {
    type: "Web product · in development",
    summary: "A space where groups of friends can track their own disciplines, check in and celebrate consistency together.",
    detail: "Personal disciplines, streaks, a group feed and rankings based on each person's activity.",
  },
  "project-spec-starter": {
    type: "CLI · version 1.0.0",
    summary: "A tool for starting projects with explicit decisions: a short interview, generated documentation and a clear starting point for people and agents.",
    detail: "The documentation bootstrap works through an interactive interview or versioned JSON answers. Code generators are planned for future stages.",
  },
} satisfies Record<ProjectName, { type: string; summary: string; detail: string }>;

const EnglishLinkLabels = {
  "Ver código": "View code",
  "Acessar produto": "Visit product",
  "Abrir guia": "Open guide",
  npm: "npm",
  Código: "Code",
} satisfies Record<ProjectLinkLabel, string>;

const EnglishExperience = [
  { company: "WeFit", role: "Software Engineer", date: "2023 — present", note: "Interfaces and maintenance for products built with React, Next.js and AEM, working with UX/UI teams." },
  { company: "QuikDev", role: "Software Engineer", date: "2022 — 2023", note: "Fintech and education products, focused on responsive interfaces and accessibility." },
  { company: "Devio", role: "Software Engineer", date: "2021 — 2022", note: "Building web and mobile interfaces from design specifications." },
  { company: "Unique", role: "Web Developer", date: "2021", note: "Developing and maintaining an Angular management system." },
];

const EnglishInitialTerminalLines = [
  { command: "whoami", output: "Hélio Palença — a Software Engineer building products for the web." },
  { command: "welcome", output: "Welcome to my space. Type help or use the desktop icons." },
];

function translateProjects(projects: readonly (typeof Projects)[number][]): PortfolioProject[] {
  return projects.map((project) => {
    const text = EnglishProjectText[project.name];
    return { ...project, type: text.type, summary: text.summary, detail: text.detail, links: project.links.map((link) => ({ ...link, label: EnglishLinkLabels[link.label] })) };
  });
}

export { translateProjects, EnglishExperience, EnglishInitialTerminalLines };
