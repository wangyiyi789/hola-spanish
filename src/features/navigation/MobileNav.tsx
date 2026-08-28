import { BookOpen, ChartPie, Map, Pencil } from 'lucide-react';
import type { AppSection } from './SideNav';

interface MobileNavProps {
  current: AppSection;
  onNavigate: (section: AppSection) => void;
}

const items = [
  { id: 'journey' as const, label: '学习', icon: Map },
  { id: 'practice' as const, label: '练习', icon: Pencil },
  { id: 'vocabulary' as const, label: '单词', icon: BookOpen },
  { id: 'records' as const, label: '记录', icon: ChartPie },
];

export function MobileNav({ current, onNavigate }: MobileNavProps) {
  return (
    <nav className="mobile-nav" aria-label="移动端导航">
      {items.map(({ id, label, icon: NavIcon }) => (
        <button
          className={`mobile-nav-button${current === id ? ' is-active' : ''}`}
          key={id}
          type="button"
          onClick={() => onNavigate(id)}
        >
          <NavIcon aria-hidden="true" size={22} strokeWidth={1.9} />
          {label}
        </button>
      ))}
    </nav>
  );
}

