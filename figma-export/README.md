# LÉTRA 카드뉴스 — Figma용 디자인 시스템 export

## Figma에 넣는 법
1. `letra-card-template.svg` 파일을 Figma 캔버스로 **드래그 앤 드롭**하세요 (또는 파일 열어서 전체 선택 → 복사 → Figma에 붙여넣기).
2. 텍스트(오늘의 이슈/헤드라인/본문/출처)는 각각 **편집 가능한 텍스트 레이어**로 들어와요. 폰트는 'Hahmlet'으로 지정돼 있어서, Figma가 자동으로 구글 폰트에서 찾아 적용해요 (못 찾으면 Figma 폰트 메뉴에서 "Hahmlet" 검색해서 한 번 설치해주세요).
3. 배경/테두리는 사각형 2개(테두리색 배경 + 안쪽 크림색)로 들어와요.

## 디자인 토큰 (템플릿 원본 기준)

| 항목 | 값 |
|---|---|
| 캔버스 크기 | 1080 × 1350px |
| 배경색 | `#f4efe4` (크림) |
| 테두리 | 10px, `#1a1a1a` |
| 본문 글자색 | `#1a1a1a` |
| 폰트 | Hahmlet (구글 폰트) |
| 여백(padding) | 상하 80px, 좌우 70px |

| 텍스트 블록 | 크기 | 굵기 | 자간 | 색상 |
|---|---|---|---|---|
| 오늘의 이슈 (eyebrow) | 26px | 500 | 5px | `#6b5f4a` |
| 헤드라인 | 60px | 600 | -1px | `#1a1a1a` |
| 본문 | 32px | 400 | 기본 | `#1a1a1a` |
| footer 좌 (LÉTRA) | 22px | 500 | 2px | `#1a1a1a` |
| footer 우 (출처, 있을 때만) | 22px | 500 | 2px | `#6b5f4a` |

모든 텍스트 블록에 `word-break: keep-all`을 적용해, 한글 단어가 줄바꿈 시 중간에 잘리지 않아요.

footer는 좌/우로 나뉘어요: 왼쪽엔 항상 "LÉTRA", 오른쪽엔 출처를 표기할 슬라이드에서만
"출처 · 프로필 링크 참고"가 들어가요 (같은 포스트 내 다른 슬라이드에는 중복 표기하지 않음).

디자인을 바꾸려면 `templates/card-template.html`의 CSS만 고치면, 카드뉴스 이미지 생성과 이 Figma export가 항상 같은 값을 참조해요.

## 특정 카드뉴스를 SVG로 뽑고 싶을 때

```
node scripts/export-figma-svg.mjs output/post-2-youth-unemployment/slides.json
```

`output/` 아래 어떤 `slides.json`이든 넣으면, 그 안의 카드 전부를 각각 SVG 파일로 만들어줘요.
