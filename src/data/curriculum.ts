import type { CourseCity, CourseNode, Lesson, LessonId } from '../domain/course';
import { resolvePublicPath } from '../services/publicPath';

export const curriculumFacts = {
  alphabet: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'Ñ', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'],
  partsOfSpeech: ['名词', '冠词', '代词', '动词', '形容词', '副词', '介词', '连词', '感叹词'],
  questionExpressions: ['qué', 'quién', 'cuál', 'cuánto', 'cómo', 'cuándo', 'dónde', 'adónde', 'de dónde', 'por qué', 'para qué', 'a qué hora'],
  tenses: ['现在时', '正在进行时', '现在完成时', '简单过去时', '过去未完成时', '近期将来时', '简单将来时', '条件式', '现在虚拟式'],
} as const;

export const lessons: Record<LessonId, Lesson> = {
  'alphabet-enye': {
    id: 'alphabet-enye',
    nodeId: 'alphabet-enye-node',
    cityId: 'alphabet-harbor',
    title: '你好，Ñ',
    subtitle: '认识西班牙语独有的字母与声音',
    minutes: 6,
    xp: 40,
    nextLessonId: 'parts-sentence',
    vocabulary: [
      { id: 'nino', term: 'niño', partOfSpeech: '名词', meaning: '男孩；孩子', example: 'El niño come pan.', translation: '这个男孩在吃面包。', scene: { title: '悬疑片 · 低声线索', line: 'El niño sabe más de lo que dice.', translation: '这个男孩知道的比他说出来的更多。', speech: 'El niño sabe más de lo que dice.' } },
      { id: 'manana', term: 'mañana', partOfSpeech: '副词／名词', meaning: '明天；早晨', example: 'Nos vemos mañana.', translation: '我们明天见。', scene: { title: '励志片 · 重新出发', line: 'Mañana empezamos de nuevo.', translation: '明天我们重新开始。', speech: 'Mañana empezamos de nuevo.' } },
    ],
    steps: [
      { id: 'enye-intro', kind: 'explain', eyebrow: '一分钟微讲解', prompt: '西语有一个英语里没有的字母', title: 'Ñ 不只是戴帽子的 N', body: 'Ñ 是西班牙语的第 15 个字母，有自己独立的名字和发音。它常听起来接近“尼”与“纽”之间的连读。', spotlight: 'Ñ ñ', tip: '把舌面贴近上颚，声音从鼻腔轻轻送出。', speech: 'eñe' },
      { id: 'enye-picture', kind: 'choice', eyebrow: '看图选择', prompt: '哪个单词里有 Ñ 的发音？', speech: 'niño, pan', options: [{ id: 'nino', label: 'niño', detail: '男孩', image: resolvePublicPath('/assets/lesson-nino.jpg') }, { id: 'pan', label: 'pan', detail: '面包', image: resolvePublicPath('/assets/lesson-pan.jpg') }], correctOptionId: 'nino', explanation: 'niño 写作 n-i-ñ-o，中间的 Ñ 让声音连在一起；pan 只有普通的 n。', example: 'El niño come pan.', translation: '这个男孩在吃面包。', wordNotes: [{ term: 'niño', label: '名词' }, { term: 'come', label: '动词' }] },
      { id: 'enye-fill', kind: 'fill', eyebrow: '拼词练习', prompt: '补全“明天”这个单词', before: 'ma', after: 'ana', acceptedAnswers: ['ñ', 'Ñ'], hint: '需要使用西语特有的字母。', explanation: 'mañana 既可以表示“明天”，也可以表示“早晨”。', example: 'Nos vemos mañana.', translation: '我们明天见。', speech: 'mañana' },
      { id: 'enye-challenge', kind: 'challenge', eyebrow: '关卡挑战', prompt: '选择正确的西语句子：这个男孩在吃面包。', options: [{ id: 'correct', label: 'El niño come pan.' }, { id: 'wrong-n', label: 'El nino come pan.' }, { id: 'wrong-order', label: 'Pan el niño come.' }], correctOptionId: 'correct', explanation: 'niño 必须保留 Ñ；西语基本语序和中文不同，通常先说主语，再说动作。', example: 'El niño come pan.', translation: '这个男孩在吃面包。' },
    ],
  },
  'parts-sentence': {
    id: 'parts-sentence', nodeId: 'parts-sentence-node', cityId: 'word-market', title: '句子里的角色', subtitle: '用一句话认识名词、冠词与动词', minutes: 8, xp: 50, nextLessonId: 'questions-real-life',
    vocabulary: [
      { id: 'cafe', term: 'café', partOfSpeech: '名词', meaning: '咖啡', example: 'La mujer bebe café.', translation: '这位女士喝咖啡。', scene: { title: '侦探片 · 漫长一夜', line: 'Un café. Tenemos una noche muy larga.', translation: '来杯咖啡。今晚还长着呢。', speech: 'Un café. Tenemos una noche muy larga.' } },
      { id: 'bebe', term: 'bebe', partOfSpeech: '动词', meaning: '他／她喝', example: 'La mujer bebe café.', translation: '这位女士喝咖啡。' },
    ],
    steps: [
      { id: 'parts-intro', kind: 'explain', eyebrow: '词语市集', prompt: '每个词在句子里都有工作', title: '先认识三个核心角色', body: '冠词告诉我们名词的性与数，名词表示人或事物，动词说明发生了什么。', spotlight: 'La · mujer · bebe', tip: '先找动作词，通常最容易定位句子骨架。', speech: 'La mujer bebe café.' },
      { id: 'parts-choice', kind: 'choice', eyebrow: '词性识别', prompt: '在 La mujer bebe café. 中，哪个词是动词？', options: [{ id: 'la', label: 'La', detail: '冠词' }, { id: 'mujer', label: 'mujer', detail: '女士' }, { id: 'bebe', label: 'bebe', detail: '喝' }], correctOptionId: 'bebe', explanation: 'bebe 表示“喝”这个动作，所以是动词。', example: 'La mujer bebe café.', translation: '这位女士喝咖啡。' },
      { id: 'parts-fill', kind: 'fill', eyebrow: '句子拼装', prompt: '补全句子：这位女士喝咖啡。', before: 'La mujer', after: 'café.', acceptedAnswers: ['bebe'], hint: '缺少的是表示“喝”的动作词。', explanation: 'bebe 是 beber 在第三人称单数现在时的形式。', example: 'La mujer bebe café.', translation: '这位女士喝咖啡。' },
      { id: 'parts-challenge', kind: 'challenge', eyebrow: '关卡挑战', prompt: 'café 在句子里是什么词性？', options: [{ id: 'noun', label: '名词' }, { id: 'verb', label: '动词' }, { id: 'article', label: '冠词' }], correctOptionId: 'noun', explanation: 'café 表示一种事物，因此是名词。', example: 'Quiero un café.', translation: '我想要一杯咖啡。' },
    ],
  },
  'questions-real-life': {
    id: 'questions-real-life', nodeId: 'questions-real-life-node', cityId: 'question-plaza', title: '从一个好问题开始', subtitle: '在真实场景里使用 qué、quién、dónde 与 por qué', minutes: 9, xp: 60, nextLessonId: 'tenses-today-yesterday',
    vocabulary: [
      { id: 'donde', term: '¿Dónde?', partOfSpeech: '疑问副词', meaning: '在哪里？', example: '¿Dónde está la estación?', translation: '车站在哪里？', scene: { title: '犯罪剧 · 调查对话', line: '¿Dónde estabas cuando ocurrió todo?', translation: '一切发生时，你在哪里？', speech: '¿Dónde estabas cuando ocurrió todo?' } },
      { id: 'porque', term: '¿Por qué?', partOfSpeech: '疑问表达', meaning: '为什么？', example: '¿Por qué estudias español?', translation: '你为什么学习西班牙语？' },
    ],
    steps: [
      { id: 'questions-intro', kind: 'explain', eyebrow: '问句广场', prompt: '疑问词决定你想知道什么', title: '地点用 dónde，原因用 por qué', body: '西语问句前后都要有问号。带重音符号的疑问词会把问题指向人、事、地点、时间、方式或原因。', spotlight: '¿Dónde? · ¿Por qué?', tip: '看到地点图先想 dónde，看到原因线索先想 por qué。', speech: '¿Dónde está la estación?' },
      { id: 'questions-place', kind: 'choice', eyebrow: '生活场景', prompt: '你在马德里迷路了，想问“车站在哪里？”，应该用哪个开头？', options: [{ id: 'donde', label: '¿Dónde...?', detail: '在哪里' }, { id: 'quien', label: '¿Quién...?', detail: '谁' }, { id: 'cuando', label: '¿Cuándo...?', detail: '什么时候' }], correctOptionId: 'donde', explanation: '询问地点使用 dónde。完整句子是 ¿Dónde está la estación?', example: '¿Dónde está la estación?', translation: '车站在哪里？' },
      { id: 'questions-fill', kind: 'fill', eyebrow: '开口提问', prompt: '补全：你为什么学习西班牙语？', before: '¿', after: 'estudias español?', acceptedAnswers: ['Por qué', 'por qué'], hint: '你在询问原因。', explanation: '疑问表达 por qué 分开写，并且 qué 带重音。', example: '¿Por qué estudias español?', translation: '你为什么学习西班牙语？' },
      { id: 'questions-challenge', kind: 'challenge', eyebrow: '关卡挑战', prompt: '哪一句是在问“谁是你的老师？”', options: [{ id: 'correct', label: '¿Quién es tu profesor?' }, { id: 'what', label: '¿Qué es tu profesor?' }, { id: 'where', label: '¿Dónde es tu profesor?' }], correctOptionId: 'correct', explanation: '询问人的身份使用 quién。', example: '¿Quién es tu profesor?', translation: '谁是你的老师？' },
    ],
  },
  'tenses-today-yesterday': {
    id: 'tenses-today-yesterday', nodeId: 'tenses-today-yesterday-node', cityId: 'tense-city', title: '今天与昨天', subtitle: '用时间线区分现在时与简单过去时', minutes: 10, xp: 70,
    vocabulary: [
      { id: 'estudio', term: 'estudio', partOfSpeech: '动词（现在时）', meaning: '我学习', example: 'Hoy estudio español.', translation: '我今天学习西班牙语。' },
      { id: 'estudie', term: 'estudié', partOfSpeech: '动词（简单过去时）', meaning: '我学习了', example: 'Ayer estudié español.', translation: '我昨天学习了西班牙语。' },
    ],
    steps: [
      { id: 'tenses-intro', kind: 'explain', eyebrow: '时态城', prompt: '时间改变，动词也会变', title: 'Hoy estudio，ayer estudié', body: '现在时描述今天或习惯性的动作；简单过去时描述已经结束的过去动作。时间词能帮你快速判断。', spotlight: 'hoy → estudio · ayer → estudié', tip: '先圈出时间词，再决定动词形式。', speech: 'Hoy estudio español. Ayer estudié español.' },
      { id: 'tenses-choice', kind: 'choice', eyebrow: '时间线选择', prompt: '你想说“我昨天学习了西班牙语”，选择正确句子。', options: [{ id: 'past', label: 'Ayer estudié español.' }, { id: 'present', label: 'Ayer estudio español.' }, { id: 'today', label: 'Hoy estudié español.' }], correctOptionId: 'past', explanation: 'ayer 指向已经结束的过去，因此 estudiar 变成 estudié。', example: 'Ayer estudié español.', translation: '我昨天学习了西班牙语。' },
      { id: 'tenses-fill', kind: 'fill', eyebrow: '变位练习', prompt: '补全今天的句子', before: 'Hoy', after: 'español.', acceptedAnswers: ['estudio'], hint: '今天使用现在时。', explanation: '主语是 yo 时，estudiar 的现在时形式是 estudio。', example: 'Hoy estudio español.', translation: '我今天学习西班牙语。' },
      { id: 'tenses-challenge', kind: 'challenge', eyebrow: '关卡挑战', prompt: '哪组搭配把时间与动词形式正确对应？', options: [{ id: 'correct', label: 'hoy → estudio / ayer → estudié' }, { id: 'reverse', label: 'hoy → estudié / ayer → estudio' }, { id: 'same', label: 'hoy → estudio / ayer → estudio' }], correctOptionId: 'correct', explanation: '现在时 estudio 对应今天或习惯，简单过去时 estudié 对应已完成的昨天。', example: 'Hoy estudio. Ayer estudié.', translation: '今天我学习。昨天我学习了。' },
    ],
  },
};

