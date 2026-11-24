import { DesktopStyles } from "@/portfolio/styles";
import Head from "next/head";
import dynamic from "next/dynamic";
import { Brand } from "@/portfolio/Brand";
import Image from "next/image";
import type { SetStateAction } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { SnakeGame } from "@/portfolio/snake/SnakeGame";
import { useSnake } from "@/portfolio/snake/useSnake";
import { DesktopWindow } from "@/portfolio/DesktopWindow";
import { StackTags } from "@/portfolio/StackTags";
import { ProjectIdentity } from "@/portfolio/ProjectIdentity";
import {
  Apps,
  AppIds,
  AppInfo,
  Spaces,
  WorkspaceShortcut,
} from "@/portfolio/constants";
import { getContent } from "@/portfolio/content";
import { useLanguage } from "@/portfolio/useLanguage";
import { WorkspaceShortcutHint } from "@/portfolio/WorkspaceShortcutHint";
import { WindowPreview } from "@/portfolio/WindowPreview";
import { WorkspaceOverview } from "@/portfolio/WorkspaceOverview";
import { LanguageSwitcher } from "@/portfolio/LanguageSwitcher";
import type { AppId, SpaceId } from "@/portfolio/constants";
import { resolveTerminalCommand } from "@/portfolio/terminal";
import { QuickSearch } from "@/portfolio/QuickSearch";
import {
  SearchActions,
  SearchShortcutLabel,
  getGoogleSearchUrl,
} from "@/portfolio/search";
import type { SearchAction } from "@/portfolio/search";
import { useSearchShortcut } from "@/portfolio/useSearchShortcut";
import { useDesktopGestures } from "@/portfolio/useDesktopGestures";
import { useWorkspaceShortcuts } from "@/portfolio/useWorkspaceShortcuts";
import { useWindowManager } from "@/portfolio/useWindowManager";
import { getSeo, LocaleUrls } from "@/portfolio/seo";
import {
  FiArrowUpRight,
  FiGithub,
  FiLinkedin,
  FiGrid,
  FiSearch,
} from "react-icons/fi";

const BootScreen = dynamic(
  () => import("@/portfolio/BootScreen").then((module) => module.BootScreen),
  { ssr: false },
);

type TerminalLine = { command: string; output: string };

