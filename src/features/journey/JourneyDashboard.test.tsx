import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createInitialProgress } from '../progress/progressStore';
import { JourneyDashboard } from './JourneyDashboard';

describe('JourneyDashboard', () => {
  it('changes the daily target and keeps continued study available after reaching it', async () => {
    const user = userEvent.setup();
    const onGoalChange = vi.fn();
    const progress = { ...createInitialProgress('2026-08-28'), todayMinutes: 35 };

    render(
      <JourneyDashboard
        progress={progress}
        onGoalChange={onGoalChange}
        onOpenLesson={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: '30 分钟' }));

    expect(onGoalChange).toHaveBeenCalledWith(30);
    expect(screen.getByRole('button', { name: /继续探索/ })).toBeVisible();
    expect(screen.getByText('已超出目标 15 分钟')).toBeVisible();
  });

  it('opens an unlocked lesson and prevents locked nodes from starting', async () => {
    const user = userEvent.setup();
    const onOpenLesson = vi.fn();

    render(
      <JourneyDashboard
        progress={createInitialProgress('2026-08-28')}
        onGoalChange={vi.fn()}
        onOpenLesson={onOpenLesson}
      />,
    );

    await user.click(screen.getByRole('button', { name: /开始 你好，Ñ/ }));

    expect(onOpenLesson).toHaveBeenCalledWith('alphabet-enye');
    expect(screen.getByRole('button', { name: /字母组合.*完成前置课程后解锁/ })).toBeDisabled();
  });

  it('shows no completed weekdays for a brand-new learner', () => {
    render(
      <JourneyDashboard
        progress={createInitialProgress('2026-08-28')}
        onGoalChange={vi.fn()}
        onOpenLesson={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('本周学习足迹').querySelectorAll('svg')).toHaveLength(0);
  });
});
