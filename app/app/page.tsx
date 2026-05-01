'use client';
import { useState, useEffect } from 'react';
import styles from './page.module.css';
import { useDeskStore, BRAND_PALETTE } from '@/lib/store';
import CustomerCard from '@/components/CustomerCard';
import VehicleCard from '@/components/VehicleCard';
import PriceCard from '@/components/PriceCard';
import TradesCard from '@/components/TradesCard';
import DealCard from '@/components/DealCard';
import CustomerModal from '@/components/modals/CustomerModal';
import VehicleModal from '@/components/modals/VehicleModal';
import SalePriceModal from '@/components/modals/SalePriceModal';
import TaxModal from '@/components/modals/TaxModal';
import TradeModal from '@/components/modals/TradeModal';
import RollModal from '@/components/modals/RollModal';
import LineItemModal from '@/components/modals/LineItemModal';
import UnderConstructionModal from '@/components/modals/UnderConstructionModal';
import { IcoArrowLeft, IcoSend, IcoPrint } from '@/components/icons';

export default function DeskPage() {
  const {
    customer, vehicle, pricing, trades, deals, modal,
    setCustomer, setVehicle, setPricing, updateSalePrice,
    setTrades, updateTrade, setModal,
    updateDeal, deleteDeal, duplicateDeal, reorderDeals, activeDealId, setActiveDeal, addDeal, getDeal,
    updateDealLineItems, brandIdx, setBrandIdx, darkMode, toggleDarkMode,
  } = useDeskStore();

  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverId, setDragOverId] = useState<number | null>(null);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const [underConstruction, setUnderConstruction] = useState<string | null>(null);

  useEffect(() => {
    const { brand, dark } = BRAND_PALETTE[brandIdx];
    document.documentElement.style.setProperty('--brand', brand);
    document.documentElement.style.setProperty('--brand-dark', dark);
  }, [brandIdx]);

  useEffect(() => {
    document.documentElement.dataset.dark = String(darkMode);
  }, [darkMode]);

  const activeDeal = deals.find(d => d.id === activeDealId) ?? deals[0];

  const renderModal = () => {
    if (!modal) return null;
    const type = typeof modal === 'string' ? modal : modal.type;
    const dealId = typeof modal === 'object' ? modal.dealId : undefined;

    if (type === 'customer')
      return <CustomerModal customer={customer} onSave={c => { setCustomer(c); setModal(null); }} onClose={() => setModal(null)} />;
    if (type === 'vehicle')
      return <VehicleModal vehicle={vehicle} onSave={v => { setVehicle(v); setPricing({ ...pricing, msrp: v.msrp, salePrice: v.msrp }); setModal(null); }} onClose={() => setModal(null)} />;
    if (type === 'salePrice')
      return <SalePriceModal pricing={pricing} onSave={p => { setPricing(p); setModal(null); }} onClose={() => setModal(null)} />;
    if (type === 'tax')
      return <TaxModal pricing={pricing} onSave={p => { setPricing(p); setModal(null); }} onClose={() => setModal(null)} />;
    if (type === 'trade')
      return <TradeModal trades={trades} onSave={tr => { setTrades(tr); setModal(null); }} onClose={() => setModal(null)} />;

    if (dealId !== undefined) {
      const deal = getDeal(dealId);
      if (!deal) return null;
      if (type === 'roll') return <RollModal deal={deal} onClose={() => setModal(null)} />;
      if (type === 'fees') return <LineItemModal title="Edit Fees" items={deal.fees.items} onSave={items => { updateDealLineItems(dealId, 'fees', items); setModal(null); }} onClose={() => setModal(null)} />;
      if (type === 'addons') return <LineItemModal title="Edit Add-Ons" items={deal.addons.items} onSave={items => { updateDealLineItems(dealId, 'addons', items); setModal(null); }} onClose={() => setModal(null)} />;
      if (type === 'rebates') return <LineItemModal title="Edit Rebates" items={deal.rebates.items} onSave={items => { updateDealLineItems(dealId, 'rebates', items); setModal(null); }} onClose={() => setModal(null)} />;
    }
    return null;
  };

  return (
    <>
      <header className={styles.topbar}>
        <button className={styles.btnRed} onClick={() => setUnderConstruction('Back')}><IcoArrowLeft size={14} /> Back</button>
        <div className={styles.topbarCenter}>
          <span className={styles.topbarLbl}>Sales Associate:</span>
          <span className={styles.topbarName}>Chad Balser</span>
        </div>
        <button className={styles.btnRed} onClick={() => setUnderConstruction('Send')}><IcoSend size={14} /> Send</button>
        <button className={styles.btnRed} onClick={() => setUnderConstruction('Print')}><IcoPrint size={14} /> Print</button>
        <div className={styles.avatarWrap}>
          <div className={styles.avatar} onClick={() => setAvatarOpen(o => !o)}>AS</div>
          {avatarOpen && (
            <>
              <div className={styles.avatarBackdrop} onClick={() => setAvatarOpen(false)} />
              <div className={styles.avatarMenu}>
                <div className={styles.avatarMenuItem} onClick={() => { setUnderConstruction('Settings'); setAvatarOpen(false); }}>Settings</div>
                <div
                  className={`${styles.avatarMenuItem}${darkMode ? ' ' + styles.avatarMenuItemOn : ''}`}
                  onClick={toggleDarkMode}
                >
                  Dark Mode
                </div>
                <div className={styles.avatarMenuDivider} />
                <div className={styles.avatarMenuSection}>Color Scheme</div>
                {([
                  { label: 'Toyota Red',     idx: 0 },
                  { label: 'Honda Blue',     idx: 1 },
                  { label: 'Nissan Crimson', idx: 2 },
                ] as const).map(({ label, idx }) => (
                  <div
                    key={idx}
                    className={`${styles.avatarMenuItem}${brandIdx === idx ? ' ' + styles.avatarMenuItemOn : ''}`}
                    onClick={() => { setBrandIdx(idx); setAvatarOpen(false); }}
                  >
                    <span className={styles.colorDot} style={{ background: BRAND_PALETTE[idx].brand }} />
                    {label}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </header>
      <main className={styles.content}>
        <div className={styles.leftPanel}>
          <CustomerCard customer={customer} onEdit={() => setModal('customer')} />
          <VehicleCard vehicle={vehicle} onEdit={() => setModal('vehicle')} />
          <PriceCard
            pricing={pricing}
            activeDeal={activeDeal}
            trades={trades}
            onEditSalePrice={() => setModal('salePrice')}
            onEditTax={() => setModal('tax')}
            onUpdateSalePrice={updateSalePrice}
          />
          <TradesCard trades={trades} onEdit={() => setModal('trade')} onUpdateTrade={updateTrade} />
        </div>
        <div className={deals.length > 3 ? styles.dealsAreaGrid : styles.dealsArea}>
          {deals.map(deal => (
            <DealCard
              key={deal.id}
              deal={deal}
              pricing={pricing}
              trades={trades}
              onUpdate={updateDeal}
              isActive={deal.id === activeDealId}
              inGrid={deals.length > 3}
              onActivate={() => setActiveDeal(deal.id)}
              onDuplicate={() => duplicateDeal(deal.id)}
              onDelete={() => deleteDeal(deal.id)}
              setModal={setModal}
              isDragging={draggedId === deal.id}
              isDropTarget={dragOverId === deal.id && draggedId !== deal.id}
              onDragStart={() => { requestAnimationFrame(() => setDraggedId(deal.id)); }}
              onDragOver={e => { e.preventDefault(); setDragOverId(deal.id); }}
              onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverId(null); }}
              onDrop={() => {
                if (draggedId !== null && draggedId !== deal.id) reorderDeals(draggedId, deal.id);
                setDraggedId(null);
                setDragOverId(null);
              }}
              onDragEnd={() => { setDraggedId(null); setDragOverId(null); }}
            />
          ))}
          {deals.length < 6 && <button className={styles.addDealBtn} onClick={addDeal} title="Add Deal">+</button>}
        </div>
      </main>
      {renderModal()}
      {underConstruction && <UnderConstructionModal feature={underConstruction} onClose={() => setUnderConstruction(null)} />}
    </>
  );
}
