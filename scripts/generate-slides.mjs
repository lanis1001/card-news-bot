import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

// 사용법: node scripts/generate-slides.mjs "뉴스 발췌문"
// ANTHROPIC_API_KEY 환경변수가 필요함. CLAUDE.md의 톤/구조/저작권 가이드를 그대로 따라
// slides.json + caption.txt를 output/에 생성한다.

const excerpt = process.argv[2];
if (!excerpt) {
  console.error('사용법: node scripts/generate-slides.mjs "뉴스 발췌문"');
  process.exit(1);
}

const claudeMd = fs.readFileSync('CLAUDE.md', 'utf-8');
const client = new Anthropic();

const schema = {
  type: 'object',
  properties: {
    slides: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          eyebrow: { type: 'string' },
          headline: { type: 'string' },
          body: { type: 'string' },
          footer: { type: 'string', description: '항상 "LÉTRA" 또는 마지막 슬라이드는 "팔로우 · 저장 · @LÉTRA"' },
          footerRight: { type: 'string', description: '출처를 표기할 슬라이드에서만 채움. 없으면 빈 문자열.' },
        },
        required: ['eyebrow', 'headline', 'body', 'footer', 'footerRight'],
        additionalProperties: false,
      },
    },
    caption: {
      type: 'string',
      description: '인스타그램 캡션 전체 (후킹 → 발췌 요약 → 코멘트 → 참여 유도 질문 → CTA → 해시태그)',
    },
  },
  required: ['slides', 'caption'],
  additionalProperties: false,
};

const prompt = `${claudeMd}

위 가이드(계정 컨셉, 슬라이드 구조, 문체, 저작권 원칙, 인스타그램 캡션 구조, 해시태그 규칙)를
정확히 따라서 아래 뉴스 발췌문으로 카드뉴스를 만들어줘.

뉴스 발췌문 또는 소재:
${excerpt}

중요: 뉴스 원문 문장을 큰따옴표로 직접 인용하지 말고, 그 안의 통계·사실만 참고해서 저작권 문제를
피해줘. 출처가 있다면 "출처 · OO 보도 참고" 형태로만 표기해.`;

const response = await client.messages.create({
  model: 'claude-opus-5',
  max_tokens: 4096,
  output_config: { format: { type: 'json_schema', schema } },
  messages: [{ role: 'user', content: prompt }],
});

const textBlock = response.content.find((b) => b.type === 'text');
if (!textBlock) {
  console.error('응답에 텍스트가 없어요:', JSON.stringify(response, null, 2));
  process.exit(1);
}

const result = JSON.parse(textBlock.text);

const outDir = 'output';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);

fs.writeFileSync(`${outDir}/slides.json`, JSON.stringify(result.slides, null, 2));
fs.writeFileSync(`${outDir}/caption.txt`, result.caption);

console.log(`슬라이드 ${result.slides.length}장 생성 완료`);
