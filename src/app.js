const express = require('express');

const MenRanking = require('../src/models/mens');
require("../src/db/conn");



const router = require('./routers/men');
const app = express();
//dynamic port
const port = process.env.PORT || 3001;


app.use(express.json());

app.use(router);
app.listen(port,
    () => {
        console.log((`connection is live at port no.${port}`));
    })


