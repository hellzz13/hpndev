import { DesktopStyles } from "@/portfolio/styles";
import { useRef } from "react";
import type { PointerEvent, ReactNode } from "react";
import { FiMinus, FiX } from "react-icons/fi";
import { DesktopBreakpoint } from "./constants";

type Position = { x: number; y: number; z: number };
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
  id: string;
  label: string;
  title: string;
  position: Position;
  onFocus: () => void;
  onMove: (x: number, y: number) => void;
  onClose: () => void;
  onMinimize: () => void;
  children: ReactNode;
};

function DesktopWindow({
  id,
  label,
  title,
  position,
  onFocus,
  onMove,
  onClose,
  onMinimize,
  children,
}: DesktopWindowProps) {
  const dragStart = useRef<DragStart | null>(null);

  function startDrag(event: PointerEvent<HTMLDivElement>) {
    const isMobile = window.matchMedia(DesktopBreakpoint).matches;
    const isControl = (event.target as HTMLElement).closest("button") !== null;
    const canStartDrag = !isMobile && !isControl;
    if (!canStartDrag) return;

    const windowElement = event.currentTarget.closest(".app-window");
    if (!windowElement) return;
    const windowRect = windowElement.getBoundingClientRect();
    const menubarBottom = document.querySelector(".menubar")?.getBoundingClientRect().bottom ?? 0;

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

    const x = Math.max(start.minX, Math.min(start.x + event.clientX - start.pointerX, start.maxX));
    const y = Math.max(start.minY, Math.min(start.y + event.clientY - start.pointerY, start.maxY));
    onMove(x, y);
  }

  function stopDrag() {
    dragStart.current = null;
  }

  return (
    <section
      className={`app-window window-${id} ${DesktopStyles.appWindow}`}
      style={{
        zIndex: position.z,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      aria-label={`Janela ${label}`}
      onPointerDown={onFocus}
    >
      <div
        className={`window-bar ${DesktopStyles.windowBar}`}
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onLostPointerCapture={stopDrag}
      >
        <div className={`window-controls ${DesktopStyles.windowControls}`}>
          <button type="button" className={`close ${DesktopStyles.close}`} onClick={onClose} aria-label={`Fechar ${label}`}>
            <FiX />
          </button>
          <button type="button" className={`minimize ${DesktopStyles.minimize}`} onClick={onMinimize} aria-label={`Minimizar ${label}`}>
            <FiMinus />
          </button>
          <span />
        </div>
        <span>{title}</span>
        <i />
      </div>
      {children}
    </section>
  );
}

export { DesktopWindow };
