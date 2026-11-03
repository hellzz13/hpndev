const SiteUrl = "https://hpndev.vercel.app/";
const SiteTitle = "Hélio Palença | Software Engineer e projetos web";
const SiteDescription =
  "Portfólio de Hélio Palença: desenvolvimento front-end, experiência profissional e projetos como DisciplineHub e project-spec-starter.";
const SocialImageUrl = `${SiteUrl}studying.png`;

const StructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${SiteUrl}#website`,
      url: SiteUrl,
      name: "Portfólio de Hélio Palença",
      inLanguage: "pt-BR",
      description: SiteDescription,
    },
    {
      "@type": "Person",
      "@id": `${SiteUrl}#person`,
      name: "Hélio Palença",
      url: SiteUrl,
      jobTitle: "Desenvolvedor Front-end",
      image: SocialImageUrl,
      sameAs: [
        "https://github.com/hellzz13",
        "https://www.linkedin.com/in/hpneto/",
      ],
    },
  ],
} as const;

export { SiteUrl, SiteTitle, SiteDescription, SocialImageUrl, StructuredData };
