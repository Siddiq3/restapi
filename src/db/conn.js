const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://siddiq:Siddiq03@cluster0.oadrcbo.mongodb.net/?retryWrites=true&w=majority').then(
    () => console.log('DB connect ')
).catch(err => console.log(err))
