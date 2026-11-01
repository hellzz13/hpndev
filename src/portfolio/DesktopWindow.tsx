import { useRef } from "react";
import type { PointerEvent, ReactNode } from "react";
import { FiMinus, FiX } from "react-icons/fi";
import { DesktopBreakpoint, WindowDragBounds } from "./constants";

type Position = { x: number; y: number; z: number };
type DragStart = { pointerX: number; pointerY: number; x: number; y: number };

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

    dragStart.current = {
      pointerX: event.clientX,
      pointerY: event.clientY,
      x: position.x,
      y: position.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function drag(event: PointerEvent<HTMLDivElement>) {
    const start = dragStart.current;
    if (!start) return;

    // Mantém parte da janela acessível mesmo após um arrasto até a borda.
    const x = Math.max(
      WindowDragBounds.minX,
      Math.min(start.x + event.clientX - start.pointerX, window.innerWidth - WindowDragBounds.rightInset),
    );
    const y = Math.max(
      WindowDragBounds.minY,
      Math.min(start.y + event.clientY - start.pointerY, window.innerHeight - WindowDragBounds.bottomInset),
    );
    onMove(x, y);
  }

  function stopDrag() {
    dragStart.current = null;
  }

  return (
    <section
      className={`app-window window-${id}`}
      style={{
        zIndex: position.z,
        transform: `translate(${position.x}px, ${position.y}px)`,
      }}
      aria-label={`Janela ${label}`}
      onPointerDown={onFocus}
    >
      <div
        className="window-bar"
        onPointerDown={startDrag}
        onPointerMove={drag}
        onPointerUp={stopDrag}
        onPointerCancel={stopDrag}
        onLostPointerCapture={stopDrag}
      >
        <div className="window-controls">
          <button type="button" className="close" onClick={onClose} aria-label={`Fechar ${label}`}>
            <FiX />
          </button>
          <button type="button" className="minimize" onClick={onMinimize} aria-label={`Minimizar ${label}`}>
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
