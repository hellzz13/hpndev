import { useRef } from "react";
import type { Dispatch, KeyboardEvent } from "react";
import { useLanguage } from "../useLanguage";
import { Directions, SnakeKeys, Statuses } from "./engine";
import type { Direction, SnakeAction, SnakeState } from "./engine";
import { SnakeBoard } from "./SnakeBoard";

const DirectionButtons = [
  { direction: Directions.UP, symbol: "↑" },
  { direction: Directions.LEFT, symbol: "←" },
  { direction: Directions.DOWN, symbol: "↓" },
  { direction: Directions.RIGHT, symbol: "→" },
] as const;
const ButtonStyle =
  "rounded-md border border-terminal-border px-3 py-2 text-terminal-input hover:bg-terminal-bar focus-visible:outline-focus";
type SnakeGameProps = { state: SnakeState; dispatch: Dispatch<SnakeAction> };
function SnakeGame({ state, dispatch }: SnakeGameProps) {
  const { t } = useLanguage();
  const boardRef = useRef<HTMLDivElement>(null);
  const isRunning = state.status === Statuses.RUNNING;
  const isFinished =
    state.status === Statuses.LOST || state.status === Statuses.WON;
  const statusLabels = {
    ready: t.snakeReady,
    running: t.snakeRunning,
    paused: t.snakePaused,
    lost: t.snakeLost,
    won: t.snakeWon,
  };
  const directionLabels = {
    up: t.snakeUp,
    down: t.snakeDown,
    left: t.snakeLeft,
    right: t.snakeRight,
  };
  function play() {
    dispatch({ type: isFinished ? "restart" : "start" });
    boardRef.current?.focus();
  }
  function turn(direction: Direction) {
    dispatch({ type: "turn", direction });
    boardRef.current?.focus();
  }
  function handleKey(event: KeyboardEvent<HTMLDivElement>) {
    const isBoard = event.target === boardRef.current;
    const canHandle =
      isBoard &&
      !event.altKey &&
      !event.ctrlKey &&
      !event.metaKey &&
      !event.nativeEvent.isComposing &&
      !event.repeat;
    if (!canHandle) return;
    const normalizedKey =
      event.key.length === 1 ? event.key.toLowerCase() : event.key;
    const direction = Object.hasOwn(SnakeKeys, normalizedKey)
      ? SnakeKeys[normalizedKey]
      : undefined;
    const isPauseKey = event.key === " " || event.key.toLowerCase() === "p";
    const isPlayKey = event.key === "Enter";
    if (direction) {
      event.preventDefault();
      turn(direction);
    } else if (isPauseKey) {
      event.preventDefault();
      dispatch({ type: isRunning ? "pause" : "start" });
    } else if (isPlayKey) {
      event.preventDefault();
      play();
    }
  }
  return (
    <div
      className="flex-1 overflow-y-auto bg-terminal p-4 font-mono text-type-xs text-terminal-text"
      onKeyDown={handleKey}
      onBlur={(event) => {
        const staysInGame =
          event.relatedTarget instanceof Node &&
          event.currentTarget.contains(event.relatedTarget);
        if (!staysInGame) dispatch({ type: "pause" });
      }}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-terminal-prompt">SNAKE / HÉLIO OS</span>
        <span>
          {t.snakeScore}: {state.score}
        </span>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-6">
        <div
          ref={boardRef}
          tabIndex={0}
          role="group"
          aria-label={t.snakeControls}
          className="relative min-w-snake-board-min flex-1 basis-snake-board max-w-snake-board overflow-hidden [[data-maximized=true]_&]:max-w-snake-board-expanded [[data-resized=true]_&]:max-w-snake-board-expanded rounded-md border border-terminal-border focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-terminal-prompt"
        >
          <SnakeBoard state={state} />
          {!isRunning && (
            <div className="absolute inset-0 flex items-center justify-center bg-terminal/80 p-4 text-center text-terminal-prompt">
              <span>{statusLabels[state.status]}</span>
            </div>
          )}
        </div>
        <div className="w-52 shrink-0">
          <p role="status" className="my-3 text-center text-terminal-muted">
            {statusLabels[state.status]}
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              type="button"
              className={ButtonStyle}
              onClick={isRunning ? () => dispatch({ type: "pause" }) : play}
            >
              {isRunning
                ? t.snakePause
                : isFinished
                  ? t.snakeRestart
                  : t.snakePlay}
            </button>
            {!isFinished && (
              <button
                type="button"
                className={ButtonStyle}
                onClick={() => {
                  dispatch({ type: "restart" });
                  boardRef.current?.focus();
                }}
              >
                {t.snakeRestart}
              </button>
            )}
          </div>
          <div
            className="mt-3 flex justify-center gap-2"
            aria-label={t.snakeDirections}
          >
            {DirectionButtons.map(({ direction, symbol }) => (
              <button
                key={direction}
                type="button"
                aria-label={directionLabels[direction]}
                className={`${ButtonStyle} min-h-11 min-w-11`}
                onClick={() => turn(direction)}
              >
                {symbol}
              </button>
            ))}
          </div>
          <p className="mb-0 mt-3 text-center leading-relaxed text-terminal-muted">
            {t.snakeInstructions}
          </p>
        </div>
      </div>
    </div>
  );
}
export { SnakeGame };
