
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE',
  DEBT_PAYMENT = 'DEBT_PAYMENT'
}

export interface Account {
  id: string;
  name: string;
  balance: number;
  color: string;
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  paidAmount: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: TransactionType;
  accountId: string;
  category: string;
  amount: number;
  note: string;
  debtId?: string;
}

export interface AppState {
  accounts: Account[];
  transactions: Transaction[];
  debts: Debt[];
}
