
import React, { useState, useMemo } from 'react';
import { Debt, Transaction, TransactionType } from '../types';
import { Plus, Trash2, ShieldCheck, Clock, Percent } from 'lucide-react';

interface DebtTrackerProps {
  debts: Debt[];
  transactions: Transaction[];
  onAdd: (name: string, total: number) => void;
  onDelete: (id: string) => void;
}

const DebtTracker: React.FC<DebtTrackerProps> = ({ debts, transactions, onAdd, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [total, setTotal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !total) return;
    onAdd(name, parseFloat(total));
    setName('');
    setTotal('');
    setShowAdd(false);
  };

  const getRecentPayments = (debtId: string) => {
    return transactions
      .filter(t => t.type === TransactionType.DEBT_PAYMENT && t.debtId === debtId)
      .slice(0, 3);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-800">Debt & Liabilities</h4>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          {showAdd ? 'Cancel' : <><Plus size={18} /> <span>New Debt Entry</span></>}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Debt Name</label>
              <input 
                type="text" 
                placeholder="e.g. Car Loan, Student Debt"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Total Principal Amount</label>
              <input 
                type="number" 
                placeholder="0.00"
                value={total}
                onChange={e => setTotal(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button 
              type="submit"
              className="px-6 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg"
            >
              Add Debt
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {debts.map(debt => {
          const remaining = debt.totalAmount - debt.paidAmount;
          const progress = (debt.paidAmount / debt.totalAmount) * 100;
          const recent = getRecentPayments(debt.id);

          return (
            <div key={debt.id} className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              <div className="p-6 pb-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h5 className="font-bold text-slate-800 text-lg">{debt.name}</h5>
                    <p className="text-xs text-slate-400">Repayment Tracking</p>
                  </div>
                  <button onClick={() => onDelete(debt.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-colors">
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 p-3 rounded-2xl">
                    <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Debt</p>
                    <p className="font-bold text-slate-800 text-sm">฿{debt.totalAmount.toLocaleString()}</p>
                  </div>
                  <div className="bg-indigo-50 p-3 rounded-2xl">
                    <p className="text-[10px] uppercase font-bold text-indigo-400 mb-1">Total Paid</p>
                    <p className="font-bold text-indigo-600 text-sm">฿{debt.paidAmount.toLocaleString()}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <p className="text-xs font-bold text-slate-500">Progress</p>
                    <p className="text-xs font-black text-indigo-600">{progress.toFixed(1)}%</p>
                  </div>
                  <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 transition-all duration-500 ease-out"
                      style={{ width: `${Math.min(100, progress)}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 p-6 pt-4 flex-1">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Recent Payments</p>
                <div className="space-y-3">
                  {recent.length > 0 ? recent.map(r => (
                    <div key={r.id} className="flex items-center justify-between text-xs bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                      <div className="flex items-center gap-2 text-slate-500">
                        <Clock size={12} />
                        <span>{r.date}</span>
                      </div>
                      <span className="font-bold text-indigo-600">฿{r.amount.toLocaleString()}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-slate-400 italic py-2">No payments recorded yet.</p>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t border-slate-200 flex justify-between items-center">
                  <p className="text-xs text-slate-500 font-medium">Remaining Principal</p>
                  <p className="text-sm font-black text-slate-800">฿{remaining.toLocaleString()}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {debts.length === 0 && !showAdd && (
        <div className="py-24 text-center bg-white rounded-3xl border border-dashed border-slate-300">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-200">
            <ShieldCheck size={48} />
          </div>
          <h5 className="text-slate-400 font-medium">No debts currently tracked.</h5>
          <p className="text-slate-300 text-sm">Add a liability to start tracking your journey to financial freedom.</p>
        </div>
      )}
    </div>
  );
};

export default DebtTracker;
