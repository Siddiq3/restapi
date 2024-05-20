const express = require("express");
const mongoose = require('mongoose');
const router = new express.Router();
const bodyParser = require('body-parser');
const Withdrawal = require('../db/model/withdraw');
const { User } = require('../db/model/register');
const { Quizdata } = require('../db/model/quizdatamodel');
const { Admission } = require('../db/model/admission');
const { Attendance } = require('../db/model/attendence');
const otpGenerator = require('otp-generator');
const twilio = require('twilio');
const { Exam } = require('../db/model/exam');
const axios = require('axios');

const Notification = require('../db/model/notification');
const Homework = require('../db/model/homework');



const otpSchema = new mongoose.Schema({
    parentPhoneNumber: String,
    otp: String,
});
const OTP = mongoose.model('OTP', otpSchema);

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Quiz } = require('../db/model/quizmodels');
router.use(bodyParser.json());


const formatDate = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
};


router.get('/', async (req, res) => {
    res.send('siddiqkolimi..');
})
router.use(express.static('public'));
router.use(express.urlencoded({ extended: true }));

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
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
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




//admission 


// Route to render the admission form
router.get('/admissionform', (req, res) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Admission Form</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }

            #admissionForm {
                max-width: 500px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            h2 {
                text-align: center;
            }

            label {
                display: block;
                margin-bottom: 10px;
                font-weight: bold;
            }

            input[type="text"],
            input[type="email"],
            select,
            textarea,
            input[type="number"],
            input[type="date"] {
                width: calc(100% - 22px);
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
            }

            select {
                height: 40px;
            }

            textarea {
                resize: vertical;
            }

            button[type="submit"] {
                background-color: #4CAF50;
                color: white;
                padding: 12px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
                font-size: 16px;
                transition: background-color 0.3s;
            }

            button[type="submit"]:hover {
                background-color: #45a049;
            }

            /* Error Message */
            .error-message {
                color: red;
                font-size: 12px;
                margin-top: 5px;
            }
        </style>
        <script>
            // Client-side validation function
            function validateForm() {
                const admissionNumber = document.getElementById('admissionNumber').value;
                const firstName = document.getElementById('firstName').value;
                const lastName = document.getElementById('lastName').value;
                const parentName = document.getElementById('parentName').value;
                const parentPhoneNumber = document.getElementById('parentPhoneNumber').value;
                const class = document.getElementById('class').value;
                const section = document.getElementById('section').value;
                const dob = document.getElementById('dob').value;
                const address = document.getElementById('address').value;
                const totalFee = document.getElementById('totalFee').value;
                const paidFee = document.getElementById('paidFee').value;
                const remainingFee = document.getElementById('remainingFee').value;
                const paidDate = document.getElementById('paidDate').value;
                const remainingFeeDueDate = document.getElementById('remainingFeeDueDate').value;

                // Perform validation
                if (!admissionNumber || !firstName || !lastName || !parentName || !parentPhoneNumber || !class || !section || !dob || !address || !totalFee || !paidFee || !remainingFee || !paidDate || !remainingFeeDueDate) {
                    alert('All fields are required');
                    return false;
                }

                // Set username and password fields
                document.getElementById('username').value = parentPhoneNumber;
                document.getElementById('password').value = dob;

                return true;
            }
        </script>
    </head>
    <body>
        <h2>Rankers Admission Form</h2>
        <form id="admissionForm" action="/submitadmission" method="post" onsubmit="return validateForm()">
            <label for="admissionNumber">Admission Number:</label>
            <input type="text" id="admissionNumber" name="admissionNumber" required>

            <label for="firstName">First Name:</label>
            <input type="text" id="firstName" name="firstName" required>

            <label for="lastName">Last Name:</label>
            <input type="text" id="lastName" name="lastName" required>
            
            <label for="dob">Date of Birth:</label>
            <input type="date" id="dob" name="dob" required>

            <label for="parentName">Parent Name:</label>
            <input type="text" id="parentName" name="parentName" required>

            <label for="parentPhoneNumber">Parent Phone Number:</label>
            <input type="text" id="parentPhoneNumber" name="parentPhoneNumber" required>

            <label for="className">Class:</label>
<select id="className" name="className" required>
    <option value="">Select Class</option>
    <option value="NMMS">NMMS</option>
