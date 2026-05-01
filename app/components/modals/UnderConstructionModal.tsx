'use client';
import s from './Modal.module.css';

export default function UnderConstructionModal({ feature, onClose }: { feature: string; onClose: () => void }) {
  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.mbox} style={{ textAlign: 'center', maxWidth: 340 }} onClick={e => e.stopPropagation()}>
        <div style={{ fontSize: 52, lineHeight: 1, marginBottom: 14 }}>🚧</div>
        <div style={{ fontSize: 17, fontWeight: 800, marginBottom: 8, color: 'var(--text)' }}>{feature}</div>
        <div style={{ fontSize: 13, color: 'var(--text-3)', lineHeight: 1.5, marginBottom: 22 }}>
          This feature is under construction and will be available in a future update.
        </div>
        <div className={s.mactions} style={{ justifyContent: 'center' }}>
          <button className={s.btnCancel} onClick={onClose}>Got it</button>
        </div>
      </div>
    </div>
  );
}
