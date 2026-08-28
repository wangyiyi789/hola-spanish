export interface PracticeQuestion {
  id: string;
  category: '发音' | '词性' | '疑问词' | '时态' | '句法';
  level: 'B1 进阶' | 'B2 专业';
  prompt: string;
  options: Array<{ id: string; label: string }>;
  correctOptionId: string;
  explanation: string;
  speech?: string;
}

export const professionalPracticeQuestions: PracticeQuestion[] = [
  {
    id: 'drill-enye-sound',
    category: '发音',
    level: 'B1 进阶',
    prompt: '听发音，选出你听到的单词。',
    speech: 'niño',
    options: [{ id: 'nino', label: 'niño' }, { id: 'pan', label: 'pan' }, { id: 'mujer', label: 'mujer' }],
    correctOptionId: 'nino',
    explanation: 'niño 中的 ñ 是独立辅音，发音接近汉语“尼”与“纽”之间的连读。',
  },
  {
    id: 'drill-verb', category: '词性', level: 'B1 进阶', prompt: 'La mujer bebe café. 中哪个词承担谓语动作？',
    options: [{ id: 'la', label: 'La' }, { id: 'mujer', label: 'mujer' }, { id: 'bebe', label: 'bebe' }], correctOptionId: 'bebe',
    explanation: 'bebe 是动词 beber 的第三人称单数现在时形式。',
  },
  {
    id: 'drill-cafe-pos', category: '词性', level: 'B1 进阶', prompt: 'café 在 Quiero un café. 中是什么词性？',
    options: [{ id: 'noun', label: '名词' }, { id: 'verb', label: '动词' }, { id: 'adjective', label: '形容词' }], correctOptionId: 'noun',
    explanation: '这里的 café 指一杯咖啡，是名词。',
  },
  {
    id: 'drill-where', category: '疑问词', level: 'B1 进阶', prompt: '要询问地点，应该用哪个问句开头？',
    options: [{ id: 'where', label: '¿Dónde...?' }, { id: 'who', label: '¿Quién...?' }, { id: 'when', label: '¿Cuándo...?' }], correctOptionId: 'where',
    explanation: 'dónde 用于询问地点，并且疑问用法中必须保留重音符号。',
  },
  {
    id: 'drill-why', category: '疑问词', level: 'B1 进阶', prompt: '要询问原因，应该使用哪个表达？',
    options: [{ id: 'why', label: '¿Por qué...?' }, { id: 'because', label: 'Porque...' }, { id: 'what-for', label: '¿Para qué...?' }], correctOptionId: 'why',
    explanation: 'por qué 分开写并带重音，用来提出“为什么”的问题。',
  },
  {
    id: 'drill-past', category: '时态', level: 'B1 进阶', prompt: '选择表示“我昨天学习了西班牙语”的句子。',
    options: [{ id: 'past', label: 'Ayer estudié español.' }, { id: 'present', label: 'Ayer estudio español.' }, { id: 'today', label: 'Hoy estudié español.' }], correctOptionId: 'past',
    explanation: 'ayer 指向已结束的过去，estudiar 因此使用简单过去时 estudié。',
  },
  {
    id: 'drill-timeline', category: '时态', level: 'B1 进阶', prompt: '哪组时间词与动词形式搭配正确？',
    options: [{ id: 'correct', label: 'hoy → estudio / ayer → estudié' }, { id: 'reverse', label: 'hoy → estudié / ayer → estudio' }, { id: 'same', label: 'hoy → estudio / ayer → estudio' }], correctOptionId: 'correct',
    explanation: 'hoy 搭配现在时 estudio，ayer 搭配已完成的过去时 estudié。',
  },
  {
    id: 'drill-sentence', category: '句法', level: 'B1 进阶', prompt: '选择语序和拼写都正确的句子。',
    options: [{ id: 'correct', label: 'La mujer bebe café.' }, { id: 'order', label: 'Café bebe la mujer.' }, { id: 'accent', label: 'La mujer bebe cafe.' }], correctOptionId: 'correct',
    explanation: '陈述句通常使用“主语 + 动词 + 宾语”，café 还要保留重音符号。',
  },
  {
    id: 'drill-b2-subjunctive', category: '时态', level: 'B2 专业', prompt: '补全：Es importante que tú ___ temprano.',
    options: [{ id: 'subjunctive', label: 'estudies' }, { id: 'present', label: 'estudias' }, { id: 'future', label: 'estudiarás' }], correctOptionId: 'subjunctive',
    explanation: 'Es importante que 表达评价和要求，从句使用现在虚拟式 estudies。',
  },
  {
    id: 'drill-b2-imperfect', category: '时态', level: 'B2 专业', prompt: '选择正确的过去叙事背景。',
    options: [{ id: 'correct', label: 'Cuando era niño, jugaba aquí.' }, { id: 'preterite', label: 'Cuando fui niño, jugué aquí cada día.' }, { id: 'present', label: 'Cuando soy niño, juego aquí.' }], correctOptionId: 'correct',
    explanation: '童年背景和过去的习惯动作用过去未完成时 era 和 jugaba。',
  },
  {
    id: 'drill-b2-perfect', category: '时态', level: 'B2 专业', prompt: '本年度尚未结束，如何说“今年我去过三次马德里”？',
    options: [{ id: 'perfect', label: 'Este año he ido tres veces a Madrid.' }, { id: 'preterite', label: 'Este año fui tres veces a Madrid.' }, { id: 'future', label: 'Este año iré tres veces a Madrid.' }], correctOptionId: 'perfect',
    explanation: '在尚未结束的时间范围 este año 中，西班牙常用现在完成时 he ido。',
  },
  {
    id: 'drill-b2-counterfactual', category: '时态', level: 'B2 专业', prompt: '选择正确的过去反事实条件句。',
    options: [{ id: 'correct', label: 'Si lo hubiera sabido, habría ido.' }, { id: 'present', label: 'Si lo sé, iría.' }, { id: 'future', label: 'Si lo sabré, habré ido.' }], correctOptionId: 'correct',
    explanation: '对过去未发生事情的假设使用过去完成虚拟式 + 过去条件式。',
  },
  {
    id: 'drill-b2-future-perfect', category: '时态', level: 'B2 专业', prompt: '如何表达“到明天为止我就会完成”？',
    options: [{ id: 'future-perfect', label: 'Para mañana habré terminado.' }, { id: 'present-perfect', label: 'Para mañana he terminado.' }, { id: 'conditional', label: 'Para mañana habría terminado.' }], correctOptionId: 'future-perfect',
    explanation: '将来某个时点之前完成的动作使用将来完成时 habré terminado。',
  },
];
