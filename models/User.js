const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    budget: { type: Number, default: 10000 },  // Example budget
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Member' }],
    isAdmin: {
        type: Boolean,
        default: false
    }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// //Method to compare hashed password
// userSchema.methods.comparePassword = async function(candidatePassword) {
//     return bcrypt.compare(candidatePassword, this.password);
// }
const User = mongoose.model('User', userSchema);

module.exports = User;
