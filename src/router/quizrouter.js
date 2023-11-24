const express = require("express");
const router = new express.Router();

const { Quiz } = require('../db/model/quizmodels');






router.get('/', async (req, res) => {
    res.send('siddiqkolimi..');
})


// Create a quiz
router.post('/quiz', async (req, res) => {
    const {
        class1,
        subject,
        chapter,
        question,
        correct_answer,
        incorrect_answers,
    } = req.body;

    // Create a new Quiz instance
    const quiz = new Quiz({
        class1,
        subject,
        chapter,
        question,
        correct_answer,
        incorrect_answers,
    });

    try {
        // Save the new quiz to the database
        const newQuiz = await quiz.save();

        // Respond with the created quiz
        res.status(201).json(newQuiz);
    } catch (error) {
        // Handle errors, such as validation errors or database errors
        res.status(400).json({ message: error.message });
    }
});


router.get('/quiz', async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        const formattedQuizzes = quizzes.map((quiz) => ({
            class1: quiz.class1,
            subject: quiz.subject,
            chapter: quiz.chapter,
            question: quiz.question,
            correct_answer: quiz.correct_answer,
            incorrect_answers: quiz.incorrect_answers,
        }));
        res.json({ response_code: 0, results: formattedQuizzes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




router.get('/quiz/:class1', async (req, res) => {
    const requestedClass = req.params.class1;

    try {
        // Filter quizzes based on the requested class
        const quizzes = await Quiz.find({ class1: requestedClass });
        const formattedQuizzes = quizzes.map((quiz) => ({
            class1: quiz.class1,
            subject: quiz.subject,
            chapter: quiz.chapter,
            question: quiz.question,
            correct_answer: quiz.correct_answer,
            incorrect_answers: quiz.incorrect_answers,
        }));
        res.json({ response_code: 0, results: formattedQuizzes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


router.get('/quiz/:class1/:chapter', async (req, res) => {
    const { class1: requestedClass, chapter } = req.params;

    try {
        // Filter quizzes based on the requested class and chapter
        const quizzes = await Quiz.find({ class1: requestedClass, chapter: chapter });
        const formattedQuizzes = quizzes.map((quiz) => ({
            question: quiz.question,
            correct_answer: quiz.correct_answer,
            incorrect_answers: quiz.incorrect_answers,
        }));
        res.json({ response_code: 0, results: formattedQuizzes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});






module.exports = router;
