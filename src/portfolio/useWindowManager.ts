import { useEffect, useRef, useState } from "react";
import { DesktopBreakpoint } from "./constants";

type DesktopWindowState<Id extends string> = {
  id: Id;
  x: number;
  y: number;
  z: number;
  minimized: boolean;
};

function useWindowManager<Id extends string>(initialWindow: Id) {
  const [windows, setWindows] = useState<DesktopWindowState<Id>[]>([
    { id: initialWindow, x: 0, y: 0, z: 2, minimized: false },
  ]);
  const topLayer = useRef(2);

  // No celular, os atalhos ficam visíveis antes de abrir qualquer janela.
  useEffect(() => {
    const shouldStartWithoutWindows = window.matchMedia(DesktopBreakpoint).matches;
    if (!shouldStartWithoutWindows) return;
    const frame = window.requestAnimationFrame(() => setWindows([]));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  function focus(id: Id) {
    const z = ++topLayer.current;
    setWindows((current) =>
      current.map((item) => {
        const isTargetWindow = item.id === id;
        return isTargetWindow ? { ...item, z } : item;
      }),
    );
  }

  function open(id: Id) {
    const z = ++topLayer.current;
    setWindows((current) => {
      const alreadyOpen = current.some((item) => item.id === id);
      if (alreadyOpen) {
        return current.map((item) => {
          const isTargetWindow = item.id === id;
          return isTargetWindow ? { ...item, minimized: false, z } : item;
        });
      }
      return [
        ...current,
        {
          id,
          x: Math.min(current.length * 28, 100),
          y: Math.min(current.length * 25, 80),
          z,
          minimized: false,
        },
      ];
    });
  }

  function close(id: Id) {
    setWindows((current) => current.filter((item) => {
      const shouldKeepWindow = item.id !== id;
      return shouldKeepWindow;
    }));
  }

  function minimize(id: Id) {
    setWindows((current) =>
      current.map((item) => {
        const isTargetWindow = item.id === id;
        return isTargetWindow ? { ...item, minimized: true } : item;
      }),
    );
  }

  function move(id: Id, x: number, y: number) {
    setWindows((current) =>
      current.map((item) => {
        const isTargetWindow = item.id === id;
        return isTargetWindow ? { ...item, x, y } : item;
      }),
    );
  }

  return { windows, open, close, minimize, focus, move };
}

export { useWindowManager };
export type { DesktopWindowState };
