const { isValidObjectId } = require('mongoose');
const Receipt = require('../models/receipt.model');

exports.getAllReceipts = async (req, res) => {
    const receipts = await Receipt.find().populate('customerId');
    res.json(receipts);
};

exports.getReceiptById = async (req, res) => {
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid receipt ID format' });
    }
    const receipt = await Receipt.findById(req.params.id).populate('customerId');
    if (!receipt) {
        return res.status(404).json({ message: 'Receipt not found' });
    }
    res.json(receipt);
}

exports.createReceipt = async (req, res) => {
    if (!req.body.receiptNumber || !req.body.customerId || !req.body.date || !req.body.amount || !req.body.paymentMethod || !req.body.details) {
        return res.status(400).json({ message: 'Receipt number, customer ID, date, amount, payment method, and details are required' });
    }
    const newReceipt = new Receipt(req.body);
    await newReceipt.save();
    res.status(201).json(newReceipt);
}

exports.updateReceipt = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Receipt ID is required' });
    }
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid receipt ID format' });
    }
    const receipt = await Receipt.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('customerId');
    if (!receipt) {
        return res.status(404).json({ message: 'Receipt not found' });
    }
    res.json(receipt);
}

exports.deleteReceipt = async (req, res) => {
    if (req.params.id == ''|| !req.params.id) {
        return res.status(400).json({ message: 'Receipt ID is required' });
    }
    if(!isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid receipt ID format' });
    }
    const receipt = await Receipt.findByIdAndDelete(req.params.id);
    if (!receipt) {
        return res.status(404).json({ message: 'Receipt not found' });
    }
    res.status(204).send(); 
}   

