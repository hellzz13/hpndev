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

export { Apps, AppIds, AppInfo, DesktopBreakpoint, WindowDragBounds };
export type { AppId };
