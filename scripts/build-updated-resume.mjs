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

  // Chrome headless generates native link annotations for all HTML <a> tags.
  // We save with useObjectStreams: false to maintain maximum compatibility with all PDF viewers.
  const finalBytes = await doc.save({ useObjectStreams: false });
  fs.writeFileSync(publicPdf, finalBytes);
  if (fs.existsSync('out')) {
    fs.writeFileSync(outPdf, finalBytes);
  }
  fs.unlinkSync(tempPdfPath);

  const kb = (finalBytes.length / 1024).toFixed(1);
  console.log(`[SUCCESS] Generated ${publicPdf} (${kb} KB, 2 pages)`);
}

buildAndAnnotate().catch(err => {
  console.error(err);
  process.exit(1);
});
