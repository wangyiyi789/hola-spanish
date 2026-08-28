import { Flame, Settings, Star } from 'lucide-react';
import { useAppState } from './app/useAppState';
import { lessons } from './data/curriculum';
import { JourneyDashboard } from './features/journey/JourneyDashboard';
import { LessonPlayer } from './features/lesson/LessonPlayer';
import { PracticeHub } from './features/practice/PracticeHub';
import { ProfessionalDrill } from './features/practice/ProfessionalDrill';
import { LearningRecords } from './features/records/LearningRecords';
import { SettingsPage } from './features/settings/SettingsPage';
import { VocabularyBook } from './features/vocabulary/VocabularyBook';
import { MobileNav } from './features/navigation/MobileNav';
import { SideNav } from './features/navigation/SideNav';
import './styles/global.css';

export default function App() {
  const app = useAppState();
  const section = app.view === 'lesson' ? 'journey' : app.view === 'drill' ? 'practice' : app.view;
  const focusedMode = (app.view === 'lesson' && Boolean(app.currentLessonId)) || app.view === 'drill';

  return (
    <div className={`app-shell${focusedMode ? ' lesson-mode' : ''}`}>
      {!focusedMode ? <SideNav current={section} onNavigate={app.navigate} /> : null}
      {!focusedMode ? (
        <header className="mobile-topbar">
          <span className="mobile-brand">¡Hola!</span>
          <div className="mobile-stats">
            <span><Flame aria-hidden="true" fill="currentColor" size={16} /> {app.progress.streak} 天</span>
            <span><Star aria-hidden="true" fill="currentColor" size={16} /> {app.progress.xp} XP</span>
          </div>
          <button className="mobile-settings" type="button" aria-label="设置" onClick={() => app.navigate('settings')}><Settings aria-hidden="true" size={18} /></button>
        </header>
      ) : null}
      {!focusedMode && app.recovery !== 'primary' && app.recovery !== 'initial' ? (
        <div className="recovery-notice" role="status">
          {app.recovery === 'migrated' ? '已清除旧版演示记录，现在从 0 开始学习。' : '已安全恢复你的学习记录。'}
          <button type="button" onClick={app.dismissRecovery}>知道了</button>
        </div>
      ) : null}
      {app.view === 'journey' ? (
        <JourneyDashboard progress={app.progress} onGoalChange={app.changeGoal} onOpenLesson={app.openLesson} />
      ) : app.view === 'lesson' && app.currentLessonId ? (
        <LessonPlayer
          lesson={lessons[app.currentLessonId]}
          resumeStep={app.progress.currentLesson?.lessonId === app.currentLessonId ? app.progress.currentLesson.stepIndex : 0}
          resumeMastery={app.progress.currentLesson?.lessonId === app.currentLessonId ? app.progress.currentLesson.mastery : undefined}
          onCheckpoint={app.checkpoint}
          onComplete={app.finishLesson}
          onExit={() => app.navigate('journey')}
          onNext={lessons[app.currentLessonId].nextLessonId
            ? () => app.openLesson(lessons[app.currentLessonId!].nextLessonId!)
            : undefined}
        />
      ) : app.view === 'drill' ? (
        <ProfessionalDrill onExit={() => app.navigate('practice')} />
      ) : app.view === 'practice' ? (
        <PracticeHub progress={app.progress} onOpenLesson={app.openLesson} onStartDrill={app.openDrill} />
      ) : app.view === 'vocabulary' ? (
        <VocabularyBook progress={app.progress} />
      ) : app.view === 'records' ? (
        <LearningRecords progress={app.progress} />
      ) : (
        <SettingsPage progress={app.progress} onGoalChange={app.changeGoal} onImport={app.importLearningProgress} onReset={app.resetLearningProgress} onRestore={app.restoreLearningProgress} />
      )}
      {!focusedMode ? <MobileNav current={section} onNavigate={app.navigate} /> : null}
    </div>
  );
}
