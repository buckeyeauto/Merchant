'use client';
import styles from './LeftPanel.module.css';
import { IcoUser } from './icons';
import type { Customer } from '@/types';

interface Props { customer: Customer; onEdit: () => void; }

export default function CustomerCard({ customer, onEdit }: Props) {
  return (
    <div className={styles.card}>
      <div className={styles.entityCard}>
        <div className={styles.entityIcon} onClick={onEdit} title="Edit Customer">
          <IcoUser size={24} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className={styles.entityName}>{customer.firstName} {customer.lastName}</div>
          <div className={styles.entitySub}>{customer.address}<br />{customer.city}, {customer.state} {customer.zip}</div>
        </div>
      </div>
    </div>
  );
}
