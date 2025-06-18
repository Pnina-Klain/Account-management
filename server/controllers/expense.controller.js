const { isValidObjectId } = require('mongoose');
const Expense = require('../models/expense.model');

exports.getAllExpenses = async (req, res) => {
    const expenses = await Expense.find();
    res.json(expenses);
};

exports.getExpenseById = async (req, res) => {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid expense ID format' });
    }
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
}

exports.createExpense = async (req, res) => {
    if (!req.body.date || !req.body.amount || !req.body.provider || !req.body.details) {
        return res.status(400).json({ message: 'Date, amount, provider, and details are required' });
    }
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.status(201).json(newExpense);
};

exports.updateExpense = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Expense ID is required' });
    }
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid expense ID format' });
    }
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
}

exports.deleteExpense = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Expense ID is required' });
    }
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid expense ID format' });
    }
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(204).send(); 
}
