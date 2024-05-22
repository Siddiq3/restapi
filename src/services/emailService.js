// emailService.js
const nodemailer = require('nodemailer');

// Create a Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'your-email@gmail.com', // Your Gmail address
    pass: 'your-password' // Your Gmail password or app-specific password
  }
});

// Function to send email to buyer with seller details
const sendBuyerEmail = (buyerEmail, sellerDetails) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: buyerEmail,
    subject: 'Seller Details',
    html: `<p>Hello,</p><p>Here are the details of the seller:</p><p>Name: ${sellerDetails.name}</p><p>Email: ${sellerDetails.email}</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Function to send email to seller with buyer details
const sendSellerEmail = (sellerEmail, buyerDetails) => {
  const mailOptions = {
    from: 'your-email@gmail.com',
    to: sellerEmail,
    subject: 'Buyer Details',
    html: `<p>Hello,</p><p>Here are the details of the interested buyer:</p><p>Name: ${buyerDetails.name}</p><p>Email: ${buyerDetails.email}</p>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = { sendBuyerEmail, sendSellerEmail };
