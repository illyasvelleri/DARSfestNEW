const mongoose = require('mongoose');

const AuctionSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  currentBid: {
    type: Number,
    required: true,
  },
  highestBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  endsAt: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model('Auction', AuctionSchema);
