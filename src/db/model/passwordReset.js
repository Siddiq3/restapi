// passwordReset.js

const mongoose = require('mongoose');

// Define the schema for password reset tokens
const passwordResetSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    resetToken: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 3600, // Token expires in 1 hour (for example)
    },
});

// Create the PasswordReset model
const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

module.exports = PasswordReset;
