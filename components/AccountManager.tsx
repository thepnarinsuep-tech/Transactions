
import React, { useState } from 'react';
import { Account } from '../types';
import { Plus, Trash2, Wallet, CreditCard } from 'lucide-react';
import { ACCOUNT_COLORS } from '../constants';

interface AccountManagerProps {
  accounts: Account[];
  onAdd: (name: string, balance: number, color: string) => void;
  onDelete: (id: string) => void;
}

const AccountManager: React.FC<AccountManagerProps> = ({ accounts, onAdd, onDelete }) => {
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState('');
  const [color, setColor] = useState(ACCOUNT_COLORS[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    onAdd(name, parseFloat(balance) || 0, color);
    setName('');
    setBalance('');
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h4 className="font-bold text-slate-800">Your Accounts</h4>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
        >
          {showAdd ? 'Cancel' : <><Plus size={18} /> <span>Add Account</span></>}
        </button>
      </div>

      {showAdd && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-md animate-in slide-in-from-top duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2 space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Account Name</label>
              <input 
                type="text" 
                placeholder="e.g. My Savings, Bank X"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Initial Balance</label>
              <input 
                type="number" 
                placeholder="0.00"
                value={balance}
                onChange={e => setBalance(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex gap-2 h-[42px] items-center px-2">
              {ACCOUNT_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-6 h-6 rounded-full ${c} ${color === c ? 'ring-2 ring-offset-2 ring-slate-400' : ''}`}
                />
              ))}
            </div>
            <div className="md:col-span-4 flex justify-end">
              <button 
                type="submit"
                className="px-6 py-2.5 bg-slate-800 text-white rounded-xl text-sm font-bold shadow-lg"
              >
                Create Account
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {accounts.map(acc => (
          <div key={acc.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm relative group overflow-hidden">
             <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div className={`p-3 rounded-2xl ${acc.color} text-white shadow-lg`}>
                    <Wallet size={24} />
                  </div>
                  <button 
                    onClick={() => onDelete(acc.id)}
                    className="p-2 text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 text-lg mb-1">{acc.name}</h5>
                  <p className="text-slate-400 text-xs uppercase tracking-widest font-bold">Current Balance</p>
                  <p className="text-2xl font-black text-slate-900 mt-1">฿{acc.balance.toLocaleString()}</p>
                </div>
             </div>
             {/* Decorative Background Element */}
             <div className={`absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-[0.03] ${acc.color}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AccountManager;
