import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
  Transition,
} from "@headlessui/react";
import { useId, useRef, useState } from "react";
import type { RefObject } from "react";
import type { IconType } from "react-icons";
import {
  FiMaximize2,
  FiBell,
  FiArrowUpRight,
  FiSearch,
  FiGrid,
  FiFolder,
  FiTerminal,
  FiCommand,
  FiGlobe,
} from "react-icons/fi";
import { AppInfo } from "./constants";
import { useLanguage } from "./useLanguage";
import {
  getSearchCatalog,
  searchCatalog,
  SearchActions,
  SearchShortcutLabel,
} from "./search";
import type { SearchAction, SearchEntry } from "./search";

type SearchProps = {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (action: SearchAction) => void;
};
type SearchBodyProps = Omit<SearchProps, "isOpen"> & {
  inputRef: RefObject<HTMLInputElement | null>;
};
const SearchIcons = {
  [SearchActions.APP]: FiFolder,
  [SearchActions.NOTIFICATIONS]: FiBell,
  [SearchActions.WINDOW_SIZE]: FiMaximize2,
  [SearchActions.PROJECT]: FiFolder,
  [SearchActions.SPACE]: FiGrid,
  [SearchActions.COMMAND]: FiTerminal,
  [SearchActions.OVERVIEW]: FiCommand,
  [SearchActions.GOOGLE]: FiGlobe,
} satisfies Record<SearchAction["kind"], IconType>;
const KeyStyle =
  "rounded border border-window-border border-b-2 bg-window-bar px-1.5 py-1 font-mono text-type-caption text-window-title";
const MaxQueryLength = 200;

function SearchBody({ onClose, onSelect, inputRef }: SearchBodyProps) {
  const { locale, t } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();
  const statusId = useId();
  const matches = searchCatalog(getSearchCatalog(locale), query);
  const trimmedQuery = query.trim();
  const hasOneMatch = matches.length === 1;
  const matchLabel = hasOneMatch ? t.searchResult : t.searchResults;
  const hasQuery = trimmedQuery.length > 0;
  const showGoogle = hasQuery && matches.length === 0;
  const rows: SearchEntry[] = showGoogle
    ? [
        {
          id: "google",
          title: `${t.searchGoogle} “${trimmedQuery}”`,
          description: t.searchGoogleHint,
          category: t.searchExternal,
          keywords: [],
          action: { kind: SearchActions.GOOGLE, query: trimmedQuery },
        },
      ]
    : matches;
  const selectedIndex = Math.min(activeIndex, rows.length - 1);
  const selected = rows[selectedIndex];

  function optionId(index: number) {
    return `${listId}-${index}`;
  }

  return (
    <>
      <div className="flex items-center gap-3 rounded-t-project-card border-b border-window-bar-border px-5 py-4 focus-within:ring-1 focus-within:ring-inset focus-within:ring-accent mobile:px-4">
        <FiSearch className="h-5 w-5 shrink-0 text-accent" aria-hidden="true" />
        <DialogTitle className="sr-only">{t.searchTitle}</DialogTitle>
        <input
          ref={inputRef}
          type="text"
          value={query}
          maxLength={MaxQueryLength}
          role="combobox"
          aria-label={t.searchTitle}
          aria-controls={listId}
          aria-expanded="true"
          aria-autocomplete="list"
          aria-activedescendant={selected ? optionId(selectedIndex) : undefined}
          aria-describedby={statusId}
          placeholder={t.searchPlaceholder}
          autoComplete="off"
          spellCheck={false}
          className="h-10 min-w-0 flex-1 border-0 bg-transparent p-0 text-type-base leading-normal text-foreground placeholder:text-body-muted focus-visible:!outline-none mobile:text-base"
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(0);
          }}
          onKeyDown={(event) => {
            const isComposing = event.nativeEvent.isComposing;
            if (isComposing) return;
            const isNext = event.key === "ArrowDown";
            const isPrevious = event.key === "ArrowUp";
            const shouldNavigate = (isNext || isPrevious) && rows.length > 0;
            if (shouldNavigate) {
              event.preventDefault();
              const direction = isNext ? 1 : -1;
              const nextIndex =
                (selectedIndex + direction + rows.length) % rows.length;
              setActiveIndex(nextIndex);
              document
                .getElementById(optionId(nextIndex))
                ?.scrollIntoView({ block: "nearest" });
            }
            const shouldSelect =
              event.key === "Enter" && selected !== undefined;
            if (shouldSelect) {
              event.preventDefault();
              onSelect(selected.action);
            }
          }}
        />
        <button
          type="button"
          onClick={onClose}
          aria-label={t.searchClose}
          className="rounded-tooltip px-2 py-2 text-body-muted hover:bg-glass-surface"
        >
          <kbd className={KeyStyle}>Esc</kbd>
        </button>
      </div>
      <div
        className="px-5 pb-2 pt-4 font-mono text-type-caption text-body-muted"
        id={statusId}
        role="status"
        aria-live="polite"
      >
        {hasQuery ? `${matches.length} ${matchLabel}` : t.searchSuggestions}
      </div>
      <div
        id={listId}
        role="listbox"
        aria-label={t.searchTitle}
        className="max-h-80 overflow-y-auto p-2"
      >
        {rows.map((entry, index) => {
          const isSelected = index === selectedIndex;
          const action = entry.action;
          const isApp = action.kind === SearchActions.APP;
          const Icon = isApp
            ? AppInfo[action.appId].Icon
            : SearchIcons[entry.action.kind];
          const isExternal = entry.action.kind === SearchActions.GOOGLE;
          const selectedStyle = isSelected
            ? "bg-glass-surface"
            : "bg-transparent";
          return (
            <button
              key={entry.id}
              id={optionId(index)}
              type="button"
              role="option"
              aria-selected={isSelected}
              tabIndex={-1}
              onClick={() => onSelect(entry.action)}
              onMouseMove={() => setActiveIndex(index)}
              className={`flex w-full items-center gap-3 rounded-project-card px-3 py-3 text-left ${selectedStyle}`}
            >
              <Icon
                className="h-5 w-5 shrink-0 text-accent"
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-type-sm font-medium text-foreground">
                  {entry.title}
                </span>
                <span className="block truncate text-type-label text-body-muted">
                  {entry.description}
                </span>
              </span>
              <span className="shrink-0 font-mono text-type-caption text-body-muted mobile:hidden">
                {entry.category}
              </span>
              {isExternal && (
                <FiArrowUpRight
                  aria-hidden="true"
                  className="shrink-0 text-accent"
                />
              )}
            </button>
          );
        })}
      </div>
      <footer className="flex flex-wrap items-center gap-3 border-t border-window-bar-border px-5 py-3 font-mono text-type-caption text-body-muted">
        <span>
          <kbd className={KeyStyle}>↑ ↓</kbd> {t.searchNavigate}
        </span>
        <span>
          <kbd className={KeyStyle}>↵</kbd> {t.searchSelect}
        </span>
        <span className="ml-auto">{SearchShortcutLabel}</span>
      </footer>
    </>
  );
}

