import type { Lesson, VocabularyItem } from '../../domain/course';

export function collectVocabulary(
  vocabularyIds: string[],
  lessonCollection: Record<string, Lesson>,
): VocabularyItem[] {
  const wanted = new Set(vocabularyIds);
  const seen = new Set<string>();
  return Object.values(lessonCollection)
    .flatMap((lesson) => lesson.vocabulary)
    .filter((word) => wanted.has(word.id) && !seen.has(word.id) && Boolean(seen.add(word.id)));
}
