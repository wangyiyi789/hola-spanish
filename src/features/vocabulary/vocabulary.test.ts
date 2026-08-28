import { describe, expect, it } from 'vitest';
import { lessons } from '../../data/curriculum';
import { collectVocabulary } from './vocabulary';

describe('collectVocabulary', () => {
  it('returns only learned words and keeps their example sentences', () => {
    const words = collectVocabulary(['nino', 'estudio'], lessons);

    expect(words.map((word) => word.term)).toEqual(['niño', 'estudio']);
    expect(words[0].example).toBe('El niño come pan.');
  });
});
