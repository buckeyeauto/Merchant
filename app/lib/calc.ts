import type { Deal, Pricing, Trade, CalcResult } from '@/types';

function sumItems(items: Array<{ amount: number }>): number {
  return items.reduce((s, i) => s + Number(i.amount), 0);
}

export function calcDeal(deal: Deal, pricing: Pricing, trades: Trade[]): CalcResult {
  const feesTotal    = sumItems(deal.fees?.items ?? []);
  const addonsTotal  = sumItems(deal.addons?.items ?? []);
  const rebatesTotal = sumItems(deal.rebates?.items ?? []);
  const tradeEquity  = trades.reduce((s, t) => s + (Number(t.allowance) - Number(t.payoff)), 0);

  const sp      = Number(pricing.salePrice) || 0;
  const taxAmt = calcTax(pricing, deal, trades).amount;
  const taxRate = Number(pricing.taxRate)   || 6.75;
  const msrp    = Number(pricing.msrp)      || 0;

  const calcPayment = (downAmount: number | null): { payment: number; primary: number } => {
    const down = Number(downAmount) || 0;

    if (deal.type === 'finance') {
      const pv = sp + taxAmt + feesTotal + addonsTotal - rebatesTotal - tradeEquity - down;
      const r  = Number(deal.rate) / 100 / 12;
      const n  = Number(deal.term);
      if (r === 0 || !n) return { payment: n ? pv / n : 0, primary: pv };
      const pmt = (pv * r) / (1 - Math.pow(1 + r, -n));
      return { payment: isFinite(pmt) ? pmt : 0, primary: pv };
    }

    if (deal.type === 'lease') {
      const netCapCost  = sp + feesTotal + addonsTotal - rebatesTotal - tradeEquity - down;
      const residualVal = msrp * (Number(deal.residual) / 100);
      const mf          = Number(deal.mf) || 0;
      const term        = Number(deal.term);
      if (!term) return { payment: 0, primary: netCapCost };
      const depreciation  = (netCapCost - residualVal) / term;
      const financeCharge = (netCapCost + residualVal) * mf;
      const base          = depreciation + financeCharge;
      const payment       = base * (1 + taxRate / 100);
      return { payment: isFinite(payment) ? payment : 0, primary: netCapCost };
    }

    return { payment: 0, primary: 0 };
  };

  if (deal.type === 'cash') {
    const otd = sp + taxAmt + feesTotal + addonsTotal - rebatesTotal - tradeEquity;
    return { payments: [], footerLabel: 'OTD Price', footerVal: otd, tradeEquity };
  }

  const payments = (deal.downPayments || []).map(dp => ({
    amount: dp.amount,
    computed: calcPayment(dp.amount),
  }));

  const activePrimary = payments[deal.activeDP]?.computed.primary ?? 0;
  const footerLabel = deal.type === 'finance' ? 'Amt. Financed' : 'Cap Cost';
  return { payments, footerLabel, footerVal: activePrimary, tradeEquity };
}

export function calcTax(pricing: Pricing, deal: Deal, trades: Trade[]): { amount: number; items: Array<{ label: string; amount: number }> } {
  const addons  = (deal.addons?.items  ?? []).reduce((s, i) => s + Number(i.amount), 0);
  const rebates = (deal.rebates?.items ?? []).reduce((s, i) => s + Number(i.amount), 0);
  const taxableBase = (Number(pricing.salePrice) || 0) + addons - rebates;
  const taxRate = Number(pricing.taxRate) || 6.75;

  const totalAllowance = pricing.applyTradeAllowanceTax === false ? 0 : trades.reduce((s, t) => s + (Number(t.allowance) || 0), 0);
  const tradeCredit = totalAllowance * (taxRate / 100);

  const stateTax = taxableBase * (taxRate / 100);
  const total = stateTax - tradeCredit;

  const taxLabel = (pricing.taxItems ?? []).find(i => i.amount >= 0)?.label
    ?? `Tax (${taxRate}%)`;

  const items: Array<{ label: string; amount: number }> = [
    { label: taxLabel, amount: stateTax },
    ...(tradeCredit > 0 ? [{ label: 'OH Trade Allowance', amount: -tradeCredit }] : []),
  ];

  return { amount: total, items };
}

export const fmt = (n: number) =>
  n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
