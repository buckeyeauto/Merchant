'use client';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Customer, Vehicle, Pricing, Trade, Deal, LineItem } from '@/types';

const INIT_CUSTOMER: Customer = {
  firstName: 'Joyce', lastName: 'Customerlady',
  address: '123 E Main St.', city: 'Lancaster', state: 'OH', zip: '43130',
  phone: '(614) 555-0182', email: 'joyce.c@email.com',
};

const INIT_VEHICLE: Vehicle = {
  id: 1, year: 2026, make: 'Honda', model: 'Passport', trim: 'EX-L',
  vin: '5FNYF9H58TB062578', stock: 'HN264', msrp: 50600, color: 'Lunar Silver',
};

const INIT_PRICING: Pricing = {
  msrp: 50600, salePrice: 49500, discount: 1500,
  discountItems: [{ label: 'Discount', amount: -1500 }],
  taxes: 1660.50, taxRate: 6.75,
  taxItems: [
    { label: 'Fairfield, OH (6.75%)', amount: 3341.25 },
    { label: 'OH Trade Allowance', amount: -1755 },
  ],
  applyTradeAllowanceTax: true,
  county: 'Fairfield',
  transitRate: 0,
};

const INIT_TRADES: Trade[] = [
  { id: 1, year: 2024, make: 'Honda', model: 'Civic', vin: '', allowance: 49500, payoff: 49500, acv: 49500 },
  { id: 2, year: 2024, make: 'Honda', model: 'Civic', vin: '', allowance: 49500, payoff: 49500, acv: 49500 },
];

const INIT_DEALS: Deal[] = [
  {
    id: 1, type: 'finance', term: 60, rate: 4.99,
    mf: '.00185', miles: 12000, residual: 59,
    downPayments: [{ amount: null }, { amount: 5000 }, { amount: 10000 }], activeDP: 2,
    fees: { items: [{ label: 'OH Doc Fee', amount: 398 }, { label: 'OH Title', amount: 38 }] },
    addons: { items: [{ label: 'BPP', amount: 1499 }, { label: 'All Season Mats', amount: 299 }, { label: 'SVC Contract', amount: 3499 }] },
    rebates: { items: [{ label: 'Loyalty', amount: 1500 }, { label: 'Finance Offer', amount: 500 }] },
    feesOpen: true, addonsOpen: true, rebatesOpen: true,
  },
  {
    id: 2, type: 'lease', term: 36, rate: 0,
    mf: '.00185', miles: 12000, residual: 59,
    downPayments: [{ amount: 5000 }, { amount: 10000 }], activeDP: 1,
    fees: { items: [{ label: 'OH Doc Fee', amount: 398 }, { label: 'OH Title', amount: 38 }, { label: 'Honda Lease Acq. Fee', amount: 595 }] },
    addons: { items: [{ label: 'BPP', amount: 1499 }, { label: 'All Season Mats', amount: 299 }, { label: 'SVC Contract', amount: 3499 }] },
    rebates: { items: [{ label: 'Loyalty', amount: 1500 }, { label: 'Lease Offer', amount: 1000 }] },
    feesOpen: true, addonsOpen: false, rebatesOpen: true,
  },
  {
    id: 3, type: 'cash', term: 60, rate: 0,
    mf: '0', miles: 12000, residual: 0,
    downPayments: [], activeDP: 0,
    fees: { items: [{ label: 'OH Doc Fee', amount: 398 }, { label: 'OH Title', amount: 38 }] },
    addons: { items: [{ label: 'BPP', amount: 1499 }, { label: 'All Season Mats', amount: 299 }, { label: 'SVC Contract', amount: 3499 }] },
    rebates: { items: [] },
    feesOpen: false, addonsOpen: false, rebatesOpen: false,
  },
];

let _nid = 4;

export const BRAND_PALETTE = [
  { brand: '#C3002F', dark: '#a60028' },
  { brand: '#007DC3', dark: '#006ba8' },
  { brand: '#EB0A1E', dark: '#c80819' },
] as const;

interface DeskStore {
  customer: Customer;
  vehicle: Vehicle;
  pricing: Pricing;
  trades: Trade[];
  deals: Deal[];
  activeDealId: number;
  brandIdx: number;
  modal: string | { type: string; dealId?: number } | null;

