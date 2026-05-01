'use client';
import { useState } from 'react';
import Modal from './Modal';
import styles from './Modal.module.css';
import { INVENTORY } from '@/lib/inventory';
import type { Vehicle } from '@/types';

interface Props { vehicle: Vehicle | null; onSave: (v: Vehicle) => void; onClose: () => void; }

const BLANK: Omit<Vehicle, 'id'> = { year: new Date().getFullYear(), make: '', model: '', trim: '', vin: '', stock: '', msrp: 0, color: '' };

export default function VehicleModal({ vehicle, onSave, onClose }: Props) {
  const [mode, setMode] = useState<'inventory' | 'manual'>('inventory');
  const [q, setQ] = useState('');
  const [sel, setSel] = useState<number | null>(vehicle?.id ?? null);
  const [manual, setManual] = useState<Omit<Vehicle, 'id'>>(BLANK);

  const setM = (k: keyof typeof manual, v: string | number) => setManual(x => ({ ...x, [k]: v }));
  const manualValid = !!(manual.year && manual.make && manual.model && manual.msrp);

  const list = INVENTORY.filter(v =>
    `${v.year} ${v.make} ${v.model} ${v.trim} ${v.stock}`.toLowerCase().includes(q.toLowerCase())
  );

  const handleSave = () => {
    if (mode === 'manual') {
      onSave({ id: Date.now(), ...manual, msrp: Number(manual.msrp) });
    } else {
      const v = INVENTORY.find(x => x.id === sel);
      if (v) onSave(v);
    }
  };

  return (
    <Modal title="Vehicle" onClose={onClose} lg>
      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 14 }}>
        <button
          onClick={() => setMode('inventory')}
          style={{ flex: 1, padding: '6px 0', borderRadius: 4, border: '1.5px solid', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700,
            background: mode === 'inventory' ? 'var(--brand)' : 'var(--surface)',
            color: mode === 'inventory' ? 'white' : 'var(--text-3)',
            borderColor: mode === 'inventory' ? 'var(--brand)' : 'var(--border-2)',
          }}
        >Inventory</button>
        <button
          onClick={() => setMode('manual')}
          style={{ flex: 1, padding: '6px 0', borderRadius: 4, border: '1.5px solid', cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, fontWeight: 700,
            background: mode === 'manual' ? 'var(--brand)' : 'var(--surface)',
            color: mode === 'manual' ? 'white' : 'var(--text-3)',
            borderColor: mode === 'manual' ? 'var(--brand)' : 'var(--border-2)',
          }}
        >Manual Entry</button>
      </div>

      {mode === 'inventory' ? (
        <>
          <input placeholder="Search year, model, stock #..." value={q} onChange={e => setQ(e.target.value)}
            style={{ width: '100%', padding: '8px 10px', border: '1px solid var(--border-2)', borderRadius: 4, fontFamily: 'inherit', fontSize: 13, marginBottom: 12, background: 'var(--surface-input)', color: 'var(--text)', boxSizing: 'border-box' }} />
          <div style={{ maxHeight: 300, overflowY: 'auto' }}>
            {list.map(v => (
              <div key={v.id} className={`${styles.invRow}${sel === v.id ? ' ' + styles.invRowSel : ''}`} onClick={() => setSel(v.id)}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{v.year} {v.make} {v.model} <span style={{ fontWeight: 500, color: 'var(--text-3)' }}>{v.trim}</span></div>
                  <div style={{ fontSize: 11, color: 'var(--text-4)', marginTop: 2 }}>VIN: {v.vin} · Stock: {v.stock} · {v.color}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>${v.msrp.toLocaleString()}</div>
                  {sel === v.id && <div style={{ color: 'var(--brand)', fontSize: 11, fontWeight: 700 }}>✓ Selected</div>}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className={styles.mrow}>
            <div className={styles.mfield} style={{ maxWidth: 80 }}><label>Year</label><input type="number" value={manual.year} onChange={e => setM('year', e.target.value)} /></div>
            <div className={styles.mfield}><label>Make</label><input value={manual.make} onChange={e => setM('make', e.target.value)} /></div>
            <div className={styles.mfield}><label>Model</label><input value={manual.model} onChange={e => setM('model', e.target.value)} /></div>
          </div>
          <div className={styles.mfield}><label>MSRP</label><input type="number" value={manual.msrp || ''} onChange={e => setM('msrp', e.target.value)} /></div>
          <div className={styles.msecTitle}>Optional</div>
          <div className={styles.mrow}>
            <div className={styles.mfield}><label>Trim</label><input value={manual.trim} onChange={e => setM('trim', e.target.value)} /></div>
            <div className={styles.mfield}><label>Color</label><input value={manual.color} onChange={e => setM('color', e.target.value)} /></div>
          </div>
          <div className={styles.mrow}>
            <div className={styles.mfield}><label>VIN</label><input value={manual.vin} onChange={e => setM('vin', e.target.value)} /></div>
            <div className={styles.mfield} style={{ maxWidth: 100 }}><label>Stock #</label><input value={manual.stock} onChange={e => setM('stock', e.target.value)} /></div>
          </div>
        </>
      )}

      <div className={styles.mactions}>
        <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
        <button className={styles.btnSave} disabled={mode === 'inventory' ? !sel : !manualValid} onClick={handleSave}>
          {mode === 'inventory' ? 'Load Vehicle' : 'Add Vehicle'}
        </button>
      </div>
    </Modal>
  );
}
