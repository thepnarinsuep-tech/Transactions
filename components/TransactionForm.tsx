
import React, { useState } from 'react';
import { TransactionType, Account, Debt, Transaction } from '../types';
import { CATEGORIES } from '../constants';
import { X } from 'lucide-react';

interface TransactionFormProps {
  accounts: Account[];
  debts: Debt[];
  onSubmit: (t: Omit<Transaction, 'id'>) => void;
  onClose: () => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ accounts, debts, onSubmit, onClose }) => {
  const [type, setType] = useState<TransactionType>(TransactionType.EXPENSE);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [accountId, setAccountId] = useState(accounts[0]?.id || '');
  const [category, setCategory] = useState(CATEGORIES.EXPENSE[0]);
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [debtId, setDebtId] = useState(debts[0]?.id || '');

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    setCategory(CATEGORIES[newType][0]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !accountId || !category) return;
    
    onSubmit({
      date,
      type,
      accountId,
      category,
      amount: parseFloat(amount),
      note,
      debtId: type === TransactionType.DEBT_PAYMENT ? debtId : undefined
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800 text-lg">New Transaction</h3>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {Object.values(TransactionType).map(t => (
              <button
                key={t}
                type="button"
                onClick={() => handleTypeChange(t)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  type === t ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {t.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Date</label>
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Amount</label>
              <input 
                type="number" 
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-indigo-500 outline-none" 
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Account</label>
            <select 
              value={accountId}
              onChange={e => setAccountId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {accounts.map(acc => (
                <option key={acc.id} value={acc.id}>{acc.name} (฿{acc.balance.toLocaleString()})</option>
              ))}
            </select>
          </div>

          {type === TransactionType.DEBT_PAYMENT && (
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Payment for Debt</label>
              <select 
                value={debtId}
                onChange={e => setDebtId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                {debts.map(debt => (
                  <option key={debt.id} value={debt.id}>{debt.name} (Rem: ฿{(debt.totalAmount - debt.paidAmount).toLocaleString()})</option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Category</label>
            <select 
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              {CATEGORIES[type].map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Note (Optional)</label>
            <input 
              type="text" 
              placeholder="What was this for?"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none" 
            />
          </div>

          <button 
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold mt-4 shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-[0.98]"
          >
            Save Transaction
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
