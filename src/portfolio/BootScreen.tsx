import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import Image from "next/image";
import { useEffect } from "react";
import { useLanguage } from "./useLanguage";

const BootFallbackMs = 3400;
const ReducedMotionQuery = "(prefers-reduced-motion: reduce)";
type BootScreenProps = { onComplete: () => void };

function BootScreen({ onComplete }: BootScreenProps) {
  const { t } = useLanguage();

  useEffect(() => {
    const media = window.matchMedia(ReducedMotionQuery);
    const fallbackDelay = media.matches ? 0 : BootFallbackMs;
    const timer = window.setTimeout(onComplete, fallbackDelay);
    function handleMotionChange(event: MediaQueryListEvent) {
      const shouldSkipMotion = event.matches;
      if (shouldSkipMotion) onComplete();
    }
    media.addEventListener("change", handleMotionChange);
    return () => {
      window.clearTimeout(timer);
      media.removeEventListener("change", handleMotionChange);
    };
  }, [onComplete]);

  return (
    <Dialog open onClose={onComplete} className="relative z-101">
      <DialogPanel
        data-boot-screen
        className="fixed inset-0 flex animate-boot-reveal flex-col items-center justify-center bg-desktop text-foreground motion-reduce:animate-none"
        onAnimationEnd={(event) => {
          const isScreenAnimation = event.target === event.currentTarget;
          if (isScreenAnimation) onComplete();
        }}
      >
        <div className="flex flex-col items-center gap-8">
          <Image
            src="/brand/helio-os-symbol.svg"
            alt=""
            width={80}
            height={80}
            priority
            className="h-20 w-20 animate-boot-symbol motion-reduce:animate-none"
          />
          <DialogTitle className="m-0">
            <Image
              src="/brand/helio-os-wordmark.svg"
              alt="Hélio OS"
              width={236}
              height={47}
              priority
              className="h-8 w-auto"
            />
          </DialogTitle>
          <p className="m-0 font-mono text-type-label text-body-muted">
            {t.bootStarting}
          </p>
        </div>
        <button
          type="button"
          data-autofocus
          onClick={onComplete}
          className="absolute bottom-8 rounded-md border border-window-bar-border px-4 py-2 font-mono text-type-label text-body-muted transition-colors hover:border-accent hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus"
        >
          {t.bootSkip}{" "}
          <span aria-hidden="true" className="ml-2 text-accent">
            ↵
          </span>
        </button>
      </DialogPanel>
    </Dialog>
  );
}

export { BootScreen };
