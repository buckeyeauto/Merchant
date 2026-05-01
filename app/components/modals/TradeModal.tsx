'use client';
import { useState } from 'react';
import Modal from './Modal';
import styles from './Modal.module.css';
import { IcoTrash } from '../icons';
import type { Trade } from '@/types';

let _tid = 100;
interface Props { trades: Trade[]; onSave: (t: Trade[]) => void; onClose: () => void; }

export default function TradeModal({ trades, onSave, onClose }: Props) {
  const [list, setList] = useState<Trade[]>(trades.map(t => ({ ...t })));
  const add = () => setList(l => [...l, { id: _tid++, year: 2024, make: '', model: '', vin: '', allowance: 0, payoff: 0, acv: 0 }]);
  const del = (idx: number) => setList(l => l.filter((_, n) => n !== idx));
  const upd = (idx: number, k: keyof Trade, v: string | number) => setList(l => l.map((x, n) => n === idx ? { ...x, [k]: v } : x));
  return (
    <Modal title="Trade-In Manager" onClose={onClose} lg>
      <div style={{ maxHeight: 400, overflowY: 'auto' }}>
        {list.map((t, idx) => (
          <div key={t.id} style={{ border: '1px solid #e0e0e0', borderRadius: 5, padding: '12px 14px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <span style={{ fontWeight: 700, fontSize: 13 }}>Trade #{idx + 1}</span>
              <button className={styles.ibtnDk} onClick={() => del(idx)}><IcoTrash size={14} /></button>
            </div>
            <div className={styles.mrow}>
              <div className={styles.mfield} style={{ maxWidth: 72 }}><label>Year</label><input type="number" value={t.year} onChange={e => upd(idx, 'year', e.target.value)} /></div>
              <div className={styles.mfield}><label>Make</label><input value={t.make} onChange={e => upd(idx, 'make', e.target.value)} /></div>
              <div className={styles.mfield}><label>Model</label><input value={t.model} onChange={e => upd(idx, 'model', e.target.value)} /></div>
            </div>
            <div className={styles.mfield}><label>VIN</label><input value={t.vin} onChange={e => upd(idx, 'vin', e.target.value)} /></div>
            <div className={styles.mrow}>
              <div className={styles.mfield}><label>Allowance</label><input type="number" value={t.allowance} onChange={e => upd(idx, 'allowance', e.target.value)} /></div>
              <div className={styles.mfield}><label>Payoff</label><input type="number" value={t.payoff} onChange={e => upd(idx, 'payoff', e.target.value)} /></div>
              <div className={styles.mfield}><label>ACV</label><input type="number" value={t.acv} onChange={e => upd(idx, 'acv', e.target.value)} /></div>
            </div>
          </div>
        ))}
      </div>
      <button className={styles.btnAddItem} onClick={add}>+ Add Trade</button>
      <div className={styles.mactions}>
        <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
        <button className={styles.btnSave} onClick={() => onSave(list)}>Save Trades</button>
      </div>
    </Modal>
  );
}
