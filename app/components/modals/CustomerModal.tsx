'use client';
import { useState } from 'react';
import Modal from './Modal';
import styles from './Modal.module.css';
import type { Customer } from '@/types';

interface Props { customer: Customer; onSave: (c: Customer) => void; onClose: () => void; }

export default function CustomerModal({ customer, onSave, onClose }: Props) {
  const [f, setF] = useState({ ...customer });
  const set = (k: keyof Customer, v: string) => setF(x => ({ ...x, [k]: v }));
  return (
    <Modal title="Edit Customer" onClose={onClose}>
      <div className={styles.mrow}>
        <div className={styles.mfield}><label>First Name</label><input value={f.firstName} onChange={e => set('firstName', e.target.value)} /></div>
        <div className={styles.mfield}><label>Last Name</label><input value={f.lastName} onChange={e => set('lastName', e.target.value)} /></div>
      </div>
      <div className={styles.mfield}><label>Address</label><input value={f.address} onChange={e => set('address', e.target.value)} /></div>
      <div className={styles.mrow}>
        <div className={styles.mfield}><label>City</label><input value={f.city} onChange={e => set('city', e.target.value)} /></div>
        <div className={styles.mfield} style={{ maxWidth: 58 }}><label>State</label><input value={f.state} onChange={e => set('state', e.target.value)} /></div>
        <div className={styles.mfield} style={{ maxWidth: 80 }}><label>ZIP</label><input value={f.zip} onChange={e => set('zip', e.target.value)} /></div>
      </div>
      <div className={styles.mrow}>
        <div className={styles.mfield}><label>Phone</label><input value={f.phone} onChange={e => set('phone', e.target.value)} /></div>
        <div className={styles.mfield}><label>Email</label><input value={f.email} onChange={e => set('email', e.target.value)} /></div>
      </div>
      <div className={styles.mactions}>
        <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
        <button className={styles.btnSave} onClick={() => onSave(f)}>Save Customer</button>
      </div>
    </Modal>
  );
}
