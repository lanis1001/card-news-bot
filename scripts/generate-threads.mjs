import Anthropic from '@anthropic-ai/sdk';
import fs from 'fs';

// 사용법: node scripts/generate-threads.mjs "주제"
// CLAUDE.md의 쓰레드 문체 가이드를 따라 150자 내외 문구 3개를 생성해 콘솔에 JSON으로 출력한다.

const topic = process.argv[2];
if (!topic) {
  console.error('사용법: node scripts/generate-threads.mjs "주제"');
  process.exit(1);
}

const claudeMd = fs.readFileSync('CLAUDE.md', 'utf-8');
const client = new Anthropic();

const schema = {
  type: 'object',
  properties: {
    posts: {
      type: 'array',
      items: { type: 'string' },
    },
  },
  required: ['posts'],
  additionalProperties: false,
};

const prompt = `${claudeMd}

위 가이드의 "쓰레드 문구" 톤 규칙을 따라서 다음 주제로 150자 내외 쓰레드 문구를 3개 만들어줘.

주제: ${topic}`;

const response = await client.messages.create({
  model: 'claude-opus-5',
  max_tokens: 2048,
  output_config: { format: { type: 'json_schema', schema } },
  messages: [{ role: 'user', content: prompt }],
});

const textBlock = response.content.find((b) => b.type === 'text');
if (!textBlock) {
  console.error('응답에 텍스트가 없어요:', JSON.stringify(response, null, 2));
  process.exit(1);
}

const result = JSON.parse(textBlock.text);
console.log(JSON.stringify(result.posts));
