const AchievementStorageKey = "helio-os:achievements:v1";
const AchievementValues = {
  EMPTY: "",
  UNREAD: "snake:unread",
  READ: "snake:read",
} as const;
const AchievementSnapshots = {
  EMPTY: { snakeDiscovered: false, unread: false },
  UNREAD: { snakeDiscovered: true, unread: true },
  READ: { snakeDiscovered: true, unread: false },
} as const;
type AchievementSnapshot =
  (typeof AchievementSnapshots)[keyof typeof AchievementSnapshots];
const listeners = new Set<() => void>();
let fallbackOnly = false;
let memoryValue: string = AchievementValues.EMPTY;
function parseAchievements(value: string | null): AchievementSnapshot {
  const isUnread = value === AchievementValues.UNREAD;
  const isRead = value === AchievementValues.READ;
  return isUnread
    ? AchievementSnapshots.UNREAD
    : isRead
      ? AchievementSnapshots.READ
      : AchievementSnapshots.EMPTY;
}
function getServerAchievements() {
  return AchievementSnapshots.EMPTY;
}
function getAchievements() {
  if (fallbackOnly) return parseAchievements(memoryValue);
  try {
    return parseAchievements(
      window.localStorage.getItem(AchievementStorageKey),
    );
  } catch {
    return parseAchievements(memoryValue);
  }
}
function emit() {
  listeners.forEach((listener) => listener());
}
function handleStorage(event: StorageEvent) {
  const hasChanged = event.key === AchievementStorageKey || event.key === null;
  if (hasChanged) emit();
}
function subscribeAchievements(listener: () => void) {
  const isFirst = listeners.size === 0;
  if (isFirst) window.addEventListener("storage", handleStorage);
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
    const isLast = listeners.size === 0;
    if (isLast) window.removeEventListener("storage", handleStorage);
  };
}
function saveAchievements(value: string) {
  memoryValue = value;
  try {
    window.localStorage.setItem(AchievementStorageKey, value);
    fallbackOnly = false;
  } catch {
    fallbackOnly = true;
    /* Session fallback when storage is unavailable. */
  }
  emit();
}
function discoverSnake() {
  const alreadyDiscovered = getAchievements().snakeDiscovered;
  if (alreadyDiscovered) return false;
  saveAchievements(AchievementValues.UNREAD);
  return true;
}
function readAchievements() {
  const shouldRead = getAchievements().unread;
  if (shouldRead) saveAchievements(AchievementValues.READ);
}
export {
  AchievementStorageKey,
  AchievementValues,
  parseAchievements,
  getAchievements,
  getServerAchievements,
  subscribeAchievements,
  discoverSnake,
  readAchievements,
};
export type { AchievementSnapshot };
