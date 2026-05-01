export interface Customer {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
}

export interface Vehicle {
  id: number;
  year: number;
  make: string;
  model: string;
  trim: string;
  vin: string;
  stock: string;
  msrp: number;
  color: string;
}

export interface LineItem {
  label: string;
  amount: number;
}

export interface LineItemGroup {
  items: LineItem[];
}

export interface DownPayment {
  amount: number | null;
}

export type DealType = 'finance' | 'lease' | 'cash';

export interface Deal {
  id: number;
  type: DealType;
  term: number;
  rate: number;
  mf: string;
  miles: number;
  residual: number;
  downPayments: DownPayment[];
  activeDP: number;
  fees: LineItemGroup;
  addons: LineItemGroup;
  rebates: LineItemGroup;
  feesOpen: boolean;
  addonsOpen: boolean;
  rebatesOpen: boolean;
}

export interface Pricing {
  msrp: number;
  salePrice: number;
  discount: number;
  discountItems: LineItem[];
  taxes: number;
  taxRate: number;
  taxItems: LineItem[];
}

export interface Trade {
  id: number;
  year: number;
  make: string;
  model: string;
  vin: string;
  allowance: number;
  payoff: number;
  acv: number;
}

export interface CalcResult {
  payments: Array<{ amount: number | null; computed: { payment: number; primary: number } }>;
  footerLabel: string;
  footerVal: number;
  tradeEquity: number;
}
