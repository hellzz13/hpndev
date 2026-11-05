// Semantic colors and a shared 4px spacing scale (quarter steps preserve existing geometry).
const Accent = "#c7fa69";
const White = "#ffffff";
const Colors = {
  "focus": Accent,
  "recovery": {
    "background": "#0747cc",
    "foreground": White,
    "muted": "#c9dbff",
    "body": "#e0eaff",
    "action": White,
    "action-foreground": "#073ba5",
    "action-hover": "#deebff",
    "action-border": "#ffffff70",
    "divider": "#ffffff35"
  },
  "accent": Accent,
  "foreground": "#f1f0e9",
  "desktop-glow": "#29263e",
  "desktop": "#171a20",
  "desktop-dot": "#454b56",
  "menubar-border": "#ffffff19",
  "separator": "#777b82",
  "hero-muted": "#afb3b2",
  "accent-foreground": "#182119",
  "accent-shadow": "#c7fa6930",
  "icon-label": "#efeee9",
  "shadow": "#000",
  "glass-highlight": "#ffffff30",
  "shadow-soft": "#0003",
  "icon-projects-start": "#c6ea98",
  "icon-projects-end": "#7fa46c",
  "icon-projects-foreground": "#1d3622",
  "icon-about-start": "#d3c0f4",
  "icon-about-end": "#8d7ab6",
  "icon-about-foreground": "#312747",
  "icon-career-start": "#a2cbda",
  "icon-career-end": "#547b91",
  "icon-career-foreground": "#142d3e",
  "icon-contact-start": "#efc6a5",
  "icon-contact-end": "#bf827d",
  "icon-contact-foreground": "#4b2828",
  "window-border": "#4a4d53",
  "window": "#24272e",
  "shadow-deep": "#0007",
  "shadow-medium": "#0005",
  "window-bar-border": "#41444a",
  "window-bar": "#30333b",
  "window-title": "#b9babf",
  "window-control-symbol": "#0009",
  "control-close": "#ff6058",
  "control-minimize": "#febd2e",
  "control-status": "#29c840",
  "terminal": "#1d2027",
  "terminal-text": "#e3e7d7",
  "terminal-muted": "#909997",
  "terminal-output": "#a9b1ad",
  "terminal-input": "#f4f3eb",
  "body-muted": "#b3b6b9",
  "tab-muted": "#aeb1b5",
  "tab-active": "#f3f3ed",
  "project-green": "#cfebbc",
  "project-green-foreground": "#243425",
  "project-purple": "#d8caed",
  "project-purple-foreground": "#322d40",
  "avatar": "#c2d49d",
  "career-border": "#44484f",
  "career-muted": "#92999a",
  "contact-border": "#5c6265",
  "contact-text": "#e9ede4",
  "contact-action-text": "#1e281c",
  "footer": "#7e8585",
  "glass-border": "#ffffff24",
  "dock": "#3a3e48bd",
  "glass-surface": "#ffffff1a",
  "dock-icon": "#eff0e9",
  "projects-desktop": "#1c2027",
  "navigation-muted": "#aeb3b7",
  "project-border": "#ffffff22",
  "project-surface": "#262b33",
  "project-text": "#c5c9c7",
  "project-muted": "#9da5a5",
  "accent-hover": "#e4ffb5",
  "tooltip-border": "#ffffff26",
  "tooltip": "#30343d",
  "tooltip-shadow": "#0006",
  "navigation": "#171a20a8",
  "navigation-index": "#929b9a",
  "navigation-active": "#1d2a20",
  "navigation-active-index": "#466238",
  "projects-glow": "#303746",
  "menubar": "rgba(42,45,53,.87)"
};
const Spacing = {
  "15": "60px",
  "1": "4px",
  "2": "8px",
  "3": "12px",
  "4": "16px",
  "5": "20px",
  "6": "24px",
  "7": "28px",
  "8": "32px",
  "11": "44px",
  "12": "48px",
  "13": "52px",
  "17": "68px",
  "18": "72px",
  "24": "96px",
  "35": "140px",
  "150": "600px",
  "190": "760px",
  "0.25": "1px",
  "0.5": "2px",
  "0.75": "3px",
  "1.25": "5px",
  "1.5": "6px",
  "1.75": "7px",
  "2.25": "9px",
  "2.5": "10px",
  "2.75": "11px",
  "3.25": "13px",
  "3.5": "14px",
  "3.75": "15px",
  "4.5": "18px",
  "4.75": "19px",
  "5.25": "21px",
  "5.5": "22px",
  "5.75": "23px",
  "6.25": "25px",
  "6.5": "26px",
  "7.5": "30px",
  "8.75": "35px",
  "9.5": "38px",
  "10.25": "41px",
  "10.5": "42px",
  "11.5": "46px",
  "13.5": "54px",
  "14.5": "58px",
  "18.75": "75px",
  "23.75": "95px",
  "32.5": "130px",
  "36.25": "145px",
  "37.5": "150px",
  "42.5": "170px",
  "62.5": "250px",
  "78.75": "315px",
  "82.5": "330px",
  "92.5": "370px",
  "97.5": "390px",
  "117.5": "470px",
  "137.5": "550px",
  "142.5": "570px",
  "desktop-top": "clamp(75px, 11vh, 125px)",
  "desktop-gutter": "6.3vw",
  "tooltip": "calc(100% + 10px)",
  "terminal-top": "25vh",
  "terminal-left": "45vw",
  "projects-top": "10vh",
  "projects-left": "24vw",
  "content-top": "13vh",
  "content-left": "30vw",
  "terminal-left-compact": "40vw",
  "recovery-gutter": "clamp(28px,7vw,100px)"
};
const TextShadows = { icons: `0 2px 6px ${Colors.shadow}`, none: 'none' };
const Transitions = {
 'hero-action': 'transform .2s, box-shadow .2s',
 'desktop-icon': 'transform .2s',
 dock: 'transform .2s, background .2s',
 tooltip: 'opacity .15s, transform .15s, visibility .15s',
 'space-track': 'transform .48s cubic-bezier(.2,.75,.2,1)',
};
/** @type {import('tailwindcss').Config} */
const Config = {
  "content": [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  "theme": {
    "extend": {
      colors: Colors,
      spacing: Spacing,
      backgroundImage: {
"wallpaper": `radial-gradient(circle at 95% 95%, ${Colors["desktop-glow"]}, transparent 43%)`,
"desktop-grid": `radial-gradient(${Colors["desktop-dot"]} .65px, transparent .65px)`,
"icon-projects": `linear-gradient(145deg,${Colors["icon-projects-start"]},${Colors["icon-projects-end"]})`,
"icon-about": `linear-gradient(145deg,${Colors["icon-about-start"]},${Colors["icon-about-end"]})`,
"icon-career": `linear-gradient(145deg,${Colors["icon-career-start"]},${Colors["icon-career-end"]})`,
"icon-contact": `linear-gradient(145deg,${Colors["icon-contact-start"]},${Colors["icon-contact-end"]})`,
"projects-wallpaper": `radial-gradient(circle at 80% 20%, ${Colors["projects-glow"]}, transparent 50%)`
},
boxShadow: {
"elevation-hero-action": `0 12px 28px ${Colors["accent-shadow"]}`,
"elevation-desktop-icon": `0 12px 20px ${Colors["shadow-soft"]}, inset 0 1px ${Colors["glass-highlight"]}`,
"elevation-app-window": `0 32px 65px ${Colors["shadow-deep"]}, 0 2px 8px ${Colors["shadow-medium"]}`,
"elevation-dock": `0 12px 32px ${Colors["shadow-medium"]}`,
"elevation-desktop-icons": `0 6px 18px ${Colors["tooltip-shadow"]}`
},
      "backgroundSize": {
        "desktop-grid": "22px 22px"
      },
      "zIndex": {
        "1": "1",
        "10": "10",
        "100": "100",
        "101": "101"
      },
      "width": {
        "terminal": "min(530px, 45vw)",
        "projects-window": "min(690px, 68vw)",
        "content-window": "min(560px, 60vw)",
        "window-mobile": "calc(100vw - 24px)",
        "terminal-compact": "54vw",
        "workspace-track": "200%"
      },
      "height": {
        "workspace": "calc(100dvh - 48px)",
        "projects-window": "min(650px, calc(100vh - 160px))",
        "content-window": "min(620px, calc(100vh - 160px))",
        "workspace-mobile": "calc(100dvh - 44px)",
        "window-mobile": "calc(100dvh - 92px)",
        "terminal-mobile": "min(440px,calc(100dvh - 92px))"
      },
      "maxWidth": {
        "tooltip": "140px",
        "hero": "600px",
        "projects-heading": "760px",
        "hero-copy": "390px",
        "content-copy": "470px",
        "project-copy": "550px",
        "contact": "370px",
        "project-summary": "570px",
        "hero-copy-mobile": "330px",
        "recovery": "820px",
        "recovery-copy": "560px"
      },
      "maxHeight": {
        "window-limit": "calc(100vh - 165px)"
      },
      "minWidth": {
        "terminal": "min(530px, 45vw)",
        "projects-window": "min(690px, 68vw)",
        "content-window": "min(560px, 60vw)",
        "viewport-54vw": "54vw",
        "window-mobile": "calc(100vw - 24px)",
        "space-track-width": "200%"
      },
      "minHeight": {
        "workspace": "calc(100dvh - 48px)",
        "projects-window": "min(650px, calc(100vh - 160px))",
        "content-window": "min(620px, calc(100vh - 160px))",
        "workspace-mobile": "calc(100dvh - 44px)",
        "window-mobile": "calc(100dvh - 92px)",
        "terminal-mobile": "min(440px,calc(100dvh - 92px))"
      },
      "fontFamily": {
        "sans": [
          "DM Sans",
          "sans-serif"
        ],
        "mono": [
          "DM Mono",
          "monospace"
        ],
        "display": [
          "Space Grotesk",
          "sans-serif"
        ]
      },
      "fontSize": {
        "type-xs": "12px",
        "type-sm": "14px",
        "type-mark": "19px",
        "type-label": "11px",
        "type-base": "16px",
        "type-small": "13px",
        "type-caption": "10px",
        "type-window": "42px",
        "type-card": "32px",
        "type-body": "17px",
        "type-contact": "55px",
        "type-tiny": "9px",
        "type-window-mobile": "37px",
        "type-card-mobile": "28px",
        "type-about-mobile": "34px",
        "type-hero-narrow": "49px",
        "type-hero": "clamp(58px, 7vw, 108px)",
        "type-projects-heading": "clamp(34px, 4vw, 58px)",
        "type-project-heading": "clamp(25px, 3vw, 38px)",
        "type-hero-compact": "clamp(53px,8vw,80px)",
        "type-hero-mobile": "clamp(52px,13vw,74px)",
        "type-recovery-face": "clamp(90px,13vw,150px)",
        "type-recovery-heading": "clamp(32px,5vw,60px)"
      },
      "lineHeight": {
        "natural": "normal",
        "hero": ".98",
        "terminal-body": "1.75",
        "project-card": "1.5",
        "body-relaxed": "1.7",
        "heading": "1.06",
        "content": "1.55",
        "body": "1.6",
        "recovery": "1.65",
        "recovery-heading": "1.12"
      },
      "letterSpacing": {
        "eyebrow": ".1em",
        "hero": "-.075em",
        "terminal-intro": ".04em",
        "window-content": "-.055em",
        "portfolio-index-number": ".07em",
        "portfolio-index-card": "-.045em",
        "recovery": ".12em",
        "recovery-heading": "-.04em"
      },
      "opacity": {
        "0": "0",
        "35": ".35",
        "60": ".6",
        "80": ".8",
        "100": "1"
      },
      "backdropBlur": {
        "menubar": "18px",
        "dock": "20px"
      },
      "borderRadius": {
        "hero-action": "8px",
        "desktop-icon": "16px",
        "app-window": "13px",
        "project-card": "9px",
        "tag-list": "20px",
        "about-heading": "26px",
        "contact-link": "7px",
        "dock": "17px",
        "dock-button": "11px",
        "tooltip": "6px",
        "desktop-icon-mobile": "14px"
      },
      "flex": {
        "window-bar": "0 0 39px",
        "terminal-body": "1",
        "project-tabs": "0 0 auto",
        "space-track": "0 0 50%"
      },
      "gridTemplateColumns": {
        "desktop-apps": "repeat(2, 88px)",
        "desktop-apps-mobile": "repeat(4,1fr)",
        "projects": "repeat(2, minmax(0, 1fr))",
        "projects-mobile": "1fr"
      },
      "screens": {
        "compact": {
          "raw": "(max-width: 1000px)"
        },
        "mobile": {
          "raw": "(max-width: 760px)"
        },
        "narrow": {
          "raw": "(max-width: 390px)"
        },
        "can-hover": {
          "raw": "(hover: hover)"
        }
      },
      "outlineWidth": {
        "3": "3px"
      },
      "outlineOffset": {
        "5": "5px"
      }
    }
  },
  "darkMode": "class",
  plugins: [function ({ addUtilities }) {
    addUtilities({
      ...Object.fromEntries(Object.entries(TextShadows).map(([name,value]) => [`.text-shadow-${name}`, { textShadow: value }])),
      ...Object.fromEntries(Object.entries(Transitions).map(([name,value]) => [`.transition-${name}`, { transition: value }])),
      '.wrap-anywhere': { overflowWrap: 'anywhere' },
      '.font-inherit': { font: 'inherit' },
      '.outline-reset': { outline: 'none', outlineOffset: '0px' },
    });
  }]
};

module.exports = Config;
