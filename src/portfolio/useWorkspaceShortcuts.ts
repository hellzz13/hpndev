import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { WorkspaceShortcut } from "./constants";
import type { SpaceId } from "./constants";

import { moveWorkspace } from "./workspaceNavigation";
const EditingSelector =
  "input, textarea, select, [contenteditable]:not([contenteditable='false']), [role='textbox'], [role='combobox'], details, [role='dialog']";

type WorkspaceShortcutsOptions = {
  isDisabled: boolean;
  setCurrentSpace: Dispatch<SetStateAction<SpaceId>>;
};

function useWorkspaceShortcuts({
  isDisabled,
  setCurrentSpace,
}: WorkspaceShortcutsOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isPrevious = event.key === WorkspaceShortcut.previousKey;
      const isNext = event.key === WorkspaceShortcut.nextKey;
      const hasShortcutModifiers =
        event.altKey && event.shiftKey && !event.ctrlKey && !event.metaKey;
      const isEditing =
        event.target instanceof Element &&
        event.target.closest(EditingSelector) !== null;
      const hasModal =
        document.querySelector('[role="dialog"][aria-modal="true"]') !== null;
      const shouldIgnore =
        isDisabled ||
        event.defaultPrevented ||
        event.isComposing ||
        event.repeat ||
        isEditing ||
        hasModal;
      const shouldSwitch =
        hasShortcutModifiers && (isPrevious || isNext) && !shouldIgnore;
      if (!shouldSwitch) return;

      event.preventDefault();
      setCurrentSpace((current) => {
        const direction = isNext ? 1 : -1;
        return moveWorkspace(current, direction);
      });
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDisabled, setCurrentSpace]);
}

export { useWorkspaceShortcuts };
