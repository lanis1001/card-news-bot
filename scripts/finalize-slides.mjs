import fs from 'fs';

// 마지막 슬라이드는 항상 같은 문구를 쓴다 (통일성 유지 목적).
// AI가 생성한 마지막 슬라이드 문구가 매번 달라지는 걸 막기 위해, capture.mjs 실행 전에
// 이 스크립트로 강제 고정한다. 사용법: node scripts/finalize-slides.mjs [output/slides.json]

const path = process.argv[2] || 'output/slides.json';
const slides = JSON.parse(fs.readFileSync(path, 'utf-8'));

if (slides.length === 0) {
  console.error('slides.json이 비어있어요.');
  process.exit(1);
}

slides[slides.length - 1] = {
  eyebrow: 'LÉTRA',
  headline: '다음 주에 또 써요',
  body: '저장해두고, 오늘 문장 하나 옮겨 적어보세요.',
  footer: '팔로우 · 저장 · @LÉTRA',
  footerRight: '',
};

fs.writeFileSync(path, JSON.stringify(slides, null, 2));
console.log('마지막 슬라이드 고정 문구 적용 완료');
