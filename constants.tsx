
import React from 'react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  CircleDollarSign,
  History,
  Settings
} from 'lucide-react';

export const CATEGORIES = {
  INCOME: ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'],
  EXPENSE: ['Food', 'Transport', 'Rent', 'Shopping', 'Entertainment', 'Health', 'Bills', 'Other'],
  DEBT_PAYMENT: ['Monthly Installment', 'Extra Payment', 'Closing Balance']
};

export const ACCOUNT_COLORS = [
  'bg-blue-500', 'bg-emerald-500', 'bg-indigo-500', 
  'bg-amber-500', 'bg-rose-500', 'bg-violet-500'
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
  { id: 'transactions', label: 'Transactions', icon: <History size={20} /> },
  { id: 'accounts', label: 'Accounts', icon: <Wallet size={20} /> },
  { id: 'debts', label: 'Debt Tracking', icon: <CircleDollarSign size={20} /> },
];
