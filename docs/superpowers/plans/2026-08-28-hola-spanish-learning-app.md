# Hola Spanish Learning App Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, fully interactive React learning prototype that takes Chinese-speaking adult beginners from the Spanish alphabet through parts of speech, question words, and common tenses with flexible daily study goals.

**Architecture:** A React + Vite single-page app reads typed curriculum data and persists a versioned `Progress` document through a defensive local-storage repository. `App` composes focused journey, lesson, vocabulary, and settings features; lesson completion applies one atomic progress transition so XP, unlocks, streaks, minutes, and vocabulary stay consistent.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, Lucide React, CSS modules/global design tokens, browser Web Speech API, Playwright for browser QA.

**Spec:** `docs/superpowers/specs/2026-08-27-hola-spanish-learning-design.md`

## Global Constraints

- Audience: Chinese-speaking adults with no prior Spanish study.
- Curriculum order: 27 letters, 9 parts of speech, 12 common question expressions, then 9 common tense/mood forms.
- Daily goals: exactly 10, 20, 30, 45, or 60 minutes; reaching a goal never blocks continued study.
- Four representative lessons must be fully completable; remaining nodes expose goals and prerequisite locks.
- Errors do not reduce progress; they produce Chinese explanations and enter review history.
- Progress is local-only, versioned, backed up before valid writes, field-repaired when possible, and exportable/importable.
- Desktop uses the approved three-column adult storybook layout; tablet collapses the right rail; mobile uses one column plus bottom navigation.
- Use code-native text and controls. Generated art is decorative or instructional imagery and never substitutes for interactive UI.
- Respect keyboard access, visible focus, reduced motion, 44 px touch targets, and Spanish punctuation/diacritics.

---

### Task 1: Scaffold the application and typed curriculum

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `eslint.config.js`
- Create: `tsconfig.json`
- Create: `tsconfig.app.json`
- Create: `tsconfig.node.json`
- Create: `index.html`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/domain/course.ts`
- Create: `src/data/curriculum.ts`
- Create: `src/data/curriculum.test.ts`
- Create: `src/test/setup.ts`

**Interfaces:**
- Produces: `CourseCity`, `CourseNode`, `Lesson`, `LessonStep`, `VocabularyItem`, `cities`, `lessons`, `getNodeById(nodeId)`.

- [ ] **Step 1: Create Vite, TypeScript, Vitest, and Testing Library configuration**

Use scripts `dev`, `build`, `lint`, `test`, `test:run`, and `preview`. Configure Vitest with `environment: 'jsdom'` and `setupFiles: './src/test/setup.ts'`.

- [ ] **Step 2: Write curriculum validation tests**

```ts
describe('curriculum', () => {
  it('contains four ordered cities and one playable lesson per city', () => {
    expect(cities.map((city) => city.id)).toEqual([
      'alphabet-harbor', 'word-market', 'question-plaza', 'tense-city',
    ]);
    for (const city of cities) {
      expect(city.nodes.some((node) => Boolean(node.lessonId))).toBe(true);
    }
  });

  it('lists 27 letters, 9 parts of speech, 12 question expressions, and 9 tenses', () => {
    expect(curriculumFacts.alphabet).toHaveLength(27);
    expect(curriculumFacts.partsOfSpeech).toHaveLength(9);
    expect(curriculumFacts.questionExpressions).toHaveLength(12);
    expect(curriculumFacts.tenses).toHaveLength(9);
  });
});
```

- [ ] **Step 3: Run the curriculum test and confirm it fails because modules are missing**

Run: `npm run test:run -- src/data/curriculum.test.ts`

Expected: FAIL with an import/module resolution error for `curriculum`.

- [ ] **Step 4: Implement domain types and complete curriculum data**

Define discriminated step types `explain`, `choice`, `fill`, and `challenge`. Each playable lesson must contain 4–6 steps, Chinese explanations, correct answer keys, XP, minutes, and at least one vocabulary item with a full Spanish example sentence.

The four playable lessons are:

```ts
export const lessonIds = [
  'alphabet-enye',
  'parts-sentence',
  'questions-real-life',
  'tenses-today-yesterday',
] as const;
```

- [ ] **Step 5: Add a minimal app mount and run tests/build**

Run: `npm run test:run && npm run build`

Expected: curriculum tests PASS and Vite build exits 0.

- [ ] **Step 6: Commit the scaffold and curriculum**

```bash
git add package.json package-lock.json vite.config.ts tsconfig*.json index.html src
git commit -m "feat: scaffold typed Spanish curriculum"
```

### Task 2: Build safe progress persistence and recovery

**Files:**
- Create: `src/domain/progress.ts`
- Create: `src/features/progress/progressStore.ts`
- Create: `src/features/progress/progressStore.test.ts`

**Interfaces:**
- Consumes: `Lesson`, `VocabularyItem`, `getNodeById(nodeId)`.
- Produces: `Progress`, `createInitialProgress()`, `repairProgress(input)`, `loadProgress(storage)`, `saveProgress(storage, progress)`, `completeLesson(progress, lesson, date)`, `setDailyGoal(progress, minutes)`, `exportProgress(progress)`, `importProgress(json)`.

- [ ] **Step 1: Write failing tests for initial state, field repair, and backup recovery**

```ts
it('repairs an invalid goal without losing valid XP and completed nodes', () => {
  const repaired = repairProgress({ version: 1, xp: 280, dailyGoalMinutes: 999, completedNodeIds: ['letters-vowels'] });
  expect(repaired.xp).toBe(280);
  expect(repaired.dailyGoalMinutes).toBe(20);
  expect(repaired.completedNodeIds).toContain('letters-vowels');
});

