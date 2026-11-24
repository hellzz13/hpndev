import { DesktopStyles } from "@/portfolio/styles";
import { useRef } from "react";
import type { KeyboardEvent, MouseEvent, PointerEvent, ReactNode } from "react";
import { FiMinimize2, FiMaximize2, FiMinus, FiX } from "react-icons/fi";
import {
  ResizeEdges,
  ResizeHandleStyles,
  ResizeKeyboardStep,
  resizeGeometry,
} from "./windowResize";
import type { ResizeEdge, ResizeFrame, WindowGeometry } from "./windowResize";
import type { AppId } from "./constants";
import { DesktopBreakpoint } from "./constants";
import { useLanguage } from "./useLanguage";

const ResizeSettings = { margin: 12, dockFallbackSpace: 84 } as const;
const WindowMinimumSizes = {
  terminal: { width: 320, height: 220 },
  projects: { width: 360, height: 300 },
  about: { width: 320, height: 300 },
  career: { width: 320, height: 300 },
  contact: { width: 320, height: 300 },
  snake: { width: 320, height: 400 },
} as const satisfies Record<AppId, { width: number; height: number }>;

type Position = {
  x: number;
  y: number;
  z: number;
  maximized: boolean;
  width?: number;
  height?: number;
};
type DragStart = {
  pointerX: number;
  pointerY: number;
  x: number;
  y: number;
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
};

type DesktopWindowProps = {
  id: AppId;
  label: string;
  title: string;
  position: Position;
  onFocus: () => void;
  onResize: (geometry: WindowGeometry) => void;
  onMove: (x: number, y: number) => void;
  onClose: () => void;
  onMinimize: () => void;
  onToggleMaximize: () => void;
  children: ReactNode;
};

