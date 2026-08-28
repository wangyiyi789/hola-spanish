import { describe, expect, it } from 'vitest';
import { answerMasteryQueue, createMasteryQueue } from './masteryQueue';

describe('masteryQueue', () => {
  it('keeps a missed question current until corrected and still reviews it at the end', () => {
    const initial = createMasteryQueue(['first', 'second']);

    const missed = answerMasteryQueue(initial, false);
    expect(missed).toMatchObject({ current: 'first', pending: ['first', 'second'], retry: ['first'], errors: 1 });

    const corrected = answerMasteryQueue(missed, true);
    expect(corrected).toMatchObject({ current: 'second', pending: ['second'], retry: ['first'] });

    const finishedInitialPass = answerMasteryQueue(corrected, true);
    expect(finishedInitialPass).toMatchObject({ phase: 'review', current: 'first', pending: ['first'], reviewRound: 1 });
  });

  it('requires immediate correction and another review round after a review mistake', () => {
    const missed = answerMasteryQueue(createMasteryQueue(['only']), false);
    const corrected = answerMasteryQueue(missed, true);
    expect(corrected.phase).toBe('review');

    const missedAgain = answerMasteryQueue(corrected, false);
    expect(missedAgain).toMatchObject({ phase: 'review', current: 'only', pending: ['only'], retry: ['only'] });

    const correctedAgain = answerMasteryQueue(missedAgain, true);
    expect(correctedAgain).toMatchObject({ phase: 'review', current: 'only', reviewRound: 2 });

    expect(answerMasteryQueue(correctedAgain, true).phase).toBe('complete');
  });
});

