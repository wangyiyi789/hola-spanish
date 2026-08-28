# ¡Hola! Visual Implementation Inventory

## Active concept references

- `docs/design/concepts/dashboard-desktop-concept.png` — 1584 × 1024 primary desktop specification.
- `docs/design/concepts/lesson-feedback-concept.png` — 1584 × 1024 lesson question and success-feedback states.
- `docs/design/concepts/dashboard-mobile-concept.png` — 852 × 1856 responsive continuation.

## Color lock

The application uses a cream paper background rather than white. Use `#F7F0E3` for the page, `#FBF6EC` for rails and elevated paper, `#D8664B` for the primary action/current state, `#AD4733` for pressed terracotta, `#5E8466` for success/completed state, `#41634A` for pressed moss, `#EFBB54` for rewards, `#3F352D` for ink, `#7D7064` for muted copy, and `#E5DAC6` for borders. No gradients or colored image overlays.

## Typography

- Display: Georgia, `Noto Serif SC`, serif; 700 weight; 1.1–1.28 line height.
- Body and Chinese UI: Inter, `PingFang SC`, `Microsoft YaHei`, sans-serif; 400–800 weights; 1.55 line height.
- Brand: Georgia 800, terracotta on desktop and ink on mobile.
- Desktop title: clamp 38–58 px. Mobile title: 34–42 px.
- Navigation: 15 px / 750. Goal controls: 13 px / 800. Lesson options: 20–28 px display plus 12–14 px UI detail.
- Buttons: 14–16 px / 800; never browser-default typography.

## Container and spacing system

- Desktop shell: left rail 208 px, fluid content, right rail 300 px, full-height open layout separated by 1 px ink-soft rules.
- Main desktop gutter: 32–44 px. Dashboard content max width is determined by the rails; it is not wrapped in a giant floating card.
- Major radius: 18–24 px for chapter and lesson surfaces; controls 10–14 px; route nodes 50% or 18 px depending on state.
- Borders: 1–2 px slightly irregular-looking ink color through CSS color/weight only; no rough SVG placeholder frames.
- Shadow: short hard offset for primary terracotta/moss actions; soft low shadow for paper panels.
- Mobile: 16–20 px gutters, single column, fixed 76 px bottom navigation, content padded below navigation.

## Allowed above-the-fold copy

- `¡Hola!`
- `西班牙语 · 从 0 开始`
- `晚上好，小航`
- `今天，让我们认识 Ñ。`
- `第 1 站 · 字母港`
- `从 A 到 Z，再多一个 Ñ`
- Navigation: `学习路线`, `今日练习`, `单词本`, `学习记录`, `设置`
- Goal labels: `每日学习目标`, `10 分钟`, `20 分钟`, `30 分钟`, `45 分钟`, `60 分钟`
- Daily plan and streak labels recorded in the product spec.

No extra hero eyebrow, proof badge, marketing CTA, or product claim is allowed.

## Icon inventory

Use Lucide outline icons at 1.8–2 px stroke unless the concept uses a filled semantic symbol.

- Map: learning route, 20–22 px.
- Pencil: practice, 20–22 px.
- BookOpen: vocabulary and current chapter, 20–22 px.
- ChartNoAxesColumnIncreasing: learning record, 20–22 px.
- Settings: settings, 19–21 px.
- Flame and Star: streak and XP; semantic terracotta/honey fill where useful.
- LockKeyhole, Check, Volume2, X, ArrowRight, CircleHelp: state and lesson controls.

Text glyphs may appear only inside route nodes where the glyph is the learning content (`A`, `Ñ`, `¿`, `时`).

## Component families

- Rails and navigation: open paper surfaces, selected nav is a solid terracotta row; mobile navigation is a fixed paper strip with four equal actions.
- Chapter banner: one terracotta focal band with a small city illustration and code-native copy.
- Journey map: an open illustrated band with one route line and completed/current/locked node variants; supporting city imagery blends directly into cream paper.
- Goal selector: five compact buttons on desktop; modal/sheet-style compact selector on mobile; selected state is solid terracotta.
- Lesson answer: spacious outlined paper option, selected terracotta outline, correct moss, incorrect terracotta with a separate explanation.
- Feedback: open layout with one bordered example panel and a single primary continue action.

## Image treatment

Lolo and city illustrations use transparent or cream-matched backgrounds, fine ink lines, watercolor/gouache texture, and no embedded interface text. Images have no tint overlay. Instructional `niño` and `pan` art use stable portrait frames and consistent lighting.

## Motion

- 180 ms answer/nav selection.
- 220 ms route-node rise on hover/focus.
- 420 ms one-time completion lift/fade.
- No perpetual movement. Under `prefers-reduced-motion`, remove transforms and nonessential transitions.
