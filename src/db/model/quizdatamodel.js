const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
    boardName: String, // Add boardName field
    className: String, // Add className field
    subject: String,
    chapter: String,
    question: String,
    correct_answer: String,
    incorrect_answers: [String],
});

const Quizdata = mongoose.model('Quizdata', quizSchema);

module.exports = { Quizdata };
