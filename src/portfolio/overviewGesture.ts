const OverviewGestureSettings = {
  threshold: 60,
  resetAfterMs: 250,
  cooldownMs: 700,
  pixelsPerLine: 16,
  axisDominance: 1.25,
} as const;
type OverviewGestureState = {
  amount: number;
  direction: number;
  lastEvent: number;
  lastAction: number;
};
type OverviewWheelInput = {
  deltaX: number;
  deltaY: number;
  deltaMode: number;
  altKey: boolean;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  cancelable: boolean;
  defaultPrevented: boolean;
};
function initialOverviewGesture(): OverviewGestureState {
  return { amount: 0, direction: 0, lastEvent: 0, lastAction: -Infinity };
}
function resolveOverviewGesture(
  state: OverviewGestureState,
  event: OverviewWheelInput,
  now: number,
  pageWidth: number,
) {
  const hasModifiers =
    event.altKey || event.shiftKey || event.ctrlKey || event.metaKey;
  const isHorizontal =
    Math.abs(event.deltaX) >
    Math.abs(event.deltaY) * OverviewGestureSettings.axisDominance;
  const canHandle =
    isHorizontal &&
    !hasModifiers &&
    event.cancelable &&
    !event.defaultPrevented;
  if (!canHandle)
    return { state: { ...state, amount: 0 }, handled: false, direction: 0 };
  const direction = Math.sign(event.deltaX);
  const shouldReset =
    now - state.lastEvent > OverviewGestureSettings.resetAfterMs ||
    direction !== state.direction;
  const isCoolingDown =
    now - state.lastAction < OverviewGestureSettings.cooldownMs;
  const multiplier =
    event.deltaMode === 1
      ? OverviewGestureSettings.pixelsPerLine
      : event.deltaMode === 2
        ? pageWidth
        : 1;
  const amount = isCoolingDown
    ? 0
    : (shouldReset ? 0 : state.amount) + Math.abs(event.deltaX) * multiplier;
  const shouldNavigate = amount >= OverviewGestureSettings.threshold;
  return {
    handled: true,
    direction: shouldNavigate ? direction : 0,
    state: {
      amount: shouldNavigate ? 0 : amount,
      direction,
      lastEvent: now,
      lastAction: shouldNavigate ? now : state.lastAction,
    },
  };
}
export { initialOverviewGesture, resolveOverviewGesture };
export type { OverviewGestureState, OverviewWheelInput };
