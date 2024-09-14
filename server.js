const express = require('express');
const cors = require('cors');
const uuid = require('uuid');

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
        status: "Pending"
    },
    {
        id: uuid.v4(),
        company: "Facebook",
        position: "Product Manager",
        dateApplied: "2020-01-02",
        status: "Rejected"
    }
];

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

app.put('/applications/:id/status', (req, res) => {
    const id = req.params.id;
    const status = req.body.status;

    let application = jobApps.find(app => app.id === id);

    if (application) {
        application.status = status;
        res.json(application);
    } else {
        res.status(404).send(`Application with id ${id} not found`);
    }
    console.log(`PUT /applications/${id}/status`);
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

 