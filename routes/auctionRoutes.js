// routes/auctionRoutes.js
const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionController');
const { ensureAuthenticated } = require('../controllers/authController');

// Place a bid (only authenticated users can access)
router.post('/place-bid', auctionController.placeBid);

module.exports = router;