</select>


            <label for="section">Section:</label>
            <select id="Section" name="section" required>
                <option value="">Select section</option>                                
                <option value="Section A">Section A</option>
                
            </select>

            <label for="totalFee">Total Fee:</label>
            <input type="number" id="totalFee" name="totalFee" required>

            <label for="paidFee">Paid Fee:</label>
            <input type="number" id="paidFee" name="paidFee" required>

            <label for="remainingFee">Remaining Fee:</label>
            <input type="number" id="remainingFee" name="remainingFee" required>

            <label for="paidDate">Paid Date:</label>
            <input type="date" id="paidDate" name="paidDate" required>

            <label for="remainingFeeDueDate">Remaining Fee Due Date:</label>
            <input type="date" id="remainingFeeDueDate" name="remainingFeeDueDate" required>

            <label for="address">Address:</label>
            <textarea id="address" name="address" rows="4" cols="50" required></textarea>

            <!-- Hidden fields for username and password -->
            <input type="hidden" id="username" name="username">
            <input type="hidden" id="password" name="password">

            <button type="submit">Submit</button>
        </form>
    </body>
    </html>
    `;
    res.send(htmlContent);
});

// Route to handle form submission
const convertToISODate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`);
};

// Route to handle form submission
router.post('/submitadmission', async (req, res) => {
    // Extract data from the form submission
    const { admissionNumber, firstName, lastName, dob, parentName, parentPhoneNumber, className, section, totalFee, paidFee, remainingFee, paidDate, remainingFeeDueDate, address } = req.body;

    try {
        // Convert dates to ISO format
        const isoDOB = convertToISODate(dob);
        const isoPaidDate = convertToISODate(paidDate);
        const isoRemainingFeeDueDate = convertToISODate(remainingFeeDueDate);

        // Create a new admission instance
        const admission = new Admission({
            admissionNumber,
            firstName,
            lastName,
            dob: isoDOB,
            parentName,
            parentPhoneNumber,
            class: className, // Rename variable to className
            section,
            totalFee,
            paidFee,
            remainingFee,
            paidDate: isoPaidDate,
            remainingFeeDueDate: isoRemainingFeeDueDate,
            address,
            username: parentPhoneNumber,
            password: dob // Use original dob as the password
        });

        // Save the admission data to the database
        await admission.save();

        res.send('Admission form submitted successfully!');
    } catch (error) {
        console.error('Error submitting admission form:', error);
        res.status(500).send('Internal Server Error');
    }
});



