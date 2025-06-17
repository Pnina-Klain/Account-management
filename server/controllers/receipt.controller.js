const Receipt = require('../models/receipt.model');

exports.getAllReceipts = async (req, res) => {
    const receipts = await Receipt.find().populate('customerId');
    res.json(receipts);
};

exports.getReceiptById = async (req, res) => {
    const receipt = await Receipt.findById(req.params.id).populate('customerId');
    if (!receipt) {
        return res.status(404).json({ message: 'Receipt not found' });
    }
    res.json(receipt);
}

exports.createReceipt = async (req, res) => {
    const newReceipt = new Receipt(req.body);
    await newReceipt.save();
    res.status(201).json(newReceipt);
}

exports.updateReceipt = async (req, res) => {
    const receipt = await Receipt.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('customerId');
    if (!receipt) {
        return res.status(404).json({ message: 'Receipt not found' });
    }
    res.json(receipt);
}

exports.deleteReceipt = async (req, res) => {
    const receipt = await Receipt.findByIdAndDelete(req.params.id);
    if (!receipt) {
        return res.status(404).json({ message: 'Receipt not found' });
    }
    res.status(204).send(); 
}   

