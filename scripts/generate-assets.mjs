import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PDFDocument, PDFName, PDFString } from "pdf-lib";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const OUT_DIR = path.join(ROOT, "out");

// 1. Generate OG Image (1200 x 630)
async function generateOgImage() {
  const width = 1200;
  const height = 630;

  const svg = `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="35%" r="75%">
      <stop offset="0%" stop-color="#141824" />
      <stop offset="55%" stop-color="#080a10" />
      <stop offset="100%" stop-color="#030407" />
    </radialGradient>
    <linearGradient id="redGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#ff453a" />
      <stop offset="100%" stop-color="#ff2d55" />
    </linearGradient>
    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#222634" stop-opacity="0" />
      <stop offset="25%" stop-color="#363c4e" stop-opacity="0.8" />
      <stop offset="75%" stop-color="#363c4e" stop-opacity="0.8" />
      <stop offset="100%" stop-color="#222634" stop-opacity="0" />
    </linearGradient>
    <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ffffff" stroke-width="1" stroke-opacity="0.03" />
    </pattern>
  </defs>

  <!-- Background -->
  <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
  <rect width="${width}" height="${height}" fill="url(#grid)" />

  <!-- Outer cinematic border -->
  <rect x="28" y="28" width="1144" height="574" rx="16" fill="none" stroke="#222736" stroke-width="1.5" />

  <!-- Top bar -->
  <g transform="translate(64, 64)">
    <!-- VG Monogram Badge -->
    <rect x="0" y="0" width="46" height="46" rx="10" fill="#0d1017" stroke="#2e3547" stroke-width="1.5" />
    <text x="23" y="30" font-family="system-ui, -apple-system, sans-serif" font-size="19" font-weight="900" fill="#f3f2ea" text-anchor="middle" letter-spacing="-0.5">VG</text>
    <circle cx="44" cy="2" r="4.5" fill="url(#redGrad)" />

    <text x="64" y="22" font-family="system-ui, -apple-system, monospace" font-size="12" font-weight="700" fill="#8e96aa" letter-spacing="2.5">VASANTHAGANESH R · PORTFOLIO 2026</text>
    <text x="64" y="40" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="500" fill="#586074" letter-spacing="1">PUDUCHERRY, INDIA · AVAILABLE GLOBALLY</text>
  </g>

  <!-- Status tag top right -->
  <g transform="translate(936, 68)">
    <rect x="0" y="0" width="200" height="34" rx="17" fill="#ff2d55" fill-opacity="0.12" stroke="#ff2d55" stroke-width="1" stroke-opacity="0.4" />
    <circle cx="20" cy="17" r="4.5" fill="#ff3b30" />
    <text x="34" y="22" font-family="system-ui, -apple-system, monospace" font-size="10.5" font-weight="700" fill="#ff5470" letter-spacing="1.5">OPEN TO RELOCATION</text>
  </g>

  <!-- Horizontal divider -->
  <line x1="64" y1="134" x2="1136" y2="134" stroke="url(#lineGrad)" stroke-width="1" />

  <!-- Main Headline Block -->
  <g transform="translate(64, 185)">
    <text x="0" y="24" font-family="system-ui, -apple-system, monospace" font-size="12" font-weight="700" fill="#ff3b30" letter-spacing="3.5">ENTERPRISE BACKEND ARCHITECTURE</text>
    <text x="0" y="94" font-family="system-ui, -apple-system, sans-serif" font-size="62" font-weight="900" fill="#f3f2ea" letter-spacing="-1.5">VASANTHAGANESH R</text>
    <text x="0" y="146" font-family="system-ui, -apple-system, sans-serif" font-size="24" font-weight="400" fill="#9da6be" letter-spacing="-0.3">
      Backend Java Engineer · Enterprise Microservices &amp; Scalable Systems
    </text>
    <text x="0" y="184" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="400" fill="#6f778d">
      Core Java (8/17) · Spring Boot · Microservices · PostgreSQL · Hibernate/JPA · Distributed Systems
    </text>
  </g>

  <!-- Badges / Pillars -->
  <g transform="translate(64, 424)">
    <!-- Card 1 -->
    <rect x="0" y="0" width="340" height="84" rx="10" fill="#0b0e15" stroke="#232838" stroke-width="1.2" />
    <text x="22" y="28" font-family="system-ui, -apple-system, monospace" font-size="10" font-weight="700" fill="#ff453a" letter-spacing="1.5">FLAGSHIP CREDENTIAL</text>
    <text x="22" y="54" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#f3f2ea">Oracle Certified Java (OCA)</text>
    <text x="22" y="72" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="400" fill="#6f778d">Java SE 8 Programmer · Concurrency</text>

    <!-- Card 2 -->
    <rect x="366" y="0" width="340" height="84" rx="10" fill="#0b0e15" stroke="#232838" stroke-width="1.2" />
    <text x="388" y="28" font-family="system-ui, -apple-system, monospace" font-size="10" font-weight="700" fill="#64d2ff" letter-spacing="1.5">ENTERPRISE EXPERIENCE</text>
    <text x="388" y="54" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#f3f2ea">Virtusa (Citi Client Platform)</text>
    <text x="388" y="72" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="400" fill="#6f778d">Spring Boot Microservices · REST APIs</text>

    <!-- Card 3 -->
    <rect x="732" y="0" width="340" height="84" rx="10" fill="#0b0e15" stroke="#232838" stroke-width="1.2" />
    <text x="754" y="28" font-family="system-ui, -apple-system, monospace" font-size="10" font-weight="700" fill="#30d158" letter-spacing="1.5">ENGINEERING CADENCE</text>
    <text x="754" y="54" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="700" fill="#f3f2ea">Resilient. Distributed. Precise.</text>
    <text x="754" y="72" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="400" fill="#6f778d">Zero data loss · ACID compliance</text>
  </g>

  <!-- Footer bar -->
  <line x1="64" y1="538" x2="1136" y2="538" stroke="url(#lineGrad)" stroke-width="1" />
  <g transform="translate(64, 570)">
    <text x="0" y="0" font-family="system-ui, -apple-system, monospace" font-size="11.5" font-weight="600" fill="#7a8298" letter-spacing="1">https://vasanthaganesh-portfolio-2026.vercel.app</text>
    <text x="1072" y="0" font-family="system-ui, -apple-system, monospace" font-size="11" font-weight="600" fill="#7a8298" letter-spacing="1" text-anchor="end">CRAFTED FOR SCALE. DEPLOYED WITH INTEGRITY.</text>
  </g>
</svg>
`;

  const pngBuffer = await sharp(Buffer.from(svg))
    .png({ palette: false, compressionLevel: 9 })
    .toBuffer();

  const publicOg = path.join(PUBLIC_DIR, "og-image.png");
  const outOg = path.join(OUT_DIR, "og-image.png");
  fs.writeFileSync(publicOg, pngBuffer);
  fs.writeFileSync(outOg, pngBuffer);
  console.log(`[OG-IMAGE] Generated ${pngBuffer.length} bytes -> ${publicOg} & ${outOg}`);
}

