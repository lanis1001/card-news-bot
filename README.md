# LÉTRA 카드뉴스 자동화 봇

뉴스 발췌문을 넣으면 카드뉴스 이미지를 자동으로 만들어 슬랙에 올려주는 도구예요.

## 무슨 일을 하나요

```
뉴스 발췌문 입력
   → Claude가 카드뉴스 슬라이드 카피 7~10장 생성
   → HTML/CSS 템플릿에 텍스트를 넣어 PNG 이미지로 변환
   → 슬랙 #sns 채널에 자동 업로드
   → (사람이 검토 후) 인스타그램/쓰레드에 직접 게시
```

이미지 디자인은 Figma가 아니라 `templates/card-template.html` 파일의 CSS로 고정되어 있어서, 텍스트만 바뀌고 디자인은 항상 일관돼요.

## 사용하는 두 가지 방법

**1. Claude Code 안에서 직접**

```
/card-news 오늘자 OO신문 사설 중 "..." 발췌문
/threads-post 필사가 더 머리에 잘 남는 이유
```

**2. 슬랙에서 봇 멘션으로 (Claude Code를 열 필요 없음)**

터미널에서 `npm run bot` 을 실행해 봇을 켜두면, 슬랙 `#sns` 채널에서 봇을 멘션하는 것만으로 카드뉴스를 만들 수 있어요.

```
@LÉTRA봇 카드뉴스 만들어줘: "오늘 서울 낮 기온이 35도까지 올랐다"
```

컴퓨터를 계속 켜둘 필요 없이, 무료 클라우드 서버에서 24시간 이 봇을 돌리는 방법은 [deploy/README.md](deploy/README.md)를 참고하세요.

## 폴더 구조

```
card-news-bot/
├── .claude/
│   ├── skills/card-news/     # 카드뉴스 제작 스킬 정의
│   └── commands/              # /card-news, /threads-post 슬래시 커맨드
├── templates/
│   └── card-template.html     # 카드 디자인 (여기 CSS만 바꾸면 전체 디자인 변경)
├── scripts/
│   ├── capture.mjs             # slides.json → PNG 변환
│   ├── slack-upload.mjs        # PNG를 슬랙에 업로드
│   ├── slack-text.mjs          # 텍스트만 슬랙에 전송
│   └── bot-server.mjs          # 슬랙 양방향 봇 (Socket Mode)
├── CLAUDE.md                   # 계정 톤/문체 가이드
└── .env                        # 슬랙 토큰 (커밋되지 않음, 직접 만들어야 함)
```

## 처음 설치하는 법

1. Node.js 18+ 설치
2. `npm install` 후 `npx playwright install chromium`
3. [api.slack.com/apps](https://api.slack.com/apps)에서 앱 생성, 아래 Bot Token Scope 추가
   - `chat:write`, `files:write`, `app_mentions:read`, `channels:history`
4. Socket Mode 활성화 → App-Level Token 발급 (`connections:write` scope)
5. Event Subscriptions에서 `app_mention` 이벤트 구독
6. 프로젝트 루트에 `.env` 파일을 만들고 아래 값을 채워넣기

   ```
   SLACK_BOT_TOKEN=xoxb-...
   SLACK_APP_TOKEN=xapp-...
   SLACK_CHANNEL_ID=C0BMEA3MBGE
   ```

7. 봇을 채널에 초대: `/invite @봇이름`

## 주의

- `.env` 파일에는 슬랙 토큰(비밀번호와 같은 값)이 들어있어요. 절대 깃에 올리거나 다른 사람과 공유하지 마세요.
- 슬랙 봇(`bot-server.mjs`)은 멘션을 받으면 `--dangerously-skip-permissions` 옵션으로 Claude Code를 실행해서, 확인 절차 없이 파일 생성/슬랙 업로드를 자동으로 수행해요. 이 프로젝트 폴더 안에서만 동작하도록 만들어졌어요.
