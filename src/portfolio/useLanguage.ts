import { useRouter } from "next/router";
import { resolveLocale } from "./locales";
import { getMessages, getAppLabel } from "./messages";
import type { AppId } from "./constants";

function useLanguage() {
  const router = useRouter();
  const locale = resolveLocale(router.locale);
  return { locale, t: getMessages(locale), appLabel: (id: AppId) => getAppLabel(id, locale) };
}

export { useLanguage };
