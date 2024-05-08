const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
    admissionNumber: {
        type: String,
        required: true
    },
    exam: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exam',
        required: true
    },
    marks: {
        type: Number,
        required: true
    },
    rank: {
        type: Number
    }
});

const Result = mongoose.model('Result', resultSchema);

module.exports = { Result };
