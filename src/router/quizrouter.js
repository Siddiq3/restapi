const express = require("express");
const router = new express.Router();
const bodyParser = require('body-parser');
const { Quiz } = require('../db/model/quizmodels');
const Withdrawal = require('../db/model/withdraw');

const { Quizdata } = require('../db/model/quizdatamodel');

router.use(bodyParser.json());
router.get('/', async (req, res) => {
    res.send('siddiqkolimi..');
})
router.use(express.static('public'));


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

router.delete('/quiz/:class1/:subject/:chapter', async (req, res) => {
    const { class1, subject, chapter } = req.params;

    try {
        // Find and delete the quiz based on class, subject, and chapter
        const deletedQuiz = await Quiz.findOneAndDelete({ class1, subject, chapter });

        if (!deletedQuiz) {
            // If the quiz is not found, return a 404 status
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Respond with a success message or other appropriate response
        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete a quiz by class, subject, chapter, and question
router.delete('/quiz/:class1/:subject/:chapter/:question', async (req, res) => {
    const { class1, subject, chapter, question } = req.params;
    console.log('Deleting quiz with parameters:', { class1, subject, chapter, question });

    try {
        // Find and delete the quiz based on class, subject, chapter, and question
        const deletedQuiz = await Quiz.findOneAndDelete({ class1, subject, chapter, question });

        if (!deletedQuiz) {
            // If the quiz is not found, return a 404 status
            return res.status(404).json({ message: 'Quiz not found' });
        }

        // Respond with a success message or other appropriate response
        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




router.post('/quizdata', async (req, res) => {
    try {
        console.log('Received POST request for /quizdata');
        const quizDataArray = req.body;

        if (!Array.isArray(quizDataArray)) {
            console.log('Invalid request format. Expecting an array.');
            return res.status(400).json({ message: 'Invalid request format. Expecting an array.' });
        }

        const createdQuizzes = [];

        for (const quizData of quizDataArray) {
            console.log('Processing quiz data:', quizData);
            const {
                boardName,
                className,
                subject,
                chapter,
                question,
                correct_answer,
                incorrect_answers,
            } = quizData;

            const quiz = new Quizdata({
                boardName,
                className,
                subject,
                chapter,
                question,
                correct_answer,
                incorrect_answers,
            });

            const newQuiz = await quiz.save();
            console.log('Quiz saved:', newQuiz);

            createdQuizzes.push(newQuiz);
        }

        console.log('Sending response:', createdQuizzes);
        res.status(201).json(createdQuizzes);
    } catch (error) {
        console.error('Error:', error);
        res.status(400).json({ message: error.message });
    }
});
router.get('/quizform', (req, res) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Quiz Form</title>
        <style>
            /* Style for the form */
            #quizForm {
                max-width: 500px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f9f9f9;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            /* Style for form labels */
            label {
                display: block;
                margin-bottom: 10px;
            }

            /* Style for input fields */
            select, input[type="text"],
            textarea {
                width: 100%;
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
            }

            /* Style for submit button */
            button[type="submit"] {
                background-color: #4CAF50;
                color: white;
                padding: 12px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }

            /* Hover effect for submit button */
            button[type="submit"]:hover {
                background-color: #45a049;
            }

            /* Style for error message */
            .error-message {
                color: red;
                margin-top: 10px;
            }
        </style>
    </head>
    <body>
        <h2>Quiz Form</h2>
        <form id="quizForm" action="/quizdata" method="post">
            <label for="boardName">Board Name:</label>
            <select id="boardName" name="boardName" required>
                <option value="">Select Board Name</option>
                <option value="Andrha Pradesh">Andrha Pradesh</option>
                <option value="Karnataka">Karnataka</option>
                <!-- Add more options as needed -->
            </select><br><br>

            <label for="className">Class Name:</label>
            <select id="className" name="className" required>
                <option value="">Select Class Name</option>
                <option value="10thClass">10thClass</option>
                <option value="9thClass">9thClass</option>
                <option value= "8thClass">8thClass</option>
                <option value="7thClass">7thClass</option>
                <option value="6thClass">6thClass</option>
                <!-- Add more options as needed -->
            </select><br><br>

            <label for="subject">Subject:</label>
            <input type="text" id="subject" name="subject" required><br><br>

            <label for="chapter">Chapter:</label>
            <input type="text" id="chapter" name="chapter" required><br><br>

            <label for="question">Question:</label>
            <textarea id="question" name="question" rows="4" cols="50" required></textarea><br><br>

            <label for="correctAnswer">Correct Answer:</label>
            <input type="text" id="correctAnswer" name="correct_answer" required><br><br>

            <label for="incorrectAnswers">Incorrect Answers:</label>
            <textarea id="incorrectAnswers" name="incorrect_answers" rows="4" cols="50" required></textarea><br><br>

            <button type="submit">Submit</button>
        </form>

        <script>
            // JavaScript code for handling form submission and clearing input fields
            document.getElementById("quizForm").addEventListener("submit", async function(event) {
                event.preventDefault(); // Prevent the default form submission

                const form = event.target;
                const formData = new FormData(form);

                try {
                    const response = await fetch('/quizdata', {
                        method: 'POST',
                        body: JSON.stringify([Object.fromEntries(formData.entries())]), // Wrap the form data in an array
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log('Quiz data stored:', data);
                        // Clear input fields after successful submission
                        form.reset();
                    } else {
                        console.error('Failed to store quiz data:', response.statusText);
                        // Handle error
                    }
                } catch (error) {
                    console.error('Error storing quiz data:', error.message);
                    // Handle error
                }
            });
        </script>
    </body>
    </html>
    `;
    res.send(htmlContent);
});


router.get('/quizdata', async (req, res) => {
    try {
        const quizdata = await Quizdata.find();
        const formattedQuizzes = quizdata.map((quiz) => ({
            boardName: quiz.boardName,
            className: quiz.className,
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


router.get('/quizdata/:boardName/:className', async (req, res) => {
    const { boardName, className } = req.params;

    try {
        const quizdata = await Quizdata.find({ boardName, className });
        const formattedQuizzes = quizdata.map((quiz) => ({
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

router.get('/quizdata/:boardName/:className/:subject', async (req, res) => {
    const { boardName, className, subject } = req.params;

    try {
        const quizdata = await Quizdata.find({ boardName, className, subject });
        const formattedQuizzes = quizdata.map((quiz) => ({
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
router.get('/delete_quizdata', (req, res) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Delete Quiz</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }

                .container {
                    max-width: 600px;
                    margin: 50px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }

                h2 {
                    margin-top: 0;
                }

                form {
                    display: flex;
                    flex-direction: column;
                }

                label {
                    margin-bottom: 8px;
                }

                input[type="text"] {
                    padding: 10px;
                    margin-bottom: 16px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                }

                button[type="submit"] {
                    padding: 12px 20px;
                    background-color: #007bff;
                    color: #fff;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }

                button[type="submit"]:hover {
                    background-color: #0056b3;
                }

                #message {
                    margin-top: 16px;
                }

                @media (max-width: 768px) {
                    .container {
                        max-width: 90%;
                    }
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Delete Quiz</h2>
                <form id="deleteQuizForm">
                    <label for="question">Question:</label>
                    <input type="text" id="question" name="question">
                    <button type="submit">Delete Quiz</button>
                </form>
                <p id="message"></p>
            </div>

            <script>
                document.getElementById("deleteQuizForm").addEventListener("submit", async function(event) {
                    event.preventDefault();
                    const question = document.getElementById("question").value.trim();

                    try {
                        const response = await fetch(\`/quizdata/\${question}\`, {
                            method: 'DELETE',
                        });
                        const data = await response.json();
                        if (response.ok) {
                            document.getElementById("message").textContent = data.message;
                        } else {
                            document.getElementById("message").textContent = data.message || "Error deleting quiz";
                        }
                    } catch (error) {
                        console.error(error);
                        document.getElementById("message").textContent = "Error deleting quiz";
                    }
                });
            </script>
        </body>
        </html>
    `;

    res.send(htmlContent);
});

router.get('/quizdata/:boardName/:className/:subject/:chapter', async (req, res) => {
    const { boardName, className, subject, chapter } = req.params;

    try {
        const quizdata = await Quizdata.find({ boardName, className, subject, chapter });
        const formattedQuizzes = quizdata.map((quiz) => ({

            question: quiz.question,
            correct_answer: quiz.correct_answer,
            incorrect_answers: quiz.incorrect_answers,
        }));
        res.json({ response_code: 0, results: formattedQuizzes });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Route to handle DELETE request for deleting quiz
router.delete('/quizdata/:question', async (req, res) => {
    const { boardName, className, subject, chapter, question } = req.params;
    console.log('Deleting quiz with parameters:', { boardName, className, subject, chapter, question });

    try {
        const deletedQuiz = await Quizdata.findOneAndDelete({ question });

        if (!deletedQuiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



module.exports = router;

