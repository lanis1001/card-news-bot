import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { loadCardTemplate, renderCardHtml } from './lib/card-template.mjs';
import { readSlides } from './lib/slides.mjs';

// 사용법:
//   node scripts/export-figma-svg.mjs                          → 디자인 시스템 예시 카드 1장
//   node scripts/export-figma-svg.mjs output/slides.json        → slides.json의 모든 카드
//   node scripts/export-figma-svg.mjs output/slides.json my-post → 파일명 접두사 지정

const defaultSlide = {
  eyebrow: '오늘의 이슈',
  headline: '청년 실업률, 팬데믹 수준 넘어서다',
  body: '2026년 청년 실업률이 7%대로, 2022년 팬데믹 때(6.8%)를 넘어섰다.',
  footer: '출처 · 중앙일보 보도 참고',
};

const slidesPath = process.argv[2];
const namePrefix = process.argv[3] || (slidesPath ? path.basename(path.dirname(slidesPath)) : 'letra-card-template');
const slides = slidesPath ? readSlides(slidesPath) : [defaultSlide];

const template = loadCardTemplate();
const outDir = 'figma-export';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1350 } });

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

async function exportSlideToSvg(slide) {
  const html = renderCardHtml(template, slide, { includeFooterRight: false });

  await page.setContent(html);
  await page.evaluate(() => document.fonts.ready);

  const data = await page.evaluate(() => {
    function getLines(el) {
      const textNode = [...el.childNodes].find((n) => n.nodeType === 3);
      if (!textNode) return [];
      const text = textNode.textContent;
      const range = document.createRange();
      const lines = [];
      let current = null;
      for (let i = 0; i < text.length; i++) {
        range.setStart(textNode, i);
        range.setEnd(textNode, i + 1);
        const rect = range.getClientRects()[0];
        if (!rect) continue;
        const top = Math.round(rect.top);
        if (!current || Math.abs(top - current.top) > 2) {
          if (current) lines.push(current);
          current = { text: '', left: rect.left, top: rect.top, bottom: rect.bottom };
        }
        current.text += text[i];
        current.left = Math.min(current.left, rect.left);
        current.bottom = Math.max(current.bottom, rect.bottom);
      }
      if (current) lines.push(current);
      return lines;
    }

    function styleOf(el) {
      const cs = getComputedStyle(el);
      return {
        fontFamily: cs.fontFamily.replace(/['"]/g, '').split(',')[0].trim(),
        fontWeight: cs.fontWeight,
        fontSize: parseFloat(cs.fontSize),
        color: cs.color,
        letterSpacing: cs.letterSpacing,
      };
    }

    const card = document.querySelector('.card');
    const cardCs = getComputedStyle(card);
    const result = {
      card: {
        width: card.getBoundingClientRect().width,
        height: card.getBoundingClientRect().height,
        background: cardCs.backgroundColor,
        borderColor: cardCs.borderTopColor,
        borderWidth: parseFloat(cardCs.borderTopWidth),
      },
      blocks: [],
    };

    for (const cls of ['eyebrow', 'headline', 'body', 'footer-left', 'footer-right']) {
      const el = document.querySelector('.' + cls);
      if (!el || !el.textContent.trim()) continue;
      result.blocks.push({ cls, style: styleOf(el), lines: getLines(el) });
    }
    return result;
  });

  const W = data.card.width;
  const H = data.card.height;
  const bw = data.card.borderWidth;

  let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">\n`;
  svg += `  <rect width="${W}" height="${H}" fill="${data.card.borderColor}"/>\n`;
  svg += `  <rect x="${bw}" y="${bw}" width="${W - 2 * bw}" height="${H - 2 * bw}" fill="${data.card.background}"/>\n`;

  for (const block of data.blocks) {
    const { style, lines } = block;
    for (const line of lines) {
      const baselineY = line.bottom - style.fontSize * 0.22;
      svg +=
        `  <text x="${line.left.toFixed(1)}" y="${baselineY.toFixed(1)}" ` +
        `font-family="${style.fontFamily}" font-weight="${style.fontWeight}" ` +
        `font-size="${style.fontSize}" fill="${style.color}" ` +
        `letter-spacing="${style.letterSpacing}">${esc(line.text)}</text>\n`;
    }
  }

  svg += `</svg>\n`;
  return svg;
}

const files = [];
for (let i = 0; i < slides.length; i++) {
  const svg = await exportSlideToSvg(slides[i]);
  const fileName = slides.length > 1 ? `${namePrefix}-${String(i + 1).padStart(2, '0')}.svg` : `${namePrefix}.svg`;
  const filePath = path.join(outDir, fileName);
  fs.writeFileSync(filePath, svg);
  files.push(filePath);
}

await browser.close();
console.log(JSON.stringify(files));