// 2. Generate Favicon ICO
async function generateFaviconIco() {
  const svgPath = path.join(PUBLIC_DIR, "favicon.svg");
  const svgBuf = fs.readFileSync(svgPath);

  const sizes = [16, 32, 48];
  const pngBuffers = [];
  for (const s of sizes) {
    const png = await sharp(svgBuf).resize(s, s).png().toBuffer();
    pngBuffers.push({ size: s, buffer: png });
  }

  // Build standard ICO file containing PNG streams
  const count = pngBuffers.length;
  const headerSize = 6;
  const entrySize = 16;
  let offset = headerSize + count * entrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // icon type (1)
  header.writeUInt16LE(count, 4); // count of images

  const entries = [];
  for (const img of pngBuffers) {
    const entry = Buffer.alloc(entrySize);
    entry.writeUInt8(img.size, 0); // width
    entry.writeUInt8(img.size, 1); // height
    entry.writeUInt8(0, 2); // color palette (0 = no palette)
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // image size
    entry.writeUInt32LE(offset, 12); // image offset
    entries.push(entry);
    offset += img.buffer.length;
  }

  const icoBuffer = Buffer.concat([
    header,
    ...entries,
    ...pngBuffers.map((b) => b.buffer),
  ]);

  const publicFavicon = path.join(PUBLIC_DIR, "favicon.ico");
  const outFavicon = path.join(OUT_DIR, "favicon.ico");
  fs.writeFileSync(publicFavicon, icoBuffer);
  fs.writeFileSync(outFavicon, icoBuffer);
  console.log(`[FAVICON] Generated ${icoBuffer.length} bytes -> ${publicFavicon} & ${outFavicon}`);
}

