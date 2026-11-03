/**
 * Genera las versiones WebP del logo a partir del PNG original.
 *
 * - Recorta el margen transparente del original.
 * - Exporta varios anchos para usarlos con srcSet según la pantalla.
 *
 * Uso: pnpm logo
 */
import { mkdir, rm, stat } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const SOURCE = path.join(root, "src/assets/nodepop-logo.png");
const OUTPUT_DIR = path.join(root, "src/assets/brand");

// Cabecera (~110 px de ancho) a 1x/2x/3x, y pie/login (~250 px) a 1x/2x/3x.
const WIDTHS = [128, 256, 384, 512, 768];

await rm(OUTPUT_DIR, { recursive: true, force: true });
await mkdir(OUTPUT_DIR, { recursive: true });

const { data: trimmed, info } = await sharp(SOURCE)
  .trim({ threshold: 1 })
  .toBuffer({ resolveWithObject: true });

console.log(`Original recortado: ${info.width}x${info.height}`);

for (const width of WIDTHS) {
  const file = path.join(OUTPUT_DIR, `nodepop-logo-${width}.webp`);
  const result = await sharp(trimmed)
    .resize({ width })
    .webp({ quality: 82, alphaQuality: 90, effort: 6 })
    .toFile(file);
  const { size } = await stat(file);
  console.log(
    `${path.basename(file)}: ${result.width}x${result.height}, ${(size / 1024).toFixed(1)} KB`,
  );
}
