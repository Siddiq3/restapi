const express = require("express");
const router = new express.Router();
const MenRanking = require('../models/mens');

const querystring = require('querystring');
router.get('/', async (req, res) => {
    res.send('siddiqkolimi..');
})


router.post('/jobs', async (req, res) => {
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

router.get('/jobs', async (req, res) => {
    try {
        const getMens = await MenRanking.find().sort({ date: -1 })
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

router.get('/internships', async (req, res) => {
    try {
        const getMens = await MenRanking.find({ type: 'internships' }).sort({ date: -1 })
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})


router.get('/walk-in-drives', async (req, res) => {
    try {
        const getMens = await MenRanking.find({ type: 'walkindrives' }).sort({ date: -1 })
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

router.get('/govt-jobs', async (req, res) => {
    try {
        const getMens = await MenRanking.find({ type: 'govtjobs' }).sort({ date: -1 })
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})



//individual
router.get('/jobs/:name', async (req, res) => {
    try {

        const getMensname = req.params.name.trim();

        const getMens = await MenRanking.findOne({
            jobname: { $regex: new RegExp(getMensname, 'i') },
        });
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

router.get('/internships/:name', async (req, res) => {
    try {

        const getMensname = req.params.name.trim()

        const getMens = await MenRanking.findOne({
            jobname: { $regex: new RegExp(getMensname, 'i') },
        });
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

router.get('/walk-in-drives/:name', async (req, res) => {
    try {

        const getMensname = req.params.name.trim()

        const getMens = await MenRanking.findOne({
            jobname: { $regex: new RegExp(getMensname, 'i') },
        });
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

router.get('/govt-jobs/:name', async (req, res) => {
    try {

        const getMensname = req.params.name.trim()

        const getMens = await MenRanking.findOne({
            jobname: { $regex: new RegExp(getMensname, 'i') },
        });
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

//update data from postman

router.put('/jobs/:id', async (req, res) => {
    try {

        const getMens = await MenRanking.findByIdAndUpdate(req.params.id, req.body)
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})


router.delete('/jobs/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Use Mongoose to find the document by ID and delete it
        const deletedMen = await MenRanking.findByIdAndDelete(id);

        if (!deletedMen) {
            return res.status(404).json({ message: 'Mens record not found' });
        }

        res.json({ message: 'Mens record deleted successfully', deletedMen });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting mens record', error });
    }
});
module.exports = router;
