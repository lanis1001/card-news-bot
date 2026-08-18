import fs from 'fs';

const TEMPLATE_PATH = 'templates/card-template.html';

const PLACEHOLDERS = [
  ['{{EYEBROW}}', 'eyebrow'],
  ['{{HEADLINE}}', 'headline'],
  ['{{BODY}}', 'body'],
  ['{{FOOTER}}', 'footer'],
  ['{{FOOTER_RIGHT}}', 'footerRight'],
];

export function loadCardTemplate() {
  return fs.readFileSync(TEMPLATE_PATH, 'utf-8');
}

// includeFooterRight: false는 export-figma-svg.mjs의 기존 동작(footerRight 미치환)을 그대로 유지하기 위한 옵션.
export function renderCardHtml(template, slide, { includeFooterRight = true } = {}) {
  const placeholders = includeFooterRight
    ? PLACEHOLDERS
    : PLACEHOLDERS.filter(([, key]) => key !== 'footerRight');
  return placeholders.reduce((html, [token, key]) => html.replace(token, slide[key] ?? ''), template);
}
