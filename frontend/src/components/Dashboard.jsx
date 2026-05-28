import React, { useState, useEffect } from 'react';
import { Wallet, Plus, Trash2, TrendingUp, TrendingDown, DollarSign, LogOut } from 'lucide-react';
import api from '../api';
import Chart from './Chart';
import Insights from './Insights';

const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Entertainment', 'Other'];
const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investment', 'Gift', 'Other'];

function Dashboard({ user, onLogout }) {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [dashTab, setDashTab] = useState('transactions');

  const [form, setForm] = useState({
    type: 'expense',
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
  });

  const fetchData = async () => {
    try {
      const [txRes, sumRes] = await Promise.all([
        api.get('/transactions'),
        api.get('/transactions/summary'),
      ]);
      setTransactions(txRes.data);
      setSummary(sumRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await api.post('/transactions', {
        ...form,
        amount: parseFloat(form.amount),
      });
      setForm({
        type: 'expense', amount: '', category: '',
        description: '', date: new Date().toISOString().split('T')[0],
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add transaction');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this transaction?')) return;
    try {
      await api.delete(`/transactions/${id}`);
      fetchData();
    } catch (err) {
      alert('Failed to delete');
    }
  };

  const categories = form.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
            <Wallet className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            SpendWise
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">Hi, <strong>{user.name}</strong></span>
          <button
            onClick={onLogout}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-6 space-y-6">

        {/* Summary Cards — always visible on all tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Balance', value: summary.balance, icon: DollarSign, color: 'indigo' },
            { label: 'Total Income', value: summary.income, icon: TrendingUp, color: 'green' },
            { label: 'Total Expenses', value: summary.expense, icon: TrendingDown, color: 'red' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-500">{label}</span>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center bg-${color}-50`}>
                  <Icon className={`w-5 h-5 text-${color}-500`} />
                </div>
              </div>
              <p className={`text-2xl font-bold text-${color === 'indigo' ? 'gray-800' : color + '-600'}`}>
                ₹{value.toLocaleString('en-IN')}
              </p>
            </div>
          ))}
        </div>

        {/* Tab Bar */}
        <div className="flex gap-2 bg-gray-100 p-1 rounded-xl w-fit">
          {['transactions', 'charts', 'insights'].map(tab => (
            <button
              key={tab}
              onClick={() => setDashTab(tab)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition capitalize ${
                dashTab === tab
                  ? 'bg-white shadow text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab === 'insights' ? '✨ Insights' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* ── TRANSACTIONS TAB ── */}
        {dashTab === 'transactions' && (
          <>
            {/* Add Transaction Button */}
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-800">Transactions</h2>
              <button
                onClick={() => setShowForm(!showForm)}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:scale-[1.02] transition"
              >
                <Plus className="w-4 h-4" />
                Add Transaction
              </button>
            </div>

            {/* Add Transaction Form */}
            {showForm && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="font-semibold text-gray-800 mb-4">New Transaction</h3>

                {error && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                  {/* Income / Expense Toggle */}
                  <div className="flex gap-3">
                    {['expense', 'income'].map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setForm({ ...form, type: t, category: '' })}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium transition ${
                          form.type === t
                            ? t === 'expense'
                              ? 'bg-red-500 text-white'
                              : 'bg-green-500 text-white'
                            : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                      <input
                        type="number"
                        min="1"
                        step="0.01"
                        value={form.amount}
                        onChange={(e) => setForm({ ...form, amount: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                      <select
                        value={form.category}
                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        required
                      >
                        <option value="">Select...</option>
                        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <input
                        type="text"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        placeholder="Optional note"
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(e) => setForm({ ...form, date: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold py-2 rounded-xl hover:scale-[1.01] transition disabled:opacity-70"
                    >
                      {submitting ? 'Adding...' : 'Add Transaction'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="px-4 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* Transactions List */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              {transactions.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <DollarSign className="w-12 h-12 mx-auto mb-3 opacity-30" />
                  <p>No transactions yet. Add your first one!</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {transactions.map((t) => (
                    <div key={t._id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          t.type === 'income' ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                          {t.type === 'income'
                            ? <TrendingUp className="w-5 h-5 text-green-500" />
                            : <TrendingDown className="w-5 h-5 text-red-500" />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{t.category}</p>
                          <p className="text-sm text-gray-400">
                            {t.description || 'No description'} · {new Date(t.date).toLocaleDateString('en-IN')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-semibold text-lg ${
                          t.type === 'income' ? 'text-green-600' : 'text-red-500'
                        }`}>
                          {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() => handleDelete(t._id)}
                          className="text-gray-300 hover:text-red-400 transition"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── CHARTS TAB ── */}
        {dashTab === 'charts' && <Chart />}

        {/* ── INSIGHTS TAB ── */}
        {dashTab === 'insights' && <Insights />}

      </div>
    </div>
  );
}

export default Dashboard;