'use client';
import styles from './LeftPanel.module.css';
import { IcoRefresh } from './icons';
import type { Trade } from '@/types';

interface Props {
  trades: Trade[];
  onEdit: () => void;
  onUpdateTrade: (idx: number, key: keyof Trade, value: number) => void;
}

export default function TradesCard({ trades, onEdit, onUpdateTrade }: Props) {
  return (
    <div className={`${styles.card} ${styles.tradesCard}`}>
      <div className={styles.tradesHdr}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <div className={styles.entityIcon} onClick={onEdit} title="Edit Trades">
            <IcoRefresh size={24} />
          </div>
          <span style={{ fontSize: 24, fontWeight: 700 }}>Trades</span>
        </div>
      </div>
      <div className={styles.tradesScroll}>
        {trades.length === 0 && <div style={{ color: '#aaa', fontSize: 12, textAlign: 'center', padding: '8px 0' }}>No trades added</div>}
        {trades.map((t, idx) => (
          <div key={t.id} className={styles.tradeEntry}>
            <div className={styles.tradeName}>{t.year} {t.make} {t.model}</div>
            <div className={styles.tradeFields}>
              {(['allowance', 'payoff', 'acv'] as const).map(field => (
                <div key={field} className={styles.tradeF}>
                  <input className={styles.tradeInp} type="number" value={t[field]}
                    onChange={e => onUpdateTrade(idx, field, Number(e.target.value))}
                    onFocus={e => e.currentTarget.select()} />
                  <span className={styles.tradeFl}>{field.charAt(0).toUpperCase() + field.slice(1)}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
