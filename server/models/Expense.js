const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    supplier: { type: String, required: true },
    paymentMethod: { type: String, enum: ['Cash', 'Credit', 'Transfer'], required: true },
    details: { type: String, required: true }
});

module.exports = mongoose.model('Expense', expenseSchema);
