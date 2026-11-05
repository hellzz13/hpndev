import { DesktopStyles } from "@/portfolio/styles";
import Head from "next/head";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DesktopWindow } from "@/portfolio/DesktopWindow";
import { StackTags } from "@/portfolio/StackTags";
import { ProjectIdentity } from "@/portfolio/ProjectIdentity";
import { Apps, AppIds, AppInfo, Spaces } from "@/portfolio/constants";
import {
  Projects,
  Experience,
  InitialTerminalLines,
} from "@/portfolio/content";
import type { AppId, SpaceId } from "@/portfolio/constants";
import { resolveTerminalCommand } from "@/portfolio/terminal";
import { useWindowManager } from "@/portfolio/useWindowManager";
import {
  SiteUrl,
  SiteTitle,
  SiteDescription,
  SocialImageUrl,
  StructuredData,
} from "@/portfolio/seo";
import { FiArrowUpRight, FiGithub, FiLinkedin } from "react-icons/fi";

type TerminalLine = { command: string; output: string };

function Home() {
  const [currentSpace, setCurrentSpace] = useState<SpaceId>(Spaces.HOME);
  const isHomeSpace = currentSpace === Spaces.HOME;
  const isProjectsSpace = currentSpace === Spaces.PROJECTS;
  const { windows, open, close, minimize, focus, move } = useWindowManager<
    AppId,
    SpaceId
  >(Apps.TERMINAL, Spaces.HOME);
  const [selectedProject, setSelectedProject] = useState(0);
  const [lines, setLines] = useState<TerminalLine[]>(InitialTerminalLines);
  const [command, setCommand] = useState("");
  const [time, setTime] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const update = () =>
      setTime(
        new Intl.DateTimeFormat("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date()),
      );
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);
  useEffect(() => {
    const terminal = endRef.current?.parentElement;
    if (terminal) terminal.scrollTop = terminal.scrollHeight;
  }, [lines]);
  function switchSpace(space: SpaceId) {
    setCurrentSpace(space);
  }

  function openApp(id: AppId) {
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

  function submitCommand() {
    const trimmedCommand = command.trim();
    const hasCommand = trimmedCommand.length > 0;
    if (!hasCommand) return;

    const result = resolveTerminalCommand(trimmedCommand);
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

  function appContent(id: AppId) {
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
            Um portfólio para explorar.
          </div>
          {lines.map((line, index) => (
            <div className={`terminal-line ${DesktopStyles.terminalLine}`} key={`${index}-${line.command}`}>
              <div>
                <span className={`prompt ${DesktopStyles.prompt}`}>helio@portfolio ~ % </span>
                {line.command}
              </div>
              <p>{line.output}</p>
            </div>
          ))}
          <form
            className={`terminal-form ${DesktopStyles.terminalForm}`}
            onSubmit={(event) => {
              event.preventDefault();
              submitCommand();
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
              aria-label="Comando do terminal"
            />
          </form>
          <div ref={endRef} />
        </div>
      );
    if (isProjectsApp) {
      const project = Projects[selectedProject];
      return (
        <div className={`window-content ${DesktopStyles.windowContent}`}>
          <span className={`eyebrow ${DesktopStyles.eyebrow}`}>/ trabalhos selecionados</span>
          <h2>
            Projetos que saíram
            <br />
            <em>do papel.</em>
          </h2>
          <p className={`lede ${DesktopStyles.lede}`}>
            Produtos e ferramentas que refletem como penso, construo e resolvo
            problemas.
          </p>
          <div className={`project-tabs ${DesktopStyles.projectTabs}`} role="tablist" aria-label="Projetos">
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
          <span className={`eyebrow ${DesktopStyles.eyebrow}`}>/ sobre mim</span>
          <div className={`about-heading ${DesktopStyles.aboutHeading}`}>
            <Image
              src="/studying.png"
              width={132}
              height={132}
              alt="Avatar ilustrado de Hélio trabalhando"
            />
            <div>
              <h2>
                Oi, eu sou
                <br />
                <em>o Hélio.</em>
              </h2>
              <p>Desenvolvedor front-end.</p>
            </div>
          </div>
          <p>
            Gosto de transformar ideias em interfaces que funcionam bem e têm
            identidade. Trabalho com produtos web e também crio ferramentas para
            tornar o processo de construir software mais claro.
          </p>
          <p>Fora do código: música, games, quadrinhos e outras nerdices.</p>
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
          <span className={`eyebrow ${DesktopStyles.eyebrow}`}>/ trajetória</span>
          <h2>
            Experiência<em>.</em>
          </h2>
          <p className={`lede ${DesktopStyles.lede}`}>
            Uma trajetória construindo interfaces para produtos de diferentes
            áreas.
          </p>
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
      <div className={`window-content contact-content ${DesktopStyles.windowContent} ${DesktopStyles.contactContent}`}>
        <span className={`eyebrow ${DesktopStyles.eyebrow}`}>/ contato</span>
        <h2>
          Vamos
          <br />
          <em>conversar?</em>
        </h2>
        <p>
          Tem uma ideia, projeto ou oportunidade? Minha caixa de entrada está
          aberta.
        </p>
        <a className={`contact-link primary ${DesktopStyles.contactLink}`} href="mailto:hpalenca13@gmail.com">
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
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        <meta property="og:url" content={SiteUrl} />
        <meta property="og:title" content={SiteTitle} />
        <meta property="og:description" content={SiteDescription} />
        <meta property="og:image" content={SocialImageUrl} />
        <meta
          property="og:image:alt"
          content="Avatar ilustrado de Hélio Palença"
        />
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
      <div className={`desktop ${DesktopStyles.desktop}`} data-space={currentSpace}>
        <header className={`menubar ${DesktopStyles.menubar}`}>
          <div>
            <span className={`menubar-mark ${DesktopStyles.menubarMark}`}>✳</span>
            <strong>Hélio OS</strong>
            <span className={`menubar-separator ${DesktopStyles.menubarSeparator}`} />{" "}
            <span className={`menubar-section ${DesktopStyles.menubarSection}`}>Portfólio</span>
          </div>
          <nav className={`workspace-switcher ${DesktopStyles.workspaceSwitcher}`} aria-label="Áreas de trabalho">
            <button
              type="button"
              aria-pressed={isHomeSpace}
              onClick={() => switchSpace(Spaces.HOME)}
            >
              <span>01</span> Início
            </button>
            <button
              type="button"
              aria-pressed={isProjectsSpace}
              onClick={() => switchSpace(Spaces.PROJECTS)}
            >
              <span>02</span> Projetos
            </button>
          </nav>
          <div>
            <span className={`available ${DesktopStyles.available}`}>● &nbsp; Disponível para explorar</span>
            <time>{time}</time>
          </div>
        </header>
        <div
          className={`space-track ${isProjectsSpace ? "show-projects" : ""} ${DesktopStyles.spaceTrack}`}
        >
          <main className={`desktop-main ${DesktopStyles.desktopMain}`} inert={!isHomeSpace}>
            <section className={`hero ${DesktopStyles.hero}`}>
              <span className={`eyebrow ${DesktopStyles.eyebrow}`}>✳ &nbsp; BEM-VINDO AO MEU ESPAÇO</span>
              <h1>
                Construindo
                <br />
                coisas para
                <br />
                <em>a web.</em>
              </h1>
              <p>
                Sou Hélio Palença, desenvolvedor front-end. Este é meu canto da
                internet — fique à vontade para explorar.
              </p>
              <button
                type="button"
                className={`hero-action ${DesktopStyles.heroAction}`}
                onClick={() => openApp(Apps.PROJECTS)}
              >
                Explorar projetos <FiArrowUpRight />
              </button>
              <span className={`hero-secondary ${DesktopStyles.heroSecondary}`}>
                Use o seletor no topo para mudar de mesa
              </span>
            </section>
            <nav className={`desktop-icons ${DesktopStyles.desktopIcons}`} aria-label="Aplicativos do desktop">
              {AppIds.filter((id) => id !== Apps.TERMINAL).map((id) => {
                const { Icon, label } = AppInfo[id];
                return (
                  <button
                    type="button"
                    key={id}
                    data-tooltip={label}
                    onClick={() => openApp(id)}
                  >
                    <span className={`desktop-icon icon-${id} ${DesktopStyles.desktopIcon}`}>
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
            <div className={`portfolio-index-heading ${DesktopStyles.portfolioIndexHeading}`}>
              <span className={`eyebrow ${DesktopStyles.eyebrow}`}>/ mesa 02 · projetos</span>
              <h2 id="projects-heading">
                Trabalho em destaque<span>.</span>
              </h2>
              <p>
                Abra um projeto para ver os detalhes em uma janela. Use as mesas
                no topo para navegar.
              </p>
            </div>
            <div className={`portfolio-index-grid ${DesktopStyles.portfolioIndexGrid}`}>
              {Projects.map((project, index) => (
                <article className={`portfolio-index-card ${DesktopStyles.portfolioIndexCard}`} key={project.name}>
                  <span className={`portfolio-index-number ${DesktopStyles.portfolioIndexNumber}`}>
                    {project.number} / {project.type}
                  </span>
                  <ProjectIdentity name={project.name} logo={project.logo} />
                  <p>{project.summary}</p>
                  <p>{project.detail}</p>
                  <StackTags tags={project.tags} />
                  <div className={`portfolio-index-actions ${DesktopStyles.portfolioIndexActions}`}>
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProject(index);
                        openApp(Apps.PROJECTS);
                      }}
                    >
                      Abrir projeto <FiArrowUpRight />
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
            const label = AppInfo[item.id].label;
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
                onFocus={() => focus(item.id)}
                onMove={(x, y) => move(item.id, x, y)}
                onClose={() => close(item.id)}
                onMinimize={() => minimize(item.id)}
              >
                {appContent(item.id)}
              </DesktopWindow>
            );
          })}
        </div>
        <footer className={`desktop-footer ${DesktopStyles.desktopFooter}`}>
          <span>© {new Date().getFullYear()} Hélio Palença</span>
          <span>Feito com curiosidade ✳</span>
        </footer>
        <nav className={`dock ${DesktopStyles.dock}`} aria-label="Dock">
          {AppIds.map((id) => {
            const { Icon, label } = AppInfo[id];
            return (
              <button
                type="button"
                key={id}
                data-tooltip={label}
                aria-label={`Abrir ${label}`}
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
        </nav>
      </div>
    </>
  );
}

export default Home;