const nodes: CourseNode[] = [
  { id: 'alphabet-vowels-node', cityId: 'alphabet-harbor', title: '五个元音', subtitle: 'A E I O U', symbol: 'A', minutes: 5, xp: 30 },
  { id: 'alphabet-enye-node', cityId: 'alphabet-harbor', title: '你好，Ñ', subtitle: '独有的字母与声音', symbol: 'Ñ', lessonId: 'alphabet-enye', minutes: 6, xp: 40 },
  { id: 'alphabet-combos-node', cityId: 'alphabet-harbor', title: '字母组合', subtitle: 'll · rr · ch', symbol: 'LL', prerequisiteNodeId: 'alphabet-enye-node', minutes: 8, xp: 45 },
  { id: 'alphabet-boss-node', cityId: 'alphabet-harbor', title: '港口挑战', subtitle: '认读基础发音', symbol: '★', prerequisiteNodeId: 'alphabet-combos-node', minutes: 10, xp: 80 },
  { id: 'parts-sentence-node', cityId: 'word-market', title: '句子里的角色', subtitle: '名词 · 冠词 · 动词', symbol: '词', lessonId: 'parts-sentence', prerequisiteNodeId: 'alphabet-enye-node', minutes: 8, xp: 50 },
  { id: 'parts-describe-node', cityId: 'word-market', title: '描述世界', subtitle: '形容词 · 副词', symbol: '美', prerequisiteNodeId: 'parts-sentence-node', minutes: 9, xp: 55 },
  { id: 'parts-connect-node', cityId: 'word-market', title: '连接想法', subtitle: '介词 · 连词 · 感叹词', symbol: '+', prerequisiteNodeId: 'parts-describe-node', minutes: 10, xp: 60 },
  { id: 'questions-real-life-node', cityId: 'question-plaza', title: '从一个好问题开始', subtitle: '地点 · 人 · 原因', symbol: '¿', lessonId: 'questions-real-life', prerequisiteNodeId: 'parts-sentence-node', minutes: 9, xp: 60 },
  { id: 'questions-time-node', cityId: 'question-plaza', title: '时间与方式', subtitle: 'cuándo · cómo · cuánto', symbol: '?', prerequisiteNodeId: 'questions-real-life-node', minutes: 10, xp: 65 },
  { id: 'questions-boss-node', cityId: 'question-plaza', title: '街头问路', subtitle: '12 个疑问表达', symbol: '★', prerequisiteNodeId: 'questions-time-node', minutes: 12, xp: 90 },
  { id: 'tenses-today-yesterday-node', cityId: 'tense-city', title: '今天与昨天', subtitle: '现在时 · 简单过去时', symbol: '时', lessonId: 'tenses-today-yesterday', prerequisiteNodeId: 'questions-real-life-node', minutes: 10, xp: 70 },
  { id: 'tenses-progress-node', cityId: 'tense-city', title: '正在发生', subtitle: '进行时 · 完成时', symbol: '→', prerequisiteNodeId: 'tenses-today-yesterday-node', minutes: 12, xp: 75 },
  { id: 'tenses-future-node', cityId: 'tense-city', title: '想象未来', subtitle: '将来时 · 条件式 · 虚拟式', symbol: '∞', prerequisiteNodeId: 'tenses-progress-node', minutes: 14, xp: 90 },
];

