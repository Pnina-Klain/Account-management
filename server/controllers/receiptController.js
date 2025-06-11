const Receipt = require('../models/Receipt');

// יצירת קבלה חדשה
exports.createReceipt = async (req, res) => {
    const { client, date, amount, paymentMethod, details } = req.body;

    try {
        const lastReceipt = await Receipt.findOne().sort({ receiptNumber: -1 });
        const receiptNumber = lastReceipt ? lastReceipt.receiptNumber + 1 : 1;

        const newReceipt = new Receipt({
            client,
            date,
            amount,
            paymentMethod,
            details,
            receiptNumber
        });

        await newReceipt.save();
        res.status(201).json(newReceipt);
    } catch (error) {
        res.status(500).json({ message: 'Error creating receipt', error });
    }
};

// קבלת כל הקבלות
exports.getReceipts = async (req, res) => {
    try {
        const receipts = await Receipt.find().populate('client');
        res.status(200).json(receipts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching receipts', error });
    }
};
