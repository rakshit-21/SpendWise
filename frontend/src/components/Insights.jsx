import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles, TrendingUp, AlertTriangle, Target,
  PartyPopper, PiggyBank, Send, RefreshCw, Bot, User
} from 'lucide-react';
import api from '../api';

// ── Icon map for tip icons from Gemini ──────────────────
const TIP_ICONS = {
  savings:     <PiggyBank className="w-5 h-5" />,
  alert:       <AlertTriangle className="w-5 h-5" />,
  trending:    <TrendingUp className="w-5 h-5" />,
  goal:        <Target className="w-5 h-5" />,
  celebration: <PartyPopper className="w-5 h-5" />,
};

const TIP_COLORS = {
  savings:     'bg-indigo-50 text-indigo-600 border-indigo-100',
  alert:       'bg-red-50 text-red-500 border-red-100',
  trending:    'bg-green-50 text-green-600 border-green-100',
  goal:        'bg-amber-50 text-amber-600 border-amber-100',
  celebration: 'bg-purple-50 text-purple-600 border-purple-100',
};

// ── Health Score Ring ────────────────────────────────────
function ScoreRing({ score, label }) {
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color =
    score >= 80 ? '#10b981' :
    score >= 60 ? '#6366f1' :
    score >= 40 ? '#f59e0b' : '#f43f5e';

  return (
    <div className="flex flex-col items-center">
      <svg width="140" height="140" className="-rotate-90">
        <circle cx="70" cy="70" r={radius} fill="none"
          stroke="#f0f0f0" strokeWidth="10" />
        <circle cx="70" cy="70" r={radius} fill="none"
          stroke={color} strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div className="text-center -mt-20 mb-14">
        <p className="text-4xl font-bold text-gray-800">{score}</p>
        <p className="text-sm font-medium" style={{ color }}>{label}</p>
      </div>
      <p className="text-xs text-gray-400">Financial Health Score</p>
    </div>
  );
}

// ── Chat Bubble ──────────────────────────────────────────
function ChatBubble({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
        isUser ? 'bg-indigo-100' : 'bg-gradient-to-br from-indigo-500 to-purple-600'
      }`}>
        {isUser
          ? <User className="w-4 h-4 text-indigo-600" />
          : <Bot className="w-4 h-4 text-white" />
        }
      </div>
      <div className={`max-w-xs lg:max-w-md px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
        isUser
          ? 'bg-indigo-600 text-white rounded-tr-sm'
          : 'bg-gray-100 text-gray-700 rounded-tl-sm'
      }`}>
        {msg.content}
      </div>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────
export default function Insights() {
  const [insights, setInsights]     = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState('');
  const [messages, setMessages]     = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your AI finance assistant powered by Gemini. Ask me anything about your spending, savings, or how to improve your finances! 💬"
    }
  ]);
  const [question, setQuestion]     = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  const fetchInsights = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get('/insights');
      if (res.data.insights) {
        setInsights(res.data.insights);
      } else {
        setError(res.data.message || 'No insights available yet.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load insights. Make sure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInsights(); }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleAsk = async (e) => {
    e.preventDefault();
    if (!question.trim() || chatLoading) return;

    const userMsg = { role: 'user', content: question };
    setMessages(prev => [...prev, userMsg]);
    setQuestion('');
    setChatLoading(true);

    try {
      const res = await api.post('/insights/ask', { question });
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: res.data.answer
      }]);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I ran into an error. Please try again.'
      }]);
    } finally {
      setChatLoading(false);
    }
  };

  const QUICK_QUESTIONS = [
    'Where am I spending the most?',
    'How can I save more this month?',
    'Am I on track financially?',
    'What is my savings rate?',
  ];

  // ── Loading ──
  if (loading) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <div className="w-12 h-12 rounded-full border-4 border-indigo-100 border-t-indigo-600 animate-spin" />
      <p className="text-sm text-gray-500">Gemini is analyzing your finances...</p>
    </div>
  );

  // ── Error ──
  if (error) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <Sparkles className="w-10 h-10 text-gray-300" />
      <p className="text-gray-500 text-center">{error}</p>
      <button onClick={fetchInsights}
        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm hover:bg-indigo-700 transition">
        <RefreshCw className="w-4 h-4" /> Retry
      </button>
    </div>
  );

  // ── No Data ──
  if (!insights) return (
    <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3">
      <Sparkles className="w-12 h-12 opacity-30" />
      <p>Add some transactions first to unlock AI insights</p>
    </div>
  );

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-800">AI Insights</h2>
            <p className="text-xs text-gray-400">Powered by Gemini 1.5 Flash</p>
          </div>
        </div>
        <button onClick={fetchInsights}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-indigo-600 transition border border-gray-200 px-3 py-1.5 rounded-xl">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </button>
      </div>

      {/* Score + Overview Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <ScoreRing score={insights.score} label={insights.scoreLabel} />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800 mb-2">Financial Overview</h3>
            <p className="text-gray-600 leading-relaxed">{insights.overview}</p>
            <div className="mt-4 p-3 bg-indigo-50 rounded-xl border border-indigo-100">
              <p className="text-sm font-medium text-indigo-700">🎯 Monthly Goal</p>
              <p className="text-sm text-indigo-600 mt-0.5">{insights.monthlyGoal}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tips Grid */}
      <div>
        <h3 className="font-semibold text-gray-800 mb-3">Personalized Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {insights.tips.map((tip, i) => (
            <div key={i}
              className={`rounded-2xl border p-4 ${TIP_COLORS[tip.icon] || TIP_COLORS.goal}`}>
              <div className="flex items-center gap-2 mb-2">
                {TIP_ICONS[tip.icon] || TIP_ICONS.goal}
                <span className="font-medium text-sm">{tip.title}</span>
              </div>
              <p className="text-sm opacity-80 leading-relaxed">{tip.detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Biggest Expense Callout */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="font-medium text-gray-800">
              Biggest Expense Category:{' '}
              <span className="text-red-500">{insights.biggestExpense}</span>
            </p>
            <p className="text-sm text-gray-500 mt-1">{insights.suggestion}</p>
          </div>
        </div>
      </div>

      {/* AI Chat */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

        {/* Chat Header */}
        <div className="p-4 border-b border-gray-50 flex items-center gap-2">
          <Bot className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-gray-800">Ask Your Finance AI</span>
        </div>

        {/* Quick Question Chips */}
        <div className="px-4 pt-3 flex flex-wrap gap-2">
          {QUICK_QUESTIONS.map((q) => (
            <button key={q}
              onClick={() => setQuestion(q)}
              className="text-xs border border-indigo-200 text-indigo-600 rounded-full px-3 py-1 hover:bg-indigo-50 transition">
              {q}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="h-64 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <ChatBubble key={i} msg={msg} />
          ))}

          {/* Typing indicator */}
          {chatLoading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex gap-1 items-center">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleAsk} className="p-4 border-t border-gray-100 flex gap-2">
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="e.g. How much did I spend on food this month?"
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            disabled={chatLoading}
          />
          <button
            type="submit"
            disabled={chatLoading || !question.trim()}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2.5 rounded-xl hover:scale-[1.02] transition disabled:opacity-50 disabled:scale-100"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  );
}