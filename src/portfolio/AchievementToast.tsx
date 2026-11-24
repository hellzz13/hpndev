import { useEffect } from "react";
import { FiAward, FiX } from "react-icons/fi";
import { useLanguage } from "./useLanguage";
const AchievementToastDurationMs = 6500;
type AchievementToastProps = { onDismiss: () => void; onOpen: () => void };
function AchievementToast({ onDismiss, onOpen }: AchievementToastProps) {
  const { t } = useLanguage();
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, AchievementToastDurationMs);
    return () => window.clearTimeout(timer);
  }, [onDismiss]);
  return (
    <aside
      aria-label={t.achievementUnlocked}
      className="fixed right-4 top-16 z-100 w-96 max-w-notification animate-notification-in rounded-app-window border border-window-border bg-window/95 p-4 text-foreground shadow-elevation-app-window backdrop-blur-menubar motion-reduce:animate-none"
    >
      <div className="flex items-start gap-3">
        <span className="rounded-project-card bg-terminal-bar p-3 text-terminal-prompt">
          <FiAward aria-hidden="true" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1" role="status">
          <p className="mb-1 font-mono text-type-label text-accent">
            {t.achievementUnlocked}
          </p>
          <p className="mb-1 font-display text-base">
            {t.snakeAchievementTitle}
          </p>
          <p className="mb-0 text-type-xs leading-relaxed text-body-muted">
            {t.snakeAchievementDescription}
          </p>
        </div>
        <button
          type="button"
          onClick={onDismiss}
          aria-label={t.dismissNotification}
          className="rounded-md p-1 text-body-muted hover:text-foreground"
        >
          <FiX aria-hidden="true" />
        </button>
      </div>
      <button
        type="button"
        onClick={onOpen}
        className="ml-auto mt-3 block rounded-md px-2 py-1 text-type-xs text-accent hover:bg-glass-surface"
      >
        {t.viewNotifications}
      </button>
    </aside>
  );
}
export { AchievementToast };