function DesktopWindow({
  id,
  label,
  title,
  position,
  onFocus,
  onMove,
  onResize,
  onClose,
  onMinimize,
  onToggleMaximize,
  children,
}: DesktopWindowProps) {
  const dragStart = useRef<DragStart | null>(null);
  const { t } = useLanguage();
  const resizeStart = useRef<{
    frame: ResizeFrame;
    edge: ResizeEdge;
    pointerX: number;
    pointerY: number;
  } | null>(null);
  const resizeLabels = {
    n: t.resizeNorth,
    s: t.resizeSouth,
    e: t.resizeEast,
    w: t.resizeWest,
    ne: t.resizeNorthEast,
    nw: t.resizeNorthWest,
    se: t.resizeSouthEast,
    sw: t.resizeSouthWest,
  };
  function measureResize(element: HTMLElement): ResizeFrame | null {
    const canResize =
      !position.maximized && !window.matchMedia(DesktopBreakpoint).matches;
    if (!canResize) return null;
    const section = element.closest(".app-window");
    if (!section) return null;
    const rect = section.getBoundingClientRect();
    const menuBottom =
      document.querySelector(".menubar")?.getBoundingClientRect().bottom ?? 0;
    const dockTop =
      document
        .querySelector("nav[aria-label] .running")

        ?.getBoundingClientRect().top ??
      window.innerHeight - ResizeSettings.dockFallbackSpace;
    return {
      left: rect.left,
      right: rect.right,
      top: rect.top,
      bottom: rect.bottom,
      x: position.x,
      y: position.y,
      minWidth: WindowMinimumSizes[id].width,
      minHeight: WindowMinimumSizes[id].height,
      bounds: {
        left: ResizeSettings.margin,
        right: window.innerWidth - ResizeSettings.margin,
        top: menuBottom + ResizeSettings.margin,
        bottom: dockTop - ResizeSettings.margin,
      },
    };
  }
  function beginResize(
    event: PointerEvent<HTMLButtonElement>,
    edge: ResizeEdge,
  ) {
    const isPrimary = event.button === 0;
    if (!isPrimary) return;
    const frame = measureResize(event.currentTarget);
    if (!frame) return;
    event.preventDefault();
    event.currentTarget.focus();
    resizeStart.current = {
      frame,
      edge,
      pointerX: event.clientX,
      pointerY: event.clientY,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }
  function continueResize(event: PointerEvent<HTMLButtonElement>) {
    const start = resizeStart.current;
    if (!start) return;
    onResize(
      resizeGeometry(
        start.frame,
        start.edge,
        event.clientX - start.pointerX,
        event.clientY - start.pointerY,
      ),
    );
  }
  function endResize() {
    resizeStart.current = null;
  }
  function resizeWithKeyboard(
    event: KeyboardEvent<HTMLButtonElement>,
    edge: ResizeEdge,
  ) {
    const isHorizontal =
      event.key === "ArrowLeft" || event.key === "ArrowRight";
    const isVertical = event.key === "ArrowUp" || event.key === "ArrowDown";
    const canHandle =
      (isHorizontal || isVertical) &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.nativeEvent.isComposing;
    if (!canHandle) return;
    const frame = measureResize(event.currentTarget);
    if (!frame) return;
    event.preventDefault();
    const dx =
      event.key === "ArrowLeft"
        ? -ResizeKeyboardStep
        : event.key === "ArrowRight"
          ? ResizeKeyboardStep
          : 0;
    const dy =
      event.key === "ArrowUp"
        ? -ResizeKeyboardStep
        : event.key === "ArrowDown"
          ? ResizeKeyboardStep
          : 0;
    onResize(resizeGeometry(frame, edge, dx, dy));
  }

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    const isMobile = window.matchMedia(DesktopBreakpoint).matches;
    const isControl = (event.target as HTMLElement).closest("button") !== null;
    const canStartDrag = !isMobile && !isControl && !position.maximized;
    if (!canStartDrag) return;

    const windowElement = event.currentTarget.closest(".app-window");
    if (!windowElement) return;
    const windowRect = windowElement.getBoundingClientRect();
    const menubarBottom =
      document.querySelector(".menubar")?.getBoundingClientRect().bottom ?? 0;

    dragStart.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: position.x,
      y: position.y,
      minX: position.x - windowRect.left,
      maxX: position.x + window.innerWidth - windowRect.right,
      minY: position.y + menubarBottom - windowRect.top,
      maxY: position.y + window.innerHeight - windowRect.bottom,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function drag(event: PointerEvent<HTMLDivElement>) {
    const start = dragStart.current;
    if (!start) return;

    const x = Math.max(
      start.minX,
      Math.min(start.x + event.clientX - start.pointerX, start.maxX),
    );
    const y = Math.max(
      start.minY,
      Math.min(start.y + event.clientY - start.pointerY, start.maxY),
    );
    onMove(x, y);
  }

  function stopDrag() {
    dragStart.current = null;
  }

  function toggleFromHeader(event: MouseEvent<HTMLDivElement>) {
    const isControl = (event.target as HTMLElement).closest("button") !== null;
    const isMobile = window.matchMedia(DesktopBreakpoint).matches;
    const canToggle = !isControl && !isMobile;
    if (canToggle) onToggleMaximize();
  }
  const maximizeLabel = position.maximized ? t.restoreWindow : t.maximize;
  const MaximizeIcon = position.maximized ? FiMinimize2 : FiMaximize2;

  return (
    <section
      className={`app-window window-${id} ${DesktopStyles.appWindow}`}
      data-maximized={position.maximized}
      data-resized={position.width !== undefined}
      style={{
        zIndex: position.z,
        width:
          !position.maximized && position.width
            ? `min(${position.width}px, calc(100vw - 24px))`
            : undefined,
        height:
          !position.maximized && position.height
            ? `min(${position.height}px, calc(100dvh - 156px))`
            : undefined,
        transform: position.maximized
          ? undefined
          : `translate(${position.x}px, ${position.y}px)`,
      }}
      aria-label={`${t.window} ${label}`}
      onPointerDown={onFocus}
    >
      <div
        className={`window-bar ${DesktopStyles.windowBar}`}
        onDoubleClick={toggleFromHeader}
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onLostPointerCapture={stopDrag}
      >
        <div className={`window-controls ${DesktopStyles.windowControls}`}>
          <button
            type="button"
            className={`close ${DesktopStyles.close}`}
            onClick={onClose}
            aria-label={`${t.close} ${label}`}
          >
            <FiX />
          </button>
          <button
            type="button"
            className={`minimize ${DesktopStyles.minimize}`}
            onClick={onMinimize}
            aria-label={`${t.minimize} ${label}`}
          >
            <FiMinus />
          </button>
          <button
            type="button"
            className="bg-control-status mobile:!hidden"
            onClick={onToggleMaximize}
            aria-label={`${maximizeLabel} ${label}`}
            title={`${maximizeLabel} ${label}`}
            aria-pressed={position.maximized}
          >
            <MaximizeIcon aria-hidden="true" />
          </button>
        </div>
        <span>{title}</span>
        <i />
      </div>
      {children}
      {!position.maximized &&
        ResizeEdges.map((edge) => (
          <button
            key={edge}
            type="button"
            aria-label={`${t.resizeWindow} ${label}: ${resizeLabels[edge]}`}
            title={t.resizeKeyboardHint}
            className={`absolute z-10 hidden touch-none border-0 bg-transparent p-0 focus-visible:bg-accent/30 focus-visible:outline-focus desktop:block ${ResizeHandleStyles[edge]}`}
            onPointerDown={(event) => beginResize(event, edge)}
            onPointerMove={continueResize}
            onPointerUp={endResize}
            onPointerCancel={endResize}
            onLostPointerCapture={endResize}
            onKeyDown={(event) => resizeWithKeyboard(event, edge)}
          />
        ))}
    </section>
  );
}

export { DesktopWindow };
