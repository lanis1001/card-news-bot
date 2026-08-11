# LÉTRA 봇을 무료 클라우드 서버에 상시 가동하기

컴퓨터를 켜두지 않아도, 슬랙에서 봇을 멘션하면 24시간 언제나 카드뉴스를 만들어주는 방식이에요.
한 번 설정해두면 그 다음부터는 터미널을 쓸 일이 거의 없어요.

## 왜 이 방식인가

- 완전 무료 (오라클 클라우드 "Always Free" 서버)
- 컴퓨터를 꺼도, 폰만 있어도 슬랙에서 그대로 사용 가능
- Claude 구독을 그대로 재사용해서 추가 API 비용 없음
- 처음 설정만 좀 걸리고, 그 뒤로는 관리할 게 거의 없음

## 전체 순서

1. 오라클 클라우드 계정 만들기 (무료)
2. 무료 서버(인스턴스) 하나 만들기
3. 브라우저로 서버에 접속해서 설치 스크립트 한 줄 실행
4. `.env` 파일 채우고, Claude 로그인 한 번
5. 봇 켜기 (`sudo systemctl enable --now letra-bot`)

이후로는 슬랙에서 `@LÉTRA봇 카드뉴스 만들어줘: ...`처럼 멘션만 하면 끝이에요.

## 나중에 코드가 업데이트됐을 때

서버에 접속해서 아래 3줄만 붙여넣으면 최신 버전으로 갱신돼요.

```bash
cd ~/card-news-bot && git pull && npm install
sudo systemctl restart letra-bot
```

## 봇이 잘 작동하는지 확인하고 싶을 때

```bash
sudo systemctl status letra-bot     # 켜져 있는지 확인
journalctl -u letra-bot -f          # 실시간 로그 보기 (Ctrl+C로 종료)
```

## 봇을 껐다 켜고 싶을 때

```bash
sudo systemctl restart letra-bot
```

## 문제가 생겼을 때

`journalctl -u letra-bot -n 50`으로 최근 로그 50줄을 보고, 에러 메시지를 그대로 복사해서 물어보면 돼요.
