import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { createInitialProgress } from '../progress/progressStore';
import { DataControls } from './DataControls';

describe('DataControls', () => {
  it('rejects an invalid backup without replacing progress', async () => {
    const user = userEvent.setup();
    const onImport = vi.fn();
    render(<DataControls progress={createInitialProgress('2026-08-28')} onImport={onImport} onReset={vi.fn()} />);

    const file = new File(['{"version": 9}'], 'bad.json', { type: 'application/json' });
    await user.upload(screen.getByLabelText('选择学习记录文件'), file);

    expect(await screen.findByRole('alert')).toHaveTextContent('无法导入');
    expect(onImport).not.toHaveBeenCalled();
  });

  it('requires a second confirmation before resetting', async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<DataControls progress={createInitialProgress('2026-08-28')} onImport={vi.fn()} onReset={onReset} />);

    await user.click(screen.getByRole('button', { name: '回到初始进度' }));
    expect(onReset).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: '确认清空并重新开始' }));
    expect(onReset).toHaveBeenCalledOnce();
  });
});
