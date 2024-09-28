const CurrentBidMember = require('../models/CurrentBidMember');
const authMiddleware = require('../middlewares/ensureAuthenticated');
const Member = require('../models/Member');
const User = require('../models/User');
const Group = require('../models/User');


// Function to place a bid
exports.placeBid = async (req, res) => {
  try {
      // Ensure that the user is authenticated
      if (!req.user || !req.user._id) {
          return res.status(401).json({ success: false, message: 'You must be logged in to place a bid.' });
      }

      const userId = req.user._id;
      const bidAmount = parseInt(req.body.bidAmount, 10);

      // Find the current bid member
      const currentBid = await CurrentBidMember.findOne({}).populate('member');
      if (!currentBid) {
          return res.status(404).json({ success: false, message: 'No ongoing auction found.' });
      }

      // Find the group (user) making the bid
      const userGroup = await Group.findOne({ userId: userId });
      if (!userGroup) {
          return res.status(404).json({ success: false, message: 'Your group could not be found.' });
      }

      // Check if the user has enough budget to place the bid
      if (userGroup.budget < bidAmount) {
          return res.status(400).json({ success: false, message: 'Insufficient budget to place this bid.' });
      }

      // Update the current bid
      currentBid.currentBid += bidAmount;
      currentBid.lastBidder = userId;

      // Deduct the bid amount from the user's group budget
      userGroup.budget -= bidAmount;

      // Extend the bidding time by 3 seconds
      currentBid.biddingEndTime = new Date(currentBid.biddingEndTime.getTime() + 3000);

      // Save the updates
      await currentBid.save();
      await userGroup.save();

      res.status(200).json({ success: true, message: 'Bid placed successfully!', currentBid: currentBid.currentBid });
  } catch (error) {
      console.error('Error placing the bid:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// Function to finalize the auction

exports.finalizeAuction = async (req, res) => {
  try {
    const currentBid = await CurrentBidMember.findOne({}).populate('member');
    if (!currentBid) {
      return res.status(400).json({ success: false, message: "No current bid in process" });

    }
    // Assign the member to the user with the last bid
    const lastBidder = await User.findById(currentBid.lastBidder);
    lastBidder.members.push(currentBid.member._id);
    await lastBidder.save();

    // Remove the member from the current bid and prepare for the next auction
    await CurrentBidMember.deleteOne({_id:currentBid._id});
     res.json ({success: true, message: 'Auction finalized, member assigned to the last bidder.'});

  } catch (error){
    console.error('Error finalizing the auction:', error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}
// let auctionInterval;  // Variable to hold the countdown interval
// const initialCountdown = 30;  // Start timer at 30 seconds
// const countdownDecrement = 3;  // Decrease timer by 3 seconds for each bid


// // Function to handle placing a bid
// exports.placeBid = async (req, res) => {
//   try {
//       const { bidAmount, groupId } = req.body;
//       const currentBid = await CurrentBidMember.findOne({}).populate('member');

//       if (!currentBid) {
//           return res.status(400).json({ success: false, message: 'No current bid in process' });
//       }

//       // Calculate new bid price
//       const newBidPrice = currentBid.currentBid + parseInt(bidAmount);

//       // Check if the group has enough budget
//       const group = await Group.findById(groupId);
//       if (group.budget < newBidPrice) {
//           return res.status(400).json({ success: false, message: 'Insufficient budget' });
//       }

//       // Update bid details and decrease the countdown
//       currentBid.currentBid = newBidPrice;
//       currentBid.lastBidder = group._id;
//       currentBid.biddingEndTime = new Date(currentBid.biddingEndTime.getTime() - countdownDecrement * 1000); // Decrease countdown by 3 seconds
//       await currentBid.save();

//       // Deduct from group's budget
//       group.budget -= parseInt(bidAmount);
//       await group.save();

//       // Send response with the new bid price and updated time
//       const remainingTime = Math.floor((currentBid.biddingEndTime - new Date()) / 1000);
//       res.json({ success: true, newBidPrice, newTime: `00:00:${remainingTime < 10 ? '0' : ''}${remainingTime}` });
//   } catch (error) {
//       console.error('Error placing the bid:', error);
//       res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };

// // Function to finalize the auction
// exports.finalizeAuction = async (req, res) => {
//   try {
//       await finalizeAuction();
//       res.json({ success: true });
//   } catch (error) {
//       console.error('Error finalizing the auction:', error);
//       res.status(500).json({ success: false, message: 'Server Error' });
//   }
// };
