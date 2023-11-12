const express = require("express");
const router = new express.Router();
const multer = require('multer');
const MenRanking = require('../models/jobsmodel');

const querystring = require('querystring');


router.get('/', async (req, res) => {
    res.send('siddiqkolimi..');
})

// Set up multer for handling form data and file uploads
const upload = multer();

// Assuming you have a route to handle the POST request for creating a new ranking
router.post('/jobs', upload.none(), async (req, res) => {
    try {
        // Assuming your MenRanking model has fields like name, score, user, etc.
        const { type, jobid, companylogo, jobtitle, jobdetails, jobname, aboutcompanyH, aboutcompany, jobdescH, jobdesc, jobprofileH, jobprofile, jobtypeH, jobtype, jobdegreeH, jobdegree, joblocH, jobloc, jobexpH, jobexp, educandskillH, educandskill, rolesandresH, rolesandres, apply } = req.body;

        // Create a new MenRanking entry with user-provided data
        const menRanking = new MenRanking({ type, jobid, companylogo, jobtitle, jobdetails, jobname, aboutcompanyH, aboutcompany, jobdescH, jobdesc, jobprofileH, jobprofile, jobtypeH, jobtype, jobdegreeH, jobdegree, joblocH, jobloc, jobexpH, jobexp, educandskillH, educandskill, rolesandresH, rolesandres, apply });

        // Save the new entry to the database
        await menRanking.save();

        res.status(201).send(menRanking); // Respond with the created entry
    } catch (error) {
        res.status(400).send(error);
    }
});

// Assuming you have a route to serve an HTML form
router.get('/form', (req, res) => {
    // Create and send an HTML form
    res.send(`
    <html>
    <head>
    <style>
    body {
        font-family: Arial, sans-serif;
    }

    form {
        width: 50%;
        margin: 0 auto;
    }

    label {
        display: block;
        margin-top: 10px;
    }

    input {
        width: 100%;
        padding: 8px;
        margin-top: 5px;
        margin-bottom: 10px;
        box-sizing: border-box;
    }

    button {
        background-color: #4CAF50;
        color: white;
        padding: 10px 15px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background-color: #45a049;
    }

    .form-row {
        margin-bottom: 10px;
    }

    /* Responsive Design */
    @media only screen and (max-width: 600px) {
        form {
            width: 80%;
        }

        input {
            padding: 6px;
        }

        button {
            padding: 8px 12px;
        }
    }
</style>

    </head>
    <body>
        <form action="/jobs" method="post" enctype="multipart/form-data">
            <label for="name">jobtype:</label>
            <input type="text" id="type" name="type" required><br>

            <label for="score">jobid:</label>
            <input type="number" id="jobid" name="jobid" required><br>

            <label for="user">image:</label>
            <input type="text" id="companylogo" name="companylogo" required><br>

            <label for="user">jobtitle:</label>
            <input type="text" id="jobtitle" name="jobtitle" required><br>

            <label for="user">details:</label>
            <input type="text" id="jobdetails" name="jobdetails" required><br>

            <label for="user">jobname:</label>
            <input type="text" id="jobname" name="jobname" required><br>


            <label for="user">aboutH:</label>
            <input type="text" id=" aboutcompanyH" name="aboutcompanyH" required><br>


            <label for="user">about:</label>
            <input type="text" id=" aboutcompany" name="aboutcompany" required><br>


            <label for="user">jobdesh:</label>
            <input type="text" id="jobdescH" name="jobdescH" required><br>


            <label for="user">jobdes:</label>
            <input type="text" id="jobdesc" name="jobdesc" required><br>


            <label for="user">jobprofileh:</label>
            <input type="text" id="jobprofileH" name="jobprofileH" required><br>


            <label for="user">jobprofile:</label>
            <input type="text" id="jobprofile" name="jobprofile" required><br> 
            
            <label for="user">jobtypeH:</label>
            <input type="text" id="jobtypeH" name="jobtypeH" required><br>

            <label for="user">jobtype:</label>
            <input type="text" id="jobtype" name="jobtype" required><br>


            <label for="user">jobdegreeH:</label>
            <input type="text" id=" jobdegreeH" name="jobdegreeH" required><br> 

            <label for="user">JOB QUALIFICATION:</label>
            <input type="text" id="jobdegree" name="jobdegree" required><br>
            <label for="user">joblocH:</label>
            <input type="text" id=" joblocH" name="joblocH" required><br>

            <label for="user">jobloc:</label>
            <input type="text" id="jobloc" name="jobloc" required><br>

            <label for="user">jobexpH:</label>  
            <input type="text" id="jobexpH" name="jobexpH" required><br>


            <label for="user">jobexp:</label>
            <input type="text" id=" jobexp" name="jobexp" required><br>


            <label for="user">educandskillH:</label>
            <input type="text" id="educandskillH" name="educandskillH" required><br>

         
            <div id="educandskill-container" class="form-row">
            <label for="educandskill">Educational and Skill:</label>
            <input type="text" name="educandskill[]" required>
            <button type="button" onclick="addRow()">Add More</button>
        </div>

            <label for="user">ROLESHeading:</label>
            <input type="text" id="rolesandresH" name="rolesandresH" required><br>

            <div id="roles" class="form-row1">
            <label for="role">Role and Responsibility:</label>
            <input type="text" name="rolesandres[]" required>
            <button type="button" onclick="addRow1()">Add More</button>
        </div>

            <label for="user">apply link:</label>
            <input type="text" id="apply" name="apply" required><br>

            <button type="submit">Submit</button>
        </form>
        <script>
    function addRow() {
        var container = document.getElementById('educandskill-container');

        var newRow = document.createElement('div');
        newRow.className = 'form-row';

        var label = document.createElement('label');
        label.textContent = 'Educational and Skill:';
        newRow.appendChild(label);

        var input = document.createElement('input');
        input.type = 'text';
        input.name = 'educandskill[]';
        input.required = true;
        newRow.appendChild(input);

        var removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.textContent = 'Remove';
        removeButton.onclick = function () {
            removeRow(newRow);
        };
        newRow.appendChild(removeButton);

        container.parentNode.insertBefore(newRow, container);
    }

    function removeRow(row) {
        row.parentNode.removeChild(row);
    }

    function addRow1() {
        var container = document.getElementById('roles');

        var newRow = document.createElement('div');
        newRow.className = 'form-row1';

        var label = document.createElement('label');
        label.textContent = 'Role and Responsibility:';
        newRow.appendChild(label);

        var input = document.createElement('input');
        input.type = 'text';
        input.name = 'rolesandres[]';
        input.required = true;
        newRow.appendChild(input);

        var removeButton = document.createElement('button');
        removeButton.type = 'button';
        removeButton.textContent = 'Remove';
        removeButton.onclick = function () {
            removeRow1(newRow);
        };
        newRow.appendChild(removeButton);

        container.parentNode.insertBefore(newRow, container);
    }

    function removeRow1(row) {
        row.parentNode.removeChild(row);
    }
</script>

  </body>
        </html>
    `);
});


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
