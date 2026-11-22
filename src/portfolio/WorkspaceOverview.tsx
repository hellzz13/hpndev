import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { FiX } from "react-icons/fi";
import { AppInfo, Apps, Spaces } from "./constants";
import type { AppId, SpaceId } from "./constants";
import type { DesktopWindowState } from "./useWindowManager";
import { useLanguage } from "./useLanguage";

type OverviewWindow = DesktopWindowState<AppId, SpaceId>;
type WorkspaceOverviewProps = {
  isOpen: boolean;
  currentSpace: SpaceId;
  windows: readonly OverviewWindow[];
  previews: Record<AppId, string>;
  onClose: () => void;
  onSelectSpace: (space: SpaceId) => void;
  onSelectWindow: (window: OverviewWindow) => void;
};

const SpaceIds = Object.values(Spaces);
const PreviewPosition = {
  origin: 30,
  divisor: 12,
  minimum: 4,
  maximum: 65,
} as const;
const FocusStyle =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus";

function WorkspaceOverview({
  isOpen,
  currentSpace,
  windows,
  previews,
  onClose,
  onSelectSpace,
  onSelectWindow,
}: WorkspaceOverviewProps) {
  const { t, appLabel } = useLanguage();
  const spaceLabels = { [Spaces.HOME]: t.home, [Spaces.PROJECTS]: t.projects };
  const currentWindows = windows.filter((item) => {
    const belongsToCurrentSpace = item.space === currentSpace;
    return belongsToCurrentSpace;
  });
  const isEmpty = currentWindows.length === 0;

  return (
    <Dialog
      data-workspace-overview
      open={isOpen}
      onClose={onClose}
      transition
      className="relative z-101 transition duration-200 data-[closed]:opacity-0 motion-reduce:transition-none"
    >
      <div
        className="fixed inset-0 bg-desktop/95 backdrop-blur-menubar"
        aria-hidden="true"
      />
      <div className="fixed inset-0 overflow-y-auto">
        <DialogPanel className="mx-auto flex min-h-dvh w-full max-w-screen-xl flex-col gap-8 p-8 text-foreground mobile:gap-6 mobile:p-4">
          <header className="flex items-center justify-between gap-4">
            <div>
              <p className="font-mono text-type-label text-accent">
                HÉLIO OS / {t.workspaces}
              </p>
              <DialogTitle className="mt-2 font-display text-2xl">
                {t.overviewTitle}
              </DialogTitle>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label={t.closeOverview}
              className={`rounded-project-card border border-glass-border p-3 hover:bg-glass-surface ${FocusStyle}`}
            >
              <FiX aria-hidden="true" />
            </button>
          </header>

          <nav
            aria-label={t.workspaces}
            className="flex justify-center gap-6 border-b border-glass-border pb-6 mobile:gap-3"
          >
            {SpaceIds.map((space, index) => {
              const isActive = space === currentSpace;
              const spaceWindows = windows.filter((item) => {
                const belongsToSpace = item.space === space;
                return belongsToSpace;
              });
              const hasOneWindow = spaceWindows.length === 1;
              const windowCountLabel = hasOneWindow
                ? t.window
                : t.overviewWindows;
              const isProjectsSpace = space === Spaces.PROJECTS;
              const wallpaperStyle = isProjectsSpace
                ? "bg-projects-desktop bg-projects-wallpaper"
                : "bg-desktop bg-wallpaper";
              const surfaceStyle = isActive
                ? "border-accent ring-2 ring-accent"
                : "border-window-border hover:border-accent";
              return (
                <button
                  type="button"
                  key={space}
                  aria-pressed={isActive}
                  onClick={() => onSelectSpace(space)}
                  className={`w-full max-w-xs rounded-project-card text-left ${FocusStyle}`}
                >
                  <div
                    aria-hidden="true"
                    className={`relative aspect-video overflow-hidden rounded-project-card border ${wallpaperStyle} ${surfaceStyle}`}
                  >
                    <span className="absolute left-3 top-3 font-display text-type-label text-hero-muted">
                      ✳ Hélio OS
                    </span>
                    {spaceWindows.map((item) => {
                      const left = Math.max(
                        PreviewPosition.minimum,
                        Math.min(
                          PreviewPosition.maximum,
                          PreviewPosition.origin +
                            item.x / PreviewPosition.divisor,
                        ),
                      );
                      const top = Math.max(
                        PreviewPosition.minimum,
                        Math.min(
                          PreviewPosition.maximum,
                          PreviewPosition.origin +
                            item.y / PreviewPosition.divisor,
                        ),
                      );
                      const minimizedStyle = item.minimized
                        ? "opacity-40"
                        : "opacity-100";
                      return (
                        <span
                          key={item.id}
                          style={{
                            left: `${left}%`,
                            top: `${top}%`,
                            zIndex: item.z,
                          }}
                          className={`absolute w-1/3 truncate rounded border border-window-border bg-window p-2 font-mono text-type-caption text-window-title ${minimizedStyle}`}
                        >
                          {appLabel(item.id)}
                        </span>
                      );
                    })}
                  </div>
                  <span className="mt-3 flex items-center justify-between gap-2 text-type-xs">
                    <span>
                      <span className="font-mono text-accent">
                        0{index + 1}
                      </span>{" "}
                      {spaceLabels[space]}
                    </span>
                    <span className="text-body-muted">
                      {spaceWindows.length} {windowCountLabel}
                    </span>
                  </span>
                </button>
              );
            })}
          </nav>

          <section aria-label={t.overviewWindows} className="flex-1">
            <h3 className="mb-4 font-mono text-type-label text-body-muted">
              {spaceLabels[currentSpace]} / {t.overviewSelectWindow}
            </h3>
            {isEmpty ? (
              <p className="rounded-project-card border border-dashed border-glass-border p-8 text-center text-body-muted">
                {t.overviewEmpty}
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-6 compact:grid-cols-2 mobile:grid-cols-1">
                {currentWindows.map((item) => {
                  const { Icon } = AppInfo[item.id];
                  const minimizedLabel = item.minimized
                    ? ` · ${t.overviewMinimized}`
                    : "";
                  const selectionLabel = `${t.overviewSelectWindow}: ${appLabel(item.id)}${minimizedLabel}`;
                  const isTerminal = item.id === Apps.TERMINAL;
                  const previewStyle = isTerminal
                    ? "bg-terminal font-mono text-terminal-output"
                    : "bg-window font-sans text-body-muted";
                  return (
                    <button
                      type="button"
                      key={item.id}
                      aria-label={selectionLabel}
                      onClick={() => onSelectWindow(item)}
                      className={`group overflow-hidden rounded-project-card border border-window-border bg-window text-left shadow-elevation-dock transition duration-200 hover:-translate-y-1 hover:border-accent motion-reduce:transform-none motion-reduce:transition-none ${FocusStyle}`}
                    >
                      <span className="flex items-center gap-2 border-b border-window-bar-border bg-window-bar p-3 text-type-xs">
                        <Icon aria-hidden="true" />
                        <span className="flex-1">{appLabel(item.id)}</span>
                        {item.minimized && (
                          <span className="font-mono text-type-caption text-accent">
                            {t.overviewMinimized}
                          </span>
                        )}
                      </span>
                      <span
                        className={`block h-40 overflow-hidden whitespace-pre-line break-words p-4 text-type-label leading-relaxed ${previewStyle}`}
                      >
                        {previews[item.id]}
                      </span>
                      <span className="block p-3 text-type-label text-body-muted group-hover:text-accent">
                        {t.overviewSelectWindow} ↗
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </section>
          <p className="font-mono text-type-label text-body-muted">
            {t.overviewHint}
          </p>
        </DialogPanel>
      </div>
    </Dialog>
  );
}

export { WorkspaceOverview };
