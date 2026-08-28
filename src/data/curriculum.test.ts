import { describe, expect, it } from 'vitest';
import { cities, curriculumFacts, lessons } from './curriculum';

describe('curriculum', () => {
  it('contains four ordered cities and one playable lesson per city', () => {
    expect(cities.map((city) => city.id)).toEqual([
      'alphabet-harbor',
      'word-market',
      'question-plaza',
      'tense-city',
    ]);

    for (const city of cities) {
      expect(city.nodes.some((node) => Boolean(node.lessonId))).toBe(true);
    }
  });

  it('lists the complete staged beginner syllabus', () => {
    expect(curriculumFacts.alphabet).toHaveLength(27);
    expect(curriculumFacts.partsOfSpeech).toHaveLength(9);
    expect(curriculumFacts.questionExpressions).toHaveLength(12);
    expect(curriculumFacts.tenses).toHaveLength(9);
  });

  it('gives every playable lesson a complete short learning loop', () => {
    const playableLessons = Object.values(lessons);
    expect(playableLessons).toHaveLength(4);

    for (const lesson of playableLessons) {
      expect(lesson.steps.length).toBeGreaterThanOrEqual(4);
      expect(lesson.steps.length).toBeLessThanOrEqual(6);
      expect(lesson.minutes).toBeGreaterThan(0);
      expect(lesson.xp).toBeGreaterThan(0);
      expect(lesson.vocabulary.length).toBeGreaterThan(0);
      expect(lesson.vocabulary[0].example).toMatch(/[.!?]$/);
    }
  });

  it('includes original cinematic scene dubbing for selected vocabulary', () => {
    const sceneWords = Object.values(lessons)
      .flatMap((lesson) => lesson.vocabulary)
      .filter((word) => 'scene' in word && Boolean(word.scene));

    expect(sceneWords.length).toBeGreaterThanOrEqual(4);
  });
});
