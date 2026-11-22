import { Locales } from "./locales";
import type { Locale } from "./locales";
import { getMessages } from "./messages";

const SiteOrigin = "https://hpndev.vercel.app";
const LocaleUrls = { [Locales.PORTUGUESE]: `${SiteOrigin}/`, [Locales.ENGLISH]: `${SiteOrigin}/en` } as const;
const SocialImageUrl = `${SiteOrigin}/studying.png`;

function getSeo(locale: Locale) {
  const t = getMessages(locale);
  const SiteUrl = LocaleUrls[locale];
  const isEnglish = locale === Locales.ENGLISH;
  const SiteTitle = t.siteTitle;
  const SiteDescription = t.siteDescription;
  const StructuredData = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "WebSite", "@id": `${SiteUrl}#website`, url: SiteUrl, name: t.siteName, inLanguage: locale, description: SiteDescription },
      {
        "@type": "Person", "@id": `${SiteOrigin}/#person`, name: "Hélio Palença", url: SiteUrl,
        jobTitle: t.jobTitle, image: SocialImageUrl,
        sameAs: ["https://github.com/hellzz13", "https://www.linkedin.com/in/hpneto/"],
      },
    ],
  };
  return { SiteUrl, SiteTitle, SiteDescription, SocialImageUrl, StructuredData, ogLocale: isEnglish ? "en_US" : "pt_BR" };
}

export { getSeo, LocaleUrls };
