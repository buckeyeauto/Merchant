'use client';
import { useState } from 'react';
import styles from './LeftPanel.module.css';
import type { Pricing, Deal, Trade } from '@/types';
import { calcTax } from '@/lib/calc';

interface Props {
  pricing: Pricing;
  activeDeal: Deal;
  trades: Trade[];
  onEditSalePrice: () => void;
  onEditTax: () => void;
  onUpdateSalePrice: (v: number) => void;
}

export default function PriceCard({ pricing, activeDeal, trades, onEditSalePrice, onEditTax, onUpdateSalePrice }: Props) {
  const [priceOpen, setPriceOpen] = useState(true);
  const [taxOpen, setTaxOpen] = useState(true);
  const [salePriceFocused, setSalePriceFocused] = useState(false);
  const tax = calcTax(pricing, activeDeal, trades);
  return (
    <div className={styles.card}>
      <div className={styles.msrpRow}>
        <span className={styles.msrpLbl}>MSRP</span>
        <span className={styles.msrpVal}>${pricing.msrp.toLocaleString()}</span>
      </div>
      <div className={styles.priceRow}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className={`${styles.caret} ${priceOpen ? styles.caretD : styles.caretR}`} onClick={() => setPriceOpen(o => !o)} />
          <button className={styles.btnRed} onClick={onEditSalePrice}>Sale Price</button>
        </div>
        <input
          className={styles.priceValInp}
          type="text"
          value={salePriceFocused ? String(pricing.salePrice) : `$${Number(pricing.salePrice).toLocaleString()}`}
          onChange={e => {
            const raw = e.target.value.replace(/[^0-9.]/g, '');
            onUpdateSalePrice(Number(raw) || 0);
          }}
          onFocus={e => { setSalePriceFocused(true); setTimeout(() => e.target.select(), 0); }}
          onBlur={() => setSalePriceFocused(false)}
        />
      </div>
      {priceOpen && (pricing.discountItems ?? [{ label: 'Discount', amount: -pricing.discount }]).map((item, i) => (
        <div key={i} className={styles.priceSub}>
          <span>{item.label}</span>
          <span>{item.amount < 0 ? '-' : '+'}${Math.abs(item.amount).toLocaleString()}</span>
        </div>
      ))}
      <div className={styles.priceRow} style={{ marginTop: 3 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className={`${styles.caret} ${taxOpen ? styles.caretD : styles.caretR}`} onClick={() => setTaxOpen(o => !o)} />
          <button className={styles.btnRed} onClick={onEditTax}>Taxes</button>
        </div>
        <span className={styles.priceVal}>${tax.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      {taxOpen && tax.items.map((item, i) => (
        <div key={i} className={styles.priceSub}>
          <span>{item.label}</span>
          <span style={{ color: item.amount < 0 ? '#555' : '#333' }}>{item.amount < 0 ? '-' : ''}${Math.abs(item.amount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>
      ))}
    </div>
  );
}
