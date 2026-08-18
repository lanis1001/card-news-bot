import fs from 'fs';

export function readSlides(slidesPath) {
  return JSON.parse(fs.readFileSync(slidesPath, 'utf-8'));
}

export function writeSlides(slidesPath, slides) {
  fs.writeFileSync(slidesPath, JSON.stringify(slides, null, 2));
}