// Route to display admission details in a table
// Route to display admission details in a table
router.get('/admissiondetails', async (req, res) => {
    try {
        // Fetch all admission records from the database
        const admissions = await Admission.find();

        // Prepare HTML content for displaying admission details in a table
        let htmlContent = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Ranker's Admission Details</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }

                    h2 {
                        text-align: center;
                        margin-top: 20px;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }

                    th, td {
                        padding: 12px 15px;
                        text-align: left;
                        border-bottom: 1px solid #ddd;
                    }

                    th {
                        background-color: #f2f2f2;
                    }

                    tr:hover {
                        background-color: #f2f2f2;
                    }
                </style>
            </head>
            <body>
                <h2>Rankers Admission Details</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Admission Number</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Date of Birth</th>
                            <th>Parent Name</th>
                            <th>Parent Phone Number</th>
                            <th>Class</th>
                            <th>Section</th>
                            <th>Total Fee</th>
                            <th>Paid Fee</th>
                            <th>Paid Date</th>
                            <th>Remaining Fee</th>
                            <th>Remaining Fee Due Date</th>
                            <th>Address</th>
                            <th>Username</th>
                            <th>Password</th>
                        </tr>
                    </thead>
                    <tbody>`;

        // Loop through admission records and add table rows
        admissions.forEach(admission => {
            htmlContent += `
                <tr>
                    <td>${admission.admissionNumber}</td>
                    <td>${admission.firstName}</td>
                    <td>${admission.lastName}</td>
                    <td>${formatDate(admission.dob)}</td>
                    <td>${admission.parentName}</td>
                    <td>${admission.parentPhoneNumber}</td>
                    <td>${admission.class}</td>
                    <td>${admission.section}</td>
                    <td>${admission.totalFee}</td>
                    <td>${admission.paidFee}</td>
                    <td>${formatDate(admission.paidDate)}</td>
                    <td>${admission.remainingFee}</td>
                    <td>${formatDate(admission.remainingFeeDueDate)}</td>
                    <td>${admission.address}</td>
                    <td>${admission.username}</td>
                    <td>${admission.password}</td>
                </tr>`;
        });

        // Close the HTML content
        htmlContent += `
                    </tbody>
                </table>
            </body>
            </html>`;

        // Send the HTML content as response
        res.send(htmlContent);
    } catch (error) {
        console.error('Error fetching admission details:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/admissiondetailsjson', async (req, res) => {
    try {
        // Fetch all admission records from the database
        const admissions = await Admission.find();

        // Convert admission records to JSON format
        const admissionData = admissions.map(admission => ({
            admissionNumber: admission.admissionNumber,
            firstName: admission.firstName,
            lastName: admission.lastName,
            dob: formatDate(admission.dob),
            parentName: admission.parentName,
            parentPhoneNumber: admission.parentPhoneNumber,
            class: admission.class,
            section: admission.section,
            totalFee: admission.totalFee,
            paidFee: admission.paidFee,
            paidDate: formatDate(admission.paidDate),
            remainingFee: admission.remainingFee,
            remainingFeeDueDate: formatDate(admission.remainingFeeDueDate),
            address: admission.address,
            username: admission.username,
            password: admission.password
        }));

        // Send the admission data in JSON format as response
        res.json(admissionData);
    } catch (error) {
        console.error('Error fetching admission details:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;



// Route to render the delete admission data page
router.get('/deleteadmission', (req, res) => {
    // HTML content for the delete admission data page
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Delete Admission Data</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }
    
            h2 {
                text-align: center;
            }
    
            form {
                max-width: 400px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
    
            label {
                display: block;
                margin-bottom: 10px;
                font-weight: bold;
            }
    
            input[type="text"] {
                width: 100%;
                padding: 10px;
                margin-bottom: 20px;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
            }
    
            button[type="submit"] {
                background-color: #f44336;
                color: white;
                padding: 12px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
                font-size: 16px;
            }
    
            button[type="submit"]:hover {
                background-color: #d32f2f;
            }
        </style>
    </head>
    <body>
        <h2>Rankers Delete Admission Data</h2>
        <form action="/deleteadmissiondata" method="post">
            <label for="admissionNumber">Enter Admission Number to Delete:</label>
            <input type="text" id="admissionNumber" name="admissionNumber" required>
            <button type="submit">Delete</button>
        </form>
    </body>
    </html>
    
    `;

    // Send the HTML content as the response
    res.send(htmlContent);
});

// Route to delete admission data by admission number
// Route to handle deletion of admission data
// Route to handle deletion of student data
router.post('/deleteadmissiondata', async (req, res) => {
    const admissionNumber = req.body.admissionNumber;

    try {
        // Find the student record with the provided admission number and delete it
        const deletedStudent = await Admission.findOneAndDelete({ admissionNumber });

        if (!deletedStudent) {
            return res.status(404).send('Student data not found.');
        }

        res.send('Student data deleted successfully.');
    } catch (error) {
        console.error('Error deleting student data:', error);
        res.status(500).send('Internal Server Error');
    }
});


//search student 
router.get('/searchstudent', async (req, res) => {
    // Check if admission number is provided in the query parameters
    const admissionNumber = req.query.admissionNumber;

    if (!admissionNumber) {
        // Render the search form if admission number is not provided
        const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Search Student</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }
                h2 {
                    text-align: center;
                    margin-top: 20px;
                }
                form {
                    max-width: 400px;
                    margin: 20px auto;
                    padding: 20px;
                    background-color: #fff;
                    border-radius: 5px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                input[type="text"] {
                    width: calc(100% - 82px);
                    padding: 10px;
                    margin-bottom: 20px;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-sizing: border-box;
                }
                button[type="submit"] {
                    width: 80px;
                    padding: 12px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    background-color: #4CAF50;
                    color: white;
                    font-size: 16px;
                    transition: background-color 0.3s;
                }
                button[type="submit"]:hover {
                    background-color: #45a049;
                }
            </style>
        </head>
        <body>
            <h2>Search Student</h2>
            <form action="/searchstudent" method="get">
                <input type="text" name="admissionNumber" placeholder="Enter Admission Number" required>
                <button type="submit">Search</button>
            </form>
        </body>
        </html>
        
        `;
        res.send(htmlContent);
    } else {
        try {
            // Find the student record with the provided admission number
            const student = await Admission.findOne({ admissionNumber });

            if (!student) {
                // If student record not found, display an error message
                const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Search Student</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        h2 {
                            text-align: center;
                            margin-top: 20px;
                        }
                        p {
                            text-align: center;
                            margin-top: 20px;
                            font-size: 18px;
                        }
                        
                        a {
                            display: block;
                            text-align: center;
                            margin-top: 20px;
                            text-decoration: none;
                            color: #4CAF50;
                            font-size: 16px;
                        }
                        a:hover {
                            text-decoration: underline;
                        }
                    </style>
                </head>
                <body>
                    <h2>Search Student</h2>
                    <p>Student with admission number ${admissionNumber} not found.</p>
                    <a href="/searchstudent">Back to Search</a>
                </body>
                </html>
                
                `;
                res.send(htmlContent);
            } else {
                // Format dates
                const formattedDOB = new Date(student.dob).toLocaleDateString('en-GB');
                const formattedPaidDate = new Date(student.paidDate).toLocaleDateString('en-GB');
                const formattedRemainingFeeDueDate = new Date(student.remainingFeeDueDate).toLocaleDateString('en-GB');

                // If student record found, display the student details in a table
                const htmlContent = `
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Search Student</title>
                    <style>
                        /* Styles for the table */
                        table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 20px;
                        }
                        th, td {
                            padding: 12px 15px;
                            text-align: left;
                            border-bottom: 1px solid #ddd;
                        }
                        th {
                            background-color: #f2f2f2;
                        }
                        tr:hover {
                            background-color: #f2f2f2;
                        }
                    </style>
                </head>
                <body>
                    <h2>Student Details</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Admission Number</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Date of Birth</th>
                                <th>Parent Name</th>
                                <th>Parent Phone Number</th>
                                <th>Course</th>
                                <th>Total Fee</th>
                                <th>Paid Fee</th>
                                <th>Paid Date</th>
                                <th>Remaining Fee</th>
                                <th>Remaining Fee Due Date</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>${student.admissionNumber}</td>
                                <td>${student.firstName}</td>
                                <td>${student.lastName}</td>
                                <td>${formattedDOB}</td>
                                <td>${student.parentName}</td>
                                <td>${student.parentPhoneNumber}</td>
                                <td>${student.course}</td>
                                <td>${student.totalFee}</td>
                                <td>${student.paidFee}</td>
                                <td>${formattedPaidDate}</td>
                                <td>${student.remainingFee}</td>
                                <td>${formattedRemainingFeeDueDate}</td>
                                <td>${student.address}</td>
                            </tr>
                        </tbody>
                    </table>
                    <a href="/searchstudent">Back to Search</a>
                </body>
                </html>
                `;
                res.send(htmlContent);
            }
        } catch (error) {
            console.error('Error searching student:', error);
            res.status(500).send('Internal Server Error');
        }
    }
});



