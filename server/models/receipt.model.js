const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    receiptNumber: { type: Number, required: true },
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    details: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Receipt', receiptSchema);
