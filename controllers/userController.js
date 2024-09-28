const db = require('../config/db'); // Adjust the path to your db configuration
const collection = require('../config/collections');
const CurrentBidMember = require('../models/CurrentBidMember');
const AdminController = require('./adminController');
// Function to fetch current bid member for dashboard
exports.getCurrentBid = async (req, res) => {
  try {
    // Fetch the current bid member along with its details
    const currentBidMemberData = await CurrentBidMember.findOne({}).populate('member').lean();

    res.render('user/dashboard', { currentBidMember: currentBidMemberData });
  } catch (error) {
    console.error('Error fetching current bid member:', error);
    res.status(500).send('Server Error');
  }
};