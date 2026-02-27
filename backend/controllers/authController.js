const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
        });

        if (user) {
            console.log(`User registered successfully: ${email}`);
            res.status(201).json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    bio: user.bio,
                    token: generateToken(user._id),
                },
            });
        }
    } catch (error) {
        console.error(`Registration error for ${email}:`, error.message);
        res.status(400).json({ success: false, message: error.message });
    }
};

// @desc    Authenticate a user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`Login failed: User not found for email ${email}`);
            return res.status(401).json({ success: false, message: 'User not registered' });
        }

        const isMatch = await user.matchPassword(password);
        if (isMatch) {
            console.log(`Login successful for user: ${email}`);
            res.json({
                success: true,
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    bio: user.bio,
                    token: generateToken(user._id),
                },
            });
        } else {
            console.log(`Login failed: Incorrect password for email ${email}`);
            res.status(401).json({ success: false, message: 'The pass is incorrect' });
        }
    } catch (error) {
        console.error('Login error:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        res.json({
            success: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                bio: user.bio,
                avatar: user.avatar,
            },
        });
    } else {
        res.status(404).json({ success: false, message: 'User not found' });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name !== undefined ? req.body.name : user.name;
            user.email = req.body.email !== undefined ? req.body.email : user.email;
            user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
            user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                user: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    bio: updatedUser.bio,
                    avatar: updatedUser.avatar,
                    token: generateToken(updatedUser._id),
                },
            });
        } else {
            res.status(404).json({ success: false, message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