function Home() {
  const { locale, t, appLabel } = useLanguage();
  const { Projects, Experience, InitialTerminalLines } = getContent(locale);
  const {
    SiteUrl,
    SiteTitle,
    SiteDescription,
    SocialImageUrl,
    StructuredData,
    ogLocale,
  } = getSeo(locale);
  const [currentSpace, setCurrentSpace] = useState<SpaceId>(Spaces.HOME);
  const [isOverviewOpen, setOverviewOpen] = useState(false);
  const [isSearchOpen, setSearchOpen] = useState(false);
  const [isSnakeUnlocked, setSnakeUnlocked] = useState(false);
  const visibleAppIds = AppIds.filter((id) => {
    const canShowApp = id !== Apps.SNAKE || isSnakeUnlocked;
    return canShowApp;
  });
  const [isBooting, setBooting] = useState(true);
  const finishBoot = useCallback(() => setBooting(false), []);
  const isHomeSpace = currentSpace === Spaces.HOME;
  const isProjectsSpace = currentSpace === Spaces.PROJECTS;
  const { windows, open, close, minimize, focus, move, setMaximized, resize } =
    useWindowManager<AppId, SpaceId>(Apps.TERMINAL, Spaces.HOME);
  const visibleWindows = windows.filter(
    (item) => !item.minimized && item.space === currentSpace,
  );
  const topWindow = visibleWindows.reduce<(typeof windows)[number] | undefined>(
    (top, item) => {
      const isTop = !top || item.z > top.z;
      return isTop ? item : top;
    },
    undefined,
  );
  const isSnakeActive =
    topWindow?.id === Apps.SNAKE &&
    !isOverviewOpen &&
    !isSearchOpen &&
    !isBooting;
  const { state: snakeState, dispatch: snakeDispatch } =
    useSnake(isSnakeActive);
  const navigateSpace = useCallback(
    (next: SetStateAction<SpaceId>) => {
      snakeDispatch({ type: "pause" });
      setCurrentSpace(next);
    },
    [snakeDispatch],
  );
  useSearchShortcut({ isDisabled: isOverviewOpen || isBooting, setSearchOpen });
  const areWorkspaceShortcutsDisabled =
    isOverviewOpen || isSearchOpen || isBooting;
  useDesktopGestures({
    currentSpace,
    setCurrentSpace: navigateSpace,
    isOverviewOpen,
    setOverviewOpen,
  });
  useWorkspaceShortcuts({
    isDisabled: areWorkspaceShortcutsDisabled,
    setCurrentSpace: navigateSpace,
  });
  const [selectedProject, setSelectedProject] = useState(0);
  const [lines, setLines] = useState<TerminalLine[]>(InitialTerminalLines);
  const [command, setCommand] = useState("");
  const [time, setTime] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat(locale, {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, [locale]);
  useEffect(() => {
    const terminal = endRef.current?.parentElement;
    if (terminal) terminal.scrollTop = terminal.scrollHeight;
  }, [lines]);
  function switchSpace(space: SpaceId) {
    navigateSpace(space);
  }

  function openApp(id: AppId) {
    const isSnakeApp = id === Apps.SNAKE;
    if (isSnakeApp) setSnakeUnlocked(true);
    open(id, currentSpace);
    const isTerminalApp = id === Apps.TERMINAL;
    if (isTerminalApp) {
      window.setTimeout(() => inputRef.current?.focus(), 50);
    }
  }

  function isWindowVisible(item: (typeof windows)[number]) {
    const belongsToCurrentSpace = item.space === currentSpace;
    return !item.minimized && belongsToCurrentSpace;
  }

  function runCommand(rawCommand: string) {
    const trimmedCommand = rawCommand.trim();
    const hasCommand = trimmedCommand.length > 0;
    if (!hasCommand) return;

    const result = resolveTerminalCommand(trimmedCommand, locale);
    const shouldClearHistory = result.clear;
    if (shouldClearHistory) {
      setLines([]);
      setCommand("");
      return;
    }
    const appToOpen = result.appToOpen;
    const hasAppToOpen = appToOpen !== undefined;
    if (hasAppToOpen) openApp(appToOpen);
    setLines((current) => [
      ...current,
      { command: trimmedCommand, output: result.output },
    ]);
    setCommand("");
  }

  function selectSearchResult(action: SearchAction) {
    setSearchOpen(false);
    const isApp = action.kind === SearchActions.APP;
    const isProject = action.kind === SearchActions.PROJECT;
    const isSpace = action.kind === SearchActions.SPACE;
    const isCommand = action.kind === SearchActions.COMMAND;
    const isWindowSize = action.kind === SearchActions.WINDOW_SIZE;
    if (isWindowSize) {
      openApp(action.appId);
      setMaximized(action.appId, action.maximized);
      return;
    }
    const isOverview = action.kind === SearchActions.OVERVIEW;
    const isGoogle = action.kind === SearchActions.GOOGLE;
    if (isApp) {
      openApp(action.appId);
      return;
    }
    if (isProject) {
      setSelectedProject(action.projectIndex);
      openApp(Apps.PROJECTS);
      return;
    }
    if (isSpace) {
      switchSpace(action.spaceId);
      return;
    }
    if (isCommand) {
      openApp(Apps.TERMINAL);
      runCommand(action.command);
      return;
    }
    if (isOverview) {
      setOverviewOpen(true);
      return;
    }
    if (isGoogle)
      window.open(
        getGoogleSearchUrl(action.query),
        "_blank",
        "noopener,noreferrer",
      );
  }

  function appContent(id: AppId) {
    const isSnakeApp = id === Apps.SNAKE;
    if (isSnakeApp)
      return <SnakeGame state={snakeState} dispatch={snakeDispatch} />;
    const isTerminalApp = id === Apps.TERMINAL;
    const isProjectsApp = id === Apps.PROJECTS;
    const isAboutApp = id === Apps.ABOUT;
    const isCareerApp = id === Apps.CAREER;

    if (isTerminalApp)
      return (
        <div
          className={`terminal-body ${DesktopStyles.terminalBody}`}
          onClick={() => inputRef.current?.focus()}
        >
          <div className={`terminal-intro ${DesktopStyles.terminalIntro}`}>
            HÉLIO OS <span>v1.0</span>
            <br />
            {t.terminalIntro}
          </div>
          {lines.map((line, index) => (
            <div
              className={`terminal-line ${DesktopStyles.terminalLine}`}
              key={`${index}-${line.command}`}
            >
              <div>
                <span className={`prompt ${DesktopStyles.prompt}`}>
                  helio@portfolio ~ %{" "}
                </span>
                {line.command}
              </div>
              <p>{line.output}</p>
            </div>
          ))}
          <form
            className={`terminal-form ${DesktopStyles.terminalForm}`}
            onSubmit={(event) => {
              event.preventDefault();
              runCommand(command);
            }}
          >
            <label htmlFor="terminal-command">helio@portfolio ~ %</label>
            <input
              id="terminal-command"
              ref={inputRef}
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              autoComplete="off"
              spellCheck={false}
              aria-label={t.terminalCommand}
            />
          </form>
          <div ref={endRef} />
        </div>
      );
    if (isProjectsApp) {
      const project = Projects[selectedProject];
      return (
        <div className={`window-content ${DesktopStyles.windowContent}`}>
          <span className={`eyebrow ${DesktopStyles.eyebrow}`}>
            {t.selectedWork}
          </span>
          <h2>
            {t.projectsFirst}
            <br />
            <em>{t.projectsLast}</em>
          </h2>
          <p className={`lede ${DesktopStyles.lede}`}>
            {t.projectsDescription}
          </p>
          <div
            className={`project-tabs ${DesktopStyles.projectTabs}`}
            role="tablist"
            aria-label={t.projects}
          >
            {Projects.map((item, index) => {
              const isSelectedProject = selectedProject === index;
              return (
                <button
                  key={item.name}
                  type="button"
                  role="tab"
                  aria-selected={isSelectedProject}
                  className={isSelectedProject ? "active" : ""}
                  onClick={() => setSelectedProject(index)}
                >
                  <span>{item.number}</span> {item.name}
                </button>
              );
            })}
          </div>
          <article
            className={`project-card project-card-${selectedProject} ${DesktopStyles.projectCard}`}
            role="tabpanel"
          >
            <div className={`project-type ${DesktopStyles.projectType}`}>
              {project.type}
              <FiArrowUpRight />
            </div>
            <ProjectIdentity name={project.name} logo={project.logo} />
            <p>{project.summary}</p>
            <p className="project-detail">{project.detail}</p>
            <StackTags tags={project.tags} />
            <div className={`project-links ${DesktopStyles.projectLinks}`}>
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label} <FiArrowUpRight />
                </a>
              ))}
            </div>
          </article>
        </div>
      );
    }
    if (isAboutApp)
      return (
        <div className={`window-content ${DesktopStyles.windowContent}`}>
          <span className={`eyebrow ${DesktopStyles.eyebrow}`}>
            {t.aboutEyebrow}
          </span>
          <div className={`about-heading ${DesktopStyles.aboutHeading}`}>
            <Image
              src="/studying.png"
              width={132}
              height={132}
              alt={t.avatarAlt}
            />
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
          <div className={`tag-list muted ${DesktopStyles.tagList}`}>
            <span>React</span>
            <span>TypeScript</span>
            <span>Next.js</span>
            <span>UI</span>
          </div>
        </div>
      );
    if (isCareerApp)
      return (
        <div className={`window-content ${DesktopStyles.windowContent}`}>
          <span className={`eyebrow ${DesktopStyles.eyebrow}`}>
            {t.careerEyebrow}
          </span>
          <h2>
            {t.career}
            <em>.</em>
          </h2>
          <p className={`lede ${DesktopStyles.lede}`}>{t.careerDescription}</p>
          <div className={`career-list ${DesktopStyles.careerList}`}>
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
        className={`window-content contact-content ${DesktopStyles.windowContent} ${DesktopStyles.contactContent}`}
      >
        <span className={`eyebrow ${DesktopStyles.eyebrow}`}>
          {t.contactEyebrow}
        </span>
        <h2>
          {t.contactFirst}
          <br />
          <em>{t.contactLast}</em>
        </h2>
        <p>{t.contactDescription}</p>
        <a
          className={`contact-link primary ${DesktopStyles.contactLink}`}
          href="mailto:hpalenca13@gmail.com"
        >
          hpalenca13@gmail.com <FiArrowUpRight />
        </a>
        <a
          className={`contact-link ${DesktopStyles.contactLink}`}
          href="https://github.com/hellzz13"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiGithub /> github.com/hellzz13 <FiArrowUpRight />
        </a>
        <a
          className={`contact-link ${DesktopStyles.contactLink}`}
          href="https://www.linkedin.com/in/hpneto/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiLinkedin /> linkedin.com/in/hpneto <FiArrowUpRight />
        </a>
      </div>
    );
  }
  return (
    <>
      <Head>
        <title>{SiteTitle}</title>
        <meta name="description" content={SiteDescription} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={SiteUrl} />
        <link rel="alternate" hrefLang="pt-BR" href={LocaleUrls["pt-BR"]} />
        <link rel="alternate" hrefLang="en" href={LocaleUrls.en} />
        <link rel="alternate" hrefLang="x-default" href={LocaleUrls["pt-BR"]} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={ogLocale} />
        <meta property="og:url" content={SiteUrl} />
        <meta property="og:title" content={SiteTitle} />
        <meta property="og:description" content={SiteDescription} />
        <meta property="og:image" content={SocialImageUrl} />
        <meta property="og:image:alt" content={t.socialImageAlt} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={SiteTitle} />
        <meta name="twitter:description" content={SiteDescription} />
        <meta name="twitter:image" content={SocialImageUrl} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(StructuredData).replace(/</g, "\\u003c"),
          }}
        />
      </Head>
      <div
        className={`desktop ${DesktopStyles.desktop} origin-center transition duration-300 ease-out motion-reduce:transition-none motion-reduce:transform-none ${isOverviewOpen ? "scale-95 opacity-80" : "scale-100 opacity-100"}`}
        data-space={currentSpace}
      >
        <header className={`menubar ${DesktopStyles.menubar}`}>
          <div>
            <Brand compactOnMobile />
            <span
              className={`menubar-separator ${DesktopStyles.menubarSeparator}`}
            />{" "}
            <span className={`menubar-section ${DesktopStyles.menubarSection}`}>
              {t.portfolio}
            </span>
          </div>
          <nav
            className={`workspace-switcher ${DesktopStyles.workspaceSwitcher}`}
            aria-label={t.workspaces}
          >
            <button
              type="button"
              title={`${t.home} · Alt + Shift + ←`}
              aria-keyshortcuts={WorkspaceShortcut.previousAria}
              aria-pressed={isHomeSpace}
              onClick={() => switchSpace(Spaces.HOME)}
            >
              <span className="mobile:hidden">01</span> {t.home}
            </button>
            <button
              type="button"
              title={`${t.projects} · Alt + Shift + →`}
              aria-keyshortcuts={WorkspaceShortcut.nextAria}
              aria-pressed={isProjectsSpace}
              onClick={() => switchSpace(Spaces.PROJECTS)}
            >
              <span className="mobile:hidden">02</span> {t.projects}
            </button>
            <button
              type="button"
              aria-haspopup="dialog"
              aria-expanded={isOverviewOpen}
              aria-label={t.overviewTitle}
              title={`${t.overviewTitle} · ${t.overviewGestureInfo}`}
              onClick={() => setOverviewOpen(true)}
            >
              <FiGrid aria-hidden="true" className="h-3.5 w-3.5" />
            </button>
          </nav>
          <div>
            <span className={`available ${DesktopStyles.available}`}>
              ● &nbsp; {t.available}
            </span>
            <time>{time}</time>
            <LanguageSwitcher />
          </div>
        </header>
        <div
          className={`space-track ${isProjectsSpace ? "show-projects" : ""} ${DesktopStyles.spaceTrack}`}
        >
          <main
            className={`desktop-main ${DesktopStyles.desktopMain}`}
            inert={!isHomeSpace}
          >
            <section className={`hero ${DesktopStyles.hero}`}>
              <span className={`eyebrow ${DesktopStyles.eyebrow}`}>
                ✳ &nbsp; {t.welcome}
              </span>
              <h1>
                {t.heroFirst}
                <br />
                {t.heroSecond}
                <br />
                <em>{t.heroLast}</em>
              </h1>
              <p>{t.heroDescription}</p>
              <button
                type="button"
                className={`hero-action ${DesktopStyles.heroAction}`}
                onClick={() => openApp(Apps.PROJECTS)}
              >
                {t.exploreProjects} <FiArrowUpRight />
              </button>
              <span className={`hero-secondary ${DesktopStyles.heroSecondary}`}>
                <WorkspaceShortcutHint />
              </span>
            </section>
            <nav
              className={`desktop-icons ${DesktopStyles.desktopIcons}`}
              data-snake-unlocked={isSnakeUnlocked}
              aria-label={t.desktopApps}
            >
              {visibleAppIds
                .filter((id) => id !== Apps.TERMINAL)
                .map((id) => {
                  const { Icon } = AppInfo[id];
                  const label = appLabel(id);
                  return (
                    <button
                      type="button"
                      key={id}
                      data-tooltip={label}
                      onClick={() => openApp(id)}
                    >
                      <span
                        className={`desktop-icon icon-${id} ${DesktopStyles.desktopIcon}`}
                      >
                        <Icon aria-hidden="true" />
                      </span>
                      {label}
                    </button>
                  );
                })}
            </nav>
          </main>
          <section
            className={`portfolio-index ${DesktopStyles.portfolioIndex}`}
            id="projects"
            aria-labelledby="projects-heading"
            inert={!isProjectsSpace}
          >
            <div
              className={`portfolio-index-heading ${DesktopStyles.portfolioIndexHeading}`}
            >
              <span className={`eyebrow ${DesktopStyles.eyebrow}`}>
                {t.projectsWorkspace}
              </span>
              <h2 id="projects-heading">
                {t.featuredWork}
                <span>.</span>
              </h2>
              <p>{t.featuredDescription}</p>
            </div>
            <div
              className={`portfolio-index-grid ${DesktopStyles.portfolioIndexGrid}`}
            >
              {Projects.map((project, index) => (
                <article
                  className={`portfolio-index-card ${DesktopStyles.portfolioIndexCard}`}
                  key={project.name}
                >
                  <span
                    className={`portfolio-index-number ${DesktopStyles.portfolioIndexNumber}`}
                  >
                    {project.number} / {project.type}
                  </span>
                  <ProjectIdentity name={project.name} logo={project.logo} />
                  <p>{project.summary}</p>
                  <p>{project.detail}</p>
                  <StackTags tags={project.tags} />
                  <div
                    className={`portfolio-index-actions ${DesktopStyles.portfolioIndexActions}`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProject(index);
                        openApp(Apps.PROJECTS);
                      }}
                    >
                      {t.openProject} <FiArrowUpRight />
                    </button>
                    {project.links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.label} <FiArrowUpRight />
                      </a>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
        <div className={`windows-layer ${DesktopStyles.windowsLayer}`}>
          {windows.filter(isWindowVisible).map((item) => {
            const label = appLabel(item.id);
            const title =
              item.id === Apps.TERMINAL
                ? "helio@portfolio — zsh"
                : `${label} — Hélio OS`;
            return (
              <DesktopWindow
                key={item.id}
                id={item.id}
                label={label}
                title={title}
                position={item}
                onToggleMaximize={() => setMaximized(item.id, !item.maximized)}
                onFocus={() => {
                  const isOtherApp = item.id !== Apps.SNAKE;
                  if (isOtherApp) snakeDispatch({ type: "pause" });
                  focus(item.id);
                }}
                onResize={(geometry) => resize(item.id, geometry)}
                onMove={(x, y) => move(item.id, x, y)}
                onClose={() => {
                  const isSnake = item.id === Apps.SNAKE;
                  if (isSnake) snakeDispatch({ type: "reset" });
                  close(item.id);
                }}
                onMinimize={() => {
                  const isSnake = item.id === Apps.SNAKE;
                  if (isSnake) snakeDispatch({ type: "pause" });
                  minimize(item.id);
                }}
              >
                {appContent(item.id)}
              </DesktopWindow>
            );
          })}
        </div>
        <footer className={`desktop-footer ${DesktopStyles.desktopFooter}`}>
          <span>© {new Date().getFullYear()} Hélio Palença</span>
          <span>{t.madeWith} ✳</span>
        </footer>
        <nav className={`dock ${DesktopStyles.dock}`} aria-label={t.dock}>
          {visibleAppIds.map((id) => {
            const { Icon } = AppInfo[id];
            const label = appLabel(id);
            return (
              <button
                type="button"
                key={id}
                data-tooltip={label}
                aria-label={`${t.open} ${label}`}
                className={
                  windows.some((item) => item.id === id && !item.minimized)
                    ? "running"
                    : ""
                }
                onClick={() => openApp(id)}
              >
                <Icon aria-hidden="true" />
              </button>
            );
          })}
          <button
            type="button"
            aria-label={t.searchTitle}
            aria-haspopup="dialog"
            aria-expanded={isSearchOpen}
            aria-keyshortcuts="Meta+k Control+k"
            data-tooltip={`${t.searchTitle} · ${SearchShortcutLabel}`}
            onClick={() => setSearchOpen(true)}
          >
            <FiSearch aria-hidden="true" />
          </button>
        </nav>
      </div>
      {isBooting && <BootScreen onComplete={finishBoot} />}
      <QuickSearch
        isOpen={isSearchOpen}
        onClose={() => setSearchOpen(false)}
        onSelect={selectSearchResult}
      />
      <WorkspaceOverview
        isOpen={isOverviewOpen}
        currentSpace={currentSpace}
        windows={windows}
        renderPreview={(id) => (
          <WindowPreview
            snakeState={snakeState}
            id={id}
            selectedProject={selectedProject}
            lines={lines}
            command={command}
          />
        )}
        onClose={() => setOverviewOpen(false)}
        onSelectSpace={(space) => {
          switchSpace(space);
          setOverviewOpen(false);
        }}
        onSelectWindow={(item) => {
          switchSpace(item.space);
          open(item.id, item.space);
          setOverviewOpen(false);
        }}
      />
    </>
  );
}

export default Home;