it('restores the last valid backup when primary JSON is corrupt', () => {
  storage.setItem(PRIMARY_KEY, '{bad json');
  storage.setItem(BACKUP_KEY, JSON.stringify({ ...createInitialProgress(), xp: 90 }));
  expect(loadProgress(storage).progress.xp).toBe(90);
  expect(loadProgress(storage).recovery).toBe('backup');
});
```

- [ ] **Step 2: Run the store tests and verify failure**

Run: `npm run test:run -- src/features/progress/progressStore.test.ts`

Expected: FAIL because the progress interfaces and functions do not exist.

- [ ] **Step 3: Implement versioned storage, field-level repair, and rotated backup**

Use primary key `hola-progress-v1` and backup key `hola-progress-backup-v1`. `saveProgress` must validate the new document, copy the previously valid primary record to backup, then write primary. Invalid imports throw a typed `ProgressImportError` and leave storage untouched.

- [ ] **Step 4: Add atomic completion and flexible-goal tests**

```ts
it('completes a lesson atomically and allows minutes beyond the daily goal', () => {
  const start = setDailyGoal(createInitialProgress(), 10);
  const once = completeLesson(start, lessons['alphabet-enye'], '2026-08-28');
  const twice = completeLesson(once, lessons['parts-sentence'], '2026-08-28');
  expect(twice.todayMinutes).toBeGreaterThan(10);
  expect(twice.completedNodeIds).toContain('parts-sentence-node');
  expect(twice.unlockedNodeIds).toContain('questions-real-life-node');
});
```

- [ ] **Step 5: Implement completion, streak, unlock, export, and import transitions**

Keep all functions pure except `loadProgress` and `saveProgress`. Count a streak once per calendar date, merge vocabulary by stable ID, deduplicate mistake IDs, and accept only goals in `[10, 20, 30, 45, 60]`.

- [ ] **Step 6: Run store tests and full tests**

Run: `npm run test:run -- src/features/progress/progressStore.test.ts && npm run test:run`

Expected: all tests PASS.

- [ ] **Step 7: Commit progress persistence**

```bash
git add src/domain/progress.ts src/features/progress
git commit -m "feat: add resilient local learning progress"
```

### Task 3: Implement the app shell, journey map, and flexible study plan

**Files:**
- Create: `src/app/useAppState.ts`
- Create: `src/components/Icon.tsx`
- Create: `src/features/navigation/SideNav.tsx`
- Create: `src/features/navigation/MobileNav.tsx`
- Create: `src/features/journey/JourneyDashboard.tsx`
- Create: `src/features/journey/JourneyMap.tsx`
- Create: `src/features/journey/DailyPlan.tsx`
- Create: `src/features/journey/GoalPicker.tsx`
- Create: `src/features/journey/JourneyDashboard.test.tsx`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `cities`, `Progress`, `setDailyGoal(progress, minutes)`.
- Produces: `AppView`, `useAppState()`, `JourneyDashboard({ progress, onOpenLesson, onGoalChange })`.

- [ ] **Step 1: Write failing dashboard interaction tests**

```tsx
it('changes the daily target and keeps the continue-learning action available', async () => {
  render(<JourneyDashboard progress={{ ...createInitialProgress(), todayMinutes: 35 }} onGoalChange={onGoalChange} onOpenLesson={vi.fn()} />);
  await user.click(screen.getByRole('button', { name: '30 分钟' }));
  expect(onGoalChange).toHaveBeenCalledWith(30);
  expect(screen.getByRole('button', { name: /继续探索/ })).toBeVisible();
});
```

- [ ] **Step 2: Run the dashboard test and verify failure**

Run: `npm run test:run -- src/features/journey/JourneyDashboard.test.tsx`

Expected: FAIL because dashboard components are missing.

- [ ] **Step 3: Implement navigation, three-column dashboard, goal picker, and node states**

Use semantic buttons for nodes. Locked nodes show their prerequisite. The progress rail displays `todayMinutes / dailyGoalMinutes`, clamps its visual width at 100%, and separately reports extra minutes after the goal is reached.

- [ ] **Step 4: Add app-level state wiring**

`useAppState` initializes from `loadProgress`, exposes current view, persists state transitions, and surfaces a dismissible recovery notice. It must not subscribe to storage repeatedly during render.

- [ ] **Step 5: Run focused tests and build**

Run: `npm run test:run -- src/features/journey/JourneyDashboard.test.tsx && npm run build`

Expected: PASS and build exits 0.

- [ ] **Step 6: Commit dashboard behavior**

```bash
git add src/App.tsx src/app src/components src/features/navigation src/features/journey
git commit -m "feat: add flexible journey dashboard"
```

### Task 4: Implement the interactive lesson engine and speech fallback

**Files:**
- Create: `src/features/lesson/LessonPlayer.tsx`
- Create: `src/features/lesson/LessonStepView.tsx`
- Create: `src/features/lesson/AnswerFeedback.tsx`
- Create: `src/features/lesson/LessonComplete.tsx`
- Create: `src/features/lesson/LessonPlayer.test.tsx`
- Create: `src/services/speech.ts`
- Create: `src/services/speech.test.ts`
- Modify: `src/app/useAppState.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `Lesson`, `Progress`, `completeLesson`, app navigation callbacks.
- Produces: `LessonPlayer({ lesson, resumeStep, onExit, onCheckpoint, onComplete })`, `createSpeechService(window)`.

