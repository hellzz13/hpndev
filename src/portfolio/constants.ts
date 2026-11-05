import { FiCode, FiFolder, FiMail, FiTerminal, FiUser } from "react-icons/fi";
import type { IconType } from "react-icons";
import { SiNodedotjs, SiReact, SiSupabase, SiTypescript } from "react-icons/si";

const StackIcons = {
  React: SiReact,
  TypeScript: SiTypescript,
  Supabase: SiSupabase,
  "Node.js": SiNodedotjs,
  CLI: FiTerminal,
} as const satisfies Record<string, IconType>;

type StackName = keyof typeof StackIcons;

const Apps = {
  TERMINAL: "terminal",
  PROJECTS: "projects",
  ABOUT: "about",
  CAREER: "career",
  CONTACT: "contact",
} as const;

type AppId = (typeof Apps)[keyof typeof Apps];

const Spaces = {
  HOME: "home",
  PROJECTS: "projects",
} as const;

type SpaceId = (typeof Spaces)[keyof typeof Spaces];

const AppInfo = {
  terminal: { label: "Terminal", Icon: FiTerminal },
  projects: { label: "Projetos", Icon: FiFolder },
  about: { label: "Sobre", Icon: FiUser },
  career: { label: "Experiência", Icon: FiCode },
  contact: { label: "Contato", Icon: FiMail },
} as const satisfies Record<AppId, { label: string; Icon: IconType }>;
const AppIds = Object.values(Apps);
const DesktopBreakpoint = "(max-width: 760px)";
export { Apps, AppIds, AppInfo, Spaces, DesktopBreakpoint, StackIcons };
export type { AppId, SpaceId, StackName };
