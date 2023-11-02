const express = require("express");
const router = new express.Router();
const MenRanking = require('../models/mens');
router.get('/', async (req, res) => {
    res.send('siddiqkolimi');
})


router.post('/mens', async (req, res) => {
    try {
        const addingMensRecords = new MenRanking(req.body)
        console.log(req.body);
        const insertMen = await addingMensRecords.save();
        res.status(201).send(insertMen);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

router.get('/mens', async (req, res) => {
    try {
        const getMens = await MenRanking.find({})
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

//individual
router.get('/mens/:id', async (req, res) => {
    try {

        const getMens = await MenRanking.findById(req.params.id)
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

//update data from postman

router.put('/mens/:id', async (req, res) => {
    try {

        const getMens = await MenRanking.findByIdAndUpdate(req.params.id, req.body)
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;
