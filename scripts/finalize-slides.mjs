import { readSlides, writeSlides } from './lib/slides.mjs';

// 첫 슬라이드 eyebrow, 마지막 2장 문구 고정 (통일성 유지). 사용법: node scripts/finalize-slides.mjs [output/slides.json]
const slidesPath = process.argv[2] || 'output/slides.json';
const slides = readSlides(slidesPath);

if (slides.length === 0) {
  console.error('slides.json이 비어있어요.');
  process.exit(1);
}

slides[0].eyebrow = '오늘의 필사';

if (slides.length >= 2) {
  slides[slides.length - 2] = {
    eyebrow: '함께 나눠요',
    headline: '당신 생각은 어때요',
    body: '댓글로 편하게 남겨주세요.',
    footer: 'LÉTRA',
    footerRight: '',
  };
}

slides[slides.length - 1] = {
  eyebrow: 'LÉTRA',
  headline: '다음 주에 또 써요',
  body: '저장해두고, 오늘 문장 하나 옮겨 적어보세요.',
  footer: '팔로우 · 저장 · @LÉTRA',
  footerRight: '',
};

writeSlides(slidesPath, slides);
console.log('마지막 슬라이드 고정 문구 적용 완료');
