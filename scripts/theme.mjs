import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PaletteIds } from "../theme/constants.mjs";

const ProjectRoot = fileURLToPath(new URL("../", import.meta.url));
const BrandFiles = [
  "helio-os-symbol.svg",
  "helio-os-wordmark.svg",
  "helio-os-logo.svg",
  "helio-os-logo-stacked.svg",
  "helio-os-logo-on-light.svg",
];
const AssetFiles = [
  "favicon.svg",
  "favicon.ico",
  ...BrandFiles.map((name) => `brand/${name}`),
];

function main() {
  const palette = process.argv[2];
  const isKnownPalette = Object.values(PaletteIds).includes(palette);
  if (!isKnownPalette) {
    console.error("Use npm run theme:green ou npm run theme:purple.");
    process.exitCode = 1;
    return;
  }
  for (const name of AssetFiles) {
    const source = path.join(ProjectRoot, "theme", "assets", palette, name);
    const destination = path.join(ProjectRoot, "public", name);
    fs.copyFileSync(source, destination);
  }
  fs.writeFileSync(
    path.join(ProjectRoot, "theme.config.json"),
    `${JSON.stringify({ palette }, null, 2)}\n`,
  );
  const now = new Date();
  fs.utimesSync(path.join(ProjectRoot, "tailwind.config.js"), now, now);
  console.log(
    `Paleta ${palette} aplicada: interface, logo e favicon sincronizados.`,
  );
}

main();
