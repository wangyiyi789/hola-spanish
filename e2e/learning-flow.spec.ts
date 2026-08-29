import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.evaluate(() => localStorage.clear());
  await page.reload();
});

test('sets a longer goal, completes a lesson, persists progress and collects words', async ({ page }) => {
  await page.getByRole('button', { name: '30 分钟' }).click();
  await expect(page.getByRole('button', { name: '30 分钟' })).toHaveAttribute('aria-pressed', 'true');

  await page.getByRole('button', { name: '开始 你好，Ñ' }).click();
  await page.getByRole('button', { name: '继续学习' }).click();
  await page.getByRole('button', { name: /选择 pan/ }).click();
  await page.getByRole('button', { name: '检查答案' }).click();
  await expect(page.getByRole('heading', { name: '再想一想' })).toBeVisible();
  await page.getByRole('button', { name: '重新作答' }).click();
  await expect(page.getByText('哪个单词里有 Ñ 的发音？')).toBeVisible();
  await page.getByRole('button', { name: /选择 niño/ }).click();
  await page.getByRole('button', { name: '检查答案' }).click();
  await page.getByRole('button', { name: '继续' }).click();
  await page.getByRole('button', { name: '输入特殊字符 ñ' }).click();
  await expect(page.getByRole('textbox', { name: '填写缺少的西语单词' })).toHaveValue('ñ');
  await page.getByRole('button', { name: '检查答案' }).click();
  await page.getByRole('button', { name: '继续' }).click();
  await page.getByRole('button', { name: /选择 El niño come pan/ }).click();
  await page.getByRole('button', { name: '检查答案' }).click();
  await page.getByRole('button', { name: '继续' }).click();

  await expect(page.getByText('错题回炉')).toBeVisible();
  await expect(page.getByText('哪个单词里有 Ñ 的发音？')).toBeVisible();
  await page.getByRole('button', { name: /选择 niño/ }).click();
  await page.getByRole('button', { name: '检查答案' }).click();
  await page.getByRole('button', { name: '掌握了，完成课程' }).click();

  await expect(page.getByRole('heading', { name: '¡Lo lograste!' })).toBeVisible();
  await page.getByRole('button', { name: '返回学习地图' }).click();
  await page.reload();
  await expect(page.getByRole('button', { name: '30 分钟' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('1 / 4 完成')).toBeVisible();

  await page.getByRole('button', { name: '单词本' }).click();
  await expect(page.getByRole('heading', { name: 'niño' })).toBeVisible();
  await expect(page.getByText('El niño come pan.')).toBeVisible();

  await page.getByRole('button', { name: '学习路线' }).click();
  await page.getByRole('button', { name: '继续学习' }).click();
  await expect(page.getByRole('heading', { name: '先认识三个核心角色' })).toBeVisible();
});

test('keeps the complete learning route usable on a narrow phone viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();

  await expect(page.getByRole('heading', { name: /今天，让我们认识/ })).toBeVisible();
  await expect(page.getByText('每日一句')).toBeVisible();
  await page.getByRole('button', { name: '练习' }).click();
  await expect(page.getByRole('heading', { name: '今日练习' })).toBeVisible();
  await page.getByRole('button', { name: '设置' }).click();
  await expect(page.getByRole('heading', { name: '学习与数据' })).toBeVisible();
});

test('refreshes and reads the daily phrase, then safely skips a spelling question', async ({ page }) => {
  await expect(page.getByText('每日一句')).toBeVisible();
  await expect(page.getByText('El niño come pan.')).toBeVisible();

  await page.getByRole('button', { name: '换一句每日西语' }).click();
  await expect(page.getByText('La mujer bebe café.')).toBeVisible();
  const audioRequest = page.waitForRequest((request) => request.url().includes('/audio/la-mujer-bebe-cafe.mp3'));
  await page.getByRole('button', { name: '朗读每日一句' }).click();
  await audioRequest;
  await expect(page.getByText('正在播放标准西语录音。')).toBeVisible();

  await page.getByRole('button', { name: '开始 你好，Ñ' }).click();
  await page.getByRole('button', { name: '继续学习' }).click();
  await page.getByRole('button', { name: /选择 niño/ }).click();
  await page.getByRole('button', { name: '检查答案' }).click();
  await page.getByRole('button', { name: '继续' }).click();

  await page.getByRole('button', { name: '跳过这道拼写题' }).click();
  await expect(page.getByRole('heading', { name: '确定暂时跳过拼写吗？' })).toBeVisible();
  await page.getByRole('button', { name: '确认跳过' }).click();
  await expect(page.getByRole('heading', { name: '已跳过拼写' })).toBeVisible();
  await expect(page.locator('.skipped-answer')).toContainText('正确写法：ñ');
  await expect(page.getByText('+0 XP')).toBeVisible();
  await page.getByRole('button', { name: '查看下一题' }).click();
  await expect(page.getByText('选择正确的西语句子：这个男孩在吃面包。')).toBeVisible();
  await expect(page.getByText('错题回炉')).not.toBeVisible();
});

