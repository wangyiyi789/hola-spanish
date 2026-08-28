import { useMemo, useState } from 'react';
import { ArrowRight, Check, RotateCcw, SlidersHorizontal, Volume2, X } from 'lucide-react';
import { professionalPracticeQuestions, type PracticeQuestion } from '../../data/practiceQuestions';
import { createSpeechService } from '../../services/speech';
import { answerMasteryQueue, createMasteryQueue } from './masteryQueue';

type DrillCategory = PracticeQuestion['category'] | '综合';
type DrillCount = 5 | 10 | 'all';

const categories: DrillCategory[] = ['综合', '发音', '词性', '疑问词', '时态', '句法'];
const levels: PracticeQuestion['level'][] = ['B1 进阶', 'B2 专业'];
const counts: Array<{ value: DrillCount; label: string }> = [
  { value: 5, label: '5 题' },
  { value: 10, label: '10 题' },
  { value: 'all', label: '全部' },
];

function filterQuestions(category: DrillCategory, level: PracticeQuestion['level'], count: DrillCount) {
  const matches = professionalPracticeQuestions.filter((question) =>
    question.level === level && (category === '综合' || question.category === category),
  );
  return count === 'all' ? matches : matches.slice(0, count);
}

function categoryAvailable(category: DrillCategory, level: PracticeQuestion['level']) {
  return category === '综合' || professionalPracticeQuestions.some((question) =>
    question.level === level && question.category === category,
  );
}

