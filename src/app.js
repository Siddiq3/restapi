const express = require('express');

const cors = require('cors');
const Quizapi = require('./db/model/quizmodels');
require("../src/db/conn");



const router = require('./router/quizrouter');
const app = express();


//dynamic port
const port = process.env.PORT || 1303;
app.use(express.json());
app.use(cors());
app.use(router);
app.listen(port,
    () => {
        console.log((`connection is live at port no.${port}`));
    })