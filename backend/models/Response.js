const mongoose = require('mongoose');

const responseSchema = mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        message: { type: String, required: true },
    },
    { timestamps: true }
);

const Response = mongoose.model('Response', responseSchema);
module.exports = Response;
