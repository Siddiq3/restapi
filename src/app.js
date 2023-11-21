const express = require('express');
const cors = require('cors');
const MenRanking = require('./models/jobsmodel');
require("../src/db/conn");



const router = require('./routers/jobrouter');
const app = express();
//dynamic port
const port = process.env.PORT || 3001;


app.use(express.json());
app.use(cors());
app.use(router);
app.listen(port,
    () => {
        console.log((`connection is live at port no.${port}`));
    })


