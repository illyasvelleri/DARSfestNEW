const Member = require('../models/Member');
const Auction = require('../models/Auction');
const CurrentBidMember = require('../models/CurrentBidMember');
const multer = require('multer');


// Set up storage engine for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images'); // Directory to save uploaded images
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Unique file name
  }
});

const upload = multer({ storage: storage }).single('img');

// Admin Dashboard
exports.dashboard = (req, res) => {
  res.render('admin/dashboard', { title: 'Admin Dashboard' });
};

// Get Add Member Form
exports.getAddMember = (req, res) => {
  res.render('admin/add-member', { title: 'Add Member' });
};

// Post Add Member
exports.postAddMember = (req, res) => {
  upload(req, res, async function (err) {
    if (err) {
      console.error('Error uploading image:', err);
      return res.status(500).send('Internal Server Error');
    }

    const { name, batch, skills, tokenNumber, category } = req.body;
    const img = req.file.filename; // The file name of the uploaded image

    try {
      const member = new Member({ name, img, batch, skills, tokenNumber, category });
      await member.save();
      console.log('Uploaded succesfully');
      res.redirect('/admin/view-members');
    } catch (err) {
      console.error('Error adding member:', err);
      res.status(500).send('Internal Server Error');
    }
  });
};

// view Members
exports.viewMembers = async (req, res) => {
  try {
    const members = await Member.find({}).lean();
    console.log(members);
    res.render('admin/view-members', { title: 'View Members', members });
  } catch (err) {
    console.error('Error fetching members:', err);
    res.redirect('/admin');
  }
};

// exports.categorizeMembers = async (req, res) => {
//   const { memberIds, category } = req.body;

//   if (!memberIds || !category) {
//     return res.status(400).send("Please select members and a category.");

//   }

//   try {
//     const ids = Array.isArray(memberIds) ? memberIds : [memberIds];
//     // Update the category for all selected members
//     await Member.updateMany(
//       { _id: { $in: ids } },
//       { $set: { category } }
//     );
//     // Redirect back to the view-members page
//     res.render('/admin/view-categorized');
//   } catch (err) {
//     console.error('Error categorizing members:', err);
//     res.status(500).send('Internal Server Error');
//   }
// }

// Categorize Members
exports.categorizeMembers = async (req, res) => {
  const { memberIds, category } = req.body;

  try {
    // Update the category of the selected members
    await Member.updateMany(
      { _id: { $in: memberIds } },
      { $set: { category: category } }
    );

    console.log('Members categorized successfully');
    res.redirect('/admin/view-categorized');
  } catch (err) {
    console.error('Error categorizing members:', err);
    res.status(500).send('Internal Server Error');
  }
};


// View Categorized Members
exports.viewCategorized = async (req, res) => {
  try {
    const members = await Member.find({ category: { $ne: "Uncategorized" } }).lean();
    console.log(members);
    res.render('admin/view-categorized', { title: 'Categorized Members', members });
  } catch (err) {
    console.error('Error fetching categorized members:', err);
    res.redirect('/admin');
  }
};



let auctionInterval;  // Variable to hold the countdown interval
const initialCountdown = 30;  // Start timer at 30 seconds
// Function to start the auction for a member

// Function to start the auction for a member
exports.startBid = async (req, res) => {
  try {
      const memberId = req.body.memberId;
      const member = await Member.findById(memberId);

      // Check if there's already an active auction
      const existingBid = await CurrentBidMember.findOne({});
      if (existingBid) {
          return res.status(400).json({ success: false, message: 'An auction is already in progress.' });
      }

      // Clear any existing auction interval
      clearInterval(auctionInterval);

      // Set the member for current auction
      const startTime = new Date();
      const biddingEndTime = new Date(startTime.getTime() + initialCountdown * 1000); // Initial countdown

      const newBid = new CurrentBidMember({
          member: member._id,
          currentBid: 500,  // Start at the base price
          biddingEndTime: biddingEndTime,
          startTime: startTime,
          lastBidder: null  // No bidder at the start
      });

      await newBid.save();

      // Start the countdown timer
      auctionInterval = setInterval(async () => {
          const currentBidMember = await CurrentBidMember.findOne({}).populate('member');

          // Check if time has run out
          if (new Date() >= currentBidMember.biddingEndTime) {
              // Timer ended, finalize the auction
              clearInterval(auctionInterval);  // Stop the interval
              await finalizeAuction(req, res);  // Finalize the auction
          } else {
              // Update the remaining time (if needed for UI purposes)
              const remainingTime = Math.floor((currentBidMember.biddingEndTime - new Date()) / 1000);
              // This would typically be communicated back to the front-end for a live update
          }
      }, 1000); // Check every second

      res.redirect('/admin/dashboard');
  } catch (error) {
      console.error('Error starting the bid:', error);
      res.status(500).send('Server Error');
  }
};

// Make sure to import this function in your placeBid function
const { finalizeAuction } = require('./auctionController');


// // Function to start bid for selected member
// exports.startBid = async (req, res) => {
//   const { memberId } = req.body; // Get the selected member ID from the form

//   try {
//     // Check if there's already a member in the current bid collection
//     await CurrentBidMember.deleteMany({});

//     // Add the selected member to the current bid collection
//     const currentBidMember = new CurrentBidMember({
//       member: memberId,
//       biddingEndTime: new Date(Date.now() + 60 * 1000) // Set the bidding end time to 1 minute from now
//     });

//     await currentBidMember.save();

//     res.redirect('admin/dashboard'); // Redirect to the dashboard to view the current bid
//   } catch (error) {
//     console.error('Error starting the bid:', error);
//     res.status(500).send('Server Error');
//   }

// };

// Function to fetch current bid member for dashboard
exports.getCurrentBid = async (req, res) => {
  try {
    // Fetch the current bid member along with its details
    const currentBidMemberData = await CurrentBidMember.findOne({}).populate('member').lean();

    res.render('admin/dashboard', { currentBidMember: currentBidMemberData });
  } catch (error) {
    console.error('Error fetching current bid member:', error);
    res.status(500).send('Server Error');
  }
};