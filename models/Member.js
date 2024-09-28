// models/Member.js
const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: String,
  img: String,
  batch: String,
  skills: [String],
  tokenNumber: String,
  category: String,
  basePrice: {
    type: Number,
    default: 500
  },
  currentBid: {
    type: Number,
    default: 500
  },
  lastBidder: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  biddingEndTime: Date
});

const Member = mongoose.model('Member', memberSchema);
module.exports = Member;
