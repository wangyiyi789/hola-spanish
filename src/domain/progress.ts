import type { LessonId } from './course';
import type { MasteryQueue } from './mastery';

export const DAILY_GOALS = [10, 20, 30, 45, 60] as const;
export type DailyGoalMinutes = (typeof DAILY_GOALS)[number];

export interface LessonCheckpoint {
  lessonId: LessonId;
  stepIndex: number;
  mastery?: MasteryQueue;
}

export interface Progress {
  version: 1;
  learnerName: string;
  xp: number;
  todayXp: number;
  dailyGoalMinutes: DailyGoalMinutes;
  todayMinutes: number;
  todayDate: string;
  streak: number;
  lastStudyDate: string | null;
  completedNodeIds: string[];
  unlockedNodeIds: string[];
  currentLesson: LessonCheckpoint | null;
  vocabularyIds: string[];
  mistakeIds: string[];
  completedTaskIds: string[];
}

export type RecoveryKind = 'primary' | 'repaired' | 'backup' | 'initial' | 'migrated';

export interface LoadedProgress {
  progress: Progress;
  recovery: RecoveryKind;
}


