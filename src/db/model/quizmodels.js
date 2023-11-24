// models/quizModel.js

const mongoose = require('mongoose');

/*const optionSchema = new mongoose.Schema({
    text: String,
    isCorrect: Boolean,
});

const questionSchema = new mongoose.Schema({
    text: String,
    options: [optionSchema],
});
*/
const quizSchema = new mongoose.Schema({
    class1: String,
    subject: String,
    chapter: String,
    question: String,
    correct_answer: String,
    incorrect_answers: [String],
});

const Quiz = mongoose.model('Quiz', quizSchema);

module.exports = { Quiz };
