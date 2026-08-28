import { ArrowRight, Check, Map, Star } from 'lucide-react';
import type { Lesson } from '../../domain/course';
import { resolvePublicPath } from '../../services/publicPath';

interface LessonCompleteProps {
  lesson: Lesson;
  onBack: () => void;
  onNext?: () => void;
}

export function LessonComplete({ lesson, onBack, onNext }: LessonCompleteProps) {
  return (
    <main className="lesson-complete">
      <img className="complete-lolo" src={resolvePublicPath('/assets/lolo-guide.jpg')} alt="Lolo 和你一起庆祝" />
      <div className="complete-seal"><Check aria-hidden="true" size={42} /></div>
      <p className="complete-small">关卡完成</p>
      <h1>¡Lo lograste!</h1>
      <p>你完成了“{lesson.title}”，新知识已经加入单词本。</p>
      <div className="complete-rewards">
        <span><Star aria-hidden="true" fill="currentColor" size={20} /> +{lesson.xp} XP</span>
        <span>{lesson.minutes} 分钟学习</span>
      </div>
      <div className="complete-actions">
        {onNext ? (
          <button className="lesson-primary is-success" type="button" onClick={onNext}>
            继续下一节 <ArrowRight aria-hidden="true" size={18} />
          </button>
        ) : null}
        <button className="lesson-secondary" type="button" onClick={onBack}>
          <Map aria-hidden="true" size={18} /> 返回学习地图
        </button>
      </div>
    </main>
  );
}