export function ProfessionalDrill({ onExit }: { onExit: () => void }) {
  const speech = useMemo(() => createSpeechService(window), []);
  const [category, setCategory] = useState<DrillCategory>('综合');
  const [level, setLevel] = useState<PracticeQuestion['level']>('B1 进阶');
  const [count, setCount] = useState<DrillCount>('all');
  const [sessionQuestions, setSessionQuestions] = useState<PracticeQuestion[]>([]);
  const [mastery, setMastery] = useState(() => createMasteryQueue([]));
  const [selected, setSelected] = useState('');
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);

  const availableQuestions = filterQuestions(category, level, count);
  const questionById = useMemo(
    () => new Map(sessionQuestions.map((question) => [question.id, question])),
    [sessionQuestions],
  );

  const start = () => {
    const questions = filterQuestions(category, level, count);
    setSessionQuestions(questions);
    setMastery(createMasteryQueue(questions.map((question) => question.id)));
    setSelected('');
    setChecked(false);
    setCorrect(false);
  };

  const restart = () => {
    setMastery(createMasteryQueue(sessionQuestions.map((question) => question.id)));
    setSelected('');
    setChecked(false);
    setCorrect(false);
  };

  if (!sessionQuestions.length) {
    return (
      <main className="lesson-shell drill-shell">
        <header className="lesson-topbar drill-setup-topbar">
          <button aria-label="退出刷题" className="lesson-close" type="button" onClick={onExit}><X aria-hidden="true" size={26} /></button>
          <span><SlidersHorizontal aria-hidden="true" size={17} /> 训练设置</span>
        </header>
        <div className="lesson-content drill-setup">
          <div className="drill-setup-heading">
            <span className="lesson-eyebrow">专业学习者</span>
            <h1>定制专业刷题</h1>
            <p>按难度和知识点建立题组。答错时先当场纠正，然后在末尾再回刷一次。</p>
          </div>

          <div className="drill-config-grid">
            <fieldset>
              <legend>难度</legend>
              <div className="drill-config-options">
                {levels.map((item) => (
                  <button aria-pressed={level === item} className={level === item ? 'is-selected' : ''} key={item} type="button" onClick={() => { setLevel(item); setCategory('综合'); }}>{item}</button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>专项</legend>
              <div className="drill-config-options is-wrapping">
                {categories.map((item) => (
                  <button aria-pressed={category === item} className={category === item ? 'is-selected' : ''} disabled={!categoryAvailable(item, level)} key={item} type="button" onClick={() => setCategory(item)}>{item}</button>
                ))}
              </div>
            </fieldset>
            <fieldset>
              <legend>题量</legend>
              <div className="drill-config-options">
                {counts.map((item) => (
                  <button aria-pressed={count === item.value} className={count === item.value ? 'is-selected' : ''} key={item.label} type="button" onClick={() => setCount(item.value)}>{item.label}</button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="drill-setup-summary">
            <div><strong>{availableQuestions.length}</strong><span>道题已准备</span></div>
            <p>{level} · {category === '综合' ? '多题型混合' : `${category}专项`} · 错题循环至掌握</p>
            <button className="lesson-primary" disabled={!availableQuestions.length} type="button" onClick={start}>
              开始刷题 <ArrowRight aria-hidden="true" size={18} />
            </button>
          </div>
        </div>
      </main>
    );
  }

  const question = mastery.current ? questionById.get(mastery.current) : undefined;
  const questionNumber = question
    ? sessionQuestions.findIndex((item) => item.id === question.id) + 1
    : sessionQuestions.length;
  const progress = mastery.phase === 'review'
    ? 100 - Math.round((mastery.pending.length / Math.max(1, mastery.initialCount)) * 100)
    : Math.round((questionNumber / mastery.initialCount) * 100);

  if (mastery.phase === 'complete') {
    const accuracy = Math.round((mastery.initialCount / Math.max(1, mastery.attempts)) * 100);
    return (
      <main className="drill-complete">
        <div className="complete-seal"><Check aria-hidden="true" size={42} /></div>
        <p className="complete-small">专业强化</p>
        <h1>训练完成</h1>
        <p>所有错题都已重新答对，这次不会把“看过答案”当成“真正掌握”。</p>
        <div className="drill-results">
          <div><strong>{accuracy}%</strong><span>作答正确率</span></div>
          <div><strong>{mastery.attempts}</strong><span>总作答次数</span></div>
          <div><strong>{mastery.errors}</strong><span>错误次数</span></div>
          <div><strong>{mastery.reviewRound}</strong><span>回刷轮次</span></div>
        </div>
        <div className="complete-actions">
          <button className="lesson-primary is-success" type="button" onClick={restart}>
            <RotateCcw aria-hidden="true" size={18} /> 再刷同组
          </button>
          <button className="lesson-secondary" type="button" onClick={() => setSessionQuestions([])}>调整训练</button>
          <button className="lesson-secondary" type="button" onClick={onExit}>返回今日练习</button>
        </div>
      </main>
    );
  }

  if (!question) return null;

  const submit = () => {
    const isCorrect = selected === question.correctOptionId;
    setCorrect(isCorrect);
    setChecked(true);
  };

  const advance = () => {
    setMastery(answerMasteryQueue(mastery, correct));
    setSelected('');
    setChecked(false);
    setCorrect(false);
  };

  const next = checked ? answerMasteryQueue(mastery, correct) : mastery;
  const actionLabel = !correct
    ? '重新作答'
    : mastery.phase === 'review'
      ? next.phase === 'complete' ? '掌握了，完成训练' : '掌握了，继续'
      : next.phase === 'review' ? '进入错题强化' : '继续';

  return (
    <main className="lesson-shell drill-shell">
      <header className="lesson-topbar">
        <button aria-label="退出刷题" className="lesson-close" type="button" onClick={onExit}><X aria-hidden="true" size={26} /></button>
        <div className="lesson-progress" aria-label={`刷题进度 ${progress}%`}><div style={{ width: `${Math.max(8, progress)}%` }} /></div>
        <span>{mastery.phase === 'review' ? `${mastery.pending.length} 题` : `${questionNumber} / ${mastery.initialCount}`}</span>
      </header>
      <div className="lesson-content drill-content">
        <div className="drill-heading-row">
          <div>
            <span className="lesson-eyebrow">{mastery.phase === 'review' ? '错题强化' : '专业强化刷题'}</span>
            <h1>{mastery.phase === 'review' ? '错题强化' : '专业强化刷题'}</h1>
          </div>
          <div className="drill-tags"><span>{question.category}</span><span>{question.level}</span></div>
        </div>
        {!checked ? (
          <section className="drill-question">
            <p className="drill-number">{mastery.phase === 'review' ? `回刷第 ${mastery.reviewRound} 轮` : `第 ${questionNumber} 题`}</p>
            <h2>{question.prompt}</h2>
            {question.speech ? (
              <button className="speech-button" type="button" onClick={() => void speech.speak(question.speech!)}>
                <Volume2 aria-hidden="true" size={18} /> 播放题目发音
              </button>
            ) : null}
            <div className="drill-options">
              {question.options.map((option, index) => (
                <button
                  aria-label={`选择 ${option.label}`}
                  aria-pressed={selected === option.id}
                  className={selected === option.id ? 'is-selected' : ''}
                  key={option.id}
                  type="button"
                  onClick={() => setSelected(option.id)}
                >
                  <span aria-hidden="true">{String.fromCharCode(65 + index)}</span>
                  <strong>{option.label}</strong>
                </button>
              ))}
            </div>
            <button className="lesson-primary" disabled={!selected} type="button" onClick={submit}>检查答案</button>
          </section>
        ) : (
          <section className={`drill-feedback${correct ? ' is-correct' : ' is-incorrect'}`} aria-live="polite">
            <span className="drill-feedback-icon">{correct ? <Check aria-hidden="true" size={28} /> : <RotateCcw aria-hidden="true" size={26} />}</span>
            <h2>{correct ? '回答正确' : '答错了，先纠正'}</h2>
            <p>{question.explanation}</p>
            {!correct ? <div className="retry-note">先答对才能进入下一题；这道题在本组末尾还会再出现。</div> : null}
            <button className={`lesson-primary${correct ? ' is-success' : ''}`} type="button" onClick={advance}>
              {actionLabel} <ArrowRight aria-hidden="true" size={18} />
            </button>
          </section>
        )}
      </div>
    </main>
  );
}
