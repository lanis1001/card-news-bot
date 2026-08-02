import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

// slides.json 형식: [{ eyebrow, headline, body, footer }, ...]
const slidesPath = process.argv[2] || 'output/slides.json';
const slides = JSON.parse(fs.readFileSync(slidesPath, 'utf-8'));
const template = fs.readFileSync('templates/card-template.html', 'utf-8');

const outDir = 'output';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });

const files = [];
for (let i = 0; i < slides.length; i++) {
  const s = slides[i];
  let html = template
    .replace('{{EYEBROW}}', s.eyebrow ?? '')
    .replace('{{HEADLINE}}', s.headline ?? '')
    .replace('{{BODY}}', s.body ?? '')
    .replace('{{FOOTER}}', s.footer ?? '');
  await page.setContent(html);
  const filePath = path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
  await page.screenshot({ path: filePath });
  files.push(filePath);
}

await browser.close();
console.log(JSON.stringify(files));
