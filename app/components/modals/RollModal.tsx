'use client';
import { useState } from 'react';
import Modal from './Modal';
import styles from './Modal.module.css';
import type { Deal } from '@/types';

interface Props { deal: Deal; onClose: () => void; }

export default function RollModal({ deal, onClose }: Props) {
  const [target, setTarget] = useState('');
  const [rate, setRate] = useState(deal.rate || 4.99);
  const [term, setTerm] = useState(deal.term || 60);
  const [down, setDown] = useState(0);
  const pmt = target
    ? ((Number(target) - Number(down)) * (Number(rate) / 100 / 12)) /
      (1 - Math.pow(1 + Number(rate) / 100 / 12, -Number(term)))
    : null;
  return (
    <Modal title="Roll Payment" onClose={onClose}>
      <div className={styles.rollFields}>
        <div className={styles.rollF}><label>Desired Payment</label><input value={target} onChange={e => setTarget(e.target.value)} placeholder="$0.00" /></div>
        <div className={styles.rollF}><label>Down Payment</label><input value={down} onChange={e => setDown(Number(e.target.value))} /></div>
      </div>
      <div className={styles.rollFields}>
        <div className={styles.rollF}><label>Rate %</label><input type="number" value={rate} onChange={e => setRate(Number(e.target.value))} /></div>
        <div className={styles.rollF}><label>Term (mo)</label><input type="number" value={term} onChange={e => setTerm(Number(e.target.value))} /></div>
      </div>
      <div className={styles.rollResult}>
        <div className={styles.rollResLbl}>Estimated Payment</div>
        <div className={styles.rollResVal}>{pmt && !isNaN(pmt) ? '$' + pmt.toFixed(2) : '—'}</div>
      </div>
      <div className={styles.mactions}>
        <button className={styles.btnCancel} onClick={onClose}>Close</button>
      </div>
    </Modal>
  );
}
