var express = require('express');
var router = express.Router();
const auctionController = require('../controllers/auctionController');
const adminController = require('../controllers/adminController');


/* GET admin dashboard. */
router.get('/', adminController.dashboard);

/* GET form to add member details. */
router.get('/add-member', adminController.getAddMember);

/* POST to upload member details. */
router.post('/add-member', adminController.postAddMember);

/* GET auction items to view. */
router.get('/view-members', adminController.viewMembers);

// Route to categorize multiple members
router.post('/categorize-members', adminController.categorizeMembers);

// Route to view categorized members
router.get('/view-categorized', adminController.viewCategorized);

// Route to start a bid
router.post('/start-bid', adminController.startBid);

// Automatically called when visiting this route
router.get('/admin/dashboard', adminController.getCurrentBid);
module.exports = router;
