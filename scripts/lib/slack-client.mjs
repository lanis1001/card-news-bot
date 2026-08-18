import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

export function createSlackClient() {
  return new WebClient(process.env.SLACK_BOT_TOKEN);
}

export function getSlackChannelId() {
  return process.env.SLACK_CHANNEL_ID;
}
