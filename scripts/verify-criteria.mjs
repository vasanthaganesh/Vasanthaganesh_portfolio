import fs from "fs";
import sharp from "sharp";
import { PDFDocument } from "pdf-lib";

async function verifyAll() {
  const checks = [];

  // 1. out/robots.txt
  const robotsExists = fs.existsSync("out/robots.txt");
  const robotsContent = robotsExists ? fs.readFileSync("out/robots.txt", "utf8") : "";
  const robotsHasSitemap = robotsContent.includes("https://vasanthaganesh-portfolio-2026.vercel.app/sitemap.xml");
  checks.push({
    name: "out/robots.txt exists & references sitemap.xml",
    pass: robotsExists && robotsHasSitemap,
    details: robotsContent.trim(),
  });

  // 2. out/sitemap.xml
  const sitemapExists = fs.existsSync("out/sitemap.xml");
  const sitemapContent = sitemapExists ? fs.readFileSync("out/sitemap.xml", "utf8") : "";
  const sitemapHasUrl = sitemapContent.includes("https://vasanthaganesh-portfolio-2026.vercel.app/");
  checks.push({
    name: "out/sitemap.xml exists & contains live URL",
    pass: sitemapExists && sitemapHasUrl,
    details: sitemapContent.trim(),
  });

  // 3. out/favicon.ico
  const favExists = fs.existsSync("out/favicon.ico");
  const favBuf = favExists ? fs.readFileSync("out/favicon.ico") : Buffer.alloc(0);
  const favValid = favBuf.length > 0 && favBuf.readUInt16LE(0) === 0 && favBuf.readUInt16LE(2) === 1;
  checks.push({
    name: "out/favicon.ico exists and is valid ICO",
    pass: favExists && favValid,
    details: `Size: ${favBuf.length} bytes, images: ${favBuf.readUInt16LE(4)}`,
  });

  // 4. out/og-image.png
  const ogExists = fs.existsSync("out/og-image.png");
  let ogMeta = null;
  if (ogExists) {
    ogMeta = await sharp("out/og-image.png").metadata();
  }
  const ogValid = ogExists && ogMeta.width === 1200 && ogMeta.height === 630;
  checks.push({
    name: "out/og-image.png exists with 1200x630 resolution",
    pass: ogValid,
    details: ogMeta ? `${ogMeta.width}x${ogMeta.height} ${ogMeta.format}` : "missing",
  });

  // 5. public/Vasanthaganesh_R_Resume.pdf under 1MB (and under 500KB) with interactive links
  const resumeExists = fs.existsSync("public/Vasanthaganesh_R_Resume.pdf");
  const resumeSize = resumeExists ? fs.statSync("public/Vasanthaganesh_R_Resume.pdf").size : Infinity;
  let pdfAnnotsCount = 0;
  if (resumeExists) {
    try {
      const pdfDoc = await PDFDocument.load(fs.readFileSync("public/Vasanthaganesh_R_Resume.pdf"));
      pdfAnnotsCount = pdfDoc.getPage(0).node.Annots()?.size() || 0;
    } catch (e) {
      pdfAnnotsCount = 0;
    }
  }
  checks.push({
    name: "public/Vasanthaganesh_R_Resume.pdf under 1MB (and under 500KB) with clickable links",
    pass: resumeExists && resumeSize < 500 * 1024 && pdfAnnotsCount >= 5,
    details: `${(resumeSize / 1024).toFixed(1)} KB (target < 500 KB), ${pdfAnnotsCount} interactive link annotations`,
  });

  // 6. out/index.html checks
  const htmlExists = fs.existsSync("out/index.html");
  const html = htmlExists ? fs.readFileSync("out/index.html", "utf8") : "";
  const htmlHasOgImage = html.includes('property="og:image"') && html.includes('https://vasanthaganesh-portfolio-2026.vercel.app/og-image.png');
  const htmlHasOgUrl = html.includes('property="og:url" content="https://vasanthaganesh-portfolio-2026.vercel.app"');
  const htmlHasCanonical = html.includes('rel="canonical" href="https://vasanthaganesh-portfolio-2026.vercel.app"');
  const htmlHasJsonLd = html.includes('"url":"https://vasanthaganesh-portfolio-2026.vercel.app"');

  checks.push({
    name: 'out/index.html contains <meta property="og:image"',
    pass: htmlHasOgImage,
    details: html.match(/<meta property="og:image"[^>]*>/)?.[0] || "not found",
  });
  checks.push({
    name: 'out/index.html contains <meta property="og:url" content="https://vasanthaganesh-portfolio-2026.vercel.app"',
    pass: htmlHasOgUrl,
    details: html.match(/<meta property="og:url"[^>]*>/)?.[0] || "not found",
  });
  checks.push({
    name: 'out/index.html contains <link rel="canonical" href="https://vasanthaganesh-portfolio-2026.vercel.app"',
    pass: htmlHasCanonical,
    details: html.match(/<link rel="canonical"[^>]*>/)?.[0] || "not found",
  });
  checks.push({
    name: 'out/index.html contains JSON-LD url="https://vasanthaganesh-portfolio-2026.vercel.app"',
    pass: htmlHasJsonLd,
    details: "Found JSON-LD matching live domain",
  });

  let allPass = true;
  console.log("\n=======================================================");
  console.log("CRITERIA VERIFICATION RESULTS");
  console.log("=======================================================");
  for (const c of checks) {
    const status = c.pass ? "[PASS]" : "[FAIL]";
    console.log(`${status} ${c.name}`);
    if (c.details) {
      console.log(`       -> ${c.details}`);
    }
    if (!c.pass) allPass = false;
  }
  console.log("=======================================================\n");

  if (!allPass) {
    console.error("Some acceptance criteria failed!");
    process.exit(1);
  } else {
    console.log("ALL ACCEPTANCE CRITERIA PASSED WITH 100% SUCCESS!");
  }
}

verifyAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
