import { ArrowRight, Check, Lightbulb, RotateCcw } from 'lucide-react';
import type { LessonStep } from '../../domain/course';
import { resolvePublicPath } from '../../services/publicPath';

interface AnswerFeedbackProps {
  correct: boolean;
  step: LessonStep;
  xp: number;
  actionLabel?: string;
  onContinue: () => void;
}

export function AnswerFeedback({ correct, step, xp, actionLabel = '继续', onContinue }: AnswerFeedbackProps) {
  return (
    <section className={`answer-feedback${correct ? ' is-correct' : ' is-incorrect'}`} aria-live="polite">
      <img className="feedback-lolo" src={resolvePublicPath('/assets/lolo-guide.jpg')} alt="Lolo 为你鼓励" />
      <div className="feedback-heading">
        <span className="feedback-icon">
          {correct ? <Check aria-hidden="true" size={27} /> : <RotateCcw aria-hidden="true" size={24} />}
        </span>
        <div>
          <h2>{correct ? '¡Muy bien!' : '再想一想'}</h2>
          <p>{correct ? '很棒！你理解了这一点。' : '没关系，错误会帮你记得更牢。'}</p>
        </div>
      </div>
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
        <strong>+{correct ? xp : 0} XP</strong>
      </div>
      <button className={`lesson-primary${correct ? ' is-success' : ''}`} type="button" onClick={onContinue}>
        {actionLabel} <ArrowRight aria-hidden="true" size={18} />
      </button>
    </section>
  );
}
