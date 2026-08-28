import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { createInitialProgress } from '../progress/progressStore';
import { VocabularyBook } from './VocabularyBook';

describe('VocabularyBook', () => {
  it('shows an original cinematic scene line for a selected learned word', () => {
    const progress = { ...createInitialProgress('2026-08-28'), vocabularyIds: ['nino'] };

    render(<VocabularyBook progress={progress} />);

    expect(screen.getByText('原创影视情境配音')).toBeVisible();
    expect(screen.getByRole('button', { name: '播放 niño 的影视情境配音' })).toBeVisible();
  });
});
