import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { FiAward, FiBell, FiX, FiArrowUpRight } from "react-icons/fi";
import { useLanguage } from "./useLanguage";
import type { AchievementSnapshot } from "./achievements";

type NotificationCenterProps = {
  isOpen: boolean;
  onClose: () => void;
  onPlaySnake: () => void;
  achievements: AchievementSnapshot;
};
function NotificationCenter({
  isOpen,
  onClose,
  onPlaySnake,
  achievements,
}: NotificationCenterProps) {
  const { t } = useLanguage();
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      transition
      className="relative z-101"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-desktop/40 transition-opacity duration-200 data-[closed]:opacity-0 motion-reduce:transition-none"
      />
      <div className="fixed inset-0 overflow-y-auto p-4 pt-16">
        <DialogPanel
          transition
          className="ml-auto w-96 max-w-notification rounded-app-window border border-window-border bg-window/95 p-5 text-foreground shadow-elevation-app-window backdrop-blur-menubar transition duration-200 ease-out data-[closed]:translate-x-8 data-[closed]:opacity-0 motion-reduce:transition-none motion-reduce:transform-none"
        >
          <header className="mb-5 flex items-center justify-between gap-3">
            <DialogTitle className="m-0 flex items-center gap-2 font-display text-lg">
              <FiBell aria-hidden="true" className="text-accent" />
              {t.notifications}
            </DialogTitle>
            <button
              type="button"
              data-autofocus
              onClick={onClose}
              aria-label={t.closeNotifications}
              className="rounded-md p-2 text-body-muted hover:bg-glass-surface hover:text-foreground"
            >
              <FiX aria-hidden="true" />
            </button>
          </header>
          <p className="mb-3 font-mono text-type-label uppercase tracking-wide text-body-muted">
            {t.achievements}
          </p>
          {achievements.snakeDiscovered ? (
            <article className="rounded-project-card border border-glass-border bg-glass-surface p-4">
              <div className="flex items-start gap-3">
                <span className="rounded-project-card bg-terminal-bar p-3 text-terminal-prompt">
                  <FiAward aria-hidden="true" className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="mb-1 font-mono text-type-label text-accent">
                    HÉLIO OS / {t.achievementUnlocked}
                  </p>
                  <h3 className="mb-2 font-display text-lg">
                    {t.snakeAchievementTitle}
                  </h3>
                  <p className="mb-0 text-type-sm leading-relaxed text-body-muted">
                    {t.snakeAchievementDescription}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onPlaySnake}
                className="mt-4 inline-flex items-center gap-2 rounded-md border border-window-border px-3 py-2 text-type-sm text-foreground hover:border-accent hover:text-accent"
              >
                {t.playSnake}
                <FiArrowUpRight aria-hidden="true" />
              </button>
            </article>
          ) : (
            <p className="rounded-project-card border border-dashed border-glass-border p-6 text-type-sm leading-relaxed text-body-muted">
              {t.notificationsEmpty}
            </p>
          )}
          <p className="mb-0 mt-4 text-type-label leading-relaxed text-body-muted">
            {t.notificationsLocal}
          </p>
        </DialogPanel>
      </div>
    </Dialog>
  );
}
export { NotificationCenter };
