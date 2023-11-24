const mongoose = require('mongoose');
const encodedPassword = encodeURIComponent('Siddiq@03');

mongoose.connect(`mongodb+srv://siddiqkolimi:${encodedPassword}@quizapi.qrbkogz.mongodb.net/quiz_db`)
    .then(() => console.log('DB connect'))
    .catch(err => console.log(err));
