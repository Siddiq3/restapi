// Assume you have a MongoDB connection named 'mongoose'
const mongoose = require('mongoose');

// Define the Withdrawal schema
const withdrawalSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    upiId: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    submissionDate: {
        type: Date,
        default: Date.now,
    },
});

// Create a model based on the schema
const Withdrawal = mongoose.model('Withdrawal', withdrawalSchema);

module.exports = Withdrawal;
