const mongoose = require('mongoose');

const receiptSchema = new mongoose.Schema({
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'Client' },
    date: { type: Date, required: true },
    amount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Cash', 'Credit', 'Transfer'], required: true },
    details: { type: String, required: true },
    receiptNumber: { type: Number, unique: true }
});

module.exports = mongoose.model('Receipt', receiptSchema);
