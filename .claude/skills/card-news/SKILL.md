---
name: card-news
description: 뉴스 발췌문을 받아 카드뉴스 슬라이드 카피를 만들고, PNG로 변환한 뒤 Slack #sns 채널에 업로드한다. "카드뉴스 만들어줘", "오늘 필사 카드뉴스" 요청에 사용.
---

1. 사용자가 준 뉴스 발췌문/링크를 바탕으로 CLAUDE.md의 슬라이드 구조(7~10장)에 맞춰
   slides.json을 생성한다. 각 항목은 { eyebrow, headline, body, footer, footerRight? } 형태.
   footerRight는 "오늘의 이슈" 슬라이드에만 "출처 · 프로필 링크 참고"로 채우고, 나머지
   슬라이드는 생략한다 (CLAUDE.md "Footer 구조" 참고).
2. slides.json을 output/slides.json에 저장한다.
3. `node scripts/capture.mjs output/slides.json` 실행해 PNG 생성.
4. 생성된 파일 목록과, Slack에 함께 올릴 caption을 준비한다.
   caption은 CLAUDE.md의 "인스타그램 캡션 구조"와 "해시태그 규칙"을 그대로 따른다
   (후킹 한 줄 → 발췌문+출처 → 코멘트 → 참여 유도 질문 → CTA → 해시태그).
5. `node scripts/slack-upload.mjs '<files JSON>' '<caption>'` 실행해 Slack 업로드.
6. 완료 후 몇 장을 업로드했는지 사용자에게 보고한다.
