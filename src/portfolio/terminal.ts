import { Apps, WorkspaceShortcut, SearchShortcutLabel } from "./constants";
import type { AppId } from "./constants";
import { Locales } from "./locales";
import type { Locale } from "./locales";
import { getMessages, getAppLabel } from "./messages";

type TerminalResult = {
  output: string;
  clear: boolean;
  appToOpen?: AppId;
};

const TerminalTargets: Partial<Record<string, AppId>> = {
  projects: Apps.PROJECTS,
  projetos: Apps.PROJECTS,
  about: Apps.ABOUT,
  sobre: Apps.ABOUT,
  career: Apps.CAREER,
  experiencia: Apps.CAREER,
  contact: Apps.CONTACT,
  contato: Apps.CONTACT,
};

const TerminalCommands = {
  HELP: "help",
  AJUDA: "ajuda",
  WHOAMI: "whoami",
  LS: "ls",
  CLEAR: "clear",
} as const;

const TerminalFiles = "projects/  about.txt  career.log  contact.txt";
const TerminalCommandIds = [
  ...new Set([
    ...Object.values(TerminalCommands),
    ...Object.keys(TerminalTargets),
  ]),
];

function resolveTerminalCommand(
  rawCommand: string,
  locale: Locale = Locales.PORTUGUESE,
): TerminalResult {
  const t = getMessages(locale);
  const command = rawCommand.trim().toLowerCase();
  const shouldClear = command === TerminalCommands.CLEAR;
  const isHelp =
    command === TerminalCommands.HELP || command === TerminalCommands.AJUDA;
  const isWhoami = command === TerminalCommands.WHOAMI;
  const isList = command === TerminalCommands.LS;
  const hasTerminalTarget = Object.hasOwn(TerminalTargets, command);
  const appToOpen = hasTerminalTarget ? TerminalTargets[command] : undefined;

  if (shouldClear) return { output: "", clear: true };
  if (isHelp)
    return {
      output: `${t.help}\n\n${t.workspaceShortcut}: ${WorkspaceShortcut.label}\n${t.shortcutScope}\n\n${t.overviewGestureInfo}\n${t.workspaceGestureInfo}\n\n${t.searchTitle}: ${SearchShortcutLabel}`,
      clear: false,
    };
  if (isWhoami) return { output: t.whoami, clear: false };
  if (isList) return { output: TerminalFiles, clear: false };
  if (appToOpen) {
    const appLabel = getAppLabel(appToOpen, locale);
    return {
      output: t.opening.replace("{app}", appLabel),
      clear: false,
      appToOpen,
    };
  }
  return { output: t.unknownCommand, clear: false };
}

export { resolveTerminalCommand, TerminalCommandIds };
export type { TerminalResult };
