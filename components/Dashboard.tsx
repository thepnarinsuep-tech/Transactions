
import React, { useState, useMemo } from 'react';
import { 
  AppState, 
  TransactionType, 
  Transaction 
} from '../types';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend 
} from 'recharts';
import { CATEGORIES } from '../constants';
import { Plus, ArrowUpRight, ArrowDownLeft, TrendingUp } from 'lucide-react';
import TransactionForm from './TransactionForm';

interface DashboardProps {
  data: AppState;
  onAddTransaction: (t: Omit<Transaction, 'id'>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ data, onAddTransaction }) => {
  const [showAddForm, setShowAddForm] = useState(false);

  const totalBalance = useMemo(() => data.accounts.reduce((s, a) => s + a.balance, 0), [data.accounts]);
  
  const todayTransactions = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return data.transactions.filter(t => t.date === today);
  }, [data.transactions]);

  // Chart Data: Expense Category Distribution
  const categoryChartData = useMemo(() => {
    const counts: Record<string, number> = {};
    data.transactions
      .filter(t => t.type === TransactionType.EXPENSE || t.type === TransactionType.DEBT_PAYMENT)
      .forEach(t => {
        counts[t.category] = (counts[t.category] || 0) + t.amount;
      });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [data.transactions]);

  // Chart Data: Monthly comparison for current year
  const monthlyChartData = useMemo(() => {
    const year = new Date().getFullYear();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map((m, i) => {
      const monthStr = `${year}-${String(i + 1).padStart(2, '0')}`;
      const income = data.transactions
        .filter(t => t.date.startsWith(monthStr) && t.type === TransactionType.INCOME)
        .reduce((s, t) => s + t.amount, 0);
      const expense = data.transactions
        .filter(t => t.date.startsWith(monthStr) && (t.type === TransactionType.EXPENSE || t.type === TransactionType.DEBT_PAYMENT))
        .reduce((s, t) => s + t.amount, 0);
      return { name: m, income, expense };
    });
  }, [data.transactions]);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-100 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-indigo-100 text-sm font-medium mb-1">Total Available Balance</p>
            <h3 className="text-3xl font-bold">฿{totalBalance.toLocaleString()}</h3>
            <div className="mt-4 flex items-center gap-2 text-xs text-indigo-200">
              <TrendingUp size={14} />
              <span>{data.accounts.length} Accounts Connected</span>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        </div>

        {data.accounts.slice(0, 2).map(acc => (
          <div key={acc.id} className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2 h-2 rounded-full ${acc.color}`}></div>
                <p className="text-slate-500 text-sm font-medium">{acc.name}</p>
              </div>
              <h3 className="text-2xl font-bold text-slate-800">฿{acc.balance.toLocaleString()}</h3>
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold mt-4">Account Holder</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Monthly Trend Chart */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-6">Income vs Expenses</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expense" name="Expense" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Chart */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-800 mb-6">Expense Distribution</h4>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {categoryChartData.slice(0, 4).map((item, i) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                  <span className="text-slate-600">{item.name}</span>
                </div>
                <span className="font-semibold text-slate-800">฿{item.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h4 className="font-bold text-slate-800">Transactions Today</h4>
          <button 
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
          >
            <Plus size={18} />
            <span>New Transaction</span>
          </button>
        </div>

        {todayTransactions.length === 0 ? (
          <div className="py-12 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <TrendingUp size={32} />
            </div>
            <p className="text-slate-400">No transactions recorded for today yet.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {todayTransactions.map(t => (
              <div key={t.id} className="py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl ${
                    t.type === TransactionType.INCOME ? 'bg-emerald-50 text-emerald-600' : 
                    t.type === TransactionType.DEBT_PAYMENT ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                  }`}>
                    {t.type === TransactionType.INCOME ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">{t.category}</p>
                    <p className="text-xs text-slate-400">{data.accounts.find(a => a.id === t.accountId)?.name} • {t.note || 'No note'}</p>
                  </div>
                </div>
                <p className={`font-bold ${t.type === TransactionType.INCOME ? 'text-emerald-600' : 'text-slate-800'}`}>
                  {t.type === TransactionType.INCOME ? '+' : '-'}฿{t.amount.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddForm && (
        <TransactionForm 
          accounts={data.accounts} 
          debts={data.debts}
          onClose={() => setShowAddForm(false)} 
          onSubmit={(t) => {
            onAddTransaction(t);
            setShowAddForm(false);
          }} 
        />
      )}
    </div>
  );
};

export default Dashboard;
