
import React, { useState, useEffect, useMemo } from 'react';
import { NAV_ITEMS } from './constants';
import Dashboard from './components/Dashboard';
import TransactionList from './components/TransactionList';
import AccountManager from './components/AccountManager';
import DebtTracker from './components/DebtTracker';
import { AppState, Transaction, Account, Debt, TransactionType } from './types';
import { Plus, Menu, X, Download } from 'lucide-react';

const STORAGE_KEY = 'fintrack_pro_data';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [data, setData] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      accounts: [
        { id: '1', name: 'Cash', balance: 0, color: 'bg-emerald-500' },
        { id: '2', name: 'Main Bank', balance: 0, color: 'bg-blue-500' }
      ],
      transactions: [],
      debts: []
    };
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const addTransaction = (t: Omit<Transaction, 'id'>) => {
    const newId = crypto.randomUUID();
    const newTransaction = { ...t, id: newId };

    setData(prev => {
      // Update account balance
      const updatedAccounts = prev.accounts.map(acc => {
        if (acc.id === t.accountId) {
          if (t.type === TransactionType.INCOME) {
            return { ...acc, balance: acc.balance + t.amount };
          } else {
            return { ...acc, balance: acc.balance - t.amount };
          }
        }
        return acc;
      });

      // Update debt paid amount if applicable
      const updatedDebts = prev.debts.map(debt => {
        if (t.type === TransactionType.DEBT_PAYMENT && debt.id === t.debtId) {
          return { ...debt, paidAmount: debt.paidAmount + t.amount };
        }
        return debt;
      });

      return {
        ...prev,
        transactions: [newTransaction, ...prev.transactions],
        accounts: updatedAccounts,
        debts: updatedDebts
      };
    });
  };

  const deleteTransaction = (id: string) => {
    setData(prev => {
      const transaction = prev.transactions.find(t => t.id === id);
      if (!transaction) return prev;

      // Reverse account balance
      const updatedAccounts = prev.accounts.map(acc => {
        if (acc.id === transaction.accountId) {
          if (transaction.type === TransactionType.INCOME) {
            return { ...acc, balance: acc.balance - transaction.amount };
          } else {
            return { ...acc, balance: acc.balance + transaction.amount };
          }
        }
        return acc;
      });

      // Reverse debt paid amount
      const updatedDebts = prev.debts.map(debt => {
        if (transaction.type === TransactionType.DEBT_PAYMENT && debt.id === transaction.debtId) {
          return { ...debt, paidAmount: debt.paidAmount - transaction.amount };
        }
        return debt;
      });

      return {
        ...prev,
        transactions: prev.transactions.filter(t => t.id !== id),
        accounts: updatedAccounts,
        debts: updatedDebts
      };
    });
  };

  const addAccount = (name: string, balance: number, color: string) => {
    const newAccount: Account = { id: crypto.randomUUID(), name, balance, color };
    setData(prev => ({ ...prev, accounts: [...prev.accounts, newAccount] }));
  };

  const deleteAccount = (id: string) => {
    setData(prev => ({ ...prev, accounts: prev.accounts.filter(a => a.id !== id) }));
  };

  const addDebt = (name: string, totalAmount: number) => {
    const newDebt: Debt = { id: crypto.randomUUID(), name, totalAmount, paidAmount: 0 };
    setData(prev => ({ ...prev, debts: [...prev.debts, newDebt] }));
  };

  const deleteDebt = (id: string) => {
    setData(prev => ({ ...prev, debts: prev.debts.filter(d => d.id !== id) }));
  };

  const exportCSV = () => {
    const headers = ['Date', 'Type', 'Account', 'Category', 'Amount', 'Note'];
    const rows = data.transactions.map(t => [
      t.date,
      t.type,
      data.accounts.find(a => a.id === t.accountId)?.name || 'Unknown',
      t.category,
      t.amount,
      t.note
    ]);
    
    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(",") + "\n" 
      + rows.map(e => e.join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `fintrack_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard data={data} onAddTransaction={addTransaction} />;
      case 'transactions':
        return <TransactionList transactions={data.transactions} accounts={data.accounts} onDelete={deleteTransaction} />;
      case 'accounts':
        return <AccountManager accounts={data.accounts} onAdd={addAccount} onDelete={deleteAccount} />;
      case 'debts':
        return <DebtTracker debts={data.debts} onAdd={addDebt} onDelete={deleteDebt} transactions={data.transactions} />;
      default:
        return <Dashboard data={data} onAddTransaction={addTransaction} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 w-64 bg-white border-r border-slate-200 z-30 transition-transform duration-300
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 flex flex-col h-full">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
              FP
            </div>
            <div>
              <h1 className="font-bold text-slate-900 leading-tight">FinTrack Pro</h1>
              <p className="text-xs text-slate-500">Wealth Management</p>
            </div>
          </div>

          <nav className="space-y-1 flex-1">
            {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeTab === item.id 
                    ? 'bg-indigo-50 text-indigo-700 font-medium' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-slate-100">
            <button 
              onClick={exportCSV}
              className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
            >
              <Download size={20} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-slate-600 md:hidden"
            >
              <Menu size={24} />
            </button>
            <h2 className="text-lg font-semibold text-slate-800 capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden sm:block text-right">
                <p className="text-xs text-slate-500">Total Balance</p>
                <p className="text-sm font-bold text-slate-900">
                  ฿{data.accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}
                </p>
             </div>
          </div>
        </header>

        {/* Dynamic View */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8">
          <div className="max-w-6xl mx-auto pb-24 md:pb-8">
            {renderContent()}
          </div>
        </div>

        {/* Bottom Nav Mobile */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 z-10 shadow-up">
           {NAV_ITEMS.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 p-2 min-w-[64px] ${
                  activeTab === item.id ? 'text-indigo-600' : 'text-slate-400'
                }`}
              >
                {item.icon}
                <span className="text-[10px] uppercase font-bold">{item.label}</span>
              </button>
            ))}
        </div>
      </main>
    </div>
  );
};

export default App;
