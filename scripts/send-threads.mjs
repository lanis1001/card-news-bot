import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

// 사용법: node scripts/send-threads.mjs '["문구1","문구2","문구3"]'
dotenv.config();
const client = new WebClient(process.env.SLACK_BOT_TOKEN);
const channel = process.env.SLACK_CHANNEL_ID;

const posts = JSON.parse(process.argv[2]);
for (const text of posts) {
  await client.chat.postMessage({ channel, text });
}
console.log(`쓰레드 문구 ${posts.length}개 전송 완료`);