- [ ] **Step 1: Write failing lesson-flow tests**

```tsx
it('shows Chinese reasoning after an incorrect answer and records the mistake', async () => {
  render(<LessonPlayer lesson={lessons['alphabet-enye']} resumeStep={0} onExit={vi.fn()} onCheckpoint={onCheckpoint} onComplete={vi.fn()} />);
  await advanceToFirstQuestion(user);
  await user.click(screen.getByRole('button', { name: /pan/ }));
  await user.click(screen.getByRole('button', { name: '检查答案' }));
  expect(screen.getByText(/为什么/)).toBeVisible();
  expect(screen.getByText(/Ñ/)).toBeVisible();
  expect(onCheckpoint).toHaveBeenCalledWith(expect.objectContaining({ mistakeId: expect.any(String) }));
});
```

- [ ] **Step 2: Run lesson tests and verify failure**

Run: `npm run test:run -- src/features/lesson/LessonPlayer.test.tsx`

Expected: FAIL because `LessonPlayer` is missing.

- [ ] **Step 3: Implement explain, choice, fill, challenge, feedback, and completion states**

Prevent continuing before checking an answer. Preserve the selected wrong answer in feedback. Persist a checkpoint after each completed step and on exit. The completion screen exposes both `继续下一节` and `返回学习地图`.

- [ ] **Step 4: Write and implement speech fallback tests**

```ts
it('returns unavailable without throwing when speech synthesis is absent', () => {
  expect(createSpeechService({} as Window).speak('niño')).toEqual({ ok: false, reason: 'unsupported' });
});
```

Prefer an `es-ES` voice, then any `es-*` voice. When unavailable, replace listening-only instructions with an equivalent visible text clue.

