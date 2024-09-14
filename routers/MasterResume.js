const express = require('express');
const router = express.Router();

var masterResume = {
    name : "Name",
    experience : [
        {
            position : "Position",
            organization : "Organization",
            responsibilites : "Position responsibilities"
        }
    ],
    contactInfo : ["Phone Number", "Address", "Email" ],
    education : [{
        schoolName : "School Name",
        programName : "Program name"
    }],
    projects : [{
        projectName : "Project name",
        projectDetails : "Project Details"
    }]
}

router.get("/", (req, res) => {
    res.send(masterResume);
})

router.put("/", (req, res) => {
    masterResume = req.body
    res.send("Success");
})

module.exports = router