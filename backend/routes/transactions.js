const express = require('express');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All routes below are protected — user must be logged in

// GET all transactions for logged-in user
router.get('/', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id })
      .sort({ date: -1 }); // newest first
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET summary (total income, expense, balance)
router.get('/summary', protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });

    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      income,
      expense,
      balance: income - expense,
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST add new transaction
router.post('/', protect, async (req, res) => {
  try {
    const { type, amount, category, description, date } = req.body;

    if (!type || !amount || !category)
      return res.status(400).json({ message: 'Type, amount, and category are required' });

    const transaction = await Transaction.create({
      user: req.user._id,
      type,
      amount,
      category,
      description,
      date: date || Date.now(),
    });

    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// PUT update a transaction
router.put('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id, // ensures user owns this transaction
    });

    if (!transaction)
      return res.status(404).json({ message: 'Transaction not found' });

    const { type, amount, category, description, date } = req.body;

    transaction.type = type || transaction.type;
    transaction.amount = amount || transaction.amount;
    transaction.category = category || transaction.category;
    transaction.description = description ?? transaction.description;
    transaction.date = date || transaction.date;

    await transaction.save();
    res.json(transaction);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE a transaction
router.delete('/:id', protect, async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!transaction)
      return res.status(404).json({ message: 'Transaction not found' });

    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;