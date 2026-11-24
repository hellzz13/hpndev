import { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";

type SearchShortcutOptions = {
  isDisabled: boolean;
  setSearchOpen: Dispatch<SetStateAction<boolean>>;
};

function useSearchShortcut({
  isDisabled,
  setSearchOpen,
}: SearchShortcutOptions) {
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      const isSearchKey = event.key.toLowerCase() === "k";
      const hasModifier =
        (event.metaKey || event.ctrlKey) && !event.altKey && !event.shiftKey;
      const shouldOpen =
        isSearchKey &&
        hasModifier &&
        !isDisabled &&
        !event.defaultPrevented &&
        !event.isComposing &&
        !event.repeat;
      if (!shouldOpen) return;
      event.preventDefault();
      setSearchOpen((current) => !current);
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDisabled, setSearchOpen]);
}

export { useSearchShortcut };
