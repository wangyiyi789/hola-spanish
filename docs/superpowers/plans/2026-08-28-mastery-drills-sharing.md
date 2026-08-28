# Mastery Drills and Sharing Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Require immediate correction plus end-of-set repetition, provide configurable professional drills, preserve retry state, and expose the local site to LAN devices.

**Architecture:** A pure mastery queue owns all answer transitions and is shared by lessons and drills. Lesson checkpoints serialize the queue through the progress store. Professional drill setup filters a static, typed question bank before creating its queue; bundled audio remains local.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, Playwright

**Spec:** `docs/superpowers/specs/2026-08-28-mastery-drills-sharing-design.md`

## Global Constraints

- Incorrect answers stay on the same question until corrected.
- Every missed question returns at the end, including mistakes made during review.
- Existing valid learner progress must remain importable.
- Film-like voice lines must be original local assets, not copyrighted film clips.
- Browser QA uses regular Playwright because the Browser plugin is unavailable.

---

### Task 1: Mastery queue behavior

**Files:**
- Create: `src/domain/mastery.ts`
- Modify: `src/features/practice/masteryQueue.ts`
- Test: `src/features/practice/masteryQueue.test.ts`

**Interfaces:**
- Produces: `MasteryQueue`, `createMasteryQueue(ids)`, `answerMasteryQueue(queue, correct)`

- [ ] Write tests proving a wrong answer keeps `current` unchanged and schedules it once for end review.
- [ ] Run the focused test and confirm it fails because the current implementation advances.
- [ ] Implement the minimal pure-state transition.
- [ ] Run the focused test and confirm it passes.

### Task 2: Lesson retry persistence

**Files:**
- Modify: `src/domain/progress.ts`
- Modify: `src/features/progress/progressStore.ts`
- Modify: `src/app/useAppState.ts`
- Modify: `src/App.tsx`
- Modify: `src/features/lesson/LessonPlayer.tsx`
- Test: `src/features/lesson/LessonPlayer.test.tsx`
- Test: `src/features/progress/progressStore.test.ts`

**Interfaces:**
- `LessonCheckpoint.mastery?: MasteryQueue`
- `checkpointLesson(progress, lessonId, stepIndex, mistakeId?, mastery?)`
- `LessonPlayerProps.resumeMastery?: MasteryQueue`

- [ ] Add failing tests for immediate same-question retry and resume persistence.
- [ ] Persist and validate the mastery snapshot without rejecting legacy progress.
- [ ] Change incorrect feedback action to “重新作答” and only route after correction.
- [ ] Run lesson and progress tests.

### Task 3: Configurable professional drills

**Files:**
- Modify: `src/data/practiceQuestions.ts`
- Modify: `src/features/practice/ProfessionalDrill.tsx`
- Modify: `src/styles/global.css`
- Test: `src/App.test.tsx`

**Interfaces:**
- `PracticeQuestion.level: 'A2 基础' | 'B1 进阶' | 'B2 专业'`
- Drill setup filters by category, level, and count before creating a mastery queue.

- [ ] Add failing interaction tests for setup filters and immediate retry.
- [ ] Expand the question bank with advanced grammar items.
- [ ] Implement accessible setup controls and results.
- [ ] Verify desktop and mobile layouts.

### Task 4: Audio and LAN delivery

**Files:**
- Verify: `src/data/audioSources.ts`
- Verify: `public/audio/*.mp3`
- Modify: `README.md`
- Verify: `vite.config.ts`

**Interfaces:**
- Local recordings resolve through `createSpeechService`.
- Vite listens on `0.0.0.0:4173`.

- [ ] Verify every mapped audio asset exists and scene audio plays.
- [ ] Start the server on all interfaces and probe localhost plus LAN IP.
- [ ] Document localhost, LAN, firewall, and static-deployment behavior.

### Task 5: Full regression and browser QA

**Files:**
- Modify: `e2e/learning-flow.spec.ts`

- [ ] Add E2E coverage for wrong answer, immediate correction, and end review.
- [ ] Run all Vitest tests, TypeScript, ESLint, production build, and Playwright.
- [ ] Capture desktop, feedback, review, drill setup, results, and mobile screenshots outside the repo.
- [ ] Inspect screenshots and verify no console or layout errors.
- [ ] Commit the completed implementation.

