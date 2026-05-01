'use client';

import { useState, useRef } from 'react';
import s from './DealCard.module.css';
import { calcDeal, fmt } from '@/lib/calc';
import { IcoCopy, IcoTrash, IcoMore, IcoPlus, IcoX, IcoRefresh } from './icons';
import type { Deal, Pricing, Trade, LineItemGroup } from '@/types';

interface Props {
  deal: Deal;
  pricing: Pricing;
  trades: Trade[];
  onUpdate: (deal: Deal) => void;
  isActive: boolean;
  inGrid?: boolean;
  onActivate: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  setModal: (m: string | { type: string; dealId?: number } | null) => void;
  isDragging?: boolean;
  isDropTarget?: boolean;
  onDragStart?: () => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDragLeave?: () => void;
  onDrop?: () => void;
  onDragEnd?: () => void;
}

// ── Local sub-components ─────────────────────────────────────────────────────

function SectionBlock({
  label,
  data,
  open,
  onToggle,
  onEdit,
}: {
  label: string;
  data: LineItemGroup;
  open: boolean;
  onToggle: () => void;
  onEdit: () => void;
}) {
  const total = (data?.items ?? []).reduce((sum, i) => sum + Number(i.amount), 0);
  const hasItems = (data?.items ?? []).length > 0;

  return (
    <div>
      <div className={s.secRow}>
        <span
          className={`${s.caret} ${open ? s.caretD : s.caretR}`}
          onClick={onToggle}
        />
        <button className={s.btnRed} onClick={onEdit}>
          {label}
        </button>
        {hasItems ? (
          <span className={s.secTotal}>${fmt(total)}</span>
        ) : (
          <span className={s.secPh}>none added</span>
        )}
      </div>
      {open && hasItems && (
        <div className={s.secItems}>
          {data.items.map((item, i) => (
            <div key={i} className={s.secItem}>
              <span>{item.label}</span>
              <span>${fmt(item.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DealMenuModal({
  deal,
  onClose,
  onDuplicate,
  onDelete,
  onSwitchType,
}: {
  deal: Deal;
  onClose: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
  onSwitchType: (t: 'finance' | 'lease' | 'cash') => void;
}) {
  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.mbox} onClick={e => e.stopPropagation()}>
        <div className={s.mtitle}>
          <span>Deal Options</span>
          <button className={s.ibtn} onClick={onClose}><IcoX size={15} /></button>
        </div>

        <div
          className={s.menuOpt}
          onClick={() => { onDuplicate(); onClose(); }}
        >
          <IcoCopy size={15} />
          Duplicate Deal Card
        </div>

        {deal.type !== 'finance' && (
          <div
            className={s.menuOpt}
            onClick={() => { onSwitchType('finance'); onClose(); }}
          >
            <IcoRefresh size={15} />
            Switch to Finance
          </div>
        )}
        {deal.type !== 'lease' && (
          <div
            className={s.menuOpt}
            onClick={() => { onSwitchType('lease'); onClose(); }}
          >
            <IcoRefresh size={15} />
            Switch to Lease
          </div>
        )}
        {deal.type !== 'cash' && (
          <div
            className={s.menuOpt}
            onClick={() => { onSwitchType('cash'); onClose(); }}
          >
            <IcoRefresh size={15} />
            Switch to Cash
          </div>
        )}

        <div
          className={`${s.menuOpt} ${s.menuOptDel}`}
          onClick={() => { onDelete(); onClose(); }}
        >
          <IcoTrash size={15} />
          Delete Deal
        </div>

        <div className={s.mactions}>
          <button className={s.btnCancel} onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function DealCard({ deal, pricing, trades, onUpdate, isActive, inGrid, onActivate, onDuplicate, onDelete, setModal, isDragging, isDropTarget, onDragStart, onDragOver, onDragLeave, onDrop, onDragEnd }: Props) {
  const [showMenu, setShowMenu] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const dragAllowed = useRef(false);

  const calc = calcDeal(deal, pricing, trades);

  const upd = <K extends keyof Deal>(k: K, v: Deal[K]) => onUpdate({ ...deal, [k]: v });

  // Down payment helpers
  const setDPActive = (idx: number) => upd('activeDP', idx);

  const setDPVal = (idx: number, k: keyof { amount: number | null }, v: number | null) => {
    const dps = deal.downPayments.map((dp, i) => i === idx ? { ...dp, [k]: v } : dp);
    onUpdate({ ...deal, downPayments: dps });
  };

  const addDP = () => {
    if (deal.downPayments.length >= 3) return;
    onUpdate({ ...deal, downPayments: [...deal.downPayments, { amount: null }] });
  };

  const removeDP = (idx: number) => {
    const dps = deal.downPayments.filter((_, i) => i !== idx);
    const newActive = Math.min(deal.activeDP, Math.max(dps.length - 1, 0));
    onUpdate({ ...deal, downPayments: dps, activeDP: newActive });
  };

  return (
    <div
      className={[
        s.dealCard,
        isActive ? s.dealCardActive : '',
        isDragging ? s.dealCardDragging : '',
        isDropTarget ? s.dealCardDropTarget : '',
      ].filter(Boolean).join(' ')}
      draggable
      onMouseDown={e => { dragAllowed.current = !!headerRef.current?.contains(e.target as Node); }}
      onDragStart={e => {
        if (!dragAllowed.current) { e.preventDefault(); return; }
        e.dataTransfer.effectAllowed = 'move';
        onDragStart?.();
      }}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
    >
      {/* ── Header ── */}
      <div ref={headerRef} className={s.dcHdr} onClick={onActivate}>
        <span className={s.dcHdrLabel}>
          {deal.type.charAt(0).toUpperCase() + deal.type.slice(1)}
        </span>
        <span className={s.hdrSp} />
        <button
          className={s.rollBtn}
          onClick={e => { e.stopPropagation(); setModal({ type: 'roll', dealId: deal.id }); }}
        >
          Roll
        </button>
        <button className={s.ibtn} onClick={e => { e.stopPropagation(); onDuplicate(); }} title="Duplicate">
          <IcoCopy size={17} />
        </button>
        <button className={s.ibtn} onClick={e => { e.stopPropagation(); onDelete(); }} title="Delete">
          <IcoTrash size={17} />
        </button>
        <button className={s.ibtn} onClick={e => { e.stopPropagation(); setShowMenu(true); }} title="More">
          <IcoMore size={17} />
        </button>
      </div>

      {/* ── Body ── */}
      <div className={`${s.dcBody}${inGrid ? ' ' + s.dcBodyGrid : ''}`}>
        <div className={s.dcTop}>
          {/* Type tabs */}
          <div className={s.typeTabs}>
            {(['finance', 'lease', 'cash'] as const).map(t => (
              <button
                key={t}
                className={`${s.btnOutline}${deal.type === t ? ' ' + s.btnOutlineActive : ''}`}
                onClick={() => upd('type', t)}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Term section */}
          <div className={s.termSection}>
            {deal.type === 'finance' && (
              <div className={s.termRow}>
                <div className={s.termF}>
                  <div className={s.termLbl}>Term</div>
                  <input
                    className={s.termInp}
                    type="number"
                    value={deal.term || ''}
                    onChange={e => upd('term', Number(e.target.value))}
                    placeholder="72"
                  />
                </div>
                <div className={s.termF}>
                  <div className={s.termLbl}>Rate <span className={s.termRed}>%</span></div>
                  <input
                    className={s.termInp}
                    type="number"
                    step="0.01"
                    value={deal.rate || ''}
                    onChange={e => upd('rate', Number(e.target.value))}
                    placeholder="6.99"
                  />
                </div>
              </div>
            )}

            {deal.type === 'lease' && (
              <div className={s.termRow}>
                <div className={s.termF}>
                  <div className={s.termLbl}>Term</div>
                  <input
                    className={s.termInp}
                    type="number"
                    value={deal.term || ''}
                    onChange={e => upd('term', Number(e.target.value))}
                    placeholder="36"
                  />
                </div>
                <div className={s.termF}>
                  <div className={s.termLbl}>MF</div>
                  <input
                    className={s.termInp}
                    type="text"
                    value={deal.mf}
                    onChange={e => upd('mf', e.target.value)}
                    placeholder=".00125"
                  />
                </div>
                <div className={s.termF}>
                  <div className={s.termLbl}>Miles</div>
                  <input
                    className={s.termInp}
                    type="number"
                    value={deal.miles || ''}
                    onChange={e => upd('miles', Number(e.target.value))}
                    placeholder="12000"
                  />
                </div>
                <div className={s.termF}>
                  <div className={s.termLbl}>Res <span className={s.termRed}>%</span></div>
                  <input
                    className={s.termInp}
                    type="number"
                    step="0.1"
                    value={deal.residual || ''}
                    onChange={e => upd('residual', Number(e.target.value))}
                    placeholder="52"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Down payment / Cash section */}
          <div className={s.dpSection}>
            {deal.type === 'cash' ? (
              <div className={s.cashBig}>
                ${fmt(calc.footerVal)}
              </div>
            ) : (
              <>
                {deal.downPayments.map((dp, idx) => {
                  const isActive = deal.activeDP === idx;
                  const payment = calc.payments[idx]?.computed.payment ?? 0;
                  return (
                    <div key={idx} className={s.dpRow}>
                      <div
                        className={`${s.dpRadio}${isActive ? ' ' + s.dpRadioOn : ''}`}
                        onClick={() => setDPActive(idx)}
                      />
                      <input
                        className={s.dpAmt}
                        type="number"
                        value={dp.amount ?? ''}
                        onChange={e => setDPVal(idx, 'amount', e.target.value === '' ? null : Number(e.target.value))}
                        placeholder="Down"
                      />
                      <div className={`${s.dpPay}${isActive ? ' ' + s.dpPayOn : ''}`}>
                        ${fmt(payment)}
                      </div>
                      <button className={s.ibtn} onClick={() => {
                        if (deal.downPayments.length > 1) removeDP(idx);
                        else setDPVal(0, 'amount', null);
                      }}>
                        <IcoX size={13} />
                      </button>
                    </div>
                  );
                })}

                {deal.downPayments.length < 3 && (
                  <button className={s.addDp} onClick={addDP}>
                    <IcoPlus size={13} />
                    Add
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        <hr className={s.sep} />

        {/* Section blocks */}
        <div className={s.dcBottom}>
          <SectionBlock
            label="Fees"
            data={deal.fees}
            open={deal.feesOpen}
            onToggle={() => upd('feesOpen', !deal.feesOpen)}
            onEdit={() => setModal({ type: 'fees', dealId: deal.id })}
          />
          <SectionBlock
            label="Addons"
            data={deal.addons}
            open={deal.addonsOpen}
            onToggle={() => upd('addonsOpen', !deal.addonsOpen)}
            onEdit={() => setModal({ type: 'addons', dealId: deal.id })}
          />
          <SectionBlock
            label="Rebates"
            data={deal.rebates}
            open={deal.rebatesOpen}
            onToggle={() => upd('rebatesOpen', !deal.rebatesOpen)}
            onEdit={() => setModal({ type: 'rebates', dealId: deal.id })}
          />
        </div>
      </div>

      {/* ── Footer ── */}
      <div className={s.dcFooter}>
        <span className={s.dcFootLbl}>{calc.footerLabel}</span>
        <span className={s.dcFootVal}>${fmt(calc.footerVal)}</span>
      </div>

      {/* ── Menu modal ── */}
      {showMenu && (
        <DealMenuModal
          deal={deal}
          onClose={() => setShowMenu(false)}
          onDuplicate={onDuplicate}
          onDelete={onDelete}
          onSwitchType={t => upd('type', t)}
        />
      )}
    </div>
  );
}
