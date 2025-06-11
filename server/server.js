require('dotenv').config();
const express = require('express');
const connectDB = require('./config/db');
const receiptRoutes = require('./routes/receiptRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
app.use(express.json());

connectDB();

app.use('/api/receipts', receiptRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/analytics', analyticsRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
