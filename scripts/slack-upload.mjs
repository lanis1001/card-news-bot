import fs from 'fs';
import { createSlackClient, getSlackChannelId } from './lib/slack-client.mjs';

const client = createSlackClient();
const channel = getSlackChannelId();

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