  setCustomer: (c: Customer) => void;
  setVehicle: (v: Vehicle) => void;
  setPricing: (p: Pricing) => void;
  updateSalePrice: (price: number) => void;
  setTrades: (t: Trade[]) => void;
  updateTrade: (idx: number, key: keyof Trade, value: number) => void;
  darkMode: boolean;
  cycleBrandColor: () => void;
  setBrandIdx: (idx: number) => void;
  toggleDarkMode: () => void;
  setModal: (m: string | { type: string; dealId?: number } | null) => void;

  updateDeal: (deal: Deal) => void;
  deleteDeal: (id: number) => void;
  duplicateDeal: (id: number) => void;
  reorderDeals: (fromId: number, toId: number) => void;
  setActiveDeal: (id: number) => void;
  addDeal: () => void;
  getDeal: (id: number) => Deal | undefined;

  updateDealLineItems: (dealId: number, section: 'fees' | 'addons' | 'rebates', items: LineItem[]) => void;
  applyLineItemsToAll: (dealId: number, section: 'fees' | 'addons' | 'rebates') => void;
}

export const useDeskStore = create<DeskStore>()(
  persist(
    (set, get) => ({
      customer: INIT_CUSTOMER,
      vehicle: INIT_VEHICLE,
      pricing: INIT_PRICING,
      trades: INIT_TRADES,
      deals: INIT_DEALS,
      activeDealId: INIT_DEALS[0].id,
      brandIdx: 0,
      darkMode: false,
      modal: null,

      setCustomer: (c) => set({ customer: c }),
      setVehicle: (v) => set({ vehicle: v }),
      setPricing: (p) => set({ pricing: p }),
      updateSalePrice: (price) => set(s => {
        const discount = Math.max(0, s.pricing.msrp - price);
        return {
          pricing: {
            ...s.pricing,
            salePrice: price,
            discount,
            discountItems: [{ label: 'Discount', amount: -discount }],
          },
        };
      }),
      setTrades: (t) => set({ trades: t }),
      updateTrade: (idx, key, value) =>
        set(s => ({ trades: s.trades.map((t, n) => n === idx ? { ...t, [key]: value } : t) })),
      cycleBrandColor: () => set(s => ({ brandIdx: (s.brandIdx + 1) % BRAND_PALETTE.length })),
      setBrandIdx: (idx) => set({ brandIdx: idx }),
      toggleDarkMode: () => set(s => ({ darkMode: !s.darkMode })),
      setModal: (m) => set({ modal: m }),

      updateDeal: (deal) => set(s => ({ deals: s.deals.map(d => d.id === deal.id ? deal : d) })),
      deleteDeal: (id) => set(s => {
        const remaining = s.deals.filter(d => d.id !== id);
        return {
          deals: remaining,
          activeDealId: s.activeDealId === id
            ? (remaining[0]?.id ?? s.activeDealId)
            : s.activeDealId,
        };
      }),
      duplicateDeal: (id) => set(s => {
        const src = s.deals.find(d => d.id === id);
        if (!src) return s;
        return { deals: [...s.deals, { ...src, id: ++_nid }] };
      }),
      reorderDeals: (fromId, toId) => set(s => {
        const list = [...s.deals];
        const from = list.findIndex(d => d.id === fromId);
        const to = list.findIndex(d => d.id === toId);
        if (from === -1 || to === -1) return s;
        const [item] = list.splice(from, 1);
        list.splice(to, 0, item);
        return { deals: list };
      }),
      setActiveDeal: (id) => set({ activeDealId: id }),
      addDeal: () => set(s => ({
        deals: [...s.deals, {
          id: ++_nid, type: 'finance', term: 60, rate: 4.99,
          mf: '0', miles: 12000, residual: 0,
          downPayments: [{ amount: null }], activeDP: 0,
          fees: { items: [] }, addons: { items: [] }, rebates: { items: [] },
          feesOpen: true, addonsOpen: true, rebatesOpen: false,
        }],
      })),
      getDeal: (id) => get().deals.find(d => d.id === id),
      updateDealLineItems: (dealId, section, items) =>
        set(s => ({
          deals: s.deals.map(d => d.id === dealId ? { ...d, [section]: { items } } : d),
        })),
      applyLineItemsToAll: (dealId, section) =>
        set(s => {
          const src = s.deals.find(d => d.id === dealId);
          if (!src) return s;
          const items = [...src[section].items];
          return { deals: s.deals.map(d => d.id === dealId ? d : { ...d, [section]: { items } }) };
        }),
    }),
    { name: 'desk-store' }
  )
);