- [ ] **Step 5: Wire lesson completion to atomic progress updates and next-lesson routing**

Completing a lesson applies XP, minutes, streak, vocabulary, mistakes, completed node, and unlocked node once. Reloading the completion screen must not award the lesson twice.

- [ ] **Step 6: Run lesson, speech, and full tests**

Run: `npm run test:run -- src/features/lesson src/services && npm run test:run && npm run build`

Expected: all tests PASS and build exits 0.

- [ ] **Step 7: Commit the lesson engine**

```bash
git add src/App.tsx src/app src/features/lesson src/services
git commit -m "feat: add interactive Spanish lessons"
```

### Task 5: Add vocabulary, learning records, and backup controls

**Files:**
- Create: `src/features/vocabulary/VocabularyBook.tsx`
- Create: `src/features/records/LearningRecords.tsx`
- Create: `src/features/settings/DataControls.tsx`
- Create: `src/features/settings/DataControls.test.tsx`
- Modify: `src/features/navigation/SideNav.tsx`
- Modify: `src/features/navigation/MobileNav.tsx`
- Modify: `src/app/useAppState.ts`
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: `Progress`, `exportProgress`, `importProgress`, app state replacement and reset callbacks.
- Produces: navigable vocabulary, records, and settings screens.

- [ ] **Step 1: Write failing import safety tests**

```tsx
it('does not replace progress when an imported file is invalid', async () => {
  render(<DataControls progress={progress} onImport={onImport} onReset={onReset} />);
  await uploadJson(user, '{"dailyGoalMinutes":999}');
  expect(onImport).not.toHaveBeenCalled();
  expect(screen.getByRole('alert')).toHaveTextContent('无法导入');
});
```

- [ ] **Step 2: Run the settings test and verify failure**

Run: `npm run test:run -- src/features/settings/DataControls.test.tsx`

Expected: FAIL because `DataControls` is missing.

- [ ] **Step 3: Implement vocabulary and records screens**

Vocabulary rows show Spanish term, part of speech, Chinese meaning, example, translation, and speech action. Records show total XP, minutes today, streak, completed lessons, and mistakes awaiting review.

- [ ] **Step 4: Implement export, validated import, and confirmed reset controls**

Export a UTF-8 JSON Blob named `hola-learning-progress-YYYY-MM-DD.json`. Import reads text, calls `importProgress`, then requires confirmation before replacing current progress. Reset requires typing `重置` or a second explicit confirmation button.

- [ ] **Step 5: Run focused tests and build**

Run: `npm run test:run -- src/features/settings/DataControls.test.tsx && npm run test:run && npm run build`

Expected: all tests PASS and build exits 0.

- [ ] **Step 6: Commit supporting screens**

```bash
git add src/App.tsx src/app src/features/navigation src/features/vocabulary src/features/records src/features/settings
git commit -m "feat: add vocabulary records and backups"
```

### Task 6: Generate production art and implement the approved visual system

**Files:**
- Create: `public/assets/lolo-guide.png`
- Create: `public/assets/alphabet-harbor.png`
- Create: `public/assets/word-market.png`
- Create: `public/assets/question-plaza.png`
- Create: `public/assets/tense-city.png`
- Create: `public/assets/lesson-nino.png`
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Modify: `src/App.tsx`
- Modify: `src/features/navigation/SideNav.tsx`
- Modify: `src/features/navigation/MobileNav.tsx`
- Modify: `src/features/journey/JourneyDashboard.tsx`
- Modify: `src/features/journey/JourneyMap.tsx`
- Modify: `src/features/journey/DailyPlan.tsx`
- Modify: `src/features/journey/GoalPicker.tsx`
- Modify: `src/features/lesson/LessonPlayer.tsx`
- Modify: `src/features/lesson/LessonStepView.tsx`
- Modify: `src/features/lesson/AnswerFeedback.tsx`
- Modify: `src/features/lesson/LessonComplete.tsx`
- Modify: `src/features/vocabulary/VocabularyBook.tsx`
- Modify: `src/features/records/LearningRecords.tsx`
- Modify: `src/features/settings/DataControls.tsx`

**Interfaces:**
- Consumes: approved visual concepts from the brainstorming session and all feature components.
- Produces: responsive adult-storybook UI with reusable color, typography, spacing, radius, border, shadow, and motion tokens.

