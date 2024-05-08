const mongoose = require('mongoose');

const examSchema = new mongoose.Schema({
    admission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admission',
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
