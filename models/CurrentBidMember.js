const mongoose = require('mongoose');

const currentBidMemberSchema = new mongoose.Schema({
    member: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Member',
        required: true
    },
    startTime: {
        type: Date,
        default: Date.now
    },
    biddingEndTime: Date
});

const CurrentBidMember = mongoose.model('CurrentBidMember', currentBidMemberSchema);
module.exports = CurrentBidMember;