- [ ] **Step 1: Generate a cohesive transparent/background illustration set**

Use the image-generation skill to create one adult editorial storybook asset sheet with consistent terracotta, moss, honey, ink, and cream colors. Extract or generate the six named assets without embedded UI text. Lolo must read as a calm adult learning guide, not a children's cartoon mascot.

- [ ] **Step 2: Define exact design tokens and global typography**

Implement cream `#F7F0E3`, paper `#FBF6EC`, terracotta `#D8664B`, terracotta-dark `#AD4733`, moss `#5E8466`, moss-dark `#41634A`, honey `#EFBB54`, ink `#3F352D`, muted `#7D7064`, and line `#E5DAC6`. Define every button, navigation item, form field, label, and feedback panel typography explicitly.

- [ ] **Step 3: Style desktop sections in slices and compare with the approved concepts**

First match the 1440×900 dashboard: 190–216 px left rail, fluid middle column, 270–300 px right rail, terracotta chapter card, path nodes, daily progress, and weekly footprint. Then match lesson question and feedback states.

- [ ] **Step 4: Implement tablet and mobile responsive behavior**

At widths below 1100 px move daily content under the central map. Below 720 px hide desktop side navigation, show bottom navigation, switch to one column, keep 16 px side gutters, and ensure primary controls remain at least 44 px high.

- [ ] **Step 5: Add restrained motion and accessibility states**

Use 160–240 ms transitions for node/answer state, a short completion rise animation, and no perpetual movement. Disable nonessential transitions under `prefers-reduced-motion`. Add visible `:focus-visible` rings and text/icon state labels.

- [ ] **Step 6: Run tests and build, then commit visuals**

Run: `npm run test:run && npm run build`

Expected: all tests PASS and assets are emitted in the build.

```bash
git add public/assets src/styles src
git commit -m "feat: apply adult storybook visual system"
```

### Task 7: Browser QA, fidelity repair, and final verification

**Files:**
- Create: `playwright.config.ts`
- Create: `e2e/learning-flow.spec.ts`
- Create: `artifacts/qa/fidelity-ledger.md`
- Create: `artifacts/qa/dashboard-desktop.png`
- Create: `artifacts/qa/dashboard-mobile.png`
- Create: `artifacts/qa/lesson-feedback.png`
- Modify: implementation files required by discovered issues.

**Interfaces:**
- Consumes: built application and approved concepts.
- Produces: repeatable end-to-end coverage and visual evidence.

- [ ] **Step 1: Write the end-to-end core-flow test**

```ts
test('adjusts goal, completes Ñ lesson, unlocks progress, and survives reload', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '30 分钟' }).click();
  await page.getByRole('button', { name: /Ñ/ }).click();
  await completeAlphabetLesson(page);
  await expect(page.getByText(/获得.*XP/)).toBeVisible();
  await page.reload();
  await expect(page.getByText('30 分钟目标')).toBeVisible();
});
```

- [ ] **Step 2: Run Playwright on desktop and mobile projects**

Run: `npx playwright test`

Expected: desktop Chromium and mobile Chromium projects PASS.

- [ ] **Step 3: Capture the required QA screenshots**

Capture dashboard at 1440×900, lesson feedback at 1280×900, and mobile dashboard at 390×844. Use `view_image` on the approved concept and each implementation capture in the same QA pass.

- [ ] **Step 4: Write and close the fidelity ledger**

Record at least: copy, column/container model, typography, palette, generated-art treatment, navigation/icon weight, question/feedback hierarchy, mobile collapse, and motion/reduced-motion. Every mismatch must state the fix or an explicit non-fixable reason.

- [ ] **Step 5: Test progress corruption and import/export manually in the browser**

Corrupt the primary storage key and verify backup restoration notice. Export, reset, import, and verify XP, goal, completed node, and vocabulary all return. Confirm unsupported speech does not block the lesson.

- [ ] **Step 6: Run the final verification suite**

Run: `npm run test:run && npm run build && npx playwright test`

Expected: every command exits 0 with no skipped core-flow test.

- [ ] **Step 7: Commit QA and final repairs**

```bash
git add e2e playwright.config.ts artifacts/qa src public
git commit -m "test: verify complete Spanish learning experience"
```
