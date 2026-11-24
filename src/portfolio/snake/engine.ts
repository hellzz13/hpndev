const SnakeSettings = { size: 16, tickMs: 140, cell: 20 } as const;
const Directions = {
  UP: "up",
  DOWN: "down",
  LEFT: "left",
  RIGHT: "right",
} as const;
type Direction = (typeof Directions)[keyof typeof Directions];
const Vectors: Record<Direction, Point> = {
  up: { x: 0, y: -1 },
  down: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
};
const SnakeKeys: Readonly<Record<string, Direction>> = {
  ArrowUp: Directions.UP,
  w: Directions.UP,
  ArrowDown: Directions.DOWN,
  s: Directions.DOWN,
  ArrowLeft: Directions.LEFT,
  a: Directions.LEFT,
  ArrowRight: Directions.RIGHT,
  d: Directions.RIGHT,
};
const Statuses = {
  READY: "ready",
  RUNNING: "running",
  PAUSED: "paused",
  LOST: "lost",
  WON: "won",
} as const;
type Point = { x: number; y: number };
type SnakeState = {
  body: readonly Point[];
  food: Point | null;
  direction: Direction;
  queued: boolean;
  status: (typeof Statuses)[keyof typeof Statuses];
  score: number;
};
type SnakeAction =
  | { type: "start" | "pause" | "restart" | "reset" }
  | { type: "turn"; direction: Direction }
  | { type: "tick"; random: number };

function initialSnake(): SnakeState {
  return {
    body: [
      { x: 7, y: 8 },
      { x: 6, y: 8 },
      { x: 5, y: 8 },
    ],
    food: { x: 11, y: 8 },
    direction: Directions.RIGHT,
    queued: false,
    status: Statuses.READY,
    score: 0,
  };
}
function samePoint(a: Point, b: Point) {
  return a.x === b.x && a.y === b.y;
}
function chooseFood(body: readonly Point[], random: number): Point | null {
  const free: Point[] = [];
  for (let y = 0; y < SnakeSettings.size; y++) {
    for (let x = 0; x < SnakeSettings.size; x++) {
      const occupied = body.some((point) => samePoint(point, { x, y }));
      if (!occupied) free.push({ x, y });
    }
  }
  const index = Math.min(
    free.length - 1,
    Math.max(0, Math.floor(random * free.length)),
  );
  return free[index] ?? null;
}
function snakeReducer(state: SnakeState, action: SnakeAction): SnakeState {
  const isReset = action.type === "reset";
  if (isReset) return initialSnake();
  const isRestart = action.type === "restart";
  if (isRestart) return { ...initialSnake(), status: Statuses.RUNNING };
  const isStart = action.type === "start";
  const canStart =
    state.status === Statuses.READY || state.status === Statuses.PAUSED;
  if (isStart) return canStart ? { ...state, status: Statuses.RUNNING } : state;
  const isPause = action.type === "pause";
  const isRunning = state.status === Statuses.RUNNING;
  if (isPause) return isRunning ? { ...state, status: Statuses.PAUSED } : state;
  if (!isRunning) return state;
  const isTurn = action.type === "turn";
  if (isTurn) {
    const current = Vectors[state.direction];
    const next = Vectors[action.direction];
    const isReverse = current.x + next.x === 0 && current.y + next.y === 0;
    const isSameDirection = action.direction === state.direction;
    const canTurn = !state.queued && !isReverse && !isSameDirection;
    return canTurn
      ? { ...state, direction: action.direction, queued: true }
      : state;
  }
  const isTick = action.type === "tick";
  if (!isTick) return state;
  const vector = Vectors[state.direction];
  const head = { x: state.body[0].x + vector.x, y: state.body[0].y + vector.y };
  const hasEaten = state.food !== null && samePoint(head, state.food);
  const collisionBody = hasEaten ? state.body : state.body.slice(0, -1);
  const hitsWall =
    head.x < 0 ||
    head.y < 0 ||
    head.x >= SnakeSettings.size ||
    head.y >= SnakeSettings.size;
  const hitsBody = collisionBody.some((point) => samePoint(point, head));
  if (hitsWall || hitsBody)
    return { ...state, status: Statuses.LOST, queued: false };
  const body = [head, ...state.body];
  if (!hasEaten) body.pop();
  const food = hasEaten ? chooseFood(body, action.random) : state.food;
  const hasWon = food === null;
  return {
    ...state,
    body,
    food,
    score: state.score + (hasEaten ? 1 : 0),
    queued: false,
    status: hasWon ? Statuses.WON : Statuses.RUNNING,
  };
}
export {
  SnakeSettings,
  Directions,
  SnakeKeys,
  Statuses,
  initialSnake,
  snakeReducer,
  chooseFood,
};
export type { SnakeState, SnakeAction, Direction };
