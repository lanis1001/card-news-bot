import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const client = new WebClient(process.env.SLACK_BOT_TOKEN);
const channel = process.env.SLACK_CHANNEL_ID;

const [filesJson, caption] = [process.argv[2], process.argv[3] || ''];
const files = JSON.parse(filesJson);

const uploads = files.map((f) => ({
  file: fs.createReadStream(f),
  filename: f.split('/').pop(),
}));

await client.filesUploadV2({
  channel_id: channel,
  initial_comment: caption,
  file_uploads: uploads,
});

console.log('Slack 업로드 완료:', files.length, '장');
