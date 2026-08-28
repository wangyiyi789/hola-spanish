import { BookOpen, Volume2 } from 'lucide-react';
import { lessons } from '../../data/curriculum';
import type { Progress } from '../../domain/progress';
import { createSpeechService } from '../../services/speech';
import { collectVocabulary } from './vocabulary';

export function VocabularyBook({ progress }: { progress: Progress }) {
  const words = collectVocabulary(progress.vocabularyIds, lessons);
  const speech = createSpeechService(window);

  return (
    <main className="section-page">
      <header className="section-heading">
        <span className="section-kicker">随课程自然积累</span>
        <h1>我的单词本</h1>
        <p>每个单词都带着词性和完整句子回来复习，不背孤立的中文释义。</p>
      </header>
      <div className="vocabulary-summary">
        <BookOpen aria-hidden="true" size={22} />
        <strong>{words.length} 个已掌握词语</strong>
        <span>完成一个关卡后，关卡里的新词会自动加入这里。</span>
      </div>
      {words.length ? (
        <div className="vocabulary-grid">
          {words.map((word) => (
            <article className="word-card" key={word.id}>
              <div className="word-card-title">
                <div><h2>{word.term}</h2><span>{word.partOfSpeech}</span></div>
                <button type="button" aria-label={`朗读 ${word.term}`} onClick={() => speech.speak(word.term)}>
                  <Volume2 aria-hidden="true" size={19} />
                </button>
              </div>
              <p className="word-meaning">{word.meaning}</p>
              <blockquote>{word.example}</blockquote>
              <p className="word-translation">{word.translation}</p>
              {word.scene ? (
                <div className="cinematic-scene">
                  <div className="scene-heading">
                    <div><span>原创影视情境配音</span><strong>{word.scene.title}</strong></div>
                    <button type="button" aria-label={`播放 ${word.term} 的影视情境配音`} onClick={() => void speech.speak(word.scene!.speech)}>
                      <Volume2 aria-hidden="true" size={18} />
                    </button>
                  </div>
                  <blockquote lang="es">{word.scene.line}</blockquote>
                  <p>{word.scene.translation}</p>
                </div>
              ) : null}
            </article>
          ))}
        </div>
      ) : (
        <div className="empty-study-state">
          <span aria-hidden="true">Ñ</span>
          <div><h2>第一个词正在路上</h2><p>完成“你好，Ñ”后，niño 和 mañana 会连同例句一起收藏。</p></div>
        </div>
      )}
    </main>
  );
}
