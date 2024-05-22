const express = require('express');
require('dotenv').config();
const cors = require('cors');
require('./db/conn'); // Ensure this points to your actual database connection file

const quizRouter = require('./router/quizrouter');
const authRouter = require('./router/authRouter');
const propertyRouter = require('./router/propertyRouter');

// Import the email service
const { sendBuyerEmail, sendSellerEmail } = require('./services/emailService');

const app = express();

// Dynamic port
const port = process.env.PORT || 1303;

app.use(express.json());
app.use(cors({
    origin: 'https://api.way2employee.com' // Replace with your frontend URL
  }));

// Existing routes
app.use(quizRouter);

// New routes for Rentify
app.use('/api/auth', authRouter);
app.use('/api/properties', propertyRouter);

// Route for sending emails when buyer is interested
app.post('/api/interested', (req, res) => {
  // Get buyer and seller details from request body
  const { buyerEmail, sellerEmail, sellerDetails, buyerDetails } = req.body;

  // Send emails to buyer and seller
  sendBuyerEmail(buyerEmail, sellerDetails);
  sendSellerEmail(sellerEmail, buyerDetails);

  // Respond with success message or handle errors
  res.json({ message: 'Emails sent successfully' });
});

app.listen(port, () => {
    console.log(`Connection is live at port no. ${port}`);
});
