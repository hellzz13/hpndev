import { Spaces } from "./constants";
import type { SpaceId } from "./constants";

const SpaceOrder = [Spaces.HOME, Spaces.PROJECTS] as const;

function moveWorkspace(current: SpaceId, direction: number): SpaceId {
  const nextIndex = Math.max(
    0,
    Math.min(SpaceOrder.length - 1, SpaceOrder.indexOf(current) + direction),
  );
  return SpaceOrder[nextIndex];
}

export { moveWorkspace };
