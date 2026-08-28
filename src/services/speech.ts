import { bundledAudioSources } from '../data/audioSources';

export type SpeechResult =
  | { ok: true; source: 'recording' | 'system' }
  | { ok: false; reason: 'unsupported' | 'blocked' | 'failed' };

export interface SpeechService {
  available: boolean;
  speak: (text: string) => Promise<SpeechResult>;
}

export interface AudioPlayer {
  currentTime: number;
  pause: () => void;
  play: () => Promise<void>;
}

export type AudioFactory = (source: string) => AudioPlayer;

type SpeechWindow = Window & {
  Audio?: new (source?: string) => HTMLAudioElement;
  SpeechSynthesisUtterance?: typeof SpeechSynthesisUtterance;
};

export function createSpeechService(
  win: Window,
  providedAudioFactory?: AudioFactory,
  audioSources: Readonly<Record<string, string>> = bundledAudioSources,
): SpeechService {
  const speechWindow = win as SpeechWindow;
  const synthesis = speechWindow.speechSynthesis;
  const Utterance = speechWindow.SpeechSynthesisUtterance;
  const audioFactory = providedAudioFactory
    ?? (speechWindow.Audio ? (source: string) => new speechWindow.Audio!(source) : null);
  let currentAudio: AudioPlayer | null = null;

  const spanishVoice = () => {
    const voices = synthesis?.getVoices() ?? [];
    return voices.find((voice) => voice.lang.toLowerCase() === 'es-es')
      ?? voices.find((voice) => voice.lang.toLowerCase().startsWith('es-'))
      ?? null;
  };

  const speakWithSystemVoice = (text: string): Promise<SpeechResult> => {
    const voice = spanishVoice();
    if (!synthesis || !Utterance || !voice) return Promise.resolve({ ok: false, reason: 'unsupported' });

    return new Promise((resolve) => {
      const utterance = new Utterance(text);
      utterance.lang = voice.lang;
      utterance.voice = voice;
      utterance.rate = 0.82;
      utterance.pitch = 1;
      utterance.onend = () => resolve({ ok: true, source: 'system' });
      utterance.onerror = () => resolve({ ok: false, reason: 'failed' });
      synthesis.cancel();
      synthesis.speak(utterance);
    });
  };

  return {
    available: Boolean(audioFactory && Object.keys(audioSources).length) || Boolean(spanishVoice()),
    async speak(text: string): Promise<SpeechResult> {
      const source = audioSources[text];
      if (source && audioFactory) {
        currentAudio?.pause();
        currentAudio = audioFactory(source);
        currentAudio.currentTime = 0;
        try {
          await currentAudio.play();
          return { ok: true, source: 'recording' };
        } catch {
          const fallback = await speakWithSystemVoice(text);
          return fallback.ok ? fallback : { ok: false, reason: 'blocked' };
        }
      }

      return speakWithSystemVoice(text);
    },
  };
}
