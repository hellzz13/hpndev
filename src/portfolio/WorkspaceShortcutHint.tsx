import { WorkspaceShortcut } from "./constants";
import { useLanguage } from "./useLanguage";

const KeyStyle =
  "inline-flex min-w-6 items-center justify-center rounded border border-window-border border-b-2 bg-window-bar px-1.5 py-1 font-mono text-type-caption leading-none text-foreground";

function WorkspaceShortcutHint() {
  const { t } = useLanguage();
  return (
    <span className="inline-flex flex-col items-start gap-2">
      <span
        role="group"
        aria-label={`${t.workspaceShortcut}: ${WorkspaceShortcut.label}. ${t.shortcutScope}`}
        className="inline-flex flex-wrap items-center gap-3 rounded-project-card border border-glass-border bg-glass-surface px-3 py-2.5"
      >
        <span
          aria-hidden="true"
          className="font-mono text-type-caption text-body-muted"
        >
          {t.workspaceShortcut}
        </span>
        <span aria-hidden="true" className="inline-flex items-center gap-1.5">
          <kbd className={KeyStyle}>Alt / ⌥</kbd>
          <kbd className={KeyStyle}>Shift</kbd>
          <span className="text-body-muted">+</span>
          <kbd className={KeyStyle}>←</kbd>
          <span className="text-body-muted">/</span>
          <kbd className={KeyStyle}>→</kbd>
        </span>
      </span>
      <span
        className="font-mono text-type-caption text-body-muted"
        title={t.workspaceGestureInfo}
      >
        {t.workspaceSwitcherHint}
      </span>
    </span>
  );
}

export { WorkspaceShortcutHint };
