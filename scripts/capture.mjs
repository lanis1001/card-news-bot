import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { loadCardTemplate, renderCardHtml } from './lib/card-template.mjs';
import { readSlides } from './lib/slides.mjs';

// slides.json: [{ eyebrow, headline, body, footer, footerRight? }]
const slidesPath = process.argv[2] || 'output/slides.json';
const slides = readSlides(slidesPath);
const template = loadCardTemplate();

const outDir = 'output';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });

const files = [];
for (let i = 0; i < slides.length; i++) {
  const slide = slides[i];
  const html = renderCardHtml(template, slide);
  await page.setContent(html);

  const lineCheck = await page.evaluate(() => {
    const el = document.querySelector('.body');
    const lineHeight = parseFloat(getComputedStyle(el).lineHeight);
    return { lines: Math.round(el.scrollHeight / lineHeight), text: el.textContent };
  });
  if (lineCheck.lines > 2) {
    console.warn(`⚠ 슬라이드 ${i + 1}: 본문이 ${lineCheck.lines}줄이에요 (최대 2줄 권장). "${lineCheck.text}"`);
  }

  const filePath = path.join(outDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
  await page.screenshot({ path: filePath });
  files.push(filePath);
}

await browser.close();
console.log(JSON.stringify(files));
