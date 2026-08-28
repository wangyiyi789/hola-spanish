import { Check, LockKeyhole } from 'lucide-react';
import { useState } from 'react';
import { cities } from '../../data/curriculum';
import type { CityId, LessonId } from '../../domain/course';
import type { Progress } from '../../domain/progress';

interface JourneyMapProps {
  progress: Progress;
  onOpenLesson: (lessonId: LessonId) => void;
}

export function JourneyMap({ progress, onOpenLesson }: JourneyMapProps) {
  const [activeCityId, setActiveCityId] = useState<CityId>('alphabet-harbor');
  const city = cities.find((item) => item.id === activeCityId) ?? cities[0];

  return (
    <section aria-labelledby="journey-title">
      <div className="journey-toolbar">
        <div>
          <h2 id="journey-title">你的学习路线</h2>
          <p>完成关卡，解锁下一座城市</p>
        </div>
        <div className="city-switcher" aria-label="切换学习城市">
          {cities.map((item) => (
            <button
              aria-label={`查看${item.title}`}
              aria-pressed={activeCityId === item.id}
              className={`city-switch${activeCityId === item.id ? ' is-active' : ''}`}
              key={item.id}
              type="button"
              onClick={() => setActiveCityId(item.id)}
            >
              {item.number}
            </button>
          ))}
        </div>
      </div>
      <div className="journey-canvas">
        <img className="journey-scene" src={city.image} alt="" aria-hidden="true" />
        <div className="journey-path" aria-hidden="true" />
        <div className="journey-nodes">
          {city.nodes.map((node) => {
            const complete = progress.completedNodeIds.includes(node.id);
            const unlocked = progress.unlockedNodeIds.includes(node.id) || complete;
            const current = unlocked && !complete && Boolean(node.lessonId);
            const label = node.lessonId && unlocked
              ? `开始 ${node.title}`
              : !unlocked
                ? `${node.title}，完成前置课程后解锁`
                : `复习 ${node.title}`;

            return (
              <div className="journey-node-wrap" key={node.id}>
                <button
                  aria-label={label}
                  className={`journey-node${complete ? ' is-complete' : ''}${current ? ' is-current' : ''}`}
                  disabled={!unlocked || !node.lessonId}
                  type="button"
                  onClick={() => node.lessonId && onOpenLesson(node.lessonId)}
                >
                  <span className="node-orb">
                    {complete ? <Check aria-hidden="true" size={28} /> : !unlocked ? <LockKeyhole aria-hidden="true" size={23} /> : node.symbol}
                  </span>
                  <span className="node-status">{complete ? '已完成' : current ? '当前关卡' : unlocked ? '学习起点' : '尚未解锁'}</span>
                  <span className="node-title">{node.title}</span>
                  <span className="node-subtitle">{node.subtitle}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
      <div className="city-summary">
        <div><strong>{city.number} · {city.title}</strong><p>{city.description}</p></div>
        <span>{city.nodes.filter((node) => progress.completedNodeIds.includes(node.id)).length} / {city.nodes.length} 完成</span>
      </div>
    </section>
  );
}
