import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { lessons } from '../../data/curriculum';
import type { Lesson } from '../../domain/course';
import { LessonPlayer } from './LessonPlayer';

describe('LessonPlayer', () => {
  it('shows Chinese reasoning after an incorrect answer and records the mistake', async () => {
    const user = userEvent.setup();
    const onCheckpoint = vi.fn();

    render(
      <LessonPlayer
        lesson={lessons['alphabet-enye']}
        resumeStep={0}
        onExit={vi.fn()}
        onCheckpoint={onCheckpoint}
        onComplete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: '继续学习' }));
    await user.click(screen.getByRole('button', { name: '选择 pan' }));
    await user.click(screen.getByRole('button', { name: '检查答案' }));

    expect(screen.getByRole('heading', { name: '再想一想' })).toBeVisible();
    expect(screen.getByText(/niño 写作/)).toBeVisible();
    expect(onCheckpoint).toHaveBeenCalledWith(expect.objectContaining({ mistakeId: 'enye-picture' }));
  });

  it('gives no XP for an incorrect answer', async () => {
    const user = userEvent.setup();

    render(
      <LessonPlayer
        lesson={lessons['alphabet-enye']}
        resumeStep={1}
        onExit={vi.fn()}
        onCheckpoint={vi.fn()}
        onComplete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: '选择 pan' }));
    await user.click(screen.getByRole('button', { name: '检查答案' }));

    expect(screen.getByText('+0 XP')).toBeVisible();
  });

  it('repeats missed questions at the end and only completes after mastery', async () => {
    const user = userEvent.setup();
    const onComplete = vi.fn();
    const lesson: Lesson = {
      ...lessons['alphabet-enye'],
      steps: [lessons['alphabet-enye'].steps[1], lessons['alphabet-enye'].steps[3]],
    };

    render(
      <LessonPlayer
        lesson={lesson}
        resumeStep={0}
        onExit={vi.fn()}
        onCheckpoint={vi.fn()}
        onComplete={onComplete}
      />,
    );

    await user.click(screen.getByRole('button', { name: '选择 pan' }));
    await user.click(screen.getByRole('button', { name: '检查答案' }));
    await user.click(screen.getByRole('button', { name: '重新作答' }));

    expect(screen.getByText('哪个单词里有 Ñ 的发音？')).toBeVisible();
    expect(screen.queryByText('选择正确的西语句子：这个男孩在吃面包。')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '选择 niño' }));
    await user.click(screen.getByRole('button', { name: '检查答案' }));
    await user.click(screen.getByRole('button', { name: '继续' }));
    await user.click(screen.getByRole('button', { name: /选择 El niño come pan/ }));
    await user.click(screen.getByRole('button', { name: '检查答案' }));
    await user.click(screen.getByRole('button', { name: /继续/ }));

    expect(screen.getByText('错题回炉')).toBeVisible();
    expect(screen.getByText('哪个单词里有 Ñ 的发音？')).toBeVisible();
    expect(onComplete).not.toHaveBeenCalled();

    await user.click(screen.getByRole('button', { name: '选择 niño' }));
    await user.click(screen.getByRole('button', { name: '检查答案' }));
    await user.click(screen.getByRole('button', { name: '掌握了，完成课程' }));

    expect(screen.getByRole('heading', { name: '¡Lo lograste!' })).toBeVisible();
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('keeps missed questions mandatory after exiting and resuming the lesson', async () => {
    const user = userEvent.setup();
    const lesson: Lesson = {
      ...lessons['alphabet-enye'],
      steps: [lessons['alphabet-enye'].steps[1], lessons['alphabet-enye'].steps[3]],
    };
    const onCheckpoint = vi.fn();
    const first = render(
      <LessonPlayer
        lesson={lesson}
        resumeStep={0}
        onExit={vi.fn()}
        onCheckpoint={onCheckpoint}
        onComplete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: '选择 pan' }));
    await user.click(screen.getByRole('button', { name: '检查答案' }));
    await user.click(screen.getByRole('button', { name: '重新作答' }));
    await user.click(screen.getByRole('button', { name: '选择 niño' }));
    await user.click(screen.getByRole('button', { name: '检查答案' }));
    await user.click(screen.getByRole('button', { name: '继续' }));

    const checkpoint = onCheckpoint.mock.calls.at(-1)?.[0];
    first.unmount();
    render(
      <LessonPlayer
        lesson={lesson}
        resumeStep={checkpoint.stepIndex}
        resumeMastery={checkpoint.mastery}
        onExit={vi.fn()}
        onCheckpoint={vi.fn()}
        onComplete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: /选择 El niño come pan/ }));
    await user.click(screen.getByRole('button', { name: '检查答案' }));
    await user.click(screen.getByRole('button', { name: '继续' }));

    expect(screen.getByText('错题回炉')).toBeVisible();
    expect(screen.getByText('哪个单词里有 Ñ 的发音？')).toBeVisible();
  });

  it('requires an answer before checking and advances after correct feedback', async () => {
    const user = userEvent.setup();

    render(
      <LessonPlayer
        lesson={lessons['alphabet-enye']}
        resumeStep={1}
        onExit={vi.fn()}
        onCheckpoint={vi.fn()}
        onComplete={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: '检查答案' })).toBeDisabled();
    await user.click(screen.getByRole('button', { name: '选择 niño' }));
    await user.click(screen.getByRole('button', { name: '检查答案' }));
    expect(screen.getByRole('heading', { name: '¡Muy bien!' })).toBeVisible();
    expect(screen.getByText('niño · 名词')).toBeVisible();
    expect(screen.getByText('come · 动词')).toBeVisible();
    expect(screen.getByText('+10 XP')).toBeVisible();
    await user.click(screen.getByRole('button', { name: '继续' }));
    expect(screen.getByText('补全“明天”这个单词')).toBeVisible();
  });

  it('lets learners enter Spanish characters without changing their physical keyboard', async () => {
    const user = userEvent.setup();

    render(
      <LessonPlayer
        lesson={lessons['alphabet-enye']}
        resumeStep={2}
        onExit={vi.fn()}
        onCheckpoint={vi.fn()}
        onComplete={vi.fn()}
      />,
    );

    const input = screen.getByRole('textbox', { name: '填写缺少的西语单词' });
    await user.click(screen.getByRole('button', { name: '输入特殊字符 ñ' }));

    expect(input).toHaveValue('ñ');
    await user.click(screen.getByRole('button', { name: '检查答案' }));
    expect(screen.getByRole('heading', { name: '¡Muy bien!' })).toBeVisible();
  });

  it('lets learners skip a spelling question without adding it to the mistake queue', async () => {
    const user = userEvent.setup();
    const onCheckpoint = vi.fn();

    render(
      <LessonPlayer
        lesson={lessons['alphabet-enye']}
        resumeStep={2}
        onExit={vi.fn()}
        onCheckpoint={onCheckpoint}
        onComplete={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: '跳过这道拼写题' }));
    expect(screen.getByRole('heading', { name: '确定暂时跳过拼写吗？' })).toBeVisible();

    await user.click(screen.getByRole('button', { name: '确认跳过' }));
    expect(screen.getByRole('heading', { name: '已跳过拼写' })).toBeVisible();
    expect(screen.getByText((_text, element) => element?.classList.contains('skipped-answer') ?? false)).toHaveTextContent('正确写法：ñ');
    expect(screen.getByText('+0 XP')).toBeVisible();
    expect(onCheckpoint).toHaveBeenCalledWith(expect.not.objectContaining({ mistakeId: 'enye-fill' }));

    await user.click(screen.getByRole('button', { name: '查看下一题' }));
    expect(screen.getByText('选择正确的西语句子：这个男孩在吃面包。')).toBeVisible();
    expect(screen.queryByText('错题回炉')).not.toBeInTheDocument();
  });
});

