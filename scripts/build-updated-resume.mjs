import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { PDFDocument, PDFName, PDFString } from 'pdf-lib';

async function buildAndAnnotate() {
  const htmlPath = path.resolve('scripts/resume_template.html');
  const tempPdfPath = path.resolve('scripts/temp_chrome.pdf');
  const publicPdf = path.resolve('public/Vasanthaganesh_R_Resume.pdf');
  const outPdf = path.resolve('out/Vasanthaganesh_R_Resume.pdf');

  console.log('Rendering HTML to PDF via Chrome headless...');
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const cmd = `"${chromePath}" --headless=new --disable-gpu --print-to-pdf="${tempPdfPath}" --no-pdf-header-footer "file:///${htmlPath.replace(/\\/g, '/')}"`;
  execSync(cmd, { stdio: 'ignore' });

  const rawBytes = fs.readFileSync(tempPdfPath);
  const doc = await PDFDocument.load(rawBytes);
  console.log(`Page count from Chrome: ${doc.getPageCount()}`);

  const page1 = doc.getPage(0);
  const page2 = doc.getPage(1);

  // Helper to add link annotation
  function addLink(page, rect, uri) {
    const annot = doc.context.obj({
      Type: 'Annot',
      Subtype: 'Link',
      Rect: rect,
      Border: [0, 0, 0],
      C: [0, 0, 0],
      A: {
        Type: 'Action',
        S: 'URI',
        URI: PDFString.of(uri),
      },
    });
    const annotRef = doc.context.register(annot);
    let annots = page.node.get(PDFName.of('Annots'));
    if (!annots) {
      annots = doc.context.obj([]);
      page.node.set(PDFName.of('Annots'), annots);
    }
    annots.push(annotRef);
  }

  // Page 1 Contact Header Links
  addLink(page1, [44, 696, 138, 712], 'tel:+917871029435');
  addLink(page1, [144, 696, 292, 712], 'mailto:vasanthaganesh11@gmail.com');
  addLink(page1, [386, 696, 436, 712], 'https://vasanthaganesh-portfolio-2026.vercel.app');
  addLink(page1, [442, 696, 488, 712], 'https://www.linkedin.com/in/vasanthaganesh-raja-085124231');
  addLink(page1, [494, 696, 532, 712], 'https://github.com/vasanthaganesh');
  addLink(page1, [538, 696, 582, 712], 'https://t.me/VasanthaganeshRaja');

  // Page 2 Project Links
  addLink(page2, [350, 725, 578, 742], 'https://github.com/vasanthaganesh/AI-Reflection-Journal');
  addLink(page2, [420, 670, 578, 687], 'https://github.com/vasanthaganesh/AI_Companion');

  const finalBytes = await doc.save({ useObjectStreams: false });
  fs.writeFileSync(publicPdf, finalBytes);
  if (fs.existsSync('out')) {
    fs.writeFileSync(outPdf, finalBytes);
  }
  fs.unlinkSync(tempPdfPath);

  const kb = (finalBytes.length / 1024).toFixed(1);
  console.log(`[SUCCESS] Generated ${publicPdf} (${kb} KB, 2 pages, 8 interactive links)`);
}

buildAndAnnotate().catch(err => {
  console.error(err);
  process.exit(1);
});
