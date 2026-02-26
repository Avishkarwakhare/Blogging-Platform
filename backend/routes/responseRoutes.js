const express = require('express');
const router = express.Router();
const { submitResponse } = require('../controllers/responseController');

router.post('/', submitResponse);

module.exports = router;
