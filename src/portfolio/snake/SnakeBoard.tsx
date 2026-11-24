import { SnakeSettings } from "./engine";
import type { SnakeState } from "./engine";

type SnakeBoardProps = { state: SnakeState };
function SnakeBoard({ state }: SnakeBoardProps) {
  const dimension = SnakeSettings.size * SnakeSettings.cell;
  return (
    <svg
      viewBox={`0 0 ${dimension} ${dimension}`}
      aria-hidden="true"
      className="block aspect-square w-full bg-terminal"
    >
      {Array.from(
        { length: SnakeSettings.size * SnakeSettings.size },
        (_, index) => (
          <rect
            key={index}
            x={(index % SnakeSettings.size) * SnakeSettings.cell}
            y={Math.floor(index / SnakeSettings.size) * SnakeSettings.cell}
            width={SnakeSettings.cell}
            height={SnakeSettings.cell}
            className="fill-none stroke-terminal-border opacity-30"
          />
        ),
      )}
      {state.food && (
        <rect
          x={state.food.x * SnakeSettings.cell + 5}
          y={state.food.y * SnakeSettings.cell + 5}
          width={10}
          height={10}
          rx={3}
          className="fill-control-minimize"
        />
      )}
      {state.body.map((point, index) => (
        <rect
          key={`${point.x}-${point.y}`}
          x={point.x * SnakeSettings.cell + 1}
          y={point.y * SnakeSettings.cell + 1}
          width={SnakeSettings.cell - 2}
          height={SnakeSettings.cell - 2}
          rx={3}
          className={
            index === 0 ? "fill-terminal-input" : "fill-terminal-prompt"
          }
        />
      ))}
    </svg>
  );
}
export { SnakeBoard };
