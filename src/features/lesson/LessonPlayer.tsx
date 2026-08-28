import { useMemo, useState } from 'react';
import { ArrowRight, X } from 'lucide-react';
import type { Lesson } from '../../domain/course';
import type { MasteryQueue } from '../../domain/mastery';
import { createSpeechService } from '../../services/speech';
import { answerMasteryQueue, createMasteryQueue } from '../practice/masteryQueue';
import { AnswerFeedback } from './AnswerFeedback';
import { LessonComplete } from './LessonComplete';
import { LessonStepView } from './LessonStepView';

export interface LessonCheckpointEvent {
  lessonId: Lesson['id'];
  stepIndex: number;
  mistakeId?: string;
  mastery?: MasteryQueue;
}

interface LessonPlayerProps {
  lesson: Lesson;
  resumeStep: number;
  resumeMastery?: MasteryQueue;
  onExit: () => void;
  onCheckpoint: (event: LessonCheckpointEvent) => void;
  onComplete: (lessonId: Lesson['id']) => void;
  onNext?: () => void;
}

export function LessonPlayer({ lesson, resumeStep, resumeMastery, onExit, onCheckpoint, onComplete, onNext }: LessonPlayerProps) {
  const resumedMasteryStep = resumeMastery?.current
    ? lesson.steps.findIndex((item) => item.id === resumeMastery.current)
    : -1;
  const initialStep = resumedMasteryStep >= 0
    ? resumedMasteryStep
    : Math.min(Math.max(0, resumeStep), lesson.steps.length - 1);
  const [stepIndex, setStepIndex] = useState(initialStep);
  const [selected, setSelected] = useState('');
  const [input, setInput] = useState('');
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  const [complete, setComplete] = useState(false);
  const [speechNotice, setSpeechNotice] = useState('');
  const [mastery, setMastery] = useState(() => resumeMastery && resumedMasteryStep >= 0
    ? resumeMastery
    : createMasteryQueue(lesson.steps.slice(initialStep).map((item) => item.id)));
  const speech = useMemo(() => createSpeechService(window), []);
  const step = lesson.steps[stepIndex];
  const progress = mastery.phase === 'review'
    ? Math.round(((mastery.initialCount - mastery.pending.length + 1) / mastery.initialCount) * 100)
    : Math.round(((stepIndex + 1) / lesson.steps.length) * 100);

  const resetAnswer = () => {
    setSelected('');
    setInput('');
    setChecked(false);
    setCorrect(false);
    setSpeechNotice('');
  };

  const advance = () => {
    const nextMastery = answerMasteryQueue(mastery, step.kind === 'explain' || correct);
    if (nextMastery.phase === 'complete') {
      setComplete(true);
      onComplete(lesson.id);
      return;
    }
    const nextIndex = lesson.steps.findIndex((item) => item.id === nextMastery.current);
    setMastery(nextMastery);
    setStepIndex(nextIndex);
    resetAnswer();
    onCheckpoint({ lessonId: lesson.id, stepIndex: nextIndex, mastery: nextMastery });
  };

  const checkAnswer = () => {
    if (step.kind === 'explain') return;
    const isCorrect = step.kind === 'fill'
      ? step.acceptedAnswers.some((answer) => answer.toLocaleLowerCase('es') === input.trim().toLocaleLowerCase('es'))
      : selected === step.correctOptionId;
    setCorrect(isCorrect);
    setChecked(true);
    const checkpointMastery = answerMasteryQueue(mastery, isCorrect);
    const checkpointIndex = checkpointMastery.current
      ? lesson.steps.findIndex((item) => item.id === checkpointMastery.current)
      : stepIndex;
    onCheckpoint({
      lessonId: lesson.id,
      stepIndex: checkpointIndex,
      mastery: checkpointMastery,
      ...(isCorrect ? {} : { mistakeId: step.id }),
    });
  };

  const exit = () => {
    const checkpointMastery = checked ? answerMasteryQueue(mastery, correct) : mastery;
    const checkpointIndex = checkpointMastery.current
      ? lesson.steps.findIndex((item) => item.id === checkpointMastery.current)
      : stepIndex;
    onCheckpoint({ lessonId: lesson.id, stepIndex: checkpointIndex, mastery: checkpointMastery });
    onExit();
  };

  const speak = async (text: string) => {
    setSpeechNotice('正在播放西班牙语发音…');
    const result = await speech.speak(text);
    if (result.ok) {
      setSpeechNotice(result.source === 'recording'
        ? '正在播放标准西语录音。'
        : '正在使用系统西语语音播放。');
      return;
    }
    setSpeechNotice(result.reason === 'blocked'
      ? '浏览器阻止了声音，请允许此页面播放音频后再试。'
      : '当前发音资源不可用，请稍后再试。');
  };

  if (complete) {
    return <LessonComplete lesson={lesson} onBack={onExit} onNext={lesson.nextLessonId ? onNext : undefined} />;
  }

  const hasAnswer = step.kind === 'fill' ? input.trim().length > 0 : step.kind === 'explain' ? true : selected.length > 0;
  const nextMastery = checked ? answerMasteryQueue(mastery, correct) : mastery;
  const feedbackActionLabel = !correct
    ? '重新作答'
    : mastery.phase === 'review'
    ? correct && nextMastery.phase === 'complete'
      ? '掌握了，完成课程'
      : correct
        ? '掌握了，继续'
        : '继续'
    : '继续';

  return (
    <main className="lesson-shell">
      <header className="lesson-topbar">
        <button aria-label="退出课程" className="lesson-close" type="button" onClick={exit}><X aria-hidden="true" size={26} /></button>
        <div className="lesson-progress" aria-label={`课程进度 ${stepIndex + 1} / ${lesson.steps.length}`}>
          <div style={{ width: `${progress}%` }} />
        </div>
        <span>{mastery.phase === 'review' ? `${mastery.pending.length} 题` : `${stepIndex + 1} / ${lesson.steps.length}`}</span>
      </header>
      <div className="lesson-content">
        {checked ? (
          <AnswerFeedback
            actionLabel={feedbackActionLabel}
            correct={correct}
            step={step}
            xp={Math.max(5, Math.round(lesson.xp / lesson.steps.length))}
            onContinue={advance}
          />
        ) : (
          <>
            {mastery.phase === 'review' ? (
              <div className="review-mode-banner" role="status">
                <strong>错题回炉</strong>
                <span>第 {mastery.reviewRound} 轮 · 还有 {mastery.pending.length + mastery.retry.length} 题需要掌握</span>
              </div>
            ) : null}
            <LessonStepView
              input={input}
              selected={selected}
              speechAvailable={speech.available}
              step={step}
              onInput={setInput}
              onSelect={setSelected}
              onSpeak={(text) => void speak(text)}
            />
            {speechNotice ? <p className="speech-notice" role="status">{speechNotice}</p> : null}
            {step.kind === 'explain' ? (
              <button className="lesson-primary" type="button" onClick={advance}>
                继续学习 <ArrowRight aria-hidden="true" size={18} />
              </button>
            ) : (
              <button className="lesson-primary" disabled={!hasAnswer} type="button" onClick={checkAnswer}>检查答案</button>
            )}
          </>
        )}
      </div>
    </main>
  );
}
