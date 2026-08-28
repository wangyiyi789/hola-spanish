import { Award, BookOpen, Flame, Timer } from 'lucide-react';
import { lessons } from '../../data/curriculum';
import type { Progress } from '../../domain/progress';

export function LearningRecords({ progress }: { progress: Progress }) {
  const completed = Object.values(lessons).filter((lesson) => progress.completedNodeIds.includes(lesson.nodeId));
  return (
    <main className="section-page">
      <header className="section-heading">
        <span className="section-kicker">看见长期积累</span>
        <h1>学习记录</h1>
        <p>不是只看连续天数，也记录你真正学过的课程、词汇和投入时间。</p>
      </header>
      <div className="record-grid">
        <article><Award size={23} /><strong>{progress.xp}</strong><span>总 XP</span></article>
        <article><Flame size={23} /><strong>{progress.streak}</strong><span>连续天数</span></article>
        <article><Timer size={23} /><strong>{progress.todayMinutes}</strong><span>今日分钟</span></article>
        <article><BookOpen size={23} /><strong>{progress.vocabularyIds.length}</strong><span>已收集词语</span></article>
      </div>
      <section className="record-list">
        <div className="record-list-heading"><h2>完成的课程</h2><span>{completed.length} 课</span></div>
        {completed.length ? completed.map((lesson) => (
          <div className="record-row" key={lesson.id}>
            <span className="record-check">✓</span>
            <div><strong>{lesson.title}</strong><small>{lesson.subtitle}</small></div>
            <span>+{lesson.xp} XP</span>
          </div>
        )) : <p className="record-empty">完成第一个互动关卡后，课程会记录在这里。</p>}
      </section>
    </main>
  );
}
