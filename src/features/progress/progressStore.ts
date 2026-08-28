import { lessons } from '../../data/curriculum';
import { DAILY_GOALS, type DailyGoalMinutes, type LoadedProgress, type Progress } from '../../domain/progress';
import type { Lesson } from '../../domain/course';
import { isMasteryQueue, type MasteryQueue } from '../../domain/mastery';

export const PRIMARY_KEY = 'hola-progress-v1';
export const BACKUP_KEY = 'hola-progress-backup-v1';

const DEFAULT_GOAL: DailyGoalMinutes = 20;
const goalSet = new Set<number>(DAILY_GOALS);

export class ProgressImportError extends Error {
  constructor(message = '学习记录格式无效') {
    super(message);
    this.name = 'ProgressImportError';
  }
}

function todayLocal(): string {
  const date = new Date();
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

export function createInitialProgress(date = todayLocal()): Progress {
  return {
    version: 1,
    xp: 0,
    todayXp: 0,
    dailyGoalMinutes: DEFAULT_GOAL,
    todayMinutes: 0,
    todayDate: date,
    streak: 0,
    lastStudyDate: null,
    completedNodeIds: [],
    unlockedNodeIds: ['alphabet-vowels-node', 'alphabet-enye-node'],
    currentLesson: null,
    vocabularyIds: [],
    mistakeIds: [],
    completedTaskIds: [],
  };
}

function isRecord(input: unknown): input is Record<string, unknown> {
  return typeof input === 'object' && input !== null && !Array.isArray(input);
}

function nonNegativeNumber(input: unknown, fallback: number): number {
  return typeof input === 'number' && Number.isFinite(input) && input >= 0 ? input : fallback;
}

function stringArray(input: unknown, fallback: string[]): string[] {
  if (!Array.isArray(input)) return fallback;
  return [...new Set(input.filter((item): item is string => typeof item === 'string' && item.length > 0))];
}

function validDate(input: unknown, fallback: string): string {
  return typeof input === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(input) ? input : fallback;
}

export function repairProgress(input: unknown, date = todayLocal()): Progress {
  const fallback = createInitialProgress(date);
  if (!isRecord(input)) return fallback;

  const currentLesson = isRecord(input.currentLesson)
    && typeof input.currentLesson.lessonId === 'string'
    && input.currentLesson.lessonId in lessons
    && typeof input.currentLesson.stepIndex === 'number'
    && Number.isInteger(input.currentLesson.stepIndex)
    && input.currentLesson.stepIndex >= 0
    ? {
        lessonId: input.currentLesson.lessonId as keyof typeof lessons,
        stepIndex: input.currentLesson.stepIndex,
        ...(isMasteryQueue(input.currentLesson.mastery) ? { mastery: input.currentLesson.mastery } : {}),
      }
    : null;

  return {
    version: 1,
    xp: nonNegativeNumber(input.xp, fallback.xp),
    todayXp: nonNegativeNumber(input.todayXp, fallback.todayXp),
    dailyGoalMinutes: goalSet.has(Number(input.dailyGoalMinutes))
      ? input.dailyGoalMinutes as DailyGoalMinutes
      : DEFAULT_GOAL,
    todayMinutes: nonNegativeNumber(input.todayMinutes, fallback.todayMinutes),
    todayDate: validDate(input.todayDate, fallback.todayDate),
    streak: nonNegativeNumber(input.streak, fallback.streak),
    lastStudyDate: input.lastStudyDate === null
      ? null
      : validDate(input.lastStudyDate, fallback.lastStudyDate ?? date),
    completedNodeIds: stringArray(input.completedNodeIds, fallback.completedNodeIds),
    unlockedNodeIds: stringArray(input.unlockedNodeIds, fallback.unlockedNodeIds),
    currentLesson,
    vocabularyIds: stringArray(input.vocabularyIds, fallback.vocabularyIds),
    mistakeIds: stringArray(input.mistakeIds, fallback.mistakeIds),
    completedTaskIds: stringArray(input.completedTaskIds, fallback.completedTaskIds),
  };
}

function isStrictProgress(input: unknown): input is Progress {
  if (!isRecord(input)) return false;
  const repaired = repairProgress(input, typeof input.todayDate === 'string' ? input.todayDate : todayLocal());
  const sameStrings = (value: unknown, expected: string[]) => Array.isArray(value)
    && value.length === expected.length
    && value.every((item, index) => item === expected[index]);
  const sameCurrentLesson = input.currentLesson === null
    ? repaired.currentLesson === null
    : isRecord(input.currentLesson)
      && repaired.currentLesson !== null
      && input.currentLesson.lessonId === repaired.currentLesson.lessonId
      && input.currentLesson.stepIndex === repaired.currentLesson.stepIndex
      && masteryMatches(input.currentLesson.mastery, repaired.currentLesson.mastery);
  return input.version === 1
    && input.xp === repaired.xp
    && input.todayXp === repaired.todayXp
    && input.dailyGoalMinutes === repaired.dailyGoalMinutes
    && input.todayMinutes === repaired.todayMinutes
    && input.todayDate === repaired.todayDate
    && input.streak === repaired.streak
    && input.lastStudyDate === repaired.lastStudyDate
    && sameCurrentLesson
    && sameStrings(input.completedNodeIds, repaired.completedNodeIds)
    && sameStrings(input.unlockedNodeIds, repaired.unlockedNodeIds)
    && sameStrings(input.vocabularyIds, repaired.vocabularyIds)
    && sameStrings(input.mistakeIds, repaired.mistakeIds)
    && sameStrings(input.completedTaskIds, repaired.completedTaskIds);
}

export function resetToInitialProgress(storage: Storage, date = todayLocal()): Progress {
  const current = parseStored(storage.getItem(PRIMARY_KEY));
  if (isStrictProgress(current)) {
    storage.setItem(BACKUP_KEY, JSON.stringify(current));
  }
  const initial = createInitialProgress(date);
  storage.setItem(PRIMARY_KEY, JSON.stringify(initial));
  return initial;
}

export function restoreBackup(storage: Storage): Progress | null {
  const backup = parseStored(storage.getItem(BACKUP_KEY));
  if (!isStrictProgress(backup)) return null;
  const current = parseStored(storage.getItem(PRIMARY_KEY));
  if (isStrictProgress(current)) {
    storage.setItem(BACKUP_KEY, JSON.stringify(current));
  }
  storage.setItem(PRIMARY_KEY, JSON.stringify(backup));
  return backup;
}

function resetDailyIfNeeded(progress: Progress, date: string): Progress {
  if (progress.todayDate === date) return progress;
  return { ...progress, todayDate: date, todayXp: 0, todayMinutes: 0, completedTaskIds: [] };
}

function parseStored(value: string | null): unknown {
  if (!value) return null;
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
}

function masteryMatches(input: unknown, expected: MasteryQueue | undefined): boolean {
  if (!expected) return input === undefined;
  return isMasteryQueue(input)
    && input.phase === expected.phase
    && input.current === expected.current
    && arraysMatch(input.pending, expected.pending)
    && arraysMatch(input.retry, expected.retry)
    && input.attempts === expected.attempts
    && input.errors === expected.errors
    && input.reviewRound === expected.reviewRound
    && input.initialCount === expected.initialCount;
}

function arraysMatch(input: unknown, expected: string[]): boolean {
  return Array.isArray(input)
    && input.length === expected.length
    && input.every((item, index) => item === expected[index]);
}

function isLegacyDemoProgress(input: unknown): boolean {
  return isRecord(input)
    && input.version === 1
    && input.xp === 120
    && input.todayXp === 20
    && input.todayMinutes === 4
    && input.streak === 7
    && input.lastStudyDate === input.todayDate
    && input.currentLesson === null
    && arraysMatch(input.completedNodeIds, ['alphabet-vowels-node'])
    && arraysMatch(input.unlockedNodeIds, ['alphabet-vowels-node', 'alphabet-enye-node'])
    && arraysMatch(input.vocabularyIds, [])
    && arraysMatch(input.mistakeIds, [])
    && arraysMatch(input.completedTaskIds, ['review-vowels']);
}

export function loadProgress(storage: Storage, date = todayLocal()): LoadedProgress {
  const rawPrimary = storage.getItem(PRIMARY_KEY);
  const primary = parseStored(rawPrimary);

  if (isLegacyDemoProgress(primary)) {
    const migrated = createInitialProgress(date);
    storage.setItem(PRIMARY_KEY, JSON.stringify(migrated));
    const backup = parseStored(storage.getItem(BACKUP_KEY));
    if (isLegacyDemoProgress(backup)) storage.removeItem(BACKUP_KEY);
    return { progress: migrated, recovery: 'migrated' };
  }

  if (isStrictProgress(primary)) {
    return { progress: resetDailyIfNeeded(primary, date), recovery: 'primary' };
  }

  if (primary !== null) {
    const repaired = repairProgress(primary, date);
    return { progress: resetDailyIfNeeded(repaired, date), recovery: 'repaired' };
  }

  const backup = parseStored(storage.getItem(BACKUP_KEY));
  if (isStrictProgress(backup)) {
    const restored = resetDailyIfNeeded(backup, date);
    storage.setItem(PRIMARY_KEY, JSON.stringify(restored));
    return { progress: restored, recovery: 'backup' };
  }

  return { progress: createInitialProgress(date), recovery: 'initial' };
}

export function saveProgress(storage: Storage, progress: Progress): void {
  if (!isStrictProgress(progress)) {
    throw new ProgressImportError('拒绝保存损坏的学习记录');
  }

  const previous = parseStored(storage.getItem(PRIMARY_KEY));
  if (isStrictProgress(previous)) {
    storage.setItem(BACKUP_KEY, JSON.stringify(previous));
  }
  storage.setItem(PRIMARY_KEY, JSON.stringify(progress));
}

export function setDailyGoal(progress: Progress, minutes: DailyGoalMinutes): Progress {
  if (!goalSet.has(minutes)) return progress;
  return { ...progress, dailyGoalMinutes: minutes };
}

export function checkpointLesson(
  progress: Progress,
  lessonId: keyof typeof lessons,
  stepIndex: number,
  mistakeId?: string,
  mastery?: MasteryQueue,
): Progress {
  return {
    ...progress,
    currentLesson: {
      lessonId,
      stepIndex: Math.max(0, Math.floor(stepIndex)),
      ...(mastery ? { mastery } : {}),
    },
    mistakeIds: mistakeId
      ? [...new Set([...progress.mistakeIds, mistakeId])]
      : progress.mistakeIds,
  };
}

function dayDistance(from: string, to: string): number {
  const fromDate = Date.parse(`${from}T00:00:00Z`);
  const toDate = Date.parse(`${to}T00:00:00Z`);
  return Math.round((toDate - fromDate) / 86_400_000);
}

export function completeLesson(progress: Progress, lesson: Lesson, date = todayLocal()): Progress {
  if (progress.completedNodeIds.includes(lesson.nodeId)) return progress;

  const daily = resetDailyIfNeeded(progress, date);
  const distance = daily.lastStudyDate ? dayDistance(daily.lastStudyDate, date) : null;
  const streak = distance === 0
    ? daily.streak
    : distance === 1
      ? daily.streak + 1
      : 1;
  const nextNodeId = lesson.nextLessonId ? lessons[lesson.nextLessonId].nodeId : undefined;

  return {
    ...daily,
    xp: daily.xp + lesson.xp,
    todayXp: daily.todayXp + lesson.xp,
    todayMinutes: daily.todayMinutes + lesson.minutes,
    streak,
    lastStudyDate: date,
    completedNodeIds: [...new Set([...daily.completedNodeIds, lesson.nodeId])],
    unlockedNodeIds: [...new Set([...daily.unlockedNodeIds, lesson.nodeId, ...(nextNodeId ? [nextNodeId] : [])])],
    currentLesson: null,
    vocabularyIds: [...new Set([...daily.vocabularyIds, ...lesson.vocabulary.map((item) => item.id)])],
    completedTaskIds: [...new Set([...daily.completedTaskIds, `lesson:${lesson.id}`])],
  };
}

export function exportProgress(progress: Progress): string {
  if (!isStrictProgress(progress)) throw new ProgressImportError();
  return JSON.stringify(progress, null, 2);
}

export function importProgress(json: string): Progress {
  let input: unknown;
  try {
    input = JSON.parse(json);
  } catch {
    throw new ProgressImportError('文件不是有效的 JSON');
  }

  if (!isStrictProgress(input)) {
    throw new ProgressImportError();
  }
  return input;
}
