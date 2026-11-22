import Head from "next/head";
import Link from "next/link";
import { useLanguage } from "@/portfolio/useLanguage";
import { LanguageSwitcher } from "@/portfolio/LanguageSwitcher";

function NotFound() {
  const { t } = useLanguage();
  return (
    <>
      <Head>
        <title>{t.errorTitle}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <main className="relative flex min-h-dvh flex-col justify-center bg-recovery-background p-recovery-gutter text-recovery-foreground font-sans">
        <div className="absolute right-4 top-4"><LanguageSwitcher /></div>
        <div className="my-auto w-full max-w-recovery pb-15 pt-9">
          <span className="text-type-label leading-natural tracking-recovery text-recovery-muted font-mono">{t.recovery}</span>
          <div className="mb-5.5 mt-7 text-type-recovery-face font-light leading-none" aria-hidden="true">:(</div>
          <h1 className="mb-6 text-type-recovery-heading font-medium leading-recovery-heading tracking-recovery-heading font-display">{t.errorFirst}<br />{t.errorLast}</h1>
          <p className="max-w-recovery-copy text-type-body leading-recovery text-recovery-body">{t.errorDescription}</p>
          <Link className="mt-4.5 inline-flex items-center gap-3 rounded-md border border-recovery-action-border bg-recovery-action px-5.5 py-4 font-bold text-recovery-action-foreground no-underline hover:bg-recovery-action-hover focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-5 focus-visible:outline-focus" href="/">↻ &nbsp; {t.restart} <span aria-hidden="true">↗</span></Link>
          <p className="mt-3 max-w-recovery-copy text-xs leading-recovery text-recovery-body">{t.restartHint}</p>
          <div className="mt-11 flex flex-col gap-2.25 text-type-label leading-body text-recovery-muted wrap-anywhere font-mono">
            <span>{t.stopCode}</span>
            <strong className="font-medium text-recovery-foreground">404 · PAGE_NOT_FOUND</strong>
            <span>{t.diagnosis}</span>
          </div>
        </div>
        <footer className="flex flex-wrap gap-x-8 gap-y-3 border-t border-recovery-divider pt-6 text-type-label leading-body text-recovery-muted font-mono">✳ Hélio OS <span>{t.errorFooter}</span></footer>
      </main>
    </>
  );
}

export default NotFound;
