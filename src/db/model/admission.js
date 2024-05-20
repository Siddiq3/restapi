const mongoose = require('mongoose');

const admissionSchema = new mongoose.Schema({

    admissionNumber: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },

    parentName: {
        type: String,
        required: true
    },
    parentPhoneNumber: {
        type: String,
        required: true,
        unique: true
    },

    class: {
        type: String,
        required: true
    },

    section: {
        type: String,
        required: true
    },
    totalFee: {
        type: String,
        required: true
    },
    paidFee: {
        type: String,
        required: true
    },
    remainingFee: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    paidDate: {
        type: Date,
        required: true
    },
    remainingFeeDueDate: {
        type: Date,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
});

const Admission = mongoose.model('Admission', admissionSchema);

module.exports = { Admission };
