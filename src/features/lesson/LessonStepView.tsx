import { Volume2 } from 'lucide-react';
import type { LessonStep } from '../../domain/course';

interface LessonStepViewProps {
  step: LessonStep;
  selected: string;
  input: string;
  speechAvailable: boolean;
  onSelect: (answer: string) => void;
  onInput: (answer: string) => void;
  onSpeak: (text: string) => void;
}

const containsSpanishText = (text: string) => /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(text);

export function LessonStepView({
  step,
  selected,
  input,
  speechAvailable,
  onSelect,
  onInput,
  onSpeak,
}: LessonStepViewProps) {
  if (step.kind === 'explain') {
    return (
      <section className="explain-step">
        <p className="lesson-eyebrow">{step.eyebrow}</p>
        <h1>{step.title}</h1>
        <div className="spotlight" lang="es">{step.spotlight}</div>
        <p className="explain-body">{step.body}</p>
        <div className="pronunciation-tip"><strong>发音提示</strong><span>{step.tip}</span></div>
        {step.speech ? (
          <button className="speech-button" type="button" onClick={() => onSpeak(step.speech ?? '')}>
            <Volume2 aria-hidden="true" size={18} /> {speechAvailable ? '听一遍' : '查看文字提示'}
          </button>
        ) : null}
      </section>
    );
  }

  if (step.kind === 'fill') {
    return (
      <section className="question-step">
        <p className="lesson-eyebrow">{step.eyebrow}</p>
        <h1>{step.prompt}</h1>
        <p className="question-hint">{step.hint}</p>
        <div className="fill-sentence" lang="es">
          <span>{step.before}</span>
          <label>
            <span className="sr-only">填写缺少的西语单词</span>
            <input autoComplete="off" value={input} onChange={(event) => onInput(event.target.value)} />
          </label>
          <span>{step.after}</span>
        </div>
        {step.speech ? (
          <button className="speech-button" type="button" onClick={() => onSpeak(step.speech ?? '')}>
            <Volume2 aria-hidden="true" size={18} /> {speechAvailable ? '听完整句子' : `文字线索：${step.speech}`}
          </button>
        ) : null}
      </section>
    );
  }

  return (
    <section className="question-step">
      <p className="lesson-eyebrow">{step.eyebrow}</p>
      <h1>{step.prompt}</h1>
      {!speechAvailable && step.speech ? <p className="speech-fallback">文字线索：{step.speech}</p> : null}
      <div className={`answer-grid${step.options.some((option) => option.image) ? ' has-images' : ''}`}>
        {step.options.map((option) => (
          <div className={`answer-card${selected === option.id ? ' is-selected' : ''}`} key={option.id}>
            <button
              aria-label={`选择 ${option.label}`}
              className="answer-choice"
              type="button"
              onClick={() => onSelect(option.id)}
            >
              {option.image ? <img alt="" src={option.image} /> : null}
              <strong lang="es">{option.label}</strong>
              {option.detail ? <span>{option.detail}</span> : null}
            </button>
            {containsSpanishText(option.label) ? (
              <button
                aria-label={`朗读 ${option.label}`}
                className="option-speech"
                disabled={!speechAvailable}
                type="button"
                onClick={() => onSpeak(option.label)}
              >
                <Volume2 aria-hidden="true" size={18} />
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}

