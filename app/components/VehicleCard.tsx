'use client';
import styles from './LeftPanel.module.css';
import { IcoCar } from './icons';
import type { Vehicle } from '@/types';

interface Props { vehicle: Vehicle | null; onEdit: () => void; }

export default function VehicleCard({ vehicle, onEdit }: Props) {
  if (!vehicle) return (
    <div className={styles.card} style={{ textAlign: 'center', padding: '12px 8px' }}>
      <div style={{ color: '#aaa', fontSize: 12, marginBottom: 8 }}>No vehicle loaded</div>
      <button className={styles.btnRed} onClick={onEdit}><IcoCar /> Select Vehicle</button>
    </div>
  );
  return (
    <div className={styles.card}>
      <div className={styles.entityCard}>
        <div className={styles.entityIcon} onClick={onEdit} title="Select Vehicle">
          <IcoCar size={24} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className={styles.entityName}>{vehicle.year} {vehicle.make} {vehicle.model}</div>
          <div className={styles.entitySub} style={{ wordBreak: 'break-all', fontSize: 10 }}>
            {vehicle.vin}<span className={styles.vinBadge}>{vehicle.stock}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
