'use client';
import { useState } from 'react';
import Modal from './Modal';
import styles from './Modal.module.css';
import { INVENTORY } from '@/lib/inventory';
import type { Vehicle } from '@/types';

interface Props { vehicle: Vehicle | null; onSave: (v: Vehicle) => void; onClose: () => void; }

export default function VehicleModal({ vehicle, onSave, onClose }: Props) {
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<number | null>(vehicle?.id ?? null);
  const list = INVENTORY.filter(v =>
    `${v.year} ${v.make} ${v.model} ${v.trim} ${v.stock}`.toLowerCase().includes(q.toLowerCase())
  );
  return (
    <Modal title="Select Vehicle from Inventory" onClose={onClose} lg>
      <input placeholder="Search year, model, stock #..." value={q} onChange={e => setQ(e.target.value)}
        style={{ width: '100%', padding: '8px 10px', border: '1px solid #ccc', borderRadius: 4, fontFamily: 'inherit', fontSize: 13, marginBottom: 12 }} />
      {list.map(v => (
        <div key={v.id} className={`${styles.invRow}${sel === v.id ? ' ' + styles.invRowSel : ''}`} onClick={() => setSel(v.id)}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 13 }}>{v.year} {v.make} {v.model} <span style={{ fontWeight: 500, color: '#666' }}>{v.trim}</span></div>
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>VIN: {v.vin} · Stock: {v.stock} · {v.color}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>${v.msrp.toLocaleString()}</div>
            {sel === v.id && <div style={{ color: '#C8102E', fontSize: 11, fontWeight: 700 }}>✓ Selected</div>}
          </div>
        </div>
      ))}
      <div className={styles.mactions}>
        <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
        <button className={styles.btnSave} disabled={!sel}
          onClick={() => { const v = INVENTORY.find(x => x.id === sel); if (v) onSave(v); }}>
          Load Vehicle
        </button>
      </div>
    </Modal>
  );
}
