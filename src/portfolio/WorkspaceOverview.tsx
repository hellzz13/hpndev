import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  TransitionChild,
} from "@headlessui/react";
import { FiX } from "react-icons/fi";
import { useCallback, useRef, useState } from "react";
import type { KeyboardEvent, ReactNode } from "react";
import { useOverviewGestures } from "./useOverviewGestures";
import { moveWorkspace } from "./workspaceNavigation";
import { Brand } from "./Brand";
import { Spaces } from "./constants";
import type { AppId, SpaceId } from "./constants";
import type { DesktopWindowState } from "./useWindowManager";
import { useLanguage } from "./useLanguage";

type OverviewWindow = DesktopWindowState<AppId, SpaceId>;
type WorkspaceOverviewProps = {
  isOpen: boolean;
  currentSpace: SpaceId;
  windows: readonly OverviewWindow[];
  renderPreview: (id: AppId) => ReactNode;
  onClose: () => void;
  onSelectSpace: (space: SpaceId) => void;
  onSelectWindow: (window: OverviewWindow) => void;
};

const SpaceIds = Object.values(Spaces);
const PreviewPosition = {
  origin: 30,
  divisor: 12,
  minimum: 4,
  maximum: 46,
} as const;
const FocusStyle =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-focus";

function WorkspaceOverviewContent({
  currentSpace,
  windows,
  renderPreview,
  onClose,
  onSelectSpace,
  onSelectWindow,
}: Omit<WorkspaceOverviewProps, "isOpen">) {
  const { t, appLabel } = useLanguage();
  const [previewSpace, setPreviewSpace] = useState(currentSpace);
  const spaceButtons = useRef<
    Partial<Record<SpaceId, HTMLButtonElement | null>>
  >({});
  const overviewRef = useRef<HTMLDivElement>(null);
  const previewWorkspace = useCallback(
    (direction: number) => {
      const nextSpace = moveWorkspace(previewSpace, direction);
      spaceButtons.current[nextSpace]?.focus({ preventScroll: true });
    },
    [previewSpace],
  );
  useOverviewGestures({
    containerRef: overviewRef,
    onNavigate: previewWorkspace,
  });
  const spaceLabels = { [Spaces.HOME]: t.home, [Spaces.PROJECTS]: t.projects };
  const currentWindows = windows.filter((item) => {
    const belongsToCurrentSpace = item.space === previewSpace;
    return belongsToCurrentSpace;
  });
  const isEmpty = currentWindows.length === 0;

  function navigateSpaces(event: KeyboardEvent<HTMLElement>) {
    const isPrevious = event.key === "ArrowLeft" || event.key === "ArrowUp";
    const isNext = event.key === "ArrowRight" || event.key === "ArrowDown";
    const canNavigate =
      !event.defaultPrevented &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.shiftKey &&
      !event.nativeEvent.isComposing &&
      (isPrevious || isNext);
    if (!canNavigate) return;
    event.preventDefault();
    previewWorkspace(isPrevious ? -1 : 1);
  }

  return (
    <>
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-desktop/95 backdrop-blur-menubar transition-opacity duration-300 ease-out data-[closed]:opacity-0 motion-reduce:transition-none"
      />
      <div
        ref={overviewRef}
        className="fixed inset-0 overflow-y-auto overscroll-x-none"
      >
        <DialogPanel
          transition
          className="mx-auto flex min-h-dvh w-full max-w-screen-xl origin-center flex-col gap-8 p-8 text-foreground transition duration-300 ease-out data-[closed]:translate-y-3 data-[closed]:scale-105 data-[closed]:opacity-0 motion-reduce:transition-none motion-reduce:!transform-none mobile:gap-6 mobile:p-4"
        >
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
            onKeyDown={navigateSpaces}
            className="flex justify-center gap-6 border-b border-glass-border pb-6 mobile:gap-3"
          >
            {SpaceIds.map((space, index) => {
              const isActive = space === previewSpace;
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
                  ref={(element) => {
                    spaceButtons.current[space] = element;
                  }}
                  data-autofocus={space === currentSpace ? true : undefined}
                  aria-pressed={isActive}
                  onFocus={() => setPreviewSpace(space)}
                  onClick={() => onSelectSpace(space)}
                  className={`w-full max-w-xs rounded-project-card text-left ${FocusStyle}`}
                >
                  <div
                    aria-hidden="true"
                    className={`relative aspect-video overflow-hidden rounded-project-card border ${wallpaperStyle} ${surfaceStyle}`}
                  >
                    <span className="absolute left-3 top-3 font-display text-type-label text-hero-muted">
                      <Brand className="h-4 w-auto" />
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
                          className={`absolute w-fit max-w-overview-mini overflow-hidden bg-window [&>svg]:h-auto [&>svg]:w-auto [&>svg]:max-w-full [&>svg]:max-h-20 mobile:[&>svg]:max-h-8 rounded border border-window-border shadow-elevation-dock ${minimizedStyle}`}
                        >
                          {renderPreview(item.id)}
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

          <TransitionChild
            as="section"
            aria-label={t.overviewWindows}
            className="flex-1 transition duration-300 ease-out data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:delay-75 data-[leave]:duration-150 motion-reduce:transition-none motion-reduce:!transform-none"
          >
            <h3 className="mb-4 font-mono text-type-label text-body-muted">
              {spaceLabels[previewSpace]} / {t.overviewSelectWindow}
            </h3>
            {isEmpty ? (
              <p className="rounded-project-card border border-dashed border-glass-border p-8 text-center text-body-muted">
                {t.overviewEmpty}
              </p>
            ) : (
              <div className="grid grid-cols-3 items-start justify-items-center gap-8 compact:grid-cols-2 mobile:grid-cols-1">
                {currentWindows.map((item) => {
                  const minimizedLabel = item.minimized
                    ? ` · ${t.overviewMinimized}`
                    : "";
                  const selectionLabel = `${t.overviewSelectWindow}: ${appLabel(item.id)}${minimizedLabel}`;
                  return (
                    <button
                      type="button"
                      key={item.id}
                      aria-label={selectionLabel}
                      onClick={() => onSelectWindow(item)}
                      className={`group w-full min-w-0 max-w-sm text-left ${FocusStyle}`}
                    >
                      <span
                        aria-hidden="true"
                        className="mx-auto block w-fit max-w-full overflow-hidden rounded-project-card [&>svg]:h-auto [&>svg]:w-auto [&>svg]:max-h-64 [&>svg]:max-w-full border border-window-border bg-window shadow-elevation-dock transition duration-200 group-hover:-translate-y-1 group-hover:border-accent group-hover:ring-2 group-hover:ring-accent motion-reduce:transform-none motion-reduce:transition-none"
                      >
                        {renderPreview(item.id)}
                      </span>
                      <span className="mt-3 flex items-center justify-center gap-2 font-mono text-type-label text-body-muted group-hover:text-accent">
                        {appLabel(item.id)}
                        {item.minimized && (
                          <span className="text-accent">
                            · {t.overviewMinimized}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </TransitionChild>
          <p className="font-mono text-type-label text-body-muted">
            {t.overviewHint}
            <br />
            {t.overviewGestureInfo}
            <br />
            {t.overviewHorizontalGesture}
          </p>
        </DialogPanel>
      </div>
    </>
  );
}

function WorkspaceOverview({
  isOpen,
  onClose,
  ...props
}: WorkspaceOverviewProps) {
  return (
    <Dialog
      data-workspace-overview
      open={isOpen}
      onClose={onClose}
      transition
      unmount
      className="relative z-101"
    >
      <WorkspaceOverviewContent {...props} onClose={onClose} />
    </Dialog>
  );
}

export { WorkspaceOverview };