router.get('/RankersAcademy', (req, res) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Main Page</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            h2 {
                text-align: center;
                margin-bottom: 20px;
                color: #333;
            }

            .button-container {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }

            .button {
                padding: 12px 24px;
                background-color: #3711F5;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 16px;
                text-align: center;
                text-decoration: none;
                transition: background-color 0.3s;
                display: flex;
                justify-content: center;
                align-items: center;
            }

            .button:hover {
                background-color: #45a049;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>RANKERS ACADEMY, KUPPAM</h2>
            <div class="button-container">
                <a class="button" href="/admissionform">New Admission Form</a>
                <a class="button" href="/admissiondetails">Admission Details</a>
                <a class="button" href="/deleteadmission">Delete Student Data</a>
                <a class="button" href="/searchstudent">Search Student Details</a>
                <a class="button" href="/attendance">Student Attendance</a>
                <a class="button" href="/exam">Exam Results</a>
            </div>
        </div>
    </body>
    </html>
    `;
    res.send(htmlContent);
});



router.get('/attendance', (req, res) => {
    const formHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Record Attendance</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
            }
    
            .container {
                background-color: #fff;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                width: 400px;
            }
    
            h1 {
                text-align: center;
                margin-bottom: 20px;
            }
    
            label {
                font-weight: bold;
            }
    
            input[type="text"],
            input[type="date"],
            select {
                width: 100%;
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ccc;
                border-radius: 5px;
                box-sizing: border-box;
            }
    
            select {
                appearance: none;
            }
    
            button[type="submit"] {
                background-color: #007bff;
                color: #fff;
                border: none;
                border-radius: 5px;
                padding: 10px 20px;
                cursor: pointer;
                transition: background-color 0.3s;
            }
    
            button[type="submit"]:hover {
                background-color: #0056b3;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Record Attendance</h1>
            <form id="attendanceForm" action="/attendance" method="POST">
                <label for="admissionNumber">Admission Number:</label>
                <input type="text" id="admissionNumber" name="admissionNumber" required><br>
                <label for="date">Date:</label>
                <input type="date" id="date" name="date" required><br>
                <label for="status">Status:</label>
                <select id="status" name="status" required>
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                </select><br>
                <button type="submit">Submit</button>
            </form>
        </div>
    </body>
    </html>
    
    `;
    res.send(formHtml);
});

