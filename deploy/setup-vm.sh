#!/bin/bash
# LÉTRA 카드뉴스 봇을 무료 클라우드 서버(Ubuntu)에 처음 설치할 때 한 번만 실행하는 스크립트.
# 사용법: 서버에 접속한 상태에서 아래 한 줄을 붙여넣으면 됨
#   curl -fsSL https://raw.githubusercontent.com/lanis1001/card-news-bot/master/deploy/setup-vm.sh | bash

set -e

echo "1/6 시스템 업데이트..."
sudo apt-get update -y

echo "2/6 Node.js 20 설치..."
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

echo "3/6 Playwright(Chromium) 실행에 필요한 시스템 패키지 설치..."
sudo npx -y playwright install-deps chromium

echo "4/6 Claude Code CLI 설치..."
sudo npm install -g @anthropic-ai/claude-code

echo "5/6 저장소 내려받기..."
if [ ! -d "$HOME/card-news-bot" ]; then
  git clone https://github.com/lanis1001/card-news-bot.git "$HOME/card-news-bot"
fi
cd "$HOME/card-news-bot"
npm install
npx playwright install chromium

echo "6/6 자동 재시작 서비스 등록..."
sudo tee /etc/systemd/system/letra-bot.service > /dev/null <<EOF
[Unit]
Description=LETRA card-news Slack bot
After=network.target

[Service]
Type=simple
WorkingDirectory=$HOME/card-news-bot
ExecStart=/usr/bin/node scripts/bot-server.mjs
Restart=always
RestartSec=5
User=$USER
EnvironmentFile=$HOME/card-news-bot/.env

[Install]
WantedBy=multi-user.target
EOF
sudo systemctl daemon-reload

echo ""
echo "=========================================="
echo "설치 완료! 아직 남은 것 두 가지:"
echo ""
echo "1) .env 파일 만들기:"
echo "   nano ~/card-news-bot/.env"
echo "   아래 내용을 채워넣고 저장(Ctrl+O, Enter, Ctrl+X):"
echo "   SLACK_BOT_TOKEN=xoxb-..."
echo "   SLACK_APP_TOKEN=xapp-..."
echo "   SLACK_CHANNEL_ID=C0BMEA3MBGE"
echo ""
echo "2) Claude Code 로그인:"
echo "   claude"
echo "   화면에 뜨는 링크를 폰이나 컴퓨터 브라우저로 열어서 로그인"
echo ""
echo "둘 다 끝나면 아래 명령으로 봇을 켜세요:"
echo "   sudo systemctl enable --now letra-bot"
echo "   sudo systemctl status letra-bot   (정상 작동 확인)"
echo "=========================================="
