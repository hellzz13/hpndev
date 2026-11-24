import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import {
  initialOverviewGesture,
  resolveOverviewGesture,
} from "./overviewGesture";

type OverviewGestureOptions = {
  containerRef: RefObject<HTMLDivElement | null>;
  onNavigate: (direction: number) => void;
};
function useOverviewGestures({
  containerRef,
  onNavigate,
}: OverviewGestureOptions) {
  const gesture = useRef(initialOverviewGesture());
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    function handleWheel(event: WheelEvent) {
      const result = resolveOverviewGesture(
        gesture.current,
        event,
        performance.now(),
        container?.clientWidth ?? window.innerWidth,
      );
      gesture.current = result.state;
      if (!result.handled) return;
      event.preventDefault();
      const shouldNavigate = result.direction !== 0;
      if (shouldNavigate) onNavigate(result.direction);
    }
    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [containerRef, onNavigate]);
}
export { useOverviewGestures };
