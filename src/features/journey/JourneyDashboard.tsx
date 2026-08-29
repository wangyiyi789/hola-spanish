import { Flame, Moon, Star } from 'lucide-react';
import { useMediaQuery } from '../../app/useMediaQuery';
import { lessons } from '../../data/curriculum';
import type { LessonId } from '../../domain/course';
import type { DailyGoalMinutes, Progress } from '../../domain/progress';
import { DailyPlan } from './DailyPlan';
import { JourneyMap } from './JourneyMap';

interface JourneyDashboardProps {
  progress: Progress;
  onGoalChange: (minutes: DailyGoalMinutes) => void;
  onOpenLesson: (lessonId: LessonId) => void;
}

export function JourneyDashboard({ progress, onGoalChange, onOpenLesson }: JourneyDashboardProps) {
  const recommended = Object.values(lessons).find((lesson) =>
    progress.unlockedNodeIds.includes(lesson.nodeId) && !progress.completedNodeIds.includes(lesson.nodeId),
  ) ?? lessons['alphabet-enye'];
  const continueLesson = () => onOpenLesson(recommended.id);
  const isMobile = useMediaQuery('(max-width: 720px)');

  return (
    <>
      <main className="dashboard-main">
        <header className="dashboard-heading">
          <div>
            <p className="greeting"><Moon aria-hidden="true" fill="currentColor" size={18} /> 晚上好，{progress.learnerName}</p>
            <h1 className="dashboard-title">今天，让我们认识 <em>Ñ</em>。</h1>
          </div>
          <div className="quick-stats" aria-label="学习概况">
            <span className="quick-stat is-fire"><Flame aria-hidden="true" fill="currentColor" size={15} /> {progress.streak} 天</span>
            <span className="quick-stat is-xp"><Star aria-hidden="true" fill="currentColor" size={15} /> {progress.xp} XP</span>
          </div>
        </header>
        <section className="chapter-banner" aria-label="当前章节">
          <div>
            <p className="chapter-kicker">第 1 站 · 字母港</p>
            <h2 className="chapter-title">从 A 到 Z，再多一个 Ñ</h2>
            <p className="chapter-copy">掌握 27 个字母与 5 个元音，为开口说话打地基。</p>
          </div>
          <span className="chapter-mark" aria-hidden="true">Ñ</span>
        </section>
        <JourneyMap progress={progress} onOpenLesson={onOpenLesson} />
        {isMobile ? <DailyPlan progress={progress} onGoalChange={onGoalChange} onContinue={continueLesson} compact /> : null}
      </main>
      {!isMobile ? <DailyPlan progress={progress} onGoalChange={onGoalChange} onContinue={continueLesson} /> : null}
    </>
  );
}

