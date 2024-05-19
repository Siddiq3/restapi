// models/Notification.js
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
    heading: {
        type: String,
        required: true
    },
    paragraphs: {
        type: [String],
        required: true
    }
});

module.exports = mongoose.model('Notification', notificationSchema);
