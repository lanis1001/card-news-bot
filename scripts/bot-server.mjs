import pkg from '@slack/bolt';
import dotenv from 'dotenv';
import { spawn } from 'child_process';

const { App } = pkg;
dotenv.config();

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
});

// stdin으로 전달 (Windows에서 인자로 넘기면 한글/특수문자가 깨짐)
function runClaude(prompt) {
  return new Promise((resolve, reject) => {
    const child = spawn('claude', ['-p', '--dangerously-skip-permissions'], {
      cwd: process.cwd(),
      shell: true,
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (d) => (stdout += d));
    child.stderr.on('data', (d) => (stderr += d));

    const timer = setTimeout(() => {
      child.kill();
      reject(new Error('claude 실행이 8분을 넘겨 중단했어요.'));
    }, 8 * 60 * 1000);

    child.on('close', (code) => {
      clearTimeout(timer);
      console.log('--- claude stdout ---');
      console.log(stdout);
      if (stderr) {
        console.log('--- claude stderr ---');
        console.log(stderr);
      }
      if (code === 0) resolve(stdout);
      else reject(new Error(`claude 종료 코드 ${code}`));
    });

    child.stdin.write(prompt);
    child.stdin.end();
  });
}

app.event('app_mention', async ({ event, say }) => {
  const mentionText = event.text.replace(/<@[^>]+>/, '').trim();

  if (!mentionText) {
    await say({
      text: '뉴스 발췌문을 함께 적어주세요. 예) @LÉTRA봇 카드뉴스 만들어줘: "..."',
      thread_ts: event.ts,
    });
    return;
  }

  await say({ text: '카드뉴스 만드는 중이에요, 잠시만 기다려주세요...', thread_ts: event.ts });

  const prompt = mentionText.includes('쓰레드')
    ? `CLAUDE.md의 쓰레드 문체 가이드에 맞춰 다음 주제로 150자 내외 쓰레드 문구를 3개 만들고, 각각을 node scripts/slack-text.mjs '<문구>'로 Slack #sns 채널에 전송해줘: ${mentionText}`
    : `card-news 스킬을 사용해서 다음 소재로 카드뉴스를 제작하고 Slack에 업로드해줘: ${mentionText}`;

  try {
    await runClaude(prompt);
    await say({ text: '완료했어요! 위 카드뉴스를 확인해주세요.', thread_ts: event.ts });
  } catch (err) {
    await say({ text: `앗, 실패했어요: ${err.message}`, thread_ts: event.ts });
  }
});

await app.start();
console.log('LÉTRA 봇이 실행 중이에요. 슬랙 #sns 채널에서 봇을 멘션해보세요. (종료: Ctrl+C)');
