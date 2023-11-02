const mongoose = require("mongoose");

const menSchema = new mongoose.Schema({


    ranking: {
        type: Number,
        required: true

    },
    name: {
        type: String,
        required: true,


    },

    dob: {
        type: Date,
        required: true,


    },

    country: {
        type: String,
        required: true,


    },

    score: {
        type: Number,
        required: true,


    },
    event: {
        type: String,
        default: "100m"

    },


})
//creating collection
const MensRanking = new mongoose.model("MenRanking", menSchema)

module.exports = MensRanking;

/*image: {
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

    }, */