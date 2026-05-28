const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

const router = express.Router();
// Temporary debug route — add this after: const router = express.Router();
router.get('/models', async (req, res) => {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`
    );
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Helper: build a readable summary from transactions
function buildSummary(transactions) {
  if (transactions.length === 0) return null;

  // Total income & expense
  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  // Group expenses by category
  const expenseByCategory = {};
  transactions
    .filter(t => t.type === 'expense')
    .forEach(t => {
      expenseByCategory[t.category] = (expenseByCategory[t.category] || 0) + t.amount;
    });

  // Group by month
  const byMonth = {};
  transactions.forEach(t => {
    const month = new Date(t.date).toLocaleString('en-IN', {
      month: 'long', year: 'numeric'
    });
    if (!byMonth[month]) byMonth[month] = { income: 0, expense: 0 };
    if (t.type === 'income') byMonth[month].income += t.amount;
    else byMonth[month].expense += t.amount;
  });

  // Recent 5 transactions
  const recent = transactions
    .slice(0, 5)
    .map(t => `${t.type === 'income' ? '+' : '-'}₹${t.amount} on ${t.category} (${new Date(t.date).toDateString()})${t.description ? ` - "${t.description}"` : ''}`)
    .join('\n');

  const categoryBreakdown = Object.entries(expenseByCategory)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, amt]) => `  ${cat}: ₹${amt.toLocaleString('en-IN')}`)
    .join('\n');

  const monthBreakdown = Object.entries(byMonth)
    .map(([month, data]) =>
      `  ${month}: Income ₹${data.income.toLocaleString('en-IN')}, Expense ₹${data.expense.toLocaleString('en-IN')}, Saved ₹${(data.income - data.expense).toLocaleString('en-IN')}`
    )
    .join('\n');

  return {
    totalIncome,
    totalExpense,
    balance: totalIncome - totalExpense,
    savingsRate: totalIncome > 0 ? ((totalIncome - totalExpense) / totalIncome * 100).toFixed(1) : 0,
    categoryBreakdown,
    monthBreakdown,
    recent,
    txCount: transactions.length,
  };
}

// ── GET /api/insights ─────────────────────────────────
// Returns AI-generated insights for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(100); // last 100 transactions for context

    if (transactions.length === 0) {
      return res.json({
        insights: null,
        message: 'Add some transactions first to get AI insights.'
      });
    }

    const summary = buildSummary(transactions);

    const prompt = `
You are a friendly and smart personal finance advisor for an Indian user.
Analyze the following financial data and provide insights in a structured JSON format.

Financial Summary:
- Total Income: ₹${summary.totalIncome.toLocaleString('en-IN')}
- Total Expenses: ₹${summary.totalExpense.toLocaleString('en-IN')}
- Net Balance: ₹${summary.balance.toLocaleString('en-IN')}
- Savings Rate: ${summary.savingsRate}%
- Total Transactions Analyzed: ${summary.txCount}

Expenses by Category:
${summary.categoryBreakdown}

Monthly Breakdown:
${summary.monthBreakdown}

Recent Transactions:
${summary.recent}

Respond ONLY with a valid JSON object (no markdown, no backticks) in this exact structure:
{
  "overview": "2-3 sentence summary of their financial health",
  "score": <number 1-100 representing financial health>,
  "scoreLabel": "<Poor|Fair|Good|Excellent>",
  "tips": [
    { "title": "short title", "detail": "1-2 sentence actionable tip", "icon": "<one of: savings|alert|trending|goal|celebration>" },
    { "title": "short title", "detail": "1-2 sentence actionable tip", "icon": "<one of: savings|alert|trending|goal|celebration>" },
    { "title": "short title", "detail": "1-2 sentence actionable tip", "icon": "<one of: savings|alert|trending|goal|celebration>" }
  ],
  "biggestExpense": "<category name>",
  "suggestion": "One specific, actionable suggestion for their biggest expense category",
  "monthlyGoal": "A realistic savings goal for next month based on their data"
}`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    // Safely parse JSON — strip any accidental backticks
    const clean = text.replace(/```json|```/g, '').trim();
    const insights = JSON.parse(clean);

    res.json({ insights, summary });

  } catch (err) {
     console.error('❌ Full Gemini error:', err);
    res.status(500).json({ message: 'Failed to generate insights. Try again.' });
  }
});

// ── POST /api/insights/ask ────────────────────────────
// Chat with AI about your finances
router.post('/ask', protect, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ message: 'Question is required' });

    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(100);

    const summary = buildSummary(transactions);

    const prompt = `
You are a helpful personal finance assistant for an Indian user.
Here is their financial data:
- Total Income: ₹${summary.totalIncome.toLocaleString('en-IN')}
- Total Expenses: ₹${summary.totalExpense.toLocaleString('en-IN')}
- Balance: ₹${summary.balance.toLocaleString('en-IN')}
- Savings Rate: ${summary.savingsRate}%

Expenses by Category:
${summary.categoryBreakdown}

Monthly Data:
${summary.monthBreakdown}

The user asks: "${question}"

Answer in 2-4 sentences. Be specific, friendly, and use their actual data in your answer. Use ₹ for currency.`;

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    const result = await model.generateContent(prompt);
    res.json({ answer: result.response.text().trim() });

  } catch (err) {
    console.error('Gemini chat error:', err.message);
    res.status(500).json({ message: 'Failed to get answer. Try again.' });
  }
});

module.exports = router;