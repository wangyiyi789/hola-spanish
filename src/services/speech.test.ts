import { describe, expect, it, vi } from 'vitest';
import { lessons } from '../data/curriculum';
import { createSpeechService } from './speech';

describe('createSpeechService', () => {
  it('returns unavailable without throwing when no speech source exists', async () => {
    await expect(createSpeechService({} as Window).speak('niño')).resolves.toEqual({ ok: false, reason: 'unsupported' });
  });

  it('plays bundled Spanish audio when the browser has no installed voices', async () => {
    const play = vi.fn().mockResolvedValue(undefined);
    const audio = { play, pause: vi.fn(), currentTime: 0 };
    const speechSynthesis = { getVoices: () => [], cancel: vi.fn(), speak: vi.fn() } as unknown as SpeechSynthesis;
    const fakeWindow = { speechSynthesis } as unknown as Window;

    const service = createSpeechService(fakeWindow, () => audio, { niño: '/audio/nino.mp3' });

    await expect(service.speak('niño')).resolves.toEqual({ ok: true, source: 'recording' });
    expect(play).toHaveBeenCalledOnce();
  });

  it('reports a blocked recording instead of claiming silent success', async () => {
    const audio = { play: vi.fn().mockRejectedValue(new Error('blocked')), pause: vi.fn(), currentTime: 0 };
    const service = createSpeechService({} as Window, () => audio, { niño: '/audio/nino.mp3' });

    await expect(service.speak('niño')).resolves.toEqual({ ok: false, reason: 'blocked' });
  });

  it('prefers a Spanish system voice for text without a bundled recording', async () => {
    class FakeUtterance {
      lang = '';
      voice: SpeechSynthesisVoice | null = null;
      rate = 1;
      pitch = 1;
      constructor(public text: string) {}
    }
    const speak = vi.fn();
    const spanishVoice = { lang: 'es-ES', name: 'Spanish' } as SpeechSynthesisVoice;
    const englishVoice = { lang: 'en-US', name: 'English' } as SpeechSynthesisVoice;
    const speechSynthesis = {
      getVoices: () => [englishVoice, spanishVoice],
      cancel: vi.fn(),
      speak,
    } as unknown as SpeechSynthesis;
    const fakeWindow = { speechSynthesis, SpeechSynthesisUtterance: FakeUtterance } as unknown as Window;

    const result = createSpeechService(fakeWindow).speak('palabra de prueba');
    const utterance = speak.mock.calls[0]?.[0] as unknown as SpeechSynthesisUtterance;
    utterance.onend?.({} as SpeechSynthesisEvent);

    await expect(result).resolves.toEqual({ ok: true, source: 'system' });
    expect(speak).toHaveBeenCalledOnce();
    expect(speak.mock.calls[0][0]).toMatchObject({ lang: 'es-ES', voice: spanishVoice, rate: 0.82 });
  });

  it('has a bundled recording for every current Spanish pronunciation control', async () => {
    const audio = { play: vi.fn().mockResolvedValue(undefined), pause: vi.fn(), currentTime: 0 };
    const service = createSpeechService({} as Window, () => audio);
    const texts = Object.values(lessons).flatMap((lesson) => lesson.steps.flatMap((step) => [
      ...(step.speech ? [step.speech] : []),
      ...('options' in step ? step.options.filter((option) => /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(option.label)).map((option) => option.label) : []),
    ]));

    for (const text of new Set(texts)) {
      await expect(service.speak(text), text).resolves.toEqual({ ok: true, source: 'recording' });
    }
  });
});
