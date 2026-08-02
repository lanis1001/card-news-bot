import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
dotenv.config();
const client = new WebClient(process.env.SLACK_BOT_TOKEN);
await client.chat.postMessage({
  channel: process.env.SLACK_CHANNEL_ID,
  text: process.argv[2],
});
console.log('Slack 텍스트 전송 완료');