// Route to record attendance from form submission
router.post('/attendance', async (req, res) => {
    try {
        const { admissionNumber, date, status } = req.body;

        // Check if admission number exists
        const admission = await Admission.findOne({ admissionNumber });
        if (!admission) {
            return res.status(404).json({ message: 'Admission number not found' });
        }

        // Create new attendance record
        const attendance = new Attendance({
            admissionNumber,
            date,
            status
        });

        // Save attendance record
        await attendance.save();
        res.status(201).json({ message: 'Attendance recorded successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Route to get attendance for a specific admission number
router.get('/attendance/:admissionNumber', async (req, res) => {
    try {
        const { admissionNumber } = req.params;

        // Find attendance records for the specified admission number
        const attendance = await Attendance.find({ admissionNumber });

        res.status(200).json({ attendance });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});




// Route to handle submission of exam form
router.get('/exam', (req, res) => {
    const formHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Create Exam for Student</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f5f5f5;
                margin: 0;
                padding: 0;
            }
            
            .container {
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            h1 {
                text-align: center;
                margin-bottom: 20px;
                color: #333;
            }
            
            form {
                margin-bottom: 20px;
            }
            
            label {
                display: block;
                margin-bottom: 5px;
                color: #666;
            }
            
            input[type="text"],
            input[type="number"],
            input[type="date"] {
                width: calc(100% - 10px);
                padding: 8px;
                margin-bottom: 10px;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
            }
            
            #subjectsContainer {
                margin-bottom: 20px;
            }
            
            #subjectsContainer label {
                display: inline-block;
                width: 100px;
                margin-right: 10px;
            }
            
            #subjectsContainer input {
                width: calc(50% - 10px);
            }
            
            #addSubjectButton {
                background-color: #007bff;
                color: #fff;
                border: none;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin-bottom: 20px;
                cursor: pointer;
                border-radius: 4px;
            }
            
            button[type="submit"] {
                background-color: #4CAF50;
                color: white;
                border: none;
                padding: 10px 20px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                cursor: pointer;
                border-radius: 4px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Exam Marks For Students</h1>
            <form id="examForm" action="/exams" method="POST">
                <label for="studentAdmissionNumber">Student Admission Number:</label>
                <input type="text" id="studentAdmissionNumber" name="admissionNumber" required><br><br>
                <label for="examType">Exam Type:</label>
                <input type="text" id="examType" name="examType" required><br><br>
                <label for="date">Date:</label>
                <input type="date" id="date" name="date" required><br><br>
                <div id="subjectsContainer">
                    <label for="subject1">Subject 1:</label>
                    <input type="text" id="subject1" name="subjects[0][name]" required>
                    <label for="marks1">Marks:</label>
                    <input type="number" id="marks1" name="subjects[0][marks]" required><br><br>
                </div>
                <button type="button" id="addSubjectButton">Add Subject</button><br><br>
                <label for="totalMarks">Total Marks:</label>
                <input type="number" id="totalMarks" name="totalMarks" required><br><br>
                <label for="rank">Rank:</label>
                <input type="number" id="rank" name="rank" required><br><br>
                <button type="submit">Submit</button>
            </form>
        </div>
    
        <script>
            // JavaScript function to add subject fields dynamically
            let subjectCounter = 1;
            document.getElementById('addSubjectButton').addEventListener('click', () => {
                subjectCounter++;
                const subjectsContainer = document.getElementById('subjectsContainer');
                const subjectDiv = document.createElement('div');
                subjectDiv.innerHTML = 
                    '<label for="subject' + subjectCounter + '">Subject ' + subjectCounter + ':</label>' +
                    '<input type="text" id="subject' + subjectCounter + '" name="subjects[' + (subjectCounter - 1) + '][name]" required>' +
                    '<label for="marks' + subjectCounter + '">Marks:</label>' +
                    '<input type="number" id="marks' + subjectCounter + '" name="subjects[' + (subjectCounter - 1) + '][marks]" required><br><br>';
                subjectsContainer.appendChild(subjectDiv);
            });
        </script>
    </body>
    </html>
    `;
    res.send(formHtml);
});


// Route to handle submission of exam form
router.post('/exams', async (req, res) => {
    try {
        const { admissionNumber, examType, date, subjects, totalMarks, rank } = req.body;

        // Check if admission number is provided
        if (!admissionNumber) {
            return res.status(400).json({ message: 'Admission number is required' });
        }

        // Find the admission record associated with the provided admission number
        const admission = await Admission.findOne({ admissionNumber });

        if (!admission) {
            return res.status(400).json({ message: 'Admission not found' });
        }

        // Check if an exam already exists for this admission and exam type
        const existingExam = await Exam.findOne({ admissionNumber, examType });
        if (existingExam) {
            return res.status(400).json({ message: 'An exam already exists for this admission with the same exam type' });
        }

        // Create new exam record
        const exam = new Exam({ admissionNumber, examType, date, subjects, totalMarks, rank });

        // Save exam record to the database
        await exam.save();

        // Send response
        res.status(201).json({ message: 'Exam stored successfully', exam });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


router.get('/examdata', async (req, res) => {
    try {
        // Find all exams
        const exams = await Exam.find();

        // Send response
        res.status(200).json({ exams });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});



router.get('/delete-exam', (req, res) => {
    const formHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Delete Exam</title>
        <style>
            /* Your CSS styles here */
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Delete Exam</h1>
            <form id="deleteExamForm" action="/delete-exam" method="POST">
                <label for="examType">Exam Type:</label>
                <input type="text" id="examType" name="examType" required><br><br>
                <button type="submit">Delete Exam</button>
            </form>
        </div>
    </body>
    </html>
    `;
    res.send(formHtml);
});



router.post('/delete-exam', async (req, res) => {
    try {
        const { examType } = req.body;

        // Find the exam by type and delete it
        const deletedExam = await Exam.findOneAndDelete({ examType });

        if (!deletedExam) {
            return res.status(404).send(`<h2>Exam not found</h2><a href="/delete-exam">Go back to delete exam</a>`);
        }

        // Render HTML with success message
        const successMessage = 'Exam deleted successfully';
        const formHtml = generateDeleteExamForm(successMessage);
        res.send(formHtml);
    } catch (error) {
        console.error(error);
        // Render HTML with error message
        const errorMessage = 'Internal server error';
        const formHtml = generateDeleteExamForm(errorMessage);
        res.status(500).send(formHtml);
    }
});

// Function to generate HTML form for deleting exam with message
function generateDeleteExamForm(message) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Delete Exam</title>
        <style>
            /* Your CSS styles here */
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Delete Exam</h1>
            ${message ? `<div>${message}</div>` : ''}
            <form id="deleteExamForm" action="/delete-exam" method="POST">
                <label for="examType">Exam Type:</label>
                <input type="text" id="examType" name="examType" required><br><br>
                <button type="submit">Delete Exam</button>
            </form>
        </div>
    </body>
    </html>
    `;
}





router.get('/notification', (req, res) => {
    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Create Notification</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 0;
            }

            .container {
                max-width: 500px;
                margin: 20px auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }

            h2 {
                text-align: center;
                margin-bottom: 20px;
            }

            label {
                display: block;
                margin-bottom: 10px;
                font-weight: bold;
            }

            input[type="text"],
            textarea {
                width: calc(100% - 22px);
                padding: 10px;
                margin-bottom: 15px;
                border: 1px solid #ccc;
                border-radius: 4px;
                box-sizing: border-box;
            }

            textarea {
                resize: vertical;
            }

            button[type="submit"] {
                background-color: #4CAF50;
                color: white;
                padding: 12px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
                font-size: 16px;
                transition: background-color 0.3s;
            }

            button[type="submit"]:hover {
                background-color: #45a049;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h2>Create New Notification</h2>
            <form action="/notification" method="post">
                <label for="heading">Heading:</label>
                <input type="text" id="heading" name="heading" required>

                <label for="paragraphs">Paragraphs:</label>
                <textarea id="paragraphs" name="paragraphs" rows="5" required></textarea>

                <button type="submit">Submit</button>
            </form>
        </div>
    </body>
    </html>
    `;
    res.send(htmlContent);
});

// Route to handle form submission and save the notification to the database
router.post('/notification', async (req, res) => {
    try {
        // Extract data from the request body
        const { heading, paragraphs } = req.body;

        // Create a new instance of the Notification model with the extracted data
        const newNotification = new Notification({
            heading,
            paragraphs: paragraphs.split('\n') // Split paragraphs by new line for multiple paragraphs
        });

        // Save the new notification to the database
        const savedNotification = await newNotification.save();

        // Respond with a success message
        res.status(201).json({ message: 'Notification created successfully', notification: savedNotification });
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: 'An error occurred while creating the notification', error: error.message });
    }
});