export const cities: CourseCity[] = [
  { id: 'alphabet-harbor', number: '01', title: '字母港', subtitle: '先听见西语', description: '从 27 个字母和 5 个元音开始，建立稳定的发音地基。', image: resolvePublicPath('/assets/alphabet-harbor.jpg'), nodes: nodes.filter((node) => node.cityId === 'alphabet-harbor') },
  { id: 'word-market', number: '02', title: '词语市集', subtitle: '看懂词的工作', description: '认识 9 种词性，让零散单词慢慢组成句子。', image: resolvePublicPath('/assets/word-market.jpg'), nodes: nodes.filter((node) => node.cityId === 'word-market') },
  { id: 'question-plaza', number: '03', title: '问句广场', subtitle: '用问题打开对话', description: '掌握 12 个高频疑问表达，能问人、事、时间、地点与原因。', image: resolvePublicPath('/assets/question-plaza.jpg'), nodes: nodes.filter((node) => node.cityId === 'question-plaza') },
  { id: 'tense-city', number: '04', title: '时态城', subtitle: '把动作放上时间线', description: '从今天与昨天出发，理解 9 个常用时态与语气。', image: resolvePublicPath('/assets/tense-city.jpg'), nodes: nodes.filter((node) => node.cityId === 'tense-city') },
];

const nodeById = new Map(nodes.map((node) => [node.id, node]));

export function getNodeById(nodeId: string): CourseNode | undefined {
  return nodeById.get(nodeId);
}
