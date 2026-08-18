import { createSlackClient, getSlackChannelId } from './lib/slack-client.mjs';

const client = createSlackClient();
await client.chat.postMessage({
  channel: getSlackChannelId(),
  text: process.argv[2],
});
console.log('Slack 텍스트 전송 완료');
