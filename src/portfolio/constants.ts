import { FiCode, FiFolder, FiMail, FiTerminal, FiUser } from "react-icons/fi";
import type { IconType } from "react-icons";

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

const AppSpaces = {
  terminal: Spaces.HOME,
  projects: Spaces.PROJECTS,
  about: Spaces.HOME,
  career: Spaces.HOME,
  contact: Spaces.HOME,
} as const satisfies Record<AppId, SpaceId>;

const AppInfo = {
  terminal: { label: "Terminal", Icon: FiTerminal },
  projects: { label: "Projetos", Icon: FiFolder },
  about: { label: "Sobre", Icon: FiUser },
  career: { label: "Experiência", Icon: FiCode },
  contact: { label: "Contato", Icon: FiMail },
} as const satisfies Record<AppId, { label: string; Icon: IconType }>;
const AppIds = Object.values(Apps);
const DesktopBreakpoint = "(max-width: 760px)";
const WindowDragBounds = {
  minX: -100,
  rightInset: 260,
  minY: -40,
  bottomInset: 160,
} as const;

export { Apps, AppIds, AppInfo, Spaces, AppSpaces, DesktopBreakpoint, WindowDragBounds };
export type { AppId, SpaceId };
