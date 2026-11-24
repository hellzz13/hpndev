import test from "node:test";
import assert from "node:assert/strict";
import { resizeGeometry, ResizeEdges } from "../src/portfolio/windowResize.ts";
const frame = {
  left: 100,
  top: 100,
  right: 600,
  bottom: 500,
  x: 25,
  y: 30,
  minWidth: 320,
  minHeight: 240,
  bounds: { left: 12, top: 60, right: 988, bottom: 704 },
};
test("right/bottom resize keeps the opposite origin anchored", () => {
  assert.deepEqual(resizeGeometry(frame, "se", 100, 80), {
    x: 25,
    y: 30,
    width: 600,
    height: 480,
  });
});
test("left/top resize updates translation while preserving opposite edges", () => {
  const next = resizeGeometry(frame, "nw", -30, -20);
  assert.deepEqual(next, { x: -5, y: 10, width: 530, height: 420 });
});
test("every handle respects viewport limits and minimum size under extreme drags", () => {
  for (const edge of ResizeEdges)
    for (const delta of [-10000, 10000]) {
      const next = resizeGeometry(frame, edge, delta, delta);
      const left = frame.left + next.x - frame.x;
      const top = frame.top + next.y - frame.y;
      assert.ok(next.width >= frame.minWidth && next.height >= frame.minHeight);
      assert.ok(left >= frame.bounds.left && top >= frame.bounds.top);
      assert.ok(left + next.width <= frame.bounds.right);
      assert.ok(top + next.height <= frame.bounds.bottom);
    }
});
test("short viewports reduce minimums and bring an oversized window inside bounds", () => {
  const short = {
    ...frame,
    bounds: { left: 12, top: 60, right: 300, bottom: 250 },
  };
  const next = resizeGeometry(short, "se", 1000, 1000);
  assert.equal(next.width, 288);
  assert.equal(next.height, 190);
});
