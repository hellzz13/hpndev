const Locales = { PORTUGUESE: "pt-BR", ENGLISH: "en" } as const;
type Locale = (typeof Locales)[keyof typeof Locales];
const LocaleOptions = [
  { id: Locales.PORTUGUESE, label: "Português", short: "PT" },
  { id: Locales.ENGLISH, label: "English", short: "EN" },
] as const;
const LocaleCookie = { name: "NEXT_LOCALE", maxAge: 31_536_000 } as const;

function resolveLocale(value: string | undefined): Locale {
  const isEnglish = value === Locales.ENGLISH;
  return isEnglish ? Locales.ENGLISH : Locales.PORTUGUESE;
}

function saveLocalePreference(locale: Locale) {
  try {
    const secure = window.location.protocol === "https:" ? "; Secure" : "";
    document.cookie = `${LocaleCookie.name}=${locale}; Path=/; Max-Age=${LocaleCookie.maxAge}; SameSite=Lax${secure}`;
  } catch {
    // Switching language still works when the browser blocks preference storage.
  }
}

export {
  Locales,
  LocaleOptions,
  LocaleCookie,
  resolveLocale,
  saveLocalePreference,
};
export type { Locale };
