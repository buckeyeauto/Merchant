'use client';
import { useState, useMemo } from 'react';
import Modal from './Modal';
import styles from './Modal.module.css';
import { OHIO_COUNTY_TAX, OHIO_STATE_RATE, ohioCountyMap } from '@/lib/ohioCountyTax';
import { ZIP_RATES } from '@/lib/ohioZipRates';
import type { Pricing, Customer } from '@/types';

interface TaxState {
  county: string;
  stateTax: number;
  countyTax: number;
  transitTax: number;
  outOfState: number;
  credit: number;
}

interface Props {
  pricing: Pricing;
  customer?: Customer;
  onSave: (p: Pricing) => void;
  onClose: () => void;
}

function baseCountyName(name: string) {
  return name.replace(/\s*\(COTA\)\s*/i, '').trim();
}

function ratesFromTotal(countyName: string, totalRate: number) {
  const base = baseCountyName(countyName);
  const data = ohioCountyMap[base.toLowerCase()];
  const countyTax = data?.countyRate ?? 0;
  const transitTax = Math.round((totalRate * 100 - OHIO_STATE_RATE * 100 - countyTax * 100)) / 100;
  return { countyTax, transitTax: Math.max(0, transitTax) };
}

export default function TaxModal({ pricing, customer, onSave, onClose }: Props) {
  const zip = customer?.zip?.trim() ?? '';

  const zipEntries = useMemo(() => ZIP_RATES[zip] ?? [], [zip]);

  // Seed initial state from ZIP if we have a single unambiguous match
  function buildInitialState(): TaxState {
    // For multi-county ZIPs, default to the first non-COTA entry so the modal
    // opens with a reasonable starting calc. Pills let the user correct it.
    const seed = zipEntries.find(e => !/COTA/i.test(e.county)) ?? zipEntries[0];
    if (seed) {
      const base = baseCountyName(seed.county);
      const { countyTax, transitTax } = ratesFromTotal(base, seed.rate);
      return { county: base, stateTax: OHIO_STATE_RATE, countyTax, transitTax, outOfState: 0, credit: 1755 };
    }
    return { county: '', stateTax: OHIO_STATE_RATE, countyTax: 0, transitTax: 0, outOfState: 0, credit: 1755 };
  }

  const [f, setF] = useState<TaxState>(buildInitialState);
  const [applyTradeAllowanceTax, setApplyTradeAllowanceTax] = useState(pricing.applyTradeAllowanceTax !== false);

  const set = <K extends keyof TaxState>(k: K, v: TaxState[K]) => setF(x => ({ ...x, [k]: v }));

  const applyZipEntry = (countyLabel: string, totalRate: number) => {
    const base = baseCountyName(countyLabel);
    const { countyTax, transitTax } = ratesFromTotal(base, totalRate);
    setF(x => ({ ...x, county: base, stateTax: OHIO_STATE_RATE, countyTax, transitTax }));
  };

  const applyCountyDropdown = (countyName: string) => {
    // Check if this ZIP has a specific rate for this county
    const zipMatch = zipEntries.find(e => baseCountyName(e.county).toLowerCase() === countyName.toLowerCase());
    if (zipMatch) {
      applyZipEntry(zipMatch.county, zipMatch.rate);
      return;
    }
    // Fall back to county-level data
    const data = ohioCountyMap[countyName.toLowerCase()];
    if (!data) return;
    setF(x => ({ ...x, county: data.county, stateTax: OHIO_STATE_RATE, countyTax: data.countyRate, transitTax: data.transitRate }));
  };

  const base = pricing.salePrice;
  const stAmt = base * (Number(f.stateTax) / 100);
  const ctAmt = base * (Number(f.countyTax) / 100);
  const trAmt = base * (Number(f.transitTax) / 100);
  const tradeCredit = applyTradeAllowanceTax ? Number(f.credit) : 0;
  const total = stAmt + ctAmt + trAmt - tradeCredit;
  const totalRate = Number(f.stateTax) + Number(f.countyTax) + Number(f.transitTax) + Number(f.outOfState);

  // Group ZIP entries: show COTA variants distinctly
  const hasMultipleZipEntries = zipEntries.length > 1;

  return (
    <Modal title="Tax Information" onClose={onClose}>

      {/* ZIP match suggestions */}
      {zipEntries.length > 0 && (
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-4)', marginBottom: 6 }}>
            {hasMultipleZipEntries
              ? `ZIP ${zip} spans multiple areas — select one:`
              : `ZIP ${zip} matched:`}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {zipEntries.map(entry => {
              const isCOTA = /COTA/i.test(entry.county);
              const entryTotal = Math.round(entry.rate * 10000);
              const stateTotal = Math.round((OHIO_STATE_RATE + f.countyTax + f.transitTax) * 100);
              const isActive = baseCountyName(entry.county).toLowerCase() === f.county.toLowerCase()
                && entryTotal === stateTotal;
              return (
                <button
                  key={entry.county}
                  onClick={() => applyZipEntry(entry.county, entry.rate)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 4,
                    border: '1.5px solid',
                    borderColor: isCOTA ? 'var(--brand)' : 'var(--border-2)',
                    background: 'var(--surface)',
                    color: isCOTA ? 'var(--brand)' : 'var(--text)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    opacity: hasMultipleZipEntries && f.county && !isActive ? 0.45 : 1,
                  }}
                >
                  {entry.county} — {(entry.rate * 100).toFixed(2)}%
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* County dropdown + out of state */}
      <div className={styles.mrow} style={{ alignItems: 'flex-end' }}>
        <div className={styles.mfield} style={{ flex: 2 }}>
          <label>Ohio County</label>
          <select value={f.county} onChange={e => applyCountyDropdown(e.target.value)}>
            <option value="">— select county —</option>
            {OHIO_COUNTY_TAX.map(c => (
              <option key={c.county} value={c.county}>
                {c.county} ({c.totalRate}%)
              </option>
            ))}
          </select>
        </div>
        <div className={styles.mfield} style={{ flex: 1 }}>
          <label>Out of State %</label>
          <input type="number" step="0.01" value={f.outOfState} onChange={e => set('outOfState', Number(e.target.value))} />
        </div>
      </div>

      {/* Rate fields */}
      <div className={styles.mrow}>
        <div className={styles.mfield}>
          <label>State Tax %</label>
          <input type="number" step="0.01" value={f.stateTax} onChange={e => set('stateTax', Number(e.target.value))} />
        </div>
        <div className={styles.mfield}>
          <label>County Permissive %</label>
          <input type="number" step="0.01" value={f.countyTax} onChange={e => set('countyTax', Number(e.target.value))} />
        </div>
        <div className={styles.mfield}>
          <label>Transit %</label>
          <input type="number" step="0.01" value={f.transitTax} onChange={e => set('transitTax', Number(e.target.value))} />
        </div>
        <div className={styles.mfield}>
          <label>Trade Credit</label>
          <input type="number" value={f.credit} onChange={e => set('credit', Number(e.target.value))} />
        </div>
      </div>

      {/* Breakdown */}
      <div className={styles.msecTitle} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>Tax Breakdown</span>
        <label style={{ display: 'flex', alignItems: 'center', gap: 5, fontWeight: 400, textTransform: 'none', letterSpacing: 0, fontSize: 11, color: 'var(--text-3)', cursor: 'pointer' }}>
          <input type="checkbox" checked={applyTradeAllowanceTax} onChange={e => setApplyTradeAllowanceTax(e.target.checked)} style={{ width: 'auto', margin: 0 }} />
          Apply Trade Allowance Credit
        </label>
      </div>

      <div className={styles.taxRow}>
        <span>
          {f.county
            ? `${f.county} (${Number(f.stateTax) + Number(f.countyTax)}%)`
            : `Ohio State (${f.stateTax}%)`}
        </span>
        <span style={{ fontWeight: 700 }}>${(stAmt + ctAmt).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      {trAmt > 0 && (
        <div className={styles.taxRow}>
          <span>Transit ({f.transitTax}%)</span>
          <span style={{ fontWeight: 700 }}>${trAmt.toFixed(2)}</span>
        </div>
      )}
      {applyTradeAllowanceTax && (
        <div className={styles.taxRow}>
          <span>OH Trade Allowance</span>
          <span style={{ fontWeight: 700, color: 'var(--brand)' }}>-${Number(f.credit).toLocaleString()}</span>
        </div>
      )}
      <div className={styles.taxRow} style={{ borderBottom: 'none', paddingTop: 8, marginTop: 4, borderTop: '1px solid #ddd' }}>
        <span style={{ fontWeight: 700 }}>Total Tax</span>
        <span style={{ fontWeight: 800, fontSize: 15 }}>
          ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>

      <div className={styles.mactions}>
        <button className={styles.btnCancel} onClick={onClose}>Cancel</button>
        <button className={styles.btnSave} onClick={() => onSave({
          ...pricing,
          taxes: total,
          taxRate: totalRate,
          county: f.county || undefined,
          transitRate: Number(f.transitTax) || 0,
          applyTradeAllowanceTax,
          taxItems: [
            {
              label: f.county
                ? `${f.county} (${Number(f.stateTax) + Number(f.countyTax)}%)`
                : `Ohio State (${f.stateTax}%)`,
              amount: stAmt + ctAmt,
            },
            ...(trAmt > 0 ? [{ label: `Transit (${f.transitTax}%)`, amount: trAmt }] : []),
            ...(applyTradeAllowanceTax ? [{ label: 'OH Trade Allowance', amount: -f.credit }] : []),
          ],
        })}>Apply</button>
      </div>
    </Modal>
  );
}
