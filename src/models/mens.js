const mongoose = require("mongoose");

const menSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true,
        unique: true
    },

    jobtitle: {
        type: String,
        required: true

    },
    jobname: {
        type: String,
        required: true,


    },

    aboutcompany: {
        type: String,
        required: true,


    },

    jobdesc: {
        type: String,
        required: true,


    },

    rolesandres: {
        type: String,
        required: true,


    },
    educ: {
        type: String,
        required: true,
        trim: true

    },
    apply: {
        type: String,
        required: true,
        trim: true

    },

})
//creating collection
const MensRanking = new mongoose.model("MenRanking", menSchema)

module.exports = MensRanking;