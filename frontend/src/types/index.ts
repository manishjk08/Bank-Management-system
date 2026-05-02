export interface User {
  id: number;
  full_name: string;
  email: string;
  role: 'customer' | 'admin';
}

export interface Account {
  id: number;
  account_number: string;
  account_type: 'savings' | 'checking';
  balance: number;
  currency: string;
  created_at: string;
}

export interface Transaction {
  id: number;
  amount: number;
  currency: string;
  transaction_type: 'transfer' | 'deposit' | 'withdrawal';
  status: 'pending' | 'completed' | 'failed';
  description: string | null;
  from_account: string | null;
  to_account: string | null;
  created_at: string;
}

export interface FxRate {
  from: string;
  to: string;
  rate: number;
  timestamp: string;
}

export interface AdminAccount extends Account {
  full_name: string;
  email: string;
}