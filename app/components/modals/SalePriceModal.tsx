'use client';
import { useState } from 'react';
import Modal from './Modal';
import styles from './Modal.module.css';
import { IcoTrash } from '../icons';
import type { Pricing, LineItem } from '@/types';

interface Props { pricing: Pricing; onSave: (p: Pricing) => void; onClose: () => void; }

export default function SalePriceModal({ pricing, onSave, onClose }: Props) {
  const [items, setItems] = useState<LineItem[]>(pricing.discountItems ?? [{ label: 'Discount', amount: -1500 }]);
  const add = () => setItems(i => [...i, { label: '', amount: 0 }]);
  const del = (idx: number) => setItems(i => i.filter((_, n) => n !== idx));
  const upd = (idx: number, k: keyof LineItem, v: string | number) =>
    setItems(i => i.map((x, n) => n === idx ? { ...x, [k]: v } : x));
  const total = items.reduce((s, i) => s + Number(i.amount), 0);
  const sp = pricing.msrp + total;
  return (
    <Modal title="Edit Sale Price" onClose={onClose}>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', marginBottom: 8, borderBottom: '1px solid #eee' }}>
        <span style={{ color: '#666', fontSize: 12 }}>MSRP</span>
        <span style={{ fontWeight: 700, fontSize: 15 }}>${pricing.msrp.toLocaleString()}</span>
      </div>
      <div className={styles.msecTitle} style={{ marginTop: 0, borderTop: 'none', paddingTop: 0 }}>Discount Line Items</div>
      {items.map((item, idx) => (
        <div key={idx} className={styles.mitemRow}>
          <input placeholder="Description" value={item.label} onChange={e => upd(idx, 'label', e.target.value)} />
          <input placeholder="Amount" value={item.amount} className={styles.iamt} onChange={e => upd(idx, 'amount', e.target.value)} />
          <button className={styles.ibtnDk} onClick={() => del(idx)}><IcoTrash /></button>
        </div>
      ))}
      <button className={styles.btnAddItem} onClick={add}>+ Add Line Item</button>
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0 0', marginTop: 8, borderTop: '1px solid #eee' }}>
        <span style={{ fontWeight: 700 }}>Sale Price</span>
        <span style={{ fontWeight: 800, fontSize: 16, color: sp < pricing.msrp ? '#1a6b1a' : '#C8102E' }}>${sp.toLocaleString()}</span>
      </div>
      <div className={styles.mactions}>
        <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
        <button className={styles.btnSave} onClick={() => onSave({ ...pricing, salePrice: sp, discount: Math.abs(total), discountItems: items })}>Apply</button>
      </div>
    </Modal>
  );
}
