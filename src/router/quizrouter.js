const express = require("express");
const router = new express.Router();

const { Quiz } = require('../db/model/quizmodels');
const Withdrawal = require('../db/model/withdraw');





router.get('/', async (req, res) => {
    res.send('siddiqkolimi..');
})


// Create a quiz
router.post('/quizzes', async (req, res) => {
    try {
        console.log('Received POST request for /quizzes');

        const quizDataArray = req.body;

        // Validate that the request body is an array
        if (!Array.isArray(quizDataArray)) {
            console.log('Invalid request format. Expecting an array.');
            return res.status(400).json({ message: 'Invalid request format. Expecting an array.' });
        }

        // Create an array to store the created quizzes
        const createdQuizzes = [];

        // Iterate through each quiz data in the array
        for (const quizData of quizDataArray) {
            console.log('Processing quiz data:', quizData);

            const {
                class1,
                subject,
                chapter,
                question,
                correct_answer,
                incorrect_answers,
            } = quizData;

            // Create a new Quiz instance
            const quiz = new Quiz({
                class1,
                subject,
                chapter,
                question,
                correct_answer,
                incorrect_answers,
            });

            // Save the new quiz to the database
            const newQuiz = await quiz.save();
            console.log('Quiz saved:', newQuiz);

            createdQuizzes.push(newQuiz);
        }

        // Respond with the created quizzes
        console.log('Sending response:', createdQuizzes);
        res.status(201).json(createdQuizzes);
    } catch (error) {
        // Handle errors, such as validation errors or database errors
        console.error('Error:', error);
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



router.get('/quiz/:class1/:subject', async (req, res) => {
    const { class1: requestedClass, subject } = req.params;

    try {
        // Filter quizzes based on the requested class and chapter
        const quizzes = await Quiz.find({ class1: requestedClass, subject: subject });
        const formattedQuizzes = quizzes.map((quiz) => ({
            // subject: quiz.subject,
            chapter: quiz.chapter,
        }));
        res.json({ response_code: 0, results: formattedQuizzes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.get('/quiz/:class1/:subject/:chapter', async (req, res) => {
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

router.post('/sk0301withdrawal', async (req, res) => {
    try {
        const formData = req.body;
        const withdrawal = new Withdrawal(formData);
        await withdrawal.save();

        res.status(201).json({ message: 'Withdrawal request submitted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/withdrawals', async (req, res) => {
    try {
        // Retrieve all withdrawal documents from the MongoDB collection
        const withdrawals = await Withdrawal.find();

        // Respond with the array of withdrawal documents
        res.status(200).json(withdrawals);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});






module.exports = router;