router.get('/displaynotifications', async (req, res) => {
    try {
        // Fetch all notifications sorted by createdAt in descending order
        const notifications = await Notification.find().sort({ createdAt: -1 });

        // Respond with the notifications
        res.status(200).json(notifications);
    } catch (error) {
        // Handle any errors that occur during the process
        res.status(500).json({ message: 'An error occurred while fetching notifications', error: error.message });
    }
});

router.get('/addhomework', (req, res) => {
    const htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Add Homework</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    background-color: #f0f2f5;
                    margin: 0;
                    padding: 0;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 100vh;
                }
                .container {
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    width: 100%;
                    max-width: 600px;
                }
                h2 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 20px;
                }
                form {
                    display: flex;
                    flex-direction: column;
                }
                label {
                    font-weight: bold;
                    margin-bottom: 5px;
                }
                input[type="text"],
                textarea,
                input[type="date"] {
                    width: 100%;
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }
                textarea {
                    resize: vertical;
                }
                button {
                    padding: 10px 20px;
                    margin-top: 10px;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                #addSubject {
                    background-color: #007bff;
                    color: #fff;
                }
                #addSubject:hover {
                    background-color: #0056b3;
                }
                #submit {
                    background-color: #28a745;
                    color: #fff;
                }
                #submit:hover {
                    background-color: #218838;
                }
                .removeSubject {
                    background-color: #dc3545;
                    color: #fff;
                }
                .removeSubject:hover {
                    background-color: #c82333;
                }
                .subjectDescription {
                    border: 1px solid #ddd;
                    padding: 10px;
                    margin-bottom: 10px;
                    border-radius: 5px;
                    background-color: #f9f9f9;
                }
                .subjectDescription:last-child {
                    margin-bottom: 0;
                }
                .success-message {
                    color: green;
                    text-align: center;
                    margin-top: 20px;
                    display: none;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Add New Homework</h2>
                <form id="homeworkForm">
                    <div id="subjectFields">
                        <div class="subjectDescription">
                            <label for="class">Class:</label>
                            <input type="text" name="class[]" required>
                            <label for="section">Section:</label>
                            <input type="text" name="section[]" required>
                            <label for="subject">Subject:</label>
                            <input type="text" name="subject[]" required>
                            <label for="description">Description:</label>
                            <textarea name="description[]" rows="5" required></textarea>
                            <label for="dueDate">Due Date:</label>
                            <input type="date" name="dueDate[]" required>
                            <button type="button" class="removeSubject">Remove</button>
                        </div>
                    </div>
                    <button type="button" id="addSubject">Add Subject</button>
                    <button type="submit" id="submit">Submit</button>
                </form>
                <div class="success-message" id="successMessage">Homework successfully added!</div>
            </div>

            <script>
                document.addEventListener('DOMContentLoaded', () => {
                    const addSubjectButton = document.getElementById('addSubject');
                    const subjectFields = document.getElementById('subjectFields');
                    const homeworkForm = document.getElementById('homeworkForm');
                    const successMessage = document.getElementById('successMessage');

                    function removeSubjectDescription(event) {
                        if (event.target.classList.contains('removeSubject')) {
                            event.target.parentElement.remove();
                        }
                    }

                    addSubjectButton.addEventListener('click', () => {
                        const subjectDescription = document.createElement('div');
                        subjectDescription.classList.add('subjectDescription');
                        subjectDescription.innerHTML = \`
                            <label for="class">Class:</label>
                            <input type="text" name="class[]" required>
                            <label for="section">Section:</label>
                            <input type="text" name="section[]" required>
                            <label for="subject">Subject:</label>
                            <input type="text" name="subject[]" required>
                            <label for="description">Description:</label>
                            <textarea name="description[]" rows="5" required></textarea>
                            <label for="dueDate">Due Date:</label>
                            <input type="date" name="dueDate[]" required>
                            <button type="button" class="removeSubject">Remove</button>
                        \`;
                        subjectFields.appendChild(subjectDescription);
                        subjectDescription.querySelector('.removeSubject').addEventListener('click', removeSubjectDescription);
                    });

                    subjectFields.addEventListener('click', removeSubjectDescription);

                    homeworkForm.addEventListener('submit', (event) => {
                        event.preventDefault();

                        const formData = new FormData(homeworkForm);
                        const data = {
                            class: formData.getAll('class[]'),
                            section: formData.getAll('section[]'),
                            subject: formData.getAll('subject[]'),
                            description: formData.getAll('description[]'),
                            dueDate: formData.getAll('dueDate[]')
                        };

                        fetch('/addhomework', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(data)
                        })
                        .then(response => response.json())
                        .then(data => {
                            if (data.success) {
                                successMessage.style.display = 'block';
                                homeworkForm.reset();
                                subjectFields.innerHTML = \`
                                    <div class="subjectDescription">
                                        <label for="class">Class:</label>
                                        <input type="text" name="class[]" required>
                                        <label for="section">Section:</label>
                                        <input type="text" name="section[]" required>
                                        <label for="subject">Subject:</label>
                                        <input type="text" name="subject[]" required>
                                        <label for="description">Description:</label>
                                        <textarea name="description[]" rows="5" required></textarea>
                                        <label for="dueDate">Due Date:</label>
                                        <input type="date" name="dueDate[]" required>
                                        <button type="button" class="removeSubject">Remove</button>
                                    </div>
                                \`;
                            } else {
                                alert('An error occurred: ' + data.error);
                            }
                        })
                        .catch(error => {
                            console.error('Error:', error);
                            alert('An error occurred while submitting the form.');
                        });
                    });
                });
            </script>
        </body>
        </html>
    `;
    res.send(htmlContent);
});



router.post('/addhomework', async (req, res) => {
    try {
        const { class: classList, section, subject, description, dueDate } = req.body;

        if (!Array.isArray(classList) || !Array.isArray(section) || !Array.isArray(subject) || !Array.isArray(description) || !Array.isArray(dueDate)) {
            throw new Error('Invalid data format');
        }

        const homeworks = subject.map((sub, index) => ({
            class: classList[index],
            section: section[index],
            subject: sub,
            description: description[index],
            dueDate: new Date(dueDate[index])
        }));

        await Homework.insertMany(homeworks);
        res.json({ success: true, message: 'Homework successfully added' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred while creating homework', error: error.message });
    }
});

// New route to get homework data
router.get('/homework', async (req, res) => {
    try {
        const homeworks = await Homework.find({}).sort({ createdAt: -1 }); // Sort by `createdAt` in descending order
        res.json({ success: true, data: homeworks });
    } catch (error) {
        res.status(500).json({ success: false, message: 'An error occurred while retrieving homework', error: error.message });
    }
});


module.exports = router;

