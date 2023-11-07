const express = require("express");
const router = new express.Router();
const MenRanking = require('../models/mens');


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
        const getMens = await MenRanking.find({})
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

router.get('/internships', async (req, res) => {
    try {
        const getMens = await MenRanking.find({ type: 'internships' })
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})


router.get('/walk-in-drives', async (req, res) => {
    try {
        const getMens = await MenRanking.find({ type: 'walkindrives' })
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

router.get('/govt-jobs', async (req, res) => {
    try {
        const getMens = await MenRanking.find({ type: 'govtjobs' })
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})



//individual
router.get('/jobs/:id', async (req, res) => {
    try {

        const getMens = await MenRanking.findById(req.params.id)
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

router.get('/internships/:id', async (req, res) => {
    try {

        const getMens = await MenRanking.findById(req.params.id)
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

router.get('/walk-in-drives/:id', async (req, res) => {
    try {

        const getMens = await MenRanking.findById(req.params.id)
        res.send(getMens);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

router.get('/govt-jobs/:id', async (req, res) => {
    try {

        const getMens = await MenRanking.findById(req.params.id)
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
