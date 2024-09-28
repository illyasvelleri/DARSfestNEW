var express = require('express');
var router = express.Router();
const auctionController = require('../controllers/auctionController')
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('user/dashboard', userController.getCurrentBid, { title: 'User' });
// });

// router.get('/', userController.getCurrentBid, { title: 'User' });
// // Automatically called when visiting this route
router.get('/', userController.getCurrentBid);
router.post('/bid', auctionController.placeBid);
router.post('/finalize-auction', auctionController.finalizeAuction);
module.exports = router;
