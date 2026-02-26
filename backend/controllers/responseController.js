const Response = require('../models/Response');

// @desc    Submit a support ticket
// @route   POST /api/responses
// @access  Public
const submitResponse = async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'Please provide all fields' });
    }

    try {
        const response = await Response.create({
            name,
            email,
            message,
        });

        res.status(201).json({
            success: true,
            message: 'Ticket submitted successfully',
            data: response,
        });
    } catch (error) {
        console.error('Submit Response Error:', error.message);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
};

module.exports = { submitResponse };
