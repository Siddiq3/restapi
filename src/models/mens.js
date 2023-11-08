const mongoose = require("mongoose");

const menSchema = new mongoose.Schema({


    /* ranking: {
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
 
     }, */
    type: {
        type: String,
        required: true
    },
    jobid: {
        type: Number,
        required: true,

    },
    companylogo: {
        type: String,
        required: true,

    },

    jobtitle: {
        type: String,
        required: true

    },

    jobdetails: {
        type: String,
        required: true

    },
    jobname: {
        type: String,
        required: true,


    },
    aboutcompanyH: {
        type: String,
        required: true,


    },
    aboutcompany: {
        type: String,
        required: true,


    },

    jobdescH: {
        type: String,
        required: true,


    },

    jobdesc: {
        type: String,
        required: true,


    },

    jobprofileH: {
        type: String,
        required: true,


    },

    jobprofile: {
        type: String,
        required: true,


    },

    jobtypeH: {
        type: String,
        required: true,


    },

    jobtype: {
        type: String,
        required: true,


    },

    jobdegreeH: {
        type: String,
        required: true,


    },

    jobdegree: {
        type: String,
        required: true,


    },

    joblocH: {
        type: String,
        required: true,


    },
    jobloc: {
        type: String,
        required: true,


    },

    jobexpH: {
        type: String,
        required: true,


    },

    jobexp: {
        type: String,
        required: true,


    },


    educandskillH: {
        type: String,
        required: true,

    },
    educandskill: {
        type: Array,
        required: true,


    },
    rolesandresH: {
        type: String,
        required: true,


    },

    rolesandres: {
        type: Array,
        required: true,


    },


    apply: {
        type: String,
        required: true,


    },
    date: {
        type: Date,
        required: true,
        default: new Date().toUTCString()
    }


})
//creating collection
const MensRanking = new mongoose.model("MenRanking", menSchema)

module.exports = MensRanking;

/*jobid: {
        type: Number,
        required: true,
        unique: true
    },

    title: {
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
        

    },
    apply: {
        type: String,
        required: true,
        trim: true

    }, */