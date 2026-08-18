---
name: card-news
description: 뉴스 발췌문을 받아 카드뉴스 슬라이드 카피를 만들고, PNG로 변환한 뒤 Slack #sns 채널에 업로드한다. "카드뉴스 만들어줘", "오늘 필사 카드뉴스" 요청에 사용.
---

1. 사용자가 준 뉴스 발췌문/링크의 언어를 먼저 판단한다 (한국어 / 영어 / 스페인어). 영어·
   스페인어면 CLAUDE.md "외국어 뉴스 지원" 규칙을 적용해 2번 슬라이드를 원문+번역 형태로
   만든다. 그 외에는 기존 방식대로 진행한다. 이후 CLAUDE.md의 슬라이드 구조(7~10장)에 맞춰
   slides.json을 생성한다. 각 항목은 { eyebrow, headline, body, footer, footerRight? } 형태.
   footerRight는 "오늘의 이슈" 슬라이드에만 "출처 · 프로필 링크 참고"로 채우고, 나머지
   슬라이드는 생략한다 (CLAUDE.md "Footer 구조" 참고).
2. slides.json을 output/slides.json에 저장한다.
3. `node scripts/finalize-slides.mjs output/slides.json` 실행해 마지막 슬라이드 문구를
   고정값("다음 주에 또 써요" 등)으로 강제 통일한다. 절대 건너뛰지 않는다.
4. `node scripts/capture.mjs output/slides.json` 실행해 PNG 생성. 이 단계에서 본문이
   2줄을 넘는 슬라이드가 있다는 경고가 뜨면, 그 슬라이드의 body를 더 짧게 줄여서
   slides.json을 고치고 3~4번을 다시 실행한다.
5. 생성된 파일 목록과, Slack에 함께 올릴 caption을 준비한다.
   caption은 CLAUDE.md의 "인스타그램 캡션 구조"와 "해시태그 규칙"을 그대로 따른다
   (후킹 한 줄 → 발췌문+출처 → 코멘트+질문 → CTA → 해시태그).
   그 아래에 CLAUDE.md "댓글 유도 멘트" 규칙에 따라 셀프 댓글 추천 1개를 만들어
   caption 맨 끝에 빈 줄 하나 띄우고 "댓글 추천: <멘트>" 형식으로 덧붙인다.
6. `node scripts/slack-upload.mjs '<files JSON>' '<caption>'` 실행해 Slack 업로드.
7. 완료 후 몇 장을 업로드했는지 사용자에게 보고한다.
