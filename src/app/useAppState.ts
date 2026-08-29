import { useCallback, useState } from 'react';
import type { LessonId } from '../domain/course';
import type { DailyGoalMinutes, Progress, RecoveryKind } from '../domain/progress';
import { lessons } from '../data/curriculum';
import { checkpointLesson, completeLesson, loadProgress, resetToInitialProgress, restoreBackup, saveProgress, setDailyGoal, setLearnerName } from '../features/progress/progressStore';
import type { LessonCheckpointEvent } from '../features/lesson/LessonPlayer';
import type { AppSection } from '../features/navigation/SideNav';

export type AppView = AppSection | 'lesson' | 'drill';

interface AppState {
  progress: Progress;
  recovery: RecoveryKind;
  view: AppView;
  currentLessonId: LessonId | null;
}

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    const loaded = loadProgress(window.localStorage);
    return {
      progress: loaded.progress,
      recovery: loaded.recovery,
      view: 'journey',
      currentLessonId: loaded.progress.currentLesson?.lessonId ?? null,
    };
  });

  const persist = useCallback((progress: Progress) => {
    saveProgress(window.localStorage, progress);
    return progress;
  }, []);

  const changeGoal = useCallback((minutes: DailyGoalMinutes) => {
    setState((current) => ({ ...current, progress: persist(setDailyGoal(current.progress, minutes)) }));
  }, [persist]);

  const changeLearnerName = useCallback((name: string) => {
    setState((current) => ({ ...current, progress: persist(setLearnerName(current.progress, name)) }));
  }, [persist]);

  const openLesson = useCallback((lessonId: LessonId) => {
    setState((current) => ({ ...current, currentLessonId: lessonId, view: 'lesson' }));
  }, []);

  const openDrill = useCallback(() => {
    setState((current) => ({ ...current, currentLessonId: null, view: 'drill' }));
  }, []);

  const checkpoint = useCallback((event: LessonCheckpointEvent) => {
    setState((current) => ({
      ...current,
      progress: persist(checkpointLesson(current.progress, event.lessonId, event.stepIndex, event.mistakeId, event.mastery)),
    }));
  }, [persist]);

  const finishLesson = useCallback((lessonId: LessonId) => {
    setState((current) => ({ ...current, progress: persist(completeLesson(current.progress, lessons[lessonId])) }));
  }, [persist]);

  const navigate = useCallback((view: AppSection) => {
    setState((current) => ({ ...current, view, currentLessonId: null }));
  }, []);

  const dismissRecovery = useCallback(() => {
    setState((current) => ({ ...current, recovery: 'primary' }));
  }, []);

  const importLearningProgress = useCallback((progress: Progress) => {
    setState((current) => ({ ...current, progress: persist(progress), view: 'journey', currentLessonId: null }));
  }, [persist]);

  const resetLearningProgress = useCallback(() => {
    setState((current) => ({ ...current, progress: resetToInitialProgress(window.localStorage), view: 'journey', currentLessonId: null }));
  }, []);

  const restoreLearningProgress = useCallback(() => {
    const restored = restoreBackup(window.localStorage);
    if (restored) setState((current) => ({ ...current, progress: restored, view: 'journey', currentLessonId: null }));
  }, []);

  return { ...state, changeGoal, changeLearnerName, openLesson, openDrill, checkpoint, finishLesson, navigate, dismissRecovery, importLearningProgress, resetLearningProgress, restoreLearningProgress };
}

