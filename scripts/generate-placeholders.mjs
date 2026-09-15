/**
 * Regenerates every placeholder image in public/images.
 *
 * Run with `npm run placeholders`. Delete this script once the real key
 * visual, brand logo and project logos have been dropped into public/images
 * with the same file names.
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve(import.meta.dirname, "..");
const imagesDir = path.join(root, "public", "images");
const projectsDir = path.join(imagesDir, "projects");

const NAVY = "#123F6D";
const CREAM = "#fcead4";

const svg = (body, width, height) =>
  `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`;

const wordmark = (color) =>
  svg(
    `<rect width="480" height="120" fill="none"/>
     <text x="0" y="62" font-family="Helvetica, Arial, sans-serif" font-size="54" font-weight="700" letter-spacing="1" fill="${color}">ASSET<tspan font-weight="300">WISE</tspan></text>
     <text x="2" y="96" font-family="Helvetica, Arial, sans-serif" font-size="17" letter-spacing="5.5" fill="${color}" opacity="0.75">LIVING A BETTER TOMORROW</text>`,
    480,
    120,
  );

const keyVisual = svg(
  `<defs>
     <linearGradient id="sky" x1="0" y1="0" x2="1" y2="1">
       <stop offset="0%" stop-color="#1b5c96"/>
       <stop offset="55%" stop-color="#123F6D"/>
       <stop offset="100%" stop-color="#0c2b4a"/>
     </linearGradient>
   </defs>
   <rect width="1920" height="1080" fill="url(#sky)"/>
   <circle cx="1480" cy="300" r="260" fill="${CREAM}" opacity="0.12"/>
   <circle cx="360" cy="880" r="340" fill="${CREAM}" opacity="0.08"/>
   <rect x="1180" y="120" width="520" height="840" rx="28" fill="${CREAM}" opacity="0.16"/>
   <text x="120" y="520" font-family="Helvetica, Arial, sans-serif" font-size="96" font-weight="700" fill="${CREAM}">KEY VISUAL</text>
   <text x="120" y="610" font-family="Helvetica, Arial, sans-serif" font-size="46" letter-spacing="8" fill="${CREAM}" opacity="0.75">PLACEHOLDER 1920 x 1080</text>`,
  1920,
  1080,
);

const happyRetireLockup = svg(
  `<text x="24" y="86" font-family="Helvetica, Arial, sans-serif" font-size="44" font-weight="700" letter-spacing="10" fill="#f6a11f">ASSETWISE</text>
   <text x="18" y="212" font-family="Georgia, serif" font-size="150" font-weight="700" fill="#f6a11f" stroke="#ffffff" stroke-width="5" paint-order="stroke">Happy</text>
   <text x="92" y="352" font-family="Georgia, serif" font-size="150" font-weight="700" fill="#f6a11f" stroke="#ffffff" stroke-width="5" paint-order="stroke">Retire</text>`,
  900,
  400,
);

const mapFallback = svg(
  `<rect width="1600" height="900" fill="#e8f0e4"/>
   <path d="M0 0 H1600 V900 H0 Z" fill="#e8f0e4"/>
   <path d="M1120 0 C1180 240 1060 460 1140 900 L1600 900 L1600 0 Z" fill="#bcd9e8"/>
   <g stroke="#ffffff" stroke-width="14" fill="none">
     <path d="M-20 300 C320 260 520 420 900 360 C1120 330 1260 420 1620 380"/>
     <path d="M240 -20 C280 260 180 520 320 920"/>
     <path d="M760 -20 C800 300 700 560 860 920"/>
   </g>
   <g fill="${NAVY}" opacity="0.82">
     <circle cx="300" cy="280" r="26"/><circle cx="620" cy="400" r="26"/>
     <circle cx="880" cy="250" r="26"/><circle cx="700" cy="640" r="26"/>
     <circle cx="1080" cy="520" r="26"/><circle cx="1320" cy="700" r="26"/>
   </g>
   <text x="80" y="840" font-family="Helvetica, Arial, sans-serif" font-size="34" letter-spacing="4" fill="${NAVY}" opacity="0.6">STATIC MAP PLACEHOLDER</text>`,
  1600,
  900,
);

const ogImage = svg(
  `<rect width="1200" height="630" fill="${NAVY}"/>
   <circle cx="1040" cy="120" r="200" fill="${CREAM}" opacity="0.12"/>
   <text x="80" y="290" font-family="Georgia, serif" font-size="92" font-weight="700" fill="${CREAM}">Happy Retire</text>
   <text x="84" y="360" font-family="Helvetica, Arial, sans-serif" font-size="34" letter-spacing="6" fill="#ffffff" opacity="0.8">ASSETWISE</text>
   <text x="84" y="440" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#ffffff" opacity="0.6">OG IMAGE PLACEHOLDER 1200 x 630</text>`,
  1200,
  630,
);

const projectLogo = (initials) =>
  svg(
    `<rect width="256" height="256" rx="48" fill="${NAVY}"/>
     <rect x="14" y="14" width="228" height="228" rx="38" fill="none" stroke="${CREAM}" stroke-width="5" opacity="0.5"/>
     <text x="128" y="152" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="88" font-weight="700" letter-spacing="2" fill="${CREAM}">${initials}</text>`,
    256,
    256,
  );

const projectLogos = {
  "atmoz-rangsit": "AR",
  "kave-donmueang": "KD",
  "modiz-ratchada": "MR",
  "atmoz-ladprao": "AL",
  "kave-ladkrabang": "KL",
  "atmoz-minburi": "AM",
  "modiz-sukhumvit": "MS",
  "atmoz-bangna": "AB",
  "kave-salaya": "KS",
  "atmoz-sriracha": "AS",
};

async function png(source, file) {
  await writeFile(file, await sharp(Buffer.from(source)).png().toBuffer());
}

async function jpg(source, file) {
  await writeFile(file, await sharp(Buffer.from(source)).jpeg({ quality: 82 }).toBuffer());
}

await mkdir(projectsDir, { recursive: true });

await png(wordmark(NAVY), path.join(imagesDir, "logo-assetwise.png"));
await png(wordmark("#FFFFFF"), path.join(imagesDir, "logo-assetwise-white.png"));
await png(happyRetireLockup, path.join(imagesDir, "hero-happy-retire.png"));
await jpg(keyVisual, path.join(imagesDir, "hero-key-visual.jpg"));
await jpg(mapFallback, path.join(imagesDir, "map-fallback.jpg"));
await jpg(ogImage, path.join(imagesDir, "og-image.jpg"));

for (const [slug, initials] of Object.entries(projectLogos)) {
  await png(projectLogo(initials), path.join(projectsDir, `${slug}.png`));
}

console.log("placeholder images written to public/images");
