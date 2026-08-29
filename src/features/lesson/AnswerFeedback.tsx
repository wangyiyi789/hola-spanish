import { ArrowRight, Check, Lightbulb, RotateCcw } from 'lucide-react';
import type { LessonStep } from '../../domain/course';
import { resolvePublicPath } from '../../services/publicPath';

interface AnswerFeedbackProps {
  correct: boolean;
  skipped?: boolean;
  step: LessonStep;
  xp: number;
  actionLabel?: string;
  onContinue: () => void;
}

export function AnswerFeedback({ correct, skipped = false, step, xp, actionLabel = '继续', onContinue }: AnswerFeedbackProps) {
  const skippedAnswer = skipped && step.kind === 'fill' ? step.acceptedAnswers[0] : null;

  return (
    <section className={`answer-feedback${skipped ? ' is-skipped' : correct ? ' is-correct' : ' is-incorrect'}`} aria-live="polite">
      <img className="feedback-lolo" src={resolvePublicPath('/assets/lolo-guide.jpg')} alt="Lolo 为你鼓励" />
      <div className="feedback-heading">
        <span className="feedback-icon">
          {correct ? <Check aria-hidden="true" size={27} /> : <RotateCcw aria-hidden="true" size={24} />}
        </span>
        <div>
          <h2>{skipped ? '已跳过拼写' : correct ? '¡Muy bien!' : '再想一想'}</h2>
          <p>{skipped ? '没问题，先认识正确写法，再继续学习。' : correct ? '很棒！你理解了这一点。' : '没关系，错误会帮你记得更牢。'}</p>
        </div>
      </div>
      {skippedAnswer ? <p className="skipped-answer">正确写法：<strong lang="es">{skippedAnswer}</strong></p> : null}
      <div className="feedback-reason">
        <span><Lightbulb aria-hidden="true" size={17} /> 为什么？</span>
        <p>{step.explanation}</p>
      </div>
      {step.example ? (
        <div className="example-panel">
          <span>把新知识放进句子</span>
          <strong>{step.example}</strong>
          <p>{step.translation}</p>
        </div>
      ) : null}
      <div className="feedback-meta">
        <div className="word-notes">
          {step.wordNotes?.map((note) => <span key={note.term}>{note.term} · {note.label}</span>)}
        </div>
        <strong>+{correct && !skipped ? xp : 0} XP</strong>
      </div>
      <button className={`lesson-primary${correct ? ' is-success' : ''}`} type="button" onClick={onContinue}>
        {actionLabel} <ArrowRight aria-hidden="true" size={18} />
      </button>
    </section>
  );
}

