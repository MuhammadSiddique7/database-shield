const express = require('express');
const router = express.Router();
const sdkController = require('../controllers/sdkController');

// POST /api/sdk/analyze
router.post('/analyze', sdkController.analyze);

// POST /api/sdk/heartbeat
router.post('/heartbeat', sdkController.heartbeat);

// POST /api/sdk/version
router.post('/version', sdkController.version);

// POST /api/sdk/log
router.post('/log', sdkController.log);

// GET /api/sdk/config
router.get('/config', sdkController.config);

module.exports = router;
