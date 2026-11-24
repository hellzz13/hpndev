import { SnakeBoard } from "./snake/SnakeBoard";
import type { SnakeState } from "./snake/engine";
import Image from "next/image";
import { Apps } from "./constants";
import type { AppId } from "./constants";
import { getContent } from "./content";
import { DesktopStyles } from "./styles";
import { useLanguage } from "./useLanguage";

type WindowPreviewProps = {
  id: AppId;
  snakeState: SnakeState;
  selectedProject: number;
  lines: readonly { command: string; output: string }[];
  command: string;
};

const PreviewSizes = {
  snake: { width: 440, height: 620 },
  terminal: { width: 530, height: 350 },
  projects: { width: 690, height: 610 },
  about: { width: 560, height: 460 },
  career: { width: 560, height: 520 },
  contact: { width: 560, height: 410 },
} as const satisfies Record<AppId, { width: number; height: number }>;
const TerminalPreviewLines = 3;

function WindowPreview({
  id,
  snakeState,
  selectedProject,
  lines,
  command,
}: WindowPreviewProps) {
  const { locale, t, appLabel } = useLanguage();
  const { Projects, Experience } = getContent(locale);
  const { width, height } = PreviewSizes[id];
  const isTerminal = id === Apps.TERMINAL;
  const isProjects = id === Apps.PROJECTS;
  const isAbout = id === Apps.ABOUT;
  const isCareer = id === Apps.CAREER;
  const project = Projects[selectedProject];
  const surfaceStyle = isTerminal ? "bg-terminal" : "bg-window";
  const barStyle = isTerminal
    ? "border-terminal-border bg-terminal-bar text-terminal-title"
    : "border-window-bar-border bg-window-bar text-window-title";

  function content() {
    const isSnake = id === Apps.SNAKE;
    if (isSnake)
      return (
        <div className="bg-terminal p-6 font-mono text-terminal-prompt">
          <p>
            SNAKE / {t.snakeScore}: {snakeState.score}
          </p>
          <SnakeBoard state={snakeState} />
        </div>
      );
    if (isTerminal)
      return (
        <div className="h-full overflow-hidden bg-terminal p-6 font-mono text-type-sm leading-relaxed text-terminal-text">
          <div className="mb-5 text-terminal-prompt">
            HÉLIO OS <span className="text-terminal-muted">v1.0</span>
            <br />
            {t.terminalIntro}
          </div>
          {lines.slice(-TerminalPreviewLines).map((line, index) => (
            <div key={index} className="mb-4">
              <div>
                <span className="text-terminal-prompt">
                  helio@portfolio ~ %{" "}
                </span>
                {line.command}
              </div>
              <p className="mt-2 whitespace-pre-line text-terminal-output">
                {line.output}
              </p>
            </div>
          ))}
          <div>
            <span className="text-terminal-prompt">helio@portfolio ~ % </span>
            {command}
            <span className="ml-1 text-terminal-input">▏</span>
          </div>
        </div>
      );
    if (isProjects)
      return (
        <div className={DesktopStyles.windowContent}>
          <span className={DesktopStyles.eyebrow}>{t.selectedWork}</span>
          <h2>
            {t.projectsFirst}
            <br />
            <em>{t.projectsLast}</em>
          </h2>
          <p className={DesktopStyles.lede}>{t.projectsDescription}</p>
          <div className="mb-5 flex gap-6 border-b border-career-border pb-3 text-type-xs">
            {Projects.map((item, index) => {
              const isSelected = index === selectedProject;
              const tabStyle = isSelected ? "text-accent" : "text-tab-muted";
              return (
                <span key={item.name} className={tabStyle}>
                  {item.number} {item.name}
                </span>
              );
            })}
          </div>
          <article
            className={`project-card-${selectedProject} ${DesktopStyles.projectCard}`}
          >
            <div className={DesktopStyles.projectType}>
              {project.type} <span>↗</span>
            </div>
            <div className="flex items-center gap-3">
              <Image
                src={project.logo}
                alt=""
                width={48}
                height={48}
                className="h-12 w-12 shrink-0 rounded-project-card object-contain"
              />
              <h3>{project.name}</h3>
            </div>
            <p>{project.summary}</p>
            <p className="project-detail">{project.detail}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-tag-list border border-current px-2 py-1 text-type-caption"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>
        </div>
      );
    if (isAbout)
      return (
        <div className={DesktopStyles.windowContent}>
          <span className={DesktopStyles.eyebrow}>{t.aboutEyebrow}</span>
          <div className={DesktopStyles.aboutHeading}>
            <Image src="/studying.png" alt="" width={132} height={132} />
            <div>
              <h2>
                {t.aboutFirst}
                <br />
                <em>{t.aboutLast}</em>
              </h2>
              <p>{t.role}</p>
            </div>
          </div>
          <p>{t.aboutDescription}</p>
          <p>{t.aboutOutside}</p>
          <div className={DesktopStyles.tagList}>
            <span>React</span>
            <span>TypeScript</span>
            <span>Next.js</span>
            <span>UI</span>
          </div>
        </div>
      );
    if (isCareer)
      return (
        <div className={DesktopStyles.windowContent}>
          <span className={DesktopStyles.eyebrow}>{t.careerEyebrow}</span>
          <h2>
            {t.career}
            <em>.</em>
          </h2>
          <div className={DesktopStyles.careerList}>
            {Experience.map((item) => (
              <article key={item.company}>
                <div>
                  <strong>{item.company}</strong>
                  <span>{item.date}</span>
                </div>
                <h3>{item.role}</h3>
                <p>{item.note}</p>
              </article>
            ))}
          </div>
        </div>
      );
    return (
      <div
        className={`${DesktopStyles.windowContent} ${DesktopStyles.contactContent}`}
      >
        <span className={DesktopStyles.eyebrow}>{t.contactEyebrow}</span>
        <h2>
          {t.contactFirst}
          <br />
          <em>{t.contactLast}</em>
        </h2>
        <p>{t.contactDescription}</p>
        <div className="mt-6 space-y-4 text-type-body text-contact-text">
          <div className="rounded-project-card bg-accent p-4 font-bold text-accent-foreground">
            hpalenca13@gmail.com ↗
          </div>
          <div>github.com/hellzz13 ↗</div>
          <div>linkedin.com/in/hpneto ↗</div>
        </div>
      </div>
    );
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="block w-full"
      aria-hidden="true"
      focusable="false"
    >
      <foreignObject width={width} height={height}>
        <div
          inert
          className={`h-full overflow-hidden font-sans text-foreground [&_em]:text-accent [&_em]:not-italic ${surfaceStyle}`}
        >
          <div
            className={`relative flex h-10 items-center justify-center border-b px-4 font-mono text-type-label ${barStyle}`}
          >
            <span className="absolute left-4 flex gap-2">
              <span className="h-3 w-3 rounded-full bg-control-close" />
              <span className="h-3 w-3 rounded-full bg-control-minimize" />
              <span className="h-3 w-3 rounded-full bg-control-status" />
            </span>
            {isTerminal
              ? "helio@portfolio — zsh"
              : `${appLabel(id)} — Hélio OS`}
          </div>
          {content()}
        </div>
      </foreignObject>
    </svg>
  );
}

export { WindowPreview };
