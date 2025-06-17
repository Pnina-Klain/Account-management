const Expense = require('../models/expense.model');

exports.getAllExpenses = async (req, res) => {
    const expenses = await Expense.find();
    res.json(expenses);
};

exports.getExpenseById = async (req, res) => {
    const expense = await Expense.findById(req.params.id);
    if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
}

exports.createExpense = async (req, res) => {
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.status(201).json(newExpense);
};

exports.updateExpense = async (req, res) => {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
}

exports.deleteExpense = async (req, res) => {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
        return res.status(404).json({ message: 'Expense not found' });
    }
    res.status(204).send(); 
}
