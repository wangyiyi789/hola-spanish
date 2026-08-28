import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SharingPanel } from './SharingPanel';
import { classifyAccessOrigin } from './accessScope';

describe('classifyAccessOrigin', () => {
  it.each([
    ['http://127.0.0.1:4173', 'local'],
    ['http://localhost:4173', 'local'],
    ['http://10.10.9.176:4173', 'lan'],
    ['http://192.168.1.20:4173', 'lan'],
    ['https://hola.example.com', 'public'],
  ] as const)('classifies %s as %s access', (origin, expected) => {
    expect(classifyAccessOrigin(origin)).toBe(expected);
  });
});

describe('SharingPanel', () => {
  it('warns that a loopback address cannot be shared with another computer', () => {
    render(<SharingPanel origin="http://127.0.0.1:4173" />);

    expect(screen.getByRole('heading', { name: '分享与访问' })).toBeVisible();
    expect(screen.getByText('仅本机可用')).toBeVisible();
    expect(screen.getByText(/每台电脑的 127\.0\.0\.1 都只指向它自己/)).toBeVisible();
    expect(screen.getByRole('button', { name: '复制当前地址' })).toBeDisabled();
  });

  it('allows a LAN address to be copied for people on the same network', () => {
    render(<SharingPanel origin="http://10.10.9.176:4173" />);

    expect(screen.getByText('同一网络可用')).toBeVisible();
    expect(screen.getByText('http://10.10.9.176:4173')).toBeVisible();
    expect(screen.getByRole('button', { name: '复制当前地址' })).toBeEnabled();
  });
});
