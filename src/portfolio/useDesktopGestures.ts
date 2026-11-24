import { useEffect, useRef } from "react";
import type { Dispatch, SetStateAction } from "react";
import type { SpaceId } from "./constants";
import { moveWorkspace } from "./workspaceNavigation";

const GestureSettings = {
  threshold: 60,
  resetAfterMs: 250,
  cooldownMs: 700,
  pixelsPerLine: 16,
  axisDominance: 1.25,
} as const;
const EditingSelector =
  "input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='textbox'], [role='combobox'], details";

const GestureAxes = { HORIZONTAL: "horizontal", VERTICAL: "vertical" } as const;
type GestureAxis = (typeof GestureAxes)[keyof typeof GestureAxes];

type DesktopGestureOptions = {
  currentSpace: SpaceId;
  setCurrentSpace: Dispatch<SetStateAction<SpaceId>>;
  isOverviewOpen: boolean;
  setOverviewOpen: Dispatch<SetStateAction<boolean>>;
};

function useDesktopGestures({
  currentSpace,
  setCurrentSpace,
  isOverviewOpen,
  setOverviewOpen,
}: DesktopGestureOptions) {
  const gesture = useRef({
    axis: null as GestureAxis | null,
    amount: 0,
    direction: 0,
    lastEvent: 0,
    lastAction: -Infinity,
  });

  useEffect(() => {
    function handleWheel(event: WheelEvent) {
      const hasModifiers =
        event.altKey && event.shiftKey && !event.ctrlKey && !event.metaKey;
      const isEditing =
        event.target instanceof Element &&
        event.target.closest(EditingSelector) !== null;
      const modal = document.querySelector(
        '[role="dialog"][aria-modal="true"]',
      );
      const hasOtherModal =
        modal !== null && !modal.hasAttribute("data-workspace-overview");
      const isHorizontal =
        Math.abs(event.deltaX) >
        Math.abs(event.deltaY) * GestureSettings.axisDominance;
      const isVertical =
        Math.abs(event.deltaY) >
        Math.abs(event.deltaX) * GestureSettings.axisDominance;
      const hasDominantAxis = isHorizontal || isVertical;
      const isHorizontalInsideOverview = isHorizontal && isOverviewOpen;
      const shouldIgnore =
        !hasModifiers ||
        isEditing ||
        hasOtherModal ||
        !hasDominantAxis ||
        isHorizontalInsideOverview ||
        event.defaultPrevented ||
        !event.cancelable;
      if (shouldIgnore) {
        gesture.current.amount = 0;
        return;
      }

      event.preventDefault();
      const now = performance.now();
      const state = gesture.current;
      const axis = isHorizontal ? GestureAxes.HORIZONTAL : GestureAxes.VERTICAL;
      const delta = isHorizontal ? event.deltaX : event.deltaY;
      const direction = Math.sign(delta);
      const shouldReset =
        now - state.lastEvent > GestureSettings.resetAfterMs ||
        direction !== state.direction ||
        axis !== state.axis;
      if (shouldReset) state.amount = 0;
      state.axis = axis;
      state.direction = direction;
      state.lastEvent = now;

      const isCoolingDown = now - state.lastAction < GestureSettings.cooldownMs;
      const shouldOpen = direction < 0;
      const alreadyInTargetState = isHorizontal
        ? moveWorkspace(currentSpace, direction) === currentSpace
        : shouldOpen === isOverviewOpen;
      if (isCoolingDown || alreadyInTargetState) {
        state.amount = 0;
        return;
      }

      const deltaMode = event.deltaMode;
      const unitMultipliers: Record<number, number> = {
        [WheelEvent.DOM_DELTA_PIXEL]: 1,
        [WheelEvent.DOM_DELTA_LINE]: GestureSettings.pixelsPerLine,
        [WheelEvent.DOM_DELTA_PAGE]: isHorizontal
          ? window.innerWidth
          : window.innerHeight,
      };
      const pixelsPerUnit = unitMultipliers[deltaMode] ?? 1;
      state.amount += Math.abs(delta) * pixelsPerUnit;
      const hasReachedThreshold = state.amount >= GestureSettings.threshold;
      if (!hasReachedThreshold) return;

      state.amount = 0;
      state.lastAction = now;
      if (isHorizontal) {
        setCurrentSpace((current) => moveWorkspace(current, direction));
        return;
      }
      setOverviewOpen(shouldOpen);
    }

    document.addEventListener("wheel", handleWheel, { passive: false });
    return () => document.removeEventListener("wheel", handleWheel);
  }, [currentSpace, setCurrentSpace, isOverviewOpen, setOverviewOpen]);
}

export { useDesktopGestures };
