import { ArrowRight, BookOpen, Check, Flame, MessageCircle, Pencil } from 'lucide-react';
import type { Progress } from '../../domain/progress';
import { GoalPicker } from './GoalPicker';
import { DailyPhrase } from './DailyPhrase';

interface DailyPlanProps {
  progress: Progress;
  onGoalChange: (minutes: Progress['dailyGoalMinutes']) => void;
  onContinue: () => void;
  compact?: boolean;
}

const tasks = [
  { id: 'review-vowels', title: '复习 5 个字母', minutes: '4 分钟', icon: BookOpen },
  { id: 'lesson:alphabet-enye', title: '完成 Ñ 发音课', minutes: '6 分钟', icon: Pencil },
  { id: 'sentence-practice', title: '用新词造句', minutes: '5 分钟', icon: MessageCircle },
];

function weekFootprint(progress: Progress): Set<number> {
  if (!progress.lastStudyDate || progress.streak <= 0) return new Set();

  const dayMs = 86_400_000;
  const today = Date.parse(`${progress.todayDate}T00:00:00Z`);
  const todayIndex = (new Date(today).getUTCDay() + 6) % 7;
  const weekStart = today - todayIndex * dayMs;
  const lastStudy = Date.parse(`${progress.lastStudyDate}T00:00:00Z`);
  const completed = new Set<number>();

  for (let offset = 0; offset < Math.min(progress.streak, 7); offset += 1) {
    const studied = lastStudy - offset * dayMs;
    if (studied >= weekStart && studied < weekStart + 7 * dayMs) {
      completed.add((new Date(studied).getUTCDay() + 6) % 7);
    }
  }
  return completed;
}

export function DailyPlan({ progress, onGoalChange, onContinue, compact = false }: DailyPlanProps) {
  const ratio = Math.min(100, Math.round((progress.todayMinutes / progress.dailyGoalMinutes) * 100));
  const overflow = Math.max(0, progress.todayMinutes - progress.dailyGoalMinutes);
  const remaining = Math.max(0, progress.dailyGoalMinutes - progress.todayMinutes);
  const completedWeekdays = weekFootprint(progress);
  const todayIndex = (new Date(`${progress.todayDate}T00:00:00Z`).getUTCDay() + 6) % 7;

  if (compact) {
    return (
      <>
        <section className="mobile-goal-card" aria-labelledby="mobile-goal-title">
          <div className="daily-progress-heading">
            <h2 id="mobile-goal-title">每日目标</h2>
            <strong>{progress.dailyGoalMinutes} 分钟</strong>
          </div>
          <div className="progress-track" aria-label={`今天已学习 ${progress.todayMinutes} 分钟`}>
            <div className="progress-fill" style={{ width: `${ratio}%` }} />
          </div>
          <p className={overflow > 0 ? 'goal-overflow' : 'goal-remaining'}>
            {overflow > 0 ? `已超出目标 ${overflow} 分钟` : `今天已学习 ${progress.todayMinutes} 分钟，还差 ${remaining} 分钟`}
          </p>
          <button className="continue-button" type="button" onClick={onContinue}>
            {overflow > 0 || remaining === 0 ? '继续探索' : '继续学习'}
            <ArrowRight aria-hidden="true" size={17} />
          </button>
        </section>
        <DailyPhrase />
      </>
    );
  }

  return (
    <aside className="right-rail">
      <div className="right-rail-inner">
        <div className="right-rail-primary">
          <h2>每日学习目标</h2>
          <p className="goal-help">选择适合今天的节奏，达标后仍可继续。</p>
          <GoalPicker value={progress.dailyGoalMinutes} onChange={onGoalChange} />
          <section className="daily-progress-card" aria-label="今日学习进度">
            <div className="daily-progress-heading">
              <span>今天已学习</span>
              <strong>{progress.todayMinutes} / {progress.dailyGoalMinutes}</strong>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${ratio}%` }} />
            </div>
            <p className={overflow > 0 ? 'goal-overflow' : 'goal-remaining'}>
              {overflow > 0 ? `已超出目标 ${overflow} 分钟` : `还差 ${remaining} 分钟完成今日目标`}
            </p>
            <button className="continue-button" type="button" onClick={onContinue}>
              {overflow > 0 || remaining === 0 ? '继续探索' : '继续学习'}
              <ArrowRight aria-hidden="true" size={17} />
            </button>
          </section>
          <section className="daily-plan">
            <h3>今日学习计划</h3>
            <div className="task-list">
              {tasks.map(({ id, title, minutes, icon: TaskIcon }) => {
                const completed = progress.completedTaskIds.includes(id);
                return (
                  <div className="task-row" key={id}>
                    <span className="task-icon"><TaskIcon aria-hidden="true" size={15} /></span>
                    <div><strong>{title}</strong><span>{minutes}</span></div>
                    <span className={`task-check${completed ? ' is-done' : ''}`}>
                      {completed ? <Check aria-hidden="true" size={13} /> : null}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
        <div className="right-rail-secondary">
          <section className="streak-card">
            <div className="streak-heading">
              <h3>连续学习天数</h3>
              <span className="streak-count"><Flame aria-hidden="true" fill="currentColor" size={20} /> {progress.streak} 天</span>
            </div>
            <div className="week-row" aria-label="本周学习足迹">
              {['一', '二', '三', '四', '五', '六', '日'].map((day, index) => {
                const completed = completedWeekdays.has(index);
                return (
                  <div className={`week-day${index === todayIndex ? ' is-today' : ''}`} key={day}>
                    {day}
                    <span className={`week-dot${completed ? ' is-done' : ''}`}>
                      {completed ? <Check aria-hidden="true" size={12} /> : null}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>
          <DailyPhrase />
        </div>
      </div>
    </aside>
  );
}


