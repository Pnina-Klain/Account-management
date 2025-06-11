const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/monthly', analyticsController.getMonthlyData);
router.get('/yearly', analyticsController.getYearlyData);
router.get('/range', analyticsController.getDataInRange);
router.get('/byClient', analyticsController.getIncomeByClient);

module.exports = router;
