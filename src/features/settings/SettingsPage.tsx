import { useState, type FormEvent } from 'react';
import { UserRound } from 'lucide-react';
import type { DailyGoalMinutes, Progress } from '../../domain/progress';
import { GoalPicker } from '../journey/GoalPicker';
import { DataControls } from './DataControls';
import { SharingPanel } from './SharingPanel';

interface SettingsPageProps {
  progress: Progress;
  onNameChange: (name: string) => void;
  onGoalChange: (minutes: DailyGoalMinutes) => void;
  onImport: (progress: Progress) => void;
  onReset: () => void;
  onRestore: () => void;
}

interface LearnerProfileProps {
  name: string;
  onChange: (name: string) => void;
}

function LearnerProfile({ name, onChange }: LearnerProfileProps) {
  const [draft, setDraft] = useState(name);
  const [saved, setSaved] = useState(false);

  const save = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextName = draft.trim();
    if (!nextName) return;
    onChange(nextName);
    setDraft(nextName);
    setSaved(true);
  };

  return (
    <section className="settings-card learner-profile-card">
      <div className="learner-profile-heading">
        <UserRound aria-hidden="true" size={24} />
        <div><h2>你的称呼</h2><p>这个姓名会显示在首页问候中，只保存在你的学习记录里。</p></div>
      </div>
      <form className="learner-profile-form" onSubmit={save}>
        <label htmlFor="learner-name">学习者姓名</label>
        <div>
          <input
            autoComplete="name"
            id="learner-name"
            maxLength={20}
            value={draft}
            onChange={(event) => { setDraft(event.target.value); setSaved(false); }}
          />
          <button disabled={!draft.trim()} type="submit">保存姓名</button>
        </div>
      </form>
      {saved ? <p className="profile-save-message" role="status">姓名已保存，首页问候已经更新。</p> : null}
    </section>
  );
}

export function SettingsPage(props: SettingsPageProps) {
  return (
    <main className="section-page settings-page">
      <header className="section-heading">
        <span className="section-kicker">节奏由你决定</span>
        <h1>学习与数据</h1>
        <p>调整当天目标不会限制学习上限；即使达到目标，也可以继续闯关。</p>
      </header>
      <LearnerProfile name={props.progress.learnerName} onChange={props.onNameChange} />
      <section className="settings-card"><h2>每日目标</h2><GoalPicker value={props.progress.dailyGoalMinutes} onChange={props.onGoalChange} /></section>
      <SharingPanel />
      <DataControls progress={props.progress} onImport={props.onImport} onReset={props.onReset} onRestore={props.onRestore} />
    </main>
  );
}

