import { DAILY_GOALS, type DailyGoalMinutes } from '../../domain/progress';

interface GoalPickerProps {
  value: DailyGoalMinutes;
  onChange: (minutes: DailyGoalMinutes) => void;
}

export function GoalPicker({ value, onChange }: GoalPickerProps) {
  return (
    <div className="goal-options" aria-label="选择每日学习时长">
      {DAILY_GOALS.map((minutes) => (
        <button
          aria-label={`${minutes} 分钟`}
          aria-pressed={value === minutes}
          className={`goal-option${value === minutes ? ' is-selected' : ''}`}
          key={minutes}
          type="button"
          onClick={() => onChange(minutes)}
        >
          {minutes}<span>分钟</span>
        </button>
      ))}
    </div>
  );
}
