const express = require('express');
require('dotenv').config();
const cors = require('cors');
require('./db/conn'); // Ensure this points to your actual database connection file

const quizRouter = require('./router/quizrouter');
const authRouter = require('./router/authRouter');
const propertyRouter = require('./router/propertyRouter');

const app = express();

// Dynamic port
const port = process.env.PORT || 1303;

app.use(express.json());
app.use(cors());

// Existing routes
app.use(quizRouter);

// New routes for Rentify
app.use('/api/auth', authRouter);
app.use('/api/properties', propertyRouter);

app.listen(port, () => {
    console.log(`Connection is live at port no. ${port}`);
});
