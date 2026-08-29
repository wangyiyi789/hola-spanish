import { beforeEach, describe, expect, it } from 'vitest';
import { lessons } from '../../data/curriculum';
import {
  BACKUP_KEY,
  PRIMARY_KEY,
  ProgressImportError,
  checkpointLesson,
  completeLesson,
  createInitialProgress,
  exportProgress,
  importProgress,
  loadProgress,
  repairProgress,
  saveProgress,
  resetToInitialProgress,
  restoreBackup,
  setDailyGoal,
} from './progressStore';

describe('progressStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('keeps the previous valid progress recoverable when resetting', () => {
    const storage = window.localStorage;
    const learned = { ...createInitialProgress('2026-08-28'), xp: 640, vocabularyIds: ['nino'] };
    saveProgress(storage, learned);

    const reset = resetToInitialProgress(storage, '2026-08-28');
    expect(reset.xp).toBe(0);
    expect(restoreBackup(storage)?.xp).toBe(640);
  });

  it('starts a new learner at zero without demo achievements', () => {
    const progress = createInitialProgress('2026-08-28');

    expect(progress).toMatchObject({ learnerName: '学习者', xp: 0, todayXp: 0, todayMinutes: 0, streak: 0, lastStudyDate: null });
    expect(progress.completedNodeIds).toEqual([]);
    expect(progress.completedTaskIds).toEqual([]);
  });

  it('normalizes a learner name while repairing imported progress', () => {
    const repaired = repairProgress({
      ...createInitialProgress('2026-08-28'),
      learnerName: '  伊莲娜  ',
    });

    expect(repaired.learnerName).toBe('伊莲娜');
  });

  it('migrates the exact legacy demo record to a real zero starting point', () => {
    localStorage.setItem(PRIMARY_KEY, JSON.stringify({
      version: 1,
      xp: 120,
      todayXp: 20,
      dailyGoalMinutes: 20,
      todayMinutes: 4,
      todayDate: '2026-08-28',
      streak: 7,
      lastStudyDate: '2026-08-28',
      completedNodeIds: ['alphabet-vowels-node'],
      unlockedNodeIds: ['alphabet-vowels-node', 'alphabet-enye-node'],
      currentLesson: null,
      vocabularyIds: [],
      mistakeIds: [],
      completedTaskIds: ['review-vowels'],
    }));

    const loaded = loadProgress(localStorage, '2026-08-28');

    expect(loaded.recovery).toBe('migrated');
    expect(loaded.progress).toMatchObject({ xp: 0, todayMinutes: 0, streak: 0 });
    expect(JSON.parse(localStorage.getItem(PRIMARY_KEY) ?? '{}').xp).toBe(0);
  });

  it('repairs an invalid field without losing valid XP and completed nodes', () => {
    const repaired = repairProgress({
      version: 1,
      xp: 280,
      dailyGoalMinutes: 999,
      completedNodeIds: ['alphabet-vowels-node'],
    });

    expect(repaired.xp).toBe(280);
    expect(repaired.dailyGoalMinutes).toBe(20);
    expect(repaired.completedNodeIds).toContain('alphabet-vowels-node');
  });

  it('restores the last valid backup when primary JSON is corrupt', () => {
    localStorage.setItem(PRIMARY_KEY, '{bad json');
    localStorage.setItem(BACKUP_KEY, JSON.stringify({ ...createInitialProgress('2026-08-27'), xp: 90 }));

    const loaded = loadProgress(localStorage, '2026-08-28');

    expect(loaded.progress.xp).toBe(90);
    expect(loaded.recovery).toBe('backup');
  });

  it('rotates the previous valid primary record into backup before saving', () => {
    const first = { ...createInitialProgress('2026-08-28'), xp: 10 };
    const second = { ...first, xp: 20 };

    saveProgress(localStorage, first);
    saveProgress(localStorage, second);

    expect(JSON.parse(localStorage.getItem(BACKUP_KEY) ?? '{}').xp).toBe(10);
    expect(JSON.parse(localStorage.getItem(PRIMARY_KEY) ?? '{}').xp).toBe(20);
  });

  it('completes lessons atomically and keeps accumulating after the goal', () => {
    const start = setDailyGoal(createInitialProgress('2026-08-28'), 10);
    const once = completeLesson(start, lessons['alphabet-enye'], '2026-08-28');
    const twice = completeLesson(once, lessons['parts-sentence'], '2026-08-28');

    expect(twice.todayMinutes).toBeGreaterThan(10);
    expect(twice.completedNodeIds).toContain('parts-sentence-node');
    expect(twice.unlockedNodeIds).toContain('questions-real-life-node');
    expect(twice.vocabularyIds).toContain('cafe');
  });

  it('does not award the same lesson twice after a completion reload', () => {
    const start = createInitialProgress('2026-08-28');
    const once = completeLesson(start, lessons['alphabet-enye'], '2026-08-28');
    const twice = completeLesson(once, lessons['alphabet-enye'], '2026-08-28');

    expect(twice.xp).toBe(once.xp);
    expect(twice.todayMinutes).toBe(once.todayMinutes);
  });

  it('saves a resumable step and deduplicates mistakes', () => {
    const start = createInitialProgress('2026-08-28');
    const once = checkpointLesson(start, 'alphabet-enye', 2, 'enye-picture');
    const twice = checkpointLesson(once, 'alphabet-enye', 2, 'enye-picture');

    expect(twice.currentLesson).toEqual({ lessonId: 'alphabet-enye', stepIndex: 2 });
    expect(twice.mistakeIds).toEqual(['enye-picture']);
  });

  it('persists and reloads the mastery retry queue in a lesson checkpoint', () => {
    const mastery = {
      phase: 'learning' as const,
      current: 'enye-challenge',
      pending: ['enye-challenge'],
      retry: ['enye-picture'],
      attempts: 2,
      errors: 1,
      reviewRound: 0,
      initialCount: 4,
    };
    const progress = checkpointLesson(createInitialProgress('2026-08-28'), 'alphabet-enye', 3, 'enye-picture', mastery);
    saveProgress(localStorage, progress);

    expect(loadProgress(localStorage, '2026-08-28').progress.currentLesson?.mastery).toEqual(mastery);
  });

  it('round-trips a valid export and rejects unsafe imports', () => {
    const progress = { ...createInitialProgress('2026-08-28'), xp: 410, dailyGoalMinutes: 45 as const };

    expect(importProgress(exportProgress(progress))).toEqual(progress);
    expect(() => importProgress('{"version":1,"dailyGoalMinutes":999}')).toThrow(ProgressImportError);
  });

  it('accepts a valid exported record even when JSON fields are reordered', () => {
    const progress = createInitialProgress('2026-08-28');
    const reversed = Object.fromEntries(Object.entries(progress).reverse());

    expect(importProgress(JSON.stringify(reversed))).toEqual(progress);
  });
});

