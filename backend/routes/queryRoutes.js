const express = require('express');
const {
  analyzeQuery,
  getQueryLogs,
  getQueryLog
} = require('../controllers/queryController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.post('/analyze-query', analyzeQuery);
router.get('/logs', protect, getQueryLogs);
router.get('/logs/:id', protect, getQueryLog);

module.exports = router;
