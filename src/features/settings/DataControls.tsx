import { Download, FileUp, RotateCcw, ShieldCheck } from 'lucide-react';
import { useRef, useState } from 'react';
import type { Progress } from '../../domain/progress';
import { exportProgress, importProgress } from '../progress/progressStore';

interface DataControlsProps {
  progress: Progress;
  onImport: (progress: Progress) => void;
  onReset: () => void;
  onRestore?: () => void;
}

export function DataControls({ progress, onImport, onReset, onRestore }: DataControlsProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [pendingImport, setPendingImport] = useState<Progress | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const download = () => {
    const blob = new Blob([exportProgress(progress)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `hola-learning-${progress.todayDate}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
    setMessage('学习记录已导出。');
  };

  const readFile = async (file?: File) => {
    if (!file) return;
    try {
      setPendingImport(importProgress(await file.text()));
      setMessage('文件校验通过。确认后才会替换当前进度。');
    } catch {
      setPendingImport(null);
      setMessage('无法导入：文件内容无效或版本不兼容。');
    } finally {
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  return (
    <section className="data-controls">
      <div className="data-heading"><ShieldCheck aria-hidden="true" size={26} /><div><h2>学习记录保险箱</h2><p>浏览器会保留当前记录和上一份有效备份，你也可以导出到自己的电脑。</p></div></div>
      <div className="data-actions">
        <button type="button" onClick={download}><Download size={18} /> 导出学习记录</button>
        <label className="file-button"><FileUp size={18} /> 导入学习记录<input ref={inputRef} aria-label="选择学习记录文件" type="file" accept="application/json,.json" onChange={(event) => void readFile(event.target.files?.[0])} /></label>
      </div>
      {message ? <p className="data-message" role={message.startsWith('无法') ? 'alert' : 'status'}>{message}</p> : null}
      {pendingImport ? <div className="confirm-panel"><p>将导入 {pendingImport.xp} XP、{pendingImport.vocabularyIds.length} 个词语的记录。</p><button type="button" onClick={() => { onImport(pendingImport); setPendingImport(null); setMessage('导入完成，旧记录仍保留为备份。'); }}>确认导入此记录</button></div> : null}
      <div className="danger-zone">
        <div><h3>重新开始</h3><p>初始进度会替换当前显示，但重置前记录仍可从本机备份恢复。</p></div>
        {!confirmReset ? (
          <button type="button" onClick={() => setConfirmReset(true)}><RotateCcw size={17} /> 回到初始进度</button>
        ) : (
          <div className="confirm-buttons"><button className="danger-button" type="button" onClick={() => { onReset(); setConfirmReset(false); setMessage('已回到初始进度；重置前记录仍保存在备份中。'); }}>确认清空并重新开始</button><button type="button" onClick={() => setConfirmReset(false)}>取消</button></div>
        )}
      </div>
      {onRestore ? <button className="restore-button" type="button" onClick={onRestore}>恢复上一份本机备份</button> : null}
    </section>
  );
}
