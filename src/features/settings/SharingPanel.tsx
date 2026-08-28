import { Check, Copy, Globe2, Laptop, Network, RadioTower } from 'lucide-react';
import { useState } from 'react';
import { classifyAccessOrigin, type AccessScope } from './accessScope';

interface SharingPanelProps {
  origin?: string;
}

const scopeDetails: Record<AccessScope, { label: string; description: string }> = {
  local: {
    label: '仅本机可用',
    description: '每台电脑的 127.0.0.1 都只指向它自己，因此这个地址发给别人不会打开。',
  },
  lan: {
    label: '同一网络可用',
    description: '这个地址可以发给同一 Wi-Fi 或局域网内的人；离开这个网络后通常无法访问。',
  },
  public: {
    label: '公网可用',
    description: '这是可公开访问的地址，只要托管服务在线，其他网络和电脑也能打开。',
  },
};

export function SharingPanel({ origin = window.location.origin }: SharingPanelProps) {
  const [copyState, setCopyState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const scope = classifyAccessOrigin(origin);
  const details = scopeDetails[scope];

  const copyOrigin = async () => {
    try {
      await navigator.clipboard.writeText(origin);
      setCopyState('copied');
    } catch {
      setCopyState('failed');
    }
  };

  return (
    <section className="sharing-panel" aria-labelledby="sharing-title">
      <div className="sharing-heading">
        <RadioTower aria-hidden="true" size={26} />
        <div>
          <h2 id="sharing-title">分享与访问</h2>
          <p>先确认当前网址的访问范围，再把正确的链接发给学习者。</p>
        </div>
      </div>

      <div className={`access-status access-status-${scope}`}>
        <div className="access-status-copy">
          <span className="access-label">{details.label}</span>
          <code>{origin}</code>
          <p>{details.description}</p>
        </div>
        <button type="button" disabled={scope === 'local'} onClick={() => void copyOrigin()}>
          {copyState === 'copied' ? <Check aria-hidden="true" size={17} /> : <Copy aria-hidden="true" size={17} />}
          {copyState === 'copied' ? '已复制' : '复制当前地址'}
        </button>
      </div>

      {copyState === 'failed' ? <p className="sharing-message" role="alert">浏览器未允许复制，请手动选择上方地址。</p> : null}

      <div className="access-options" aria-label="可用的分享方式">
        <article>
          <Network aria-hidden="true" size={21} />
          <div><h3>同一网络</h3><p>启动网站后，把终端显示的 Network 地址发给对方，并保持这台电脑开机。</p></div>
        </article>
        <article>
          <Globe2 aria-hidden="true" size={21} />
          <div><h3>任何电脑</h3><p>把生产版部署到静态托管平台，获得一个 HTTPS 公网链接；这是正式分享的推荐方式。</p></div>
        </article>
        <article>
          <Laptop aria-hidden="true" size={21} />
          <div><h3>Browser 的边界</h3><p>它能检查页面和模拟屏幕尺寸，但不能代替另一台真实电脑验证路由器或校园网限制。</p></div>
        </article>
      </div>
    </section>
  );
}
