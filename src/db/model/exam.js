const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    admissionNumber: {
        type: String,
        required: true
    },
    examType: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    subjects: [{
        name: {
            type: String,
            required: true
        },
        marks: {
            type: Number,
            required: true
        }
    }],
    totalMarks: {
        type: Number,
        required: true
    },

    rank: {
        type: Number,
        required: true
    }
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = { Exam };
