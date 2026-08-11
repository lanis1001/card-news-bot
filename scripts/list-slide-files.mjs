import fs from 'fs';

// output/slides.json의 장수를 세어 ["output/slide-01.png", ...] 형태로 출력한다.
const slides = JSON.parse(fs.readFileSync('output/slides.json', 'utf-8'));
const files = slides.map((_, i) => `output/slide-${String(i + 1).padStart(2, '0')}.png`);
console.log(JSON.stringify(files));
