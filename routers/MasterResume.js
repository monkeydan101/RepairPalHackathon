const express = require('express');
const router = express.Router();

// var masterResume = {
//     name : "abc",
//     experience : [
//         {
//             position : "",
//             organization : "",
//             responsibilites : ""
//         }
//     ],
//     contactInfo : ["", "", "" ],
//     education : [{
//         schoolName : "",
//         programName : ""
//     }],
//     projects : [{
//         projectName : "",
//         projectDetails : ""
//     }]
// }

let masterResume = {
    resume_name: "My Master Resume",
    name : "John Doe",
    experience : [
        {
            position : "Software Engineer",
            organization : "ABC Inc",
            responsibilities : "Developed web applications"
        }
    ],
    contactInfo : ["7801234567", "johndoe@gmail.com", "123 John Doe Way" ],
    education : [{
        schoolName : "University of XYZ",
        programName : "Software Engineering"
    }],
    projects : [{
        projectName : "Amazon",
        projectDetails : "I made amazon"
    }]
};

let resumeVersions = [
    {
        resume_name: "My Google Resume",
        name: "John Doe",
        experience: [
            {
                position: "Software Engineer",
                organization: "ABC Inc",
                responsibilities: "Developed web applications"
            }
        ],
        contactInfo: ["7801234567", "johndoe@gmail.com", "123 John Doe Way"],
        education: [{
            schoolName: "University of XYZ",
            programName: "Software Engineering"
        }],
        projects: [{
            projectName: "Google",
            projectDetails: "I made google"
        }]
}];


router.get("/", (req, res) => {
    res.send(masterResume);
})

router.put("/", (req, res) => {
    masterResume = req.body
    res.send("Success");
})

// get all resume versions
router.get("/versions", (req, res) => {
    res.send(resumeVersions);
})

// add new resume version
router.post("/versions", (req, res) => {
    const newResume = req.body;
    resumeVersions.push(req.body);
    res.send("Success - resume version added");
})

module.exports = router