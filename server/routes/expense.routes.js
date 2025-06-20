const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expense.controller');
const { route } = require('./customer.routes');

router.get('/', expenseController.getAllExpenses);
router.get('/:id', expenseController.getExpenseById); 
router.post('/', expenseController.createExpense);
router.put('/:id?', expenseController.updateExpense); 
router.delete('/:id?', expenseController.deleteExpense); 
module.exports = router;
