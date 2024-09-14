const express = require('express');
const cors = require('cors');
const uuid = require('uuid');
const axios = require('axios'); // Add axios
const bodyParser = require('body-parser');
const app = express();
const PORT = 3000;

const masterResumeRoute = require('./routers/MasterResume');

app.use(cors());

let jobApps = [
    {
        id: uuid.v4(),
        company: "Google",
        position: "Software Engineer",
        dateApplied: "2020-01-01",
        status: "Pending",
        notes: ""
    },
    {
        id: uuid.v4(),
        company: "Facebook",
        position: "Product Manager",
        dateApplied: "2020-01-02",
        status: "Rejected",
        notes: ""
    }
];

let masterResume = {
    name : "John Doe",
    experience : [
        {
            position : "Software Engineer",
            organization : "ABC Inc",
            responsibilites : "Developed web applications"
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

app.get('/applications', (req, res) => {
    res.json(jobApps);
    console.log("GET /applications");
});

app.use(bodyParser.json());

app.use('/masterresume', masterResumeRoute);

app.post('/applications', (req, res) => {
    const newApp = {
        ...req.body
    };
    jobApps.push(newApp);
    res.json(newApp);
    console.log("POST /applications");
});

app.put('/applications/:id', (req, res) => {
    const id = req.params.id;
    const {status, notes} = req.body;

    let application = jobApps.find(app => app.id === id);

    if (application) {
        if (status) application.status = status;
        if (notes !== undefined) application.notes = notes;
        res.json(application);
    } else {
        res.status(404).send(`Application with id ${id} not found`);
    }
    console.log(`PUT /applications/${id}`);
});

// AI Resume Recommendation
app.post('/resume/evaluate', (req, res) => {
    const requestData = {
        model: "lmstudio-community/Meta-Llama-3.1-8B-Instruct-GGUF/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf",
        messages: [
            { role: "system", content: "Your name is Milo. You are a professional resume evaluator and career advisor. You will be provided with an individual's resume, including details about their work experience, education, and projects. Your goal is to carefully evaluate the resume, offering constructive and helpful feedback to improve it.\n\nBe friendly, but also critical, pointing out areas that need improvement.\nOffer specific and actionable tips for enhancing clarity, professionalism, and alignment with industry standards.\nIf certain sections (like skills, achievements, or formatting) seem weak or missing, suggest improvements and explain why those changes would benefit the applicant.\nEnsure your feedback is clear, motivating, and encourages the individual to refine their resume for better results in job applications.\nIf the resume is well-crafted in certain areas, acknowledge the strengths as well.\nOverall, aim to help the individual present themselves in the best possible way to potential employers. Do not evaluate any escape characters. Do not use special characters such as HTML or any formatting, just plaintext. Keep your response concise and to the point." },
            { role: "user", content: req.body.prompt }
        ],
        temperature: 0.7,
        max_tokens: 500,  // Limit the response length
        stream: false
    };

    axios.post('http://localhost:1234/v1/chat/completions', requestData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        const plainTextResponse = response.data.choices[0].message.content.replace(/<\/?[^>]+(>|$)/g, "");  // Remove any HTML tags if present
        res.json({ content: plainTextResponse });  // Return AI response to the client
    })
    .catch(error => {
        console.error('Error:', error);
        res.status(500).send('Failed to get AI recommendation');
    });
    console.log("POST /resume/ai-recommendation");
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
