const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    admissionNumber: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true,
        default: Date.now // Default to current date
    },
    status: {
        type: String,
        enum: ['present', 'absent'],
        default: 'present'
    },
    reason: {
        type: String
    },
    precision: {
        type: String
    }
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = { Attendance };
