import sharp from "sharp";
import fs from "fs-extra";
import path from "path";

const input = process.argv[2];
const outputDir = "./frontend/public/icons";

if (!input) {
  console.error("Debes indicar la imagen base: node generate-icons.js logo_1.png");
  process.exit(1);
}

const sizes = [32, 72, 96, 128, 144, 152,180, 192, 384, 512];

async function generate() {
  await fs.ensureDir(outputDir);

  for (const size of sizes) {
    await sharp(input)
      .resize(size, size)
      .png()
      .toFile(path.join(outputDir, `icon-${size}.png`));
  }

  console.log("✅ Iconos PWA generados correctamente");
}

generate();
