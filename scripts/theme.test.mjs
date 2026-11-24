import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import test from "node:test";

const ProjectRoot = fileURLToPath(new URL("../", import.meta.url));
const PaletteNames = ["green", "purple"];

function fixture() {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "hpn-theme-test-"));
  fs.mkdirSync(path.join(root, "scripts"), { recursive: true });
  fs.mkdirSync(path.join(root, "public", "brand"), { recursive: true });
  fs.cpSync(path.join(ProjectRoot, "theme"), path.join(root, "theme"), {
    recursive: true,
  });
  fs.copyFileSync(
    path.join(ProjectRoot, "scripts", "theme.mjs"),
    path.join(root, "scripts", "theme.mjs"),
  );
  fs.writeFileSync(path.join(root, "tailwind.config.js"), "// fixture\n");
  fs.writeFileSync(
    path.join(root, "theme.config.json"),
    '{"palette":"purple"}\n',
  );
  return root;
}

function run(root, name) {
  return spawnSync(
    process.execPath,
    [path.join(root, "scripts", "theme.mjs"), name],
    { encoding: "utf8" },
  );
}

for (const name of PaletteNames) {
  test(`switching to ${name} synchronizes config, logo and favicon without touching unrelated files`, () => {
    const root = fixture();
    try {
      fs.writeFileSync(path.join(root, "public", "keep.txt"), "keep");
      const result = run(root, name);
      assert.equal(result.status, 0, result.stderr);
      assert.equal(
        JSON.parse(fs.readFileSync(path.join(root, "theme.config.json")))
          .palette,
        name,
      );
      const files = [
        "favicon.ico",
        "favicon.svg",
        ...fs
          .readdirSync(path.join(root, "theme", "assets", name, "brand"))
          .map((file) => `brand/${file}`),
      ];
      for (const file of files)
        assert.deepEqual(
          fs.readFileSync(path.join(root, "public", file)),
          fs.readFileSync(path.join(root, "theme", "assets", name, file)),
        );
      assert.equal(
        fs.readFileSync(path.join(root, "public", "keep.txt"), "utf8"),
        "keep",
      );
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
}

test("unknown or unsafe palette does not modify files", () => {
  const root = fixture();
  try {
    const before = fs.readFileSync(path.join(root, "theme.config.json"));
    for (const name of ["unknown", "../../outside"]) {
      assert.equal(run(root, name).status, 1);
      assert.deepEqual(
        fs.readFileSync(path.join(root, "theme.config.json")),
        before,
      );
      assert.deepEqual(fs.readdirSync(path.join(root, "public")), ["brand"]);
    }
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

test("a valid switch recovers an invalid active selection", () => {
  const root = fixture();
  try {
    fs.writeFileSync(
      path.join(root, "theme.config.json"),
      '{"palette":"invalid"}',
    );
    assert.equal(run(root, "green").status, 0);
    assert.equal(
      JSON.parse(fs.readFileSync(path.join(root, "theme.config.json"))).palette,
      "green",
    );
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});

function palette(name) {
  return JSON.parse(
    fs.readFileSync(
      path.join(ProjectRoot, "theme", "palettes", `${name}.json`),
      "utf8",
    ),
  );
}
function luminance(hex) {
  const rgb = [1, 3, 5].map((offset) => {
    const channel = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    const isLow = channel <= 0.04045;
    return isLow ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
  });
  return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
}
function contrast(first, second) {
  const a = luminance(first),
    b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

test("both profiles expose the same complete token set", () => {
  assert.deepEqual(
    Object.keys(palette("green")).sort(),
    Object.keys(palette("purple")).sort(),
  );
});

for (const name of PaletteNames) {
  test(`${name} preserves readable primary text and terminal contrast`, () => {
    const colors = palette(name);
    for (const [foreground, background] of [
      ["foreground", "desktop"],
      ["accent-foreground", "accent"],
      ["window-title", "window-bar"],
      ["body-muted", "window"],
      ["terminal-prompt", "terminal"],
      ["terminal-output", "terminal"],
      ["terminal-title", "terminal-bar"],
    ])
      assert(
        contrast(colors[foreground], colors[background]) >= 4.5,
        `${foreground}/${background}`,
      );
    for (const app of ["projects", "about", "career", "contact"])
      assert(
        contrast(colors[`icon-${app}-foreground`], colors[`icon-${app}-end`]) >=
          3,
        app,
      );
  });
  test(`${name} source identity assets match its colors`, () => {
    const colors = palette(name);
    const symbol = fs.readFileSync(
      path.join(
        ProjectRoot,
        "theme",
        "assets",
        name,
        "brand",
        "helio-os-symbol.svg",
      ),
      "utf8",
    );
    const favicon = fs.readFileSync(
      path.join(ProjectRoot, "theme", "assets", name, "favicon.svg"),
      "utf8",
    );
    assert(symbol.includes(`stroke="${colors.accent}"`));
    assert(favicon.includes(`fill="${colors.desktop}"`));
  });
}
