import { BookOpen, ChartNoAxesColumnIncreasing, Map, Pencil, Settings } from 'lucide-react';
import { resolvePublicPath } from '../../services/publicPath';

export type AppSection = 'journey' | 'practice' | 'vocabulary' | 'records' | 'settings';

interface SideNavProps {
  current: AppSection;
  onNavigate: (section: AppSection) => void;
}

const items = [
  { id: 'journey' as const, label: '学习路线', icon: Map },
  { id: 'practice' as const, label: '今日练习', icon: Pencil },
  { id: 'vocabulary' as const, label: '单词本', icon: BookOpen },
  { id: 'records' as const, label: '学习记录', icon: ChartNoAxesColumnIncreasing },
];

export function SideNav({ current, onNavigate }: SideNavProps) {
  return (
    <aside className="side-nav" aria-label="主导航">
      <div className="brand">¡Hola!</div>
      <p className="brand-subtitle">西班牙语 · 从 0 开始</p>
      <nav className="nav-list">
        {items.map(({ id, label, icon: NavIcon }) => (
          <button
            className={`nav-button${current === id ? ' is-active' : ''}`}
            key={id}
            type="button"
            onClick={() => onNavigate(id)}
          >
            <NavIcon aria-hidden="true" size={20} strokeWidth={1.9} />
            {label}
          </button>
        ))}
      </nav>
      <div className="guide-note">
        <img src={resolvePublicPath('/assets/lolo-guide.jpg')} alt="狐狸向导 Lolo" />
        <div><strong>Lolo 的提示</strong>每天先迈出一步；想多学时，路线永远为你敞开。</div>
      </div>
      <button
        className={`nav-button${current === 'settings' ? ' is-active' : ''}`}
        type="button"
        onClick={() => onNavigate('settings')}
      >
        <Settings aria-hidden="true" size={19} strokeWidth={1.9} />
        设置
      </button>
    </aside>
  );
}
