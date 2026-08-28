import type { MasteryQueue } from '../../domain/mastery';

export type { MasteryQueue } from '../../domain/mastery';

export function createMasteryQueue(ids: string[]): MasteryQueue {
  const pending = [...ids];
  return {
    phase: pending.length ? 'learning' : 'complete',
    current: pending[0] ?? null,
    pending,
    retry: [],
    attempts: 0,
    errors: 0,
    reviewRound: 0,
    initialCount: pending.length,
  };
}

export function answerMasteryQueue(queue: MasteryQueue, correct: boolean): MasteryQueue {
  if (!queue.current || queue.phase === 'complete') return queue;

  const result = {
    ...queue,
    attempts: queue.attempts + 1,
    errors: queue.errors + (correct ? 0 : 1),
  };

  if (!correct) {
    return {
      ...result,
      retry: queue.retry.includes(queue.current) ? queue.retry : [...queue.retry, queue.current],
    };
  }

  const pending = queue.pending.slice(1);
  const retry = queue.retry;

  if (pending.length) {
    return { ...result, pending, retry, current: pending[0] };
  }

  if (retry.length) {
    return {
      ...result,
      phase: 'review',
      pending: retry,
      retry: [],
      current: retry[0],
      reviewRound: queue.reviewRound + 1,
    };
  }

  return { ...result, phase: 'complete', pending: [], retry: [], current: null };
}
