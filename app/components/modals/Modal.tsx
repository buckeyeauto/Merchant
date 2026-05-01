'use client';
import styles from './Modal.module.css';
import { IcoX } from '../icons';

interface Props {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  lg?: boolean;
}

export default function Modal({ title, onClose, children, lg }: Props) {
  return (
    <div className={styles.overlay} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.mbox}${lg ? ' ' + styles.mboxLg : ''}`}>
        <div className={styles.mtitle}>
          <span>{title}</span>
          <button className={styles.ibtnDk} onClick={onClose}><IcoX /></button>
        </div>
        {children}
      </div>
    </div>
  );
}
