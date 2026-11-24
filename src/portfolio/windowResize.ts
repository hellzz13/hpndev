const ResizeEdges = ["n", "s", "e", "w", "ne", "nw", "se", "sw"] as const;
type ResizeEdge = (typeof ResizeEdges)[number];
type WindowGeometry = { x: number; y: number; width: number; height: number };
type ResizeFrame = {
  left: number;
  top: number;
  right: number;
  bottom: number;
  x: number;
  y: number;
  minWidth: number;
  minHeight: number;
  bounds: { left: number; top: number; right: number; bottom: number };
};
const ResizeKeyboardStep = 16;
const ResizeHandleStyles: Record<ResizeEdge, string> = {
  n: "inset-x-4 top-0 h-2 cursor-n-resize",
  s: "inset-x-4 bottom-0 h-2 cursor-s-resize",
  e: "inset-y-4 right-0 w-2 cursor-e-resize",
  w: "inset-y-4 left-0 w-2 cursor-w-resize",
  ne: "right-0 top-0 h-4 w-4 cursor-ne-resize",
  nw: "left-0 top-0 h-4 w-4 cursor-nw-resize",
  se: "bottom-0 right-0 h-4 w-4 cursor-se-resize",
  sw: "bottom-0 left-0 h-4 w-4 cursor-sw-resize",
};
function resizeGeometry(
  frame: ResizeFrame,
  edge: ResizeEdge,
  dx: number,
  dy: number,
): WindowGeometry {
  const { bounds } = frame;
  const minimumWidth = Math.min(frame.minWidth, bounds.right - bounds.left);
  const minimumHeight = Math.min(frame.minHeight, bounds.bottom - bounds.top);
  let left = Math.max(
    bounds.left,
    Math.min(frame.left, bounds.right - minimumWidth),
  );
  let top = Math.max(
    bounds.top,
    Math.min(frame.top, bounds.bottom - minimumHeight),
  );
  let right = Math.min(
    bounds.right,
    Math.max(frame.right, left + minimumWidth),
  );
  let bottom = Math.min(
    bounds.bottom,
    Math.max(frame.bottom, top + minimumHeight),
  );
  const movesLeft = edge.includes("w");
  const movesRight = edge.includes("e");
  const movesTop = edge.includes("n");
  const movesBottom = edge.includes("s");
  if (movesLeft)
    left = Math.max(
      bounds.left,
      Math.min(frame.left + dx, right - minimumWidth),
    );
  if (movesRight)
    right = Math.min(
      bounds.right,
      Math.max(frame.right + dx, left + minimumWidth),
    );
  if (movesTop)
    top = Math.max(
      bounds.top,
      Math.min(frame.top + dy, bottom - minimumHeight),
    );
  if (movesBottom)
    bottom = Math.min(
      bounds.bottom,
      Math.max(frame.bottom + dy, top + minimumHeight),
    );
  return {
    x: frame.x + left - frame.left,
    y: frame.y + top - frame.top,
    width: right - left,
    height: bottom - top,
  };
}
export { ResizeEdges, ResizeHandleStyles, ResizeKeyboardStep, resizeGeometry };
export type { ResizeEdge, ResizeFrame, WindowGeometry };
