import { Apps, AppInfo } from "./constants";
import type { AppId } from "./constants";

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

const TerminalMessages = {
  HELP: "Comandos: help, whoami, projects, about, career, contact, clear.",
  WHOAMI:
    "Hélio Palença. Desenvolvedor front-end que gosta de construir interfaces, ferramentas e experiências com personalidade.",
  LS: "projects/  about.txt  career.log  contact.txt",
  UNKNOWN: "Comando não encontrado. Digite help para ver as opções.",
} as const;

function resolveTerminalCommand(rawCommand: string): TerminalResult {
  const command = rawCommand.trim().toLowerCase();
  const shouldClear = command === TerminalCommands.CLEAR;
  const isHelp =
    command === TerminalCommands.HELP || command === TerminalCommands.AJUDA;
  const isWhoami = command === TerminalCommands.WHOAMI;
  const isList = command === TerminalCommands.LS;
  const appToOpen = TerminalTargets[command];

  if (shouldClear) return { output: "", clear: true };
  if (isHelp) return { output: TerminalMessages.HELP, clear: false };
  if (isWhoami) return { output: TerminalMessages.WHOAMI, clear: false };
  if (isList) return { output: TerminalMessages.LS, clear: false };
  if (appToOpen) {
    const appLabel = AppInfo[appToOpen].label;
    return { output: `Abrindo ${appLabel}...`, clear: false, appToOpen };
  }
  return { output: TerminalMessages.UNKNOWN, clear: false };
}

export { resolveTerminalCommand };
export type { TerminalResult };