function QuickSearch({ isOpen, onClose, onSelect }: SearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const pendingAction = useRef<SearchAction | null>(null);
  function close() {
    pendingAction.current = null;
    onClose();
  }
  function select(action: SearchAction) {
    const isExternal = action.kind === SearchActions.GOOGLE;
    if (isExternal) {
      pendingAction.current = null;
      onSelect(action);
      return;
    }
    pendingAction.current = action;
    onClose();
  }
  function finishSelection() {
    const action = pendingAction.current;
    pendingAction.current = null;
    const hasAction = action !== null;
    if (hasAction) onSelect(action);
  }
  return (
    <Transition
      show={isOpen}
      beforeEnter={() => {
        pendingAction.current = null;
      }}
      afterLeave={finishSelection}
    >
      <Dialog
        onClose={close}
        initialFocus={inputRef}
        className="relative z-101 font-sans text-foreground"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-desktop/80 backdrop-blur-sm transition-opacity duration-200 data-[closed]:opacity-0 motion-reduce:transition-none"
        />
        <div className="fixed inset-0 overflow-y-auto px-4 py-16 mobile:py-6">
          <DialogPanel
            transition
            className="mx-auto w-full max-w-2xl overflow-hidden rounded-project-card border border-window-border bg-window shadow-elevation-dock transition duration-200 data-[closed]:scale-95 data-[closed]:opacity-0 motion-reduce:transition-none motion-reduce:!transform-none"
          >
            <SearchBody onClose={close} onSelect={select} inputRef={inputRef} />
          </DialogPanel>
        </div>
      </Dialog>
    </Transition>
  );
}

export { QuickSearch };
