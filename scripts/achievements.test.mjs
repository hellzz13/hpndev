import test from "node:test";
import assert from "node:assert/strict";
import {
  AchievementStorageKey,
  AchievementValues,
  parseAchievements,
  getServerAchievements,
  getAchievements,
  discoverSnake,
  readAchievements,
  subscribeAchievements,
} from "../src/portfolio/achievements.ts";
const storage = new Map();
const surface = new EventTarget();
surface.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
};
globalThis.window = surface;
test("server snapshot is empty and unsupported data is ignored", () => {
  assert.deepEqual(getServerAchievements(), {
    snakeDiscovered: false,
    unread: false,
  });
  assert.equal(parseAchievements("unknown"), getServerAchievements());
  assert.equal(parseAchievements(null), getServerAchievements());
});
test("discovery is stored once, unread can be consumed without deleting the achievement", () => {
  assert.equal(discoverSnake(), true);
  assert.equal(storage.get(AchievementStorageKey), AchievementValues.UNREAD);
  assert.equal(discoverSnake(), false);
  readAchievements();
  assert.deepEqual(getAchievements(), { snakeDiscovered: true, unread: false });
  assert.equal(storage.get(AchievementStorageKey), AchievementValues.READ);
});
test("subscriptions notify current tab and relevant storage events, then clean up", () => {
  storage.clear();
  let count = 0;
  const stop = subscribeAchievements(() => count++);
  discoverSnake();
  assert.equal(count, 1);
  const unrelated = new Event("storage");
  unrelated.key = "other";
  surface.dispatchEvent(unrelated);
  assert.equal(count, 1);
  const event = new Event("storage");
  event.key = AchievementStorageKey;
  surface.dispatchEvent(event);
  assert.equal(count, 2);
  stop();
  surface.dispatchEvent(event);
  assert.equal(count, 2);
});
test("write failures preserve session state and prevent duplicate achievements", () => {
  storage.clear();
  surface.localStorage.setItem = () => {
    throw new Error("Storage unavailable");
  };
  assert.equal(discoverSnake(), true);
  assert.equal(discoverSnake(), false);
  readAchievements();
  assert.deepEqual(getAchievements(), { snakeDiscovered: true, unread: false });
});
