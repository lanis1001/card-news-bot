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

export function renderCardHtml(template, slide) {
  return PLACEHOLDERS.reduce((html, [token, key]) => html.replace(token, slide[key] ?? ''), template);
}
