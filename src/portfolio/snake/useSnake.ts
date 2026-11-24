import { useEffect, useReducer } from "react";
import { initialSnake, snakeReducer, SnakeSettings, Statuses } from "./engine";

function useSnake(isActive: boolean) {
  const [state, dispatch] = useReducer(snakeReducer, undefined, initialSnake);
  const isRunning = state.status === Statuses.RUNNING;
  useEffect(() => {
    const canTick = isActive && isRunning;
    if (!canTick) return;
    const timer = window.setInterval(() => {
      const canAdvance = document.visibilityState === "visible";
      if (canAdvance) dispatch({ type: "tick", random: Math.random() });
    }, SnakeSettings.tickMs);
    return () => window.clearInterval(timer);
  }, [isActive, isRunning]);
  useEffect(() => {
    function pause() {
      dispatch({ type: "pause" });
    }
    function visibilityChanged() {
      const isHidden = document.visibilityState !== "visible";
      if (isHidden) pause();
    }
    document.addEventListener("visibilitychange", visibilityChanged);
    window.addEventListener("blur", pause);
    return () => {
      document.removeEventListener("visibilitychange", visibilityChanged);
      window.removeEventListener("blur", pause);
    };
  }, []);
  return { state, dispatch };
}
export { useSnake };
