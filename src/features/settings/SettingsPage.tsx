import type { DailyGoalMinutes, Progress } from '../../domain/progress';
import { GoalPicker } from '../journey/GoalPicker';
import { DataControls } from './DataControls';
import { SharingPanel } from './SharingPanel';

interface SettingsPageProps {
  progress: Progress;
  onGoalChange: (minutes: DailyGoalMinutes) => void;
  onImport: (progress: Progress) => void;
  onReset: () => void;
  onRestore: () => void;
}

export function SettingsPage(props: SettingsPageProps) {
  return (
    <main className="section-page settings-page">
      <header className="section-heading">
        <span className="section-kicker">节奏由你决定</span>
        <h1>学习与数据</h1>
        <p>调整当天目标不会限制学习上限；即使达到目标，也可以继续闯关。</p>
      </header>
      <section className="settings-card"><h2>每日目标</h2><GoalPicker value={props.progress.dailyGoalMinutes} onChange={props.onGoalChange} /></section>
      <SharingPanel />
      <DataControls progress={props.progress} onImport={props.onImport} onReset={props.onReset} onRestore={props.onRestore} />
    </main>
  );
}
