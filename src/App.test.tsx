import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('App lesson routing', () => {
  beforeEach(() => localStorage.clear());

  it('opens the lesson as a focused full-screen experience', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '开始 你好，Ñ' }));

    expect(screen.getByRole('heading', { name: 'Ñ 不只是戴帽子的 N' })).toBeVisible();
    expect(screen.queryByRole('complementary', { name: '主导航' })).not.toBeInTheDocument();
  });

  it('opens the vocabulary book and data settings without placeholder screens', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '单词本' }));
    expect(screen.getByRole('heading', { name: '我的单词本' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: '设置' }));
    expect(screen.getByRole('heading', { name: '学习与数据' })).toBeVisible();
    expect(screen.queryByText('这一站正在准备')).not.toBeInTheDocument();
  });

  it('lets a learner change their name and keeps the greeting after remounting', async () => {
    const user = userEvent.setup();
    const first = render(<App />);

    expect(screen.getByText('晚上好，学习者')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '设置' }));
    const input = screen.getByRole('textbox', { name: '学习者姓名' });
    await user.clear(input);
    await user.type(input, '伊莲娜');
    await user.click(screen.getByRole('button', { name: '保存姓名' }));
    expect(screen.getByRole('status')).toHaveTextContent('姓名已保存');

    first.unmount();
    render(<App />);
    expect(screen.getByText('晚上好，伊莲娜')).toBeVisible();
  });

  it('opens a dedicated professional drill from practice', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '今日练习' }));
    await user.click(screen.getByRole('button', { name: '开始专业强化刷题' }));

    expect(screen.getByRole('heading', { name: '定制专业刷题' })).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'B2 专业' }));
    expect(screen.getByRole('button', { name: '发音' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '时态' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: '时态' }));
    await user.click(screen.getByRole('button', { name: '5 题' }));
    await user.click(screen.getByRole('button', { name: '开始刷题' }));

    expect(screen.getByRole('heading', { name: '专业强化刷题' })).toBeVisible();
    expect(screen.getByText('B2 专业')).toBeVisible();
  });

  it('keeps a missed professional drill question until it is answered correctly', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '今日练习' }));
    await user.click(screen.getByRole('button', { name: '开始专业强化刷题' }));
    await user.click(screen.getByRole('button', { name: '开始刷题' }));

    await user.click(screen.getByRole('button', { name: '选择 pan' }));
    await user.click(screen.getByRole('button', { name: '检查答案' }));
    await user.click(screen.getByRole('button', { name: '重新作答' }));
    expect(screen.getByText('听发音，选出你听到的单词。')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '选择 niño' }));
    await user.click(screen.getByRole('button', { name: '检查答案' }));
    await user.click(screen.getByRole('button', { name: '继续' }));

    const answers = [
      'bebe',
      '名词',
      '¿Dónde...?',
      '¿Por qué...?',
      'Ayer estudié español.',
      'hoy → estudio / ayer → estudié',
      'La mujer bebe café.',
    ];

    for (const answer of answers) {
      await user.click(screen.getByRole('button', { name: `选择 ${answer}` }));
      await user.click(screen.getByRole('button', { name: '检查答案' }));
      await user.click(screen.getByRole('button', { name: /(继续|进入错题强化)/ }));
    }

    expect(screen.getByRole('heading', { name: '错题强化' })).toBeVisible();
    expect(screen.queryByRole('heading', { name: '训练完成' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '选择 niño' }));
    await user.click(screen.getByRole('button', { name: '检查答案' }));
    await user.click(screen.getByRole('button', { name: '掌握了，完成训练' }));

    expect(screen.getByRole('heading', { name: '训练完成' })).toBeVisible();
  });
});

