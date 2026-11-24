import test from "node:test";
import assert from "node:assert/strict";
import {
  initialOverviewGesture,
  resolveOverviewGesture,
} from "../src/portfolio/overviewGesture.ts";
const input = {
  deltaX: 30,
  deltaY: 0,
  deltaMode: 0,
  altKey: false,
  shiftKey: false,
  ctrlKey: false,
  metaKey: false,
  cancelable: true,
  defaultPrevented: false,
};
const resolve = (state, overrides = {}, now = 1000) =>
  resolveOverviewGesture(state, { ...input, ...overrides }, now, 800);
test("accumulates horizontal movement then selects only one workspace during inertia", () => {
  const first = resolve(initialOverviewGesture());
  assert.equal(first.handled, true);
  assert.equal(first.direction, 0);
  const next = resolve(first.state, {}, 1050);
  assert.equal(next.direction, 1);
  assert.equal(resolve(next.state, { deltaX: 300 }, 1150).direction, 0);
});
test("left movement selects previous and reversing direction resets accumulated distance", () => {
  const first = resolve(initialOverviewGesture());
  const reversed = resolve(first.state, { deltaX: -30 }, 1050);
  assert.equal(reversed.direction, 0);
  assert.equal(resolve(reversed.state, { deltaX: -30 }, 1100).direction, -1);
});
test("ignores vertical, ambiguous diagonal, modifiers, pinch and noncancelable events", () => {
  for (const overrides of [
    { deltaX: 0, deltaY: 100 },
    { deltaX: 80, deltaY: 80 },
    { altKey: true },
    { shiftKey: true },
    { ctrlKey: true },
    { metaKey: true },
    { cancelable: false },
    { defaultPrevented: true },
  ]) {
    const result = resolve(initialOverviewGesture(), overrides);
    assert.equal(result.handled, false);
    assert.equal(result.direction, 0);
  }
});
test("normalizes line and page units and resets a paused gesture", () => {
  assert.equal(
    resolve(initialOverviewGesture(), { deltaX: 4, deltaMode: 1 }).direction,
    1,
  );
  assert.equal(
    resolve(initialOverviewGesture(), { deltaX: 1, deltaMode: 2 }).direction,
    1,
  );
  const first = resolve(initialOverviewGesture());
  assert.equal(resolve(first.state, {}, 1500).direction, 0);
});
