const express = require('express');
const {
  getStats,
  getRecentActivity,
  getChartData
} = require('../controllers/dashboardController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.get('/stats', getStats);
router.get('/recent', getRecentActivity);
router.get('/chart', getChartData);

module.exports = router;
