// frontend/src/Chart.jsx
import React, { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import api from '../api';

const COLORS = {
  income: '#6366f1',
  expense: '#f43f5e',
  balance: '#10b981',
  categories: ['#6366f1','#f43f5e','#f59e0b','#10b981','#3b82f6','#8b5cf6','#ec4899','#14b8a6'],
};

// ── Custom Tooltip ──────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg p-3 text-sm">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: ₹{Number(p.value).toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  );
};

// ── Helper: group transactions by month ─────────────────
function groupByMonth(transactions) {
  const map = {};
  transactions.forEach(t => {
    const month = new Date(t.date).toLocaleString('en-IN', { month: 'short', year: '2-digit' });
    if (!map[month]) map[month] = { month, income: 0, expense: 0 };
    if (t.type === 'income') map[month].income += t.amount;
    else map[month].expense += t.amount;
  });
  return Object.values(map).map(m => ({ ...m, balance: m.income - m.expense }));
}

// ── Helper: group by category ───────────────────────────
function groupByCategory(transactions, type) {
  const map = {};
  transactions.filter(t => t.type === type).forEach(t => {
    map[t.category] = (map[t.category] || 0) + t.amount;
  });
  return Object.entries(map).map(([name, value]) => ({ name, value }));
}

// ── Chart Card Wrapper ──────────────────────────────────
const ChartCard = ({ title, subtitle, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
    <div className="mb-4">
      <h3 className="font-semibold text-gray-800">{title}</h3>
      {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
    </div>
    {children}
  </div>
);

// ── Main Chart Component ────────────────────────────────
export default function Chart() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    api.get('/transactions')
      .then(res => setTransactions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const monthlyData   = groupByMonth(transactions);
  const expenseBycat  = groupByCategory(transactions, 'expense');
  const incomeBycat   = groupByCategory(transactions, 'income');

  // Last 7 days daily spending
  const dailyData = (() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return {
        day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
        date: d.toDateString(),
        expense: 0, income: 0,
      };
    });
    transactions.forEach(t => {
      const idx = days.findIndex(d => d.date === new Date(t.date).toDateString());
      if (idx !== -1) {
        if (t.type === 'expense') days[idx].expense += t.amount;
        else days[idx].income += t.amount;
      }
    });
    return days;
  })();

  const tabs = ['overview', 'monthly', 'categories', 'daily'];

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600" />
    </div>
  );

  if (transactions.length === 0) return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
      <p className="text-lg font-medium">No data to visualize yet</p>
      <p className="text-sm mt-1">Add some transactions to see your charts</p>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Tab Bar */}
      <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition capitalize ${
              activeTab === tab
                ? 'bg-white shadow text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Income vs Expense Bar */}
          <ChartCard title="Income vs Expenses" subtitle="Monthly comparison">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="income" name="Income" fill={COLORS.income} radius={[4,4,0,0]} />
                <Bar dataKey="expense" name="Expense" fill={COLORS.expense} radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Expense Pie */}
          <ChartCard title="Expense Breakdown" subtitle="By category">
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={expenseBycat}
                  cx="50%" cy="50%"
                  innerRadius={60} outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent*100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {expenseBycat.map((_, i) => (
                    <Cell key={i} fill={COLORS.categories[i % COLORS.categories.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Net Balance Area */}
          <ChartCard title="Net Balance Trend" subtitle="Income minus expenses over time">
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.balance} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.balance} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone" dataKey="balance" name="Balance"
                  stroke={COLORS.balance} fill="url(#balanceGrad)" strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>

          {/* Income Pie */}
          <ChartCard title="Income Sources" subtitle="By category">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={incomeBycat}
                  cx="50%" cy="50%"
                  outerRadius={80} paddingAngle={3}
                  dataKey="value"
                >
                  {incomeBycat.map((_, i) => (
                    <Cell key={i} fill={COLORS.categories[i % COLORS.categories.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </ChartCard>

        </div>
      )}

      {/* ── MONTHLY TAB ── */}
      {activeTab === 'monthly' && (
        <div className="space-y-5">
          <ChartCard title="Monthly Income vs Expenses" subtitle="Full bar breakdown">
            <ResponsiveContainer width="100%" height={320}>
              <BarChart data={monthlyData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v/1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="income" name="Income" fill={COLORS.income} radius={[6,6,0,0]} />
                <Bar dataKey="expense" name="Expense" fill={COLORS.expense} radius={[6,6,0,0]} />
                <Bar dataKey="balance" name="Balance" fill={COLORS.balance} radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Savings Rate" subtitle="% of income saved each month">
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={monthlyData.map(m => ({
                ...m,
                savingsRate: m.income > 0 ? +((m.balance / m.income) * 100).toFixed(1) : 0
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `${v}%`} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Line
                  type="monotone" dataKey="savingsRate" name="Savings Rate"
                  stroke={COLORS.balance} strokeWidth={2} dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      )}

      {/* ── CATEGORIES TAB ── */}
      {activeTab === 'categories' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          <ChartCard title="Top Expense Categories" subtitle="Where your money goes">
            <ResponsiveContainer width="100%" height={280}>
              <BarChart
                data={[...expenseBycat].sort((a, b) => b.value - a.value)}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={v => `₹${v/1000}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={80} />
                <Tooltip formatter={(v) => `₹${v.toLocaleString('en-IN')}`} />
                <Bar dataKey="value" name="Amount" radius={[0,6,6,0]}>
                  {expenseBycat.map((_, i) => (
                    <Cell key={i} fill={COLORS.categories[i % COLORS.categories.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Category Stats" subtitle="Expense distribution table">
            <div className="space-y-3 mt-2">
              {[...expenseBycat]
                .sort((a, b) => b.value - a.value)
                .map((cat, i) => {
                  const total = expenseBycat.reduce((s, c) => s + c.value, 0);
                  const pct = total > 0 ? ((cat.value / total) * 100).toFixed(1) : 0;
                  return (
                    <div key={cat.name}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">{cat.name}</span>
                        <span className="text-gray-500">
                          ₹{cat.value.toLocaleString('en-IN')} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${pct}%`,
                            backgroundColor: COLORS.categories[i % COLORS.categories.length]
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          </ChartCard>

        </div>
      )}

      {/* ── DAILY TAB ── */}
      {activeTab === 'daily' && (
        <ChartCard title="Last 7 Days" subtitle="Daily income and spending">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.income} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={COLORS.income} stopOpacity={0} />
                </linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.expense} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={COLORS.expense} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={v => `₹${v}`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="income" name="Income"
                stroke={COLORS.income} fill="url(#incGrad)" strokeWidth={2} />
              <Area type="monotone" dataKey="expense" name="Expense"
                stroke={COLORS.expense} fill="url(#expGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      )}

    </div>
  );
}