// 3. Generate robots.txt
function generateRobotsTxt() {
  const content = `User-agent: *
Allow: /

Sitemap: https://vasanthaganesh-portfolio-2026.vercel.app/sitemap.xml
`;
  const publicRobots = path.join(PUBLIC_DIR, "robots.txt");
  const outRobots = path.join(OUT_DIR, "robots.txt");
  fs.writeFileSync(publicRobots, content, "utf-8");
  fs.writeFileSync(outRobots, content, "utf-8");
  console.log(`[ROBOTS] Generated -> ${publicRobots} & ${outRobots}`);
}

// 4. Generate sitemap.xml
function generateSitemapXml() {
  const content = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://vasanthaganesh-portfolio-2026.vercel.app/</loc>
    <lastmod>2026-10-13</lastmod>
    <changefreq>monthly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;
  const publicSitemap = path.join(PUBLIC_DIR, "sitemap.xml");
  const outSitemap = path.join(OUT_DIR, "sitemap.xml");
  fs.writeFileSync(publicSitemap, content, "utf-8");
  fs.writeFileSync(outSitemap, content, "utf-8");
  console.log(`[SITEMAP] Generated -> ${publicSitemap} & ${outSitemap}`);
}

// 5. Annotate Resume PDF with interactive links
async function annotateResumePdf() {
  const publicPdf = path.join(PUBLIC_DIR, "Vasanthaganesh_R_Resume.pdf");
  const outPdf = path.join(OUT_DIR, "Vasanthaganesh_R_Resume.pdf");
  if (!fs.existsSync(publicPdf)) return;

  const buf = fs.readFileSync(publicPdf);
  const doc = await PDFDocument.load(buf);
  const page = doc.getPage(0);

  const links = [
    { rect: [148, 665, 238, 680], uri: "tel:+918220499437" },
    { rect: [240, 665, 385, 680], uri: "mailto:vasanthaganeshraja@gmail.com" },
    { rect: [148, 652, 365, 667], uri: "https://www.linkedin.com/in/vasanthaganesh-raja-085124231" },
    { rect: [148, 639, 315, 654], uri: "https://vasanthaganesh-portfolio-2026.vercel.app" },
    { rect: [318, 639, 440, 654], uri: "https://t.me/VasanthaganeshRaja" },
  ];

  const newAnnots = doc.context.obj([]);
  for (const l of links) {
    const annot = doc.context.obj({
      Type: "Annot",
      Subtype: "Link",
      Rect: l.rect,
      Border: [0, 0, 0],
      C: [0, 0, 0],
      A: {
        Type: "Action",
        S: "URI",
        URI: PDFString.of(l.uri),
      },
    });
    const ref = doc.context.register(annot);
    newAnnots.push(ref);
  }
  page.node.set(PDFName.of("Annots"), newAnnots);

  const updated = await doc.save();
  fs.writeFileSync(publicPdf, updated);
  if (fs.existsSync(OUT_DIR)) {
    fs.writeFileSync(outPdf, updated);
  }
  console.log(`[RESUME PDF] Embedded ${links.length} interactive links (${(updated.length / 1024).toFixed(1)} KB)`);
}

async function main() {
  await generateOgImage();
  await generateFaviconIco();
  generateRobotsTxt();
  generateSitemapXml();
  await annotateResumePdf();
  console.log("All static assets successfully generated!");
}

main().catch((err) => {
  console.error("Asset generation failed:", err);
  process.exit(1);
});
