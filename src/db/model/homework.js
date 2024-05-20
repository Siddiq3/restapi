const mongoose = require('mongoose');

const HomeworkSchema = new mongoose.Schema({
    class: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    }
}, {
    timestamps: true // This adds `createdAt` and `updatedAt` fields
});

const Homework = mongoose.model('Homework', HomeworkSchema);

module.exports = Homework;
