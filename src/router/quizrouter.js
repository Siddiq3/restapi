const express = require("express");
const router = new express.Router();
const bodyParser = require('body-parser');
const Withdrawal = require('../db/model/withdraw');
const { User } = require('../db/model/register');
const { Quizdata } = require('../db/model/quizdatamodel');
const { Admission } = require('../db/model/admission');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { Quiz } = require('../db/model/quizmodels');
router.use(bodyParser.json());

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



router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Hash the password before storing it in the database
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        // If user does not exist or password does not match, send error response
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, username: user.username }, 'your_secret_key');

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
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
                const course = document.getElementById('course').value;
                const dob = document.getElementById('dob').value;
                const address = document.getElementById('address').value;
                const totalFee = document.getElementById('totalFee').value;
                const paidFee = document.getElementById('paidFee').value;
                const remainingFee = document.getElementById('remainingFee').value;
                const paidDate = document.getElementById('paidDate').value;
                const remainingFeeDueDate = document.getElementById('remainingFeeDueDate').value;
    
                // Perform validation
                if (!admissionNumber || !firstName || !lastName || !parentName || !parentPhoneNumber || !course || !dob || !address || !totalFee || !paidFee || !remainingFee || !paidDate || !remainingFeeDueDate) {
                    alert('All fields are required');
                    return false;
                }
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
    
            <label for="course">Course:</label>
            <select id="course" name="course" required>
                <option value="">Select Course</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Engineering">Engineering</option>
                <!-- Add more options as needed -->
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
            <button type="submit">Submit</button>
        </form>
    </body>
    </html>
    
    `;
    res.send(htmlContent);
});


// Route to handle form submission
router.post('/submitadmission', async (req, res) => {
    // Extract data from the form submission
    const { admissionNumber, firstName, lastName, dob, parentName, parentPhoneNumber, course, totalFee, paidFee, remainingFee, paidDate, remainingFeeDueDate, address } = req.body;

    try {
        // Create a new admission instance
        const admission = new Admission({
            admissionNumber,
            firstName,
            lastName,
            dob,
            parentName,
            parentPhoneNumber,
            course,
            totalFee,
            paidFee,
            remainingFee,
            paidDate,
            remainingFeeDueDate,
            address
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
                            <th>Course</th>
                            <th>Total Fee</th>
                            <th>Paid Fee</th>
                             <th>Paid Date</th>
                            <th>Remaining Fee</th>
                            <th>Remaining Fee Due Date</th>
                            <th>Address</th>
                        </tr>
                    </thead>
                    <tbody>`;

        // Loop through admission records and add table rows
        admissions.forEach(admission => {
            // Format the date of birth
            const dob = new Date(admission.dob);
            const formattedDOB = `${dob.getDate()}/${dob.getMonth() + 1}/${dob.getFullYear()}`;

            // Format the paid date
            const paidDate = new Date(admission.paidDate);
            const formattedPaidDate = `${paidDate.getDate()}/${paidDate.getMonth() + 1}/${paidDate.getFullYear()}`;

            // Format the remaining fee due date
            const remainingFeeDueDate = new Date(admission.remainingFeeDueDate);
            const formattedRemainingFeeDueDate = `${remainingFeeDueDate.getDate()}/${remainingFeeDueDate.getMonth() + 1}/${remainingFeeDueDate.getFullYear()}`;

            htmlContent += `
                <tr>
                    <td>${admission.admissionNumber}</td>
                    <td>${admission.firstName}</td>
                    <td>${admission.lastName}</td>
                    <td>${formattedDOB}</td>
                    <td>${admission.parentName}</td>
                    <td>${admission.parentPhoneNumber}</td>
                    <td>${admission.course}</td>
                   <td>${admission.totalFee}</td>
                    <td>${admission.paidFee}</td>
                    <td>${formattedPaidDate}</td>
                    <td>${admission.remainingFee}</td>
                   <td>${formattedRemainingFeeDueDate}</td>
                    <td>${admission.address}</td>
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
        </div>
    </div>
</body>
</html>

    `;
    res.send(htmlContent);
});


module.exports = router;

