'use client';
import { useState } from 'react';
import Modal from './Modal';
import styles from './Modal.module.css';
import type { Pricing } from '@/types';

interface TaxState { stateTax: number; countyTax: number; outOfState: number; credit: number; county: string; }
interface Props { pricing: Pricing; onSave: (p: Pricing) => void; onClose: () => void; }

export default function TaxModal({ pricing, onSave, onClose }: Props) {
  const [f, setF] = useState<TaxState>({ stateTax: 6.75, countyTax: 0, outOfState: 0, credit: 1755, county: 'Fairfield, OH' });
  const [applyTradeAllowanceTax, setApplyTradeAllowanceTax] = useState(pricing.applyTradeAllowanceTax !== false);
  const set = (k: keyof TaxState, v: string | number) => setF(x => ({ ...x, [k]: v }));
  const base = pricing.salePrice;
  const stAmt = base * (f.stateTax / 100);
  const ctAmt = base * (f.countyTax / 100);
  const tradeCredit = applyTradeAllowanceTax ? Number(f.credit) : 0;
  const total = stAmt + ctAmt - tradeCredit;
  return (
    <Modal title="Tax Information" onClose={onClose}>
      <div className={styles.mrow}>
        <div className={styles.mfield}><label>County / Locale</label><input value={f.county} onChange={e => set('county', e.target.value)} /></div>
        <div className={styles.mfield} style={{ maxWidth: 90 }}><label>State Tax %</label><input type="number" value={f.stateTax} onChange={e => set('stateTax', e.target.value)} /></div>
      </div>
      <div className={styles.mrow}>
        <div className={styles.mfield} style={{ maxWidth: 90 }}><label>County Tax %</label><input type="number" value={f.countyTax} onChange={e => set('countyTax', e.target.value)} /></div>
        <div className={styles.mfield} style={{ maxWidth: 90 }}><label>Out of State %</label><input type="number" value={f.outOfState} onChange={e => set('outOfState', e.target.value)} /></div>
        <div className={styles.mfield}><label>Vehicle Tax Credit</label><input type="number" value={f.credit} onChange={e => set('credit', e.target.value)} /></div>
      </div>
      <div className={styles.msecTitle} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Tax Breakdown</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11, color: 'var(--text-3)', cursor: 'pointer' }}>
          <input type="checkbox" checked={applyTradeAllowanceTax} onChange={e => setApplyTradeAllowanceTax(e.target.checked)} style={{ width: 'auto', margin: 0 }} />
          Apply Trade Allowance Credit
        </label>
      </div>
      <div className={styles.taxRow}><span>{f.county} ({f.stateTax}%)</span><span style={{ fontWeight: 700 }}>${stAmt.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
      {ctAmt > 0 && <div className={styles.taxRow}><span>County Tax ({f.countyTax}%)</span><span style={{ fontWeight: 700 }}>${ctAmt.toFixed(2)}</span></div>}
      {applyTradeAllowanceTax && <div className={styles.taxRow}><span>OH Trade Allowance</span><span style={{ fontWeight: 700, color: 'var(--brand)' }}>-${Number(f.credit).toLocaleString()}</span></div>}
      <div className={styles.taxRow} style={{ borderBottom: 'none', paddingTop: 8, marginTop: 4, borderTop: '1px solid #ddd' }}><span style={{ fontWeight: 700 }}>Total Tax</span><span style={{ fontWeight: 800, fontSize: 15 }}>${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span></div>
      <div className={styles.mactions}>
        <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
        <button className={styles.btnSave} onClick={() => onSave({
          ...pricing, taxes: total,
          taxRate: Number(f.stateTax) + Number(f.countyTax) + Number(f.outOfState),
          applyTradeAllowanceTax,
          taxItems: [
            { label: `${f.county} (${f.stateTax}%)`, amount: stAmt },
            ...(applyTradeAllowanceTax ? [{ label: 'OH Trade Allowance', amount: -f.credit }] : []),
          ],
        })}>Apply</button>
      </div>
    </Modal>
  );
}
