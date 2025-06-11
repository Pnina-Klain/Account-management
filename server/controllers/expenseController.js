const Expense = require('../models/Expense');

// יצירת הוצאה חדשה
exports.createExpense = async (req, res) => {
    const { date, amount, supplier, paymentMethod, details } = req.body;

    try {
        const newExpense = new Expense({ date, amount, supplier, paymentMethod, details });
        await newExpense.save();
        res.status(201).json(newExpense);
    } catch (error) {
        res.status(500).json({ message: 'Error creating expense', error });
    }
};

// קבלת כל ההוצאות
exports.getExpenses = async (req, res) => {
    try {
        const expenses = await Expense.find();
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expenses', error });
    }
};
