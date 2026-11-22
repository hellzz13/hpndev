import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { FiGlobe, FiCheck } from "react-icons/fi";
import { LocaleOptions, saveLocalePreference } from "./locales";
import type { Locale } from "./locales";
import { useLanguage } from "./useLanguage";

function LanguageSwitcher() {
  const { locale, t } = useLanguage();
  const router = useRouter();
  const detailsRef = useRef<HTMLDetailsElement>(null);
  const [pending, setPending] = useState(false);
  const [failed, setFailed] = useState(false);
  const activeOption = LocaleOptions.find((option) => {
    const isSelectedLocale = option.id === locale;
    return isSelectedLocale;
  })!;

  useEffect(() => {
    function dismiss(event: PointerEvent) {
      const details = detailsRef.current;
      const isOutside =
        event.target instanceof Node && !details?.contains(event.target);
      const shouldDismiss = isOutside && details !== null;
      if (shouldDismiss) details.open = false;
    }
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, []);

  async function selectLanguage(nextLocale: Locale) {
    const shouldNavigate = nextLocale !== locale;
    setPending(true);
    setFailed(false);
    try {
      if (shouldNavigate) {
        const changed = await router.push(
          { pathname: router.pathname, query: router.query },
          router.asPath,
          { locale: nextLocale, scroll: false },
        );
        const wasNavigationCancelled = !changed;
        if (wasNavigationCancelled)
          throw new Error("Language navigation cancelled");
      }
      saveLocalePreference(nextLocale);
      const details = detailsRef.current;
      const canCloseMenu = details !== null;
      if (canCloseMenu) {
        details.open = false;
        details.querySelector("summary")?.focus();
      }
    } catch {
      setFailed(true);
    } finally {
      setPending(false);
    }
  }

  return (
    <details
      ref={detailsRef}
      className="relative"
      onKeyDown={(event) => {
        const details = detailsRef.current;
        const shouldClose = event.key === "Escape" && details !== null;
        if (shouldClose) {
          details.open = false;
          details.querySelector("summary")?.focus();
          event.stopPropagation();
        }
      }}
    >
      <summary
        aria-label={t.language}
        className="inline-flex cursor-pointer list-none items-center gap-1.5 rounded-tooltip px-2 py-1.5 font-mono text-type-label text-foreground hover:bg-glass-highlight focus-visible:outline focus-visible:outline-2 focus-visible:outline-focus [&::-webkit-details-marker]:hidden"
      >
        <FiGlobe className="h-3.5 w-3.5" aria-hidden="true" />{" "}
        {activeOption.short}
      </summary>
      <div
        className="absolute right-0 top-full z-101 mt-2 w-48 rounded-project-card border border-glass-border bg-window p-2 text-foreground shadow-elevation-dock"
        aria-label={t.languageOptions}
        aria-busy={pending}
      >
        <p className="px-2 py-1 font-mono text-type-caption text-body-muted">
          {t.languageOptions}
        </p>
        {LocaleOptions.map((option) => {
          const isSelectedLocale = option.id === locale;
          return (
            <button
              key={option.id}
              type="button"
              lang={option.id}
              aria-pressed={isSelectedLocale}
              disabled={pending}
              onClick={() => void selectLanguage(option.id)}
              className="flex w-full items-center justify-between rounded-tooltip px-2 py-2 text-left text-type-xs hover:bg-glass-highlight disabled:opacity-60"
            >
              {option.label}{" "}
              {isSelectedLocale && (
                <FiCheck aria-hidden="true" className="text-accent" />
              )}
            </button>
          );
        })}
        {failed && (
          <p role="alert" className="p-2 text-type-xs">
            {t.languageError}
          </p>
        )}
      </div>
    </details>
  );
}

export { LanguageSwitcher };
