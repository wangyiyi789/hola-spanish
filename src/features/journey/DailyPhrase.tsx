import { useMemo, useState } from 'react';
import { RefreshCw, Volume2 } from 'lucide-react';
import { createSpeechService, type SpeechService } from '../../services/speech';

const dailyPhrases = [
  { spanish: 'El niño come pan.', chinese: '这个男孩在吃面包。' },
  { spanish: 'La mujer bebe café.', chinese: '这位女士在喝咖啡。' },
  { spanish: '¿Dónde está la estación?', chinese: '车站在哪里？' },
  { spanish: 'Ayer estudié español.', chinese: '我昨天学习了西班牙语。' },
  { spanish: 'Mañana empezamos de nuevo.', chinese: '明天我们重新开始。' },
] as const;

interface DailyPhraseProps {
  speechService?: SpeechService;
}

export function DailyPhrase({ speechService }: DailyPhraseProps) {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [speechNotice, setSpeechNotice] = useState('');
  const speech = useMemo(() => speechService ?? createSpeechService(window), [speechService]);
  const phrase = dailyPhrases[phraseIndex];

  const refresh = () => {
    setPhraseIndex((current) => (current + 1) % dailyPhrases.length);
    setSpeechNotice('');
  };

  const readAloud = async () => {
    setSpeechNotice('正在播放西班牙语发音…');
    const result = await speech.speak(phrase.spanish);
    if (result.ok) {
      setSpeechNotice(result.source === 'recording' ? '正在播放标准西语录音。' : '正在使用系统西语语音播放。');
      return;
    }
    setSpeechNotice(result.reason === 'blocked'
      ? '浏览器阻止了声音，请允许此页面播放音频后再试。'
      : '当前发音资源不可用，请稍后再试。');
  };

  return (
    <section className="daily-phrase" aria-labelledby="daily-phrase-title">
      <div className="daily-phrase-heading">
        <small id="daily-phrase-title">每日一句</small>
        <button aria-label="换一句每日西语" type="button" onClick={refresh}>
          <RefreshCw aria-hidden="true" size={14} /> 换一句
        </button>
      </div>
      <strong lang="es">{phrase.spanish}</strong>
      <span>{phrase.chinese}</span>
      <button
        aria-label="朗读每日一句"
        className="daily-phrase-speech"
        disabled={!speech.available}
        type="button"
        onClick={() => void readAloud()}
      >
        <Volume2 aria-hidden="true" size={15} /> 朗读
      </button>
      {speechNotice ? <p className="daily-phrase-notice" role="status">{speechNotice}</p> : null}
    </section>
  );
}

