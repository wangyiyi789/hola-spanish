export type CityId = 'alphabet-harbor' | 'word-market' | 'question-plaza' | 'tense-city';

export type LessonId =
  | 'alphabet-enye'
  | 'parts-sentence'
  | 'questions-real-life'
  | 'tenses-today-yesterday';

export type LessonStepKind = 'explain' | 'choice' | 'fill' | 'challenge';

export interface VocabularyItem {
  id: string;
  term: string;
  partOfSpeech: string;
  meaning: string;
  example: string;
  translation: string;
  scene?: {
    title: string;
    line: string;
    translation: string;
    speech: string;
  };
}

export interface StepOption {
  id: string;
  label: string;
  detail?: string;
  image?: string;
}

interface BaseLessonStep {
  id: string;
  kind: LessonStepKind;
  eyebrow: string;
  prompt: string;
  explanation?: string;
  example?: string;
  translation?: string;
  speech?: string;
  wordNotes?: Array<{ term: string; label: string }>;
}

export interface ExplainStep extends BaseLessonStep {
  kind: 'explain';
  title: string;
  body: string;
  spotlight: string;
  tip: string;
}

export interface ChoiceStep extends BaseLessonStep {
  kind: 'choice' | 'challenge';
  options: StepOption[];
  correctOptionId: string;
}

export interface FillStep extends BaseLessonStep {
  kind: 'fill';
  before: string;
  after: string;
  acceptedAnswers: string[];
  hint: string;
}

export type LessonStep = ExplainStep | ChoiceStep | FillStep;

export interface Lesson {
  id: LessonId;
  nodeId: string;
  cityId: CityId;
  title: string;
  subtitle: string;
  minutes: number;
  xp: number;
  steps: LessonStep[];
  vocabulary: VocabularyItem[];
  nextLessonId?: LessonId;
}

export interface CourseNode {
  id: string;
  cityId: CityId;
  title: string;
  subtitle: string;
  symbol: string;
  lessonId?: LessonId;
  prerequisiteNodeId?: string;
  minutes: number;
  xp: number;
}

export interface CourseCity {
  id: CityId;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  nodes: CourseNode[];
}
