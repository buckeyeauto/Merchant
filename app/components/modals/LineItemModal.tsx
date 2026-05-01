'use client';
import { useState } from 'react';
import Modal from './Modal';
import styles from './Modal.module.css';
import { IcoTrash } from '../icons';
import type { LineItem } from '@/types';

interface Props { title: string; items: LineItem[]; onSave: (items: LineItem[]) => void; onClose: () => void; }

export default function LineItemModal({ title, items: init, onSave, onClose }: Props) {
  const [items, setItems] = useState<LineItem[]>(init.map(x => ({ ...x })));
  const add = () => setItems(i => [...i, { label: '', amount: 0 }]);
  const del = (idx: number) => setItems(i => i.filter((_, n) => n !== idx));
  const upd = (idx: number, k: keyof LineItem, v: string | number) =>
    setItems(i => i.map((x, n) => n === idx ? { ...x, [k]: v } : x));
  const total = items.reduce((s, i) => s + Number(i.amount), 0);
  return (
    <Modal title={title} onClose={onClose}>
      {items.map((item, idx) => (
        <div key={idx} className={styles.mitemRow}>
          <input placeholder="Description" value={item.label} onChange={e => upd(idx, 'label', e.target.value)} />
          <input placeholder="$0" value={item.amount} className={styles.iamt} onChange={e => upd(idx, 'amount', e.target.value)} />
          <button className={styles.ibtnDk} onClick={() => del(idx)}><IcoTrash /></button>
        </div>
      ))}
      <button className={styles.btnAddItem} onClick={add}>+ Add Item</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', marginTop: 8, borderTop: '1px solid #eee' }}>
        <span style={{ fontWeight: 700 }}>Total</span>
        <span style={{ fontWeight: 800, fontSize: 16 }}>${Number(total).toLocaleString()}</span>
      </div>
      <div className={styles.mactions}>
        <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
        <button className={styles.btnSave} onClick={() => onSave(items)}>Apply</button>
      </div>
    </Modal>
  );
}
