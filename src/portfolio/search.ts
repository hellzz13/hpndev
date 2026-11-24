import { AppIds, Apps, Spaces, SearchShortcutLabel } from "./constants";
import type { AppId, SpaceId } from "./constants";
import { getContent } from "./content";
import { Locales } from "./locales";
import type { Locale } from "./locales";
import { getAppLabel, getMessages } from "./messages";
import { TerminalCommandIds } from "./terminal";

const SearchActions = {
  APP: "app",
  PROJECT: "project",
  SPACE: "space",
  COMMAND: "command",
  OVERVIEW: "overview",
  GOOGLE: "google",
} as const;
type SearchAction =
  | { kind: typeof SearchActions.APP; appId: AppId }
  | { kind: typeof SearchActions.PROJECT; projectIndex: number }
  | { kind: typeof SearchActions.SPACE; spaceId: SpaceId }
  | { kind: typeof SearchActions.COMMAND; command: string }
  | { kind: typeof SearchActions.OVERVIEW }
  | { kind: typeof SearchActions.GOOGLE; query: string };
type SearchEntry = {
  id: string;
  title: string;
  description: string;
  category: string;
  keywords: readonly string[];
  action: SearchAction;
};

const AppKeywords = {
  terminal: ["console", "shell", "zsh"],
  projects: ["portfolio", "trabalhos", "work"],
  about: ["bio", "perfil", "helio"],
  career: ["curriculo", "resume", "trajetoria"],
  contact: ["email", "linkedin", "github", "fale"],
} as const satisfies Record<AppId, readonly string[]>;
const SpaceKeys = {
  [Spaces.HOME]: "home",
  [Spaces.PROJECTS]: "projects",
} as const satisfies Record<SpaceId, "home" | "projects">;
const CommandKeywords: Partial<Record<string, readonly string[]>> = {
  help: ["ajuda", "comandos", "commands"],
  ajuda: ["help", "comandos"],
  clear: ["limpar", "historico", "history", "terminal"],
  whoami: ["quem", "identidade", "identity"],
  ls: ["listar", "list", "arquivos", "files"],
};
const DefaultApps: readonly AppId[] = [
  Apps.PROJECTS,
  Apps.ABOUT,
  Apps.CONTACT,
  Apps.TERMINAL,
];
const SearchLimit = 8;

function getSearchCatalog(locale: Locale): SearchEntry[] {
  const t = getMessages(locale);
  const pt = getMessages(Locales.PORTUGUESE);
  const en = getMessages(Locales.ENGLISH);
  const { Projects } = getContent(locale);
  return [
    ...AppIds.map(
      (appId): SearchEntry => ({
        id: `app:${appId}`,
        title: getAppLabel(appId, locale),
        description: t.searchOpenApp,
        category: t.searchApps,
        keywords: [
          appId,
          getAppLabel(appId, Locales.PORTUGUESE),
          getAppLabel(appId, Locales.ENGLISH),
          ...AppKeywords[appId],
        ],
        action: { kind: SearchActions.APP, appId },
      }),
    ),
    ...Projects.map(
      (project, projectIndex): SearchEntry => ({
        id: `project:${project.name}`,
        title: project.name,
        description: project.summary,
        category: t.projects,
        keywords: [
          project.name,
          ...project.tags,
          "projeto",
          "project",
          ...getContent(Locales.ENGLISH).Projects[projectIndex].summary.split(
            " ",
          ),
          ...getContent(Locales.PORTUGUESE).Projects[
            projectIndex
          ].summary.split(" "),
        ],
        action: { kind: SearchActions.PROJECT, projectIndex },
      }),
    ),
    ...Object.values(Spaces).map(
      (spaceId): SearchEntry => ({
        id: `space:${spaceId}`,
        title: t[SpaceKeys[spaceId]],
        description: t.searchSwitchSpace,
        category: t.workspaces,
        keywords: [
          "mesa",
          "desktop",
          "workspace",
          pt[SpaceKeys[spaceId]],
          en[SpaceKeys[spaceId]],
        ],
        action: { kind: SearchActions.SPACE, spaceId },
      }),
    ),
    ...TerminalCommandIds.map(
      (command): SearchEntry => ({
        id: `command:${command}`,
        title: command,
        description: t.searchRunCommand,
        category: t.searchCommands,
        keywords: [
          command,
          "terminal",
          "comando",
          "command",
          ...(CommandKeywords[command] ?? []),
        ],
        action: { kind: SearchActions.COMMAND, command },
      }),
    ),
    {
      id: "overview",
      title: t.overviewTitle,
      description: t.searchOpenOverview,
      category: t.searchActions,
      keywords: [
        "mission control",
        "visao geral",
        "overview",
        "janelas",
        "windows",
        "mesas",
      ],
      action: { kind: SearchActions.OVERVIEW },
    },
  ];
}

function normalizeSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function searchCatalog(
  catalog: readonly SearchEntry[],
  rawQuery: string,
): SearchEntry[] {
  const query = normalizeSearch(rawQuery);
  const isEmpty = query.length === 0;
  if (isEmpty)
    return DefaultApps.flatMap((appId) =>
      catalog.filter((entry) => {
        const isDefaultApp = entry.id === `app:${appId}`;
        return isDefaultApp;
      }),
    );
  const tokens = query.split(/\s+/);
  const isWorkspaceQuery = tokens.some((token) => {
    const namesWorkspace = ["mesa", "workspace", "desktop", "area"].includes(
      token,
    );
    return namesWorkspace;
  });
  return catalog
    .map((entry) => {
      const title = normalizeSearch(entry.title);
      const searchable = normalizeSearch(
        [
          entry.title,
          entry.description,
          entry.category,
          ...entry.keywords,
        ].join(" "),
      );
      const matches = tokens.every((token) => {
        const containsToken = searchable.includes(token);
        return containsToken;
      });
      let score = 0;
      const isExact = title === query;
      const isPrefix = title.startsWith(query);
      const isTitleMatch = title.includes(query);
      if (matches) score = 10;
      if (matches && isTitleMatch) score = 40;
      if (matches && isPrefix) score = 60;
      if (matches && isExact) score = 100;
      const isAppAlias =
        entry.action.kind === SearchActions.APP &&
        entry.keywords.some((keyword) => {
          const matchesAlias = normalizeSearch(keyword) === query;
          return matchesAlias;
        });
      if (matches && isAppAlias) score = 100;
      const shouldPrioritizeWorkspace =
        matches &&
        isWorkspaceQuery &&
        entry.action.kind === SearchActions.SPACE;
      if (shouldPrioritizeWorkspace) score += 50;
      return { entry, score };
    })
    .filter((result) => {
      const hasMatch = result.score > 0;
      return hasMatch;
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, SearchLimit)
    .map((result) => result.entry);
}

function getGoogleSearchUrl(query: string): string {
  return `https://www.google.com/search?q=${encodeURIComponent(query.trim())}`;
}

export {
  getSearchCatalog,
  searchCatalog,
  getGoogleSearchUrl,
  SearchActions,
  SearchShortcutLabel,
};
export type { SearchAction, SearchEntry };
