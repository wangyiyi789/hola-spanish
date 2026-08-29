import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { SpeechService } from '../../services/speech';
import { DailyPhrase } from './DailyPhrase';

describe('DailyPhrase', () => {
  it('refreshes the phrase and reads the currently displayed Spanish sentence', async () => {
    const user = userEvent.setup();
    const speech: SpeechService = {
      available: true,
      speak: vi.fn().mockResolvedValue({ ok: true, source: 'recording' }),
    };

    render(<DailyPhrase speechService={speech} />);

    expect(screen.getByText('每日一句')).toBeVisible();
    expect(screen.getByText('El niño come pan.')).toBeVisible();

    await user.click(screen.getByRole('button', { name: '换一句每日西语' }));
    expect(screen.getByText('La mujer bebe café.')).toBeVisible();

    await user.click(screen.getByRole('button', { name: '朗读每日一句' }));
    expect(speech.speak).toHaveBeenCalledWith('La mujer bebe café.');
    expect(screen.getByText('正在播放标准西语录音。')).toBeVisible();
  });
});

