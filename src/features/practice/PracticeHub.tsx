import { ArrowRight, BrainCircuit, Clock3, Headphones, RotateCcw } from 'lucide-react';
import { lessons } from '../../data/curriculum';
import type { LessonId } from '../../domain/course';
import type { Progress } from '../../domain/progress';

function recommendedLesson(progress: Progress) {
  return Object.values(lessons).find((lesson) =>
    progress.unlockedNodeIds.includes(lesson.nodeId) && !progress.completedNodeIds.includes(lesson.nodeId),
  ) ?? lessons['alphabet-enye'];
}

export function PracticeHub({ progress, onOpenLesson, onStartDrill }: { progress: Progress; onOpenLesson: (id: LessonId) => void; onStartDrill: () => void }) {
  const recommended = recommendedLesson(progress);
  const remaining = Math.max(0, progress.dailyGoalMinutes - progress.todayMinutes);
  return (
    <main className="section-page practice-page">
      <header className="section-heading">
        <span className="section-kicker">按自己的节奏</span>
        <h1>今日练习</h1>
        <p>{remaining ? `距今日目标还差 ${remaining} 分钟。` : '今日目标已完成，你仍可以沿路线继续学习。'}</p>
      </header>
      <section className="recommended-card">
        <div>
          <span className="mini-label">为你推荐</span>
          <h2>{recommended.title}</h2>
          <p>{recommended.subtitle}</p>
          <div className="lesson-meta"><span><Clock3 size={17} /> {recommended.minutes} 分钟</span><span>+{recommended.xp} XP</span></div>
        </div>
        <button className="primary-button" type="button" onClick={() => onOpenLesson(recommended.id)}>
          {progress.currentLesson?.lessonId === recommended.id ? '继续练习' : '开始练习'} <ArrowRight size={18} />
        </button>
      </section>
      <section className="professional-drill-card">
        <div className="drill-card-icon"><BrainCircuit aria-hidden="true" size={30} /></div>
        <div>
          <span className="mini-label">专业学习者</span>
          <h2>专业强化刷题</h2>
          <p>混合发音、词性、疑问词、时态与句法；答错的题会在末尾循环出现，直到真正掌握。</p>
          <div className="drill-card-meta"><span><Headphones aria-hidden="true" size={16} /> 听力混合</span><span>可定制题量</span><span>B1–B2</span></div>
        </div>
        <button className="primary-button" type="button" onClick={onStartDrill}>
          开始专业强化刷题 <ArrowRight aria-hidden="true" size={18} />
        </button>
      </section>
      <section className="review-strip">
        <RotateCcw aria-hidden="true" size={24} />
        <div><h2>错题回顾</h2><p>{progress.mistakeIds.length ? `目前有 ${progress.mistakeIds.length} 个知识点值得再看一遍。` : '目前没有待复习错题，保持这个节奏。'}</p></div>
      </section>
    </main>
  );
}
