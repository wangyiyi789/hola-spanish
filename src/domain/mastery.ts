export type MasteryPhase = 'learning' | 'review' | 'complete';

export interface MasteryQueue {
  phase: MasteryPhase;
  current: string | null;
  pending: string[];
  retry: string[];
  attempts: number;
  errors: number;
  reviewRound: number;
  initialCount: number;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

export function isMasteryQueue(value: unknown): value is MasteryQueue {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return false;
  const queue = value as Record<string, unknown>;
  return (queue.phase === 'learning' || queue.phase === 'review' || queue.phase === 'complete')
    && (queue.current === null || typeof queue.current === 'string')
    && isStringArray(queue.pending)
    && isStringArray(queue.retry)
    && isNonNegativeInteger(queue.attempts)
    && isNonNegativeInteger(queue.errors)
    && isNonNegativeInteger(queue.reviewRound)
    && isNonNegativeInteger(queue.initialCount);
}

