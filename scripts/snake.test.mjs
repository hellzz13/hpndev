import assert from "node:assert/strict";
import test from "node:test";
import {
  initialSnake,
  snakeReducer,
  chooseFood,
  Statuses,
} from "../src/portfolio/snake/engine.ts";

const start = () => snakeReducer(initialSnake(), { type: "start" });
const tick = (state) => snakeReducer(state, { type: "tick", random: 0.5 });
test("ready and paused games do not advance, resume preserves score/body", () => {
  const ready = initialSnake();
  assert.equal(tick(ready), ready);
  const running = tick(start());
  const paused = snakeReducer(running, { type: "pause" });
  assert.equal(tick(paused), paused);
  assert.deepEqual(snakeReducer(paused, { type: "start" }), {
    ...running,
    status: Statuses.RUNNING,
  });
});
test("rejects reversal and multiple turns in one tick", () => {
  const running = start();
  assert.equal(
    snakeReducer(running, { type: "turn", direction: "left" }),
    running,
  );
  const up = snakeReducer(running, { type: "turn", direction: "up" });
  assert.equal(snakeReducer(up, { type: "turn", direction: "left" }), up);
  const next = tick(up);
  assert.deepEqual(next.body[0], { x: 7, y: 7 });
  assert.equal(next.queued, false);
});
test("food grows body, increases score and never spawns on snake", () => {
  let state = start();
  for (let count = 0; count < 4; count++) state = tick(state);
  assert.equal(state.score, 1);
  assert.equal(state.body.length, 4);
  assert.ok(state.food);
  assert.ok(
    !state.body.some(
      (point) => point.x === state.food.x && point.y === state.food.y,
    ),
  );
});
test("wall and body collisions end the game", () => {
  const wall = tick({
    ...start(),
    body: [
      { x: 15, y: 8 },
      { x: 14, y: 8 },
    ],
  });
  assert.equal(wall.status, Statuses.LOST);
  const self = tick({
    ...start(),
    body: [
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
    ],
  });
  assert.equal(self.status, Statuses.LOST);
});
test("moving into the departing tail is valid", () => {
  const state = tick({
    ...start(),
    body: [
      { x: 3, y: 3 },
      { x: 3, y: 4 },
      { x: 4, y: 4 },
      { x: 4, y: 3 },
    ],
  });
  assert.equal(state.status, Statuses.RUNNING);
});
test("last free cell produces a win and restart/reset return clean state", () => {
  const body = Array.from({ length: 256 }, (_, i) => ({
    x: i % 16,
    y: Math.floor(i / 16),
  })).filter((point) => point.x !== 1 || point.y !== 0);
  assert.deepEqual(chooseFood(body, 0), { x: 1, y: 0 });
  const won = tick({ ...start(), body, food: { x: 1, y: 0 } });
  assert.equal(won.status, Statuses.WON);
  assert.equal(won.food, null);
  assert.deepEqual(snakeReducer(won, { type: "restart" }), start());
  assert.deepEqual(snakeReducer(won, { type: "reset" }), initialSnake());
});
