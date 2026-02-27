const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^[\w-\.]+@(gmail\.com|outlook\.in|outlook\.com|yahoo\.com|hotmail\.com|icloud\.com)$/i, 'Please use a valid email (e.g., @gmail.com or @outlook.in)']
        },
        password: { type: String, required: true },
        bio: { type: String, default: '' },
        avatar: { type: String, default: '' },
    },
    { timestamps: true }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
module.exports = User;
