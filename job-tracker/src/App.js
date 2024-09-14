import React, { useState, useEffect } from 'react';
import { Container, Box, Typography } from '@mui/material';
import ApplicationForm from './Components/ApplicationForm';
import ApplicationList from './Components/ApplicationList';
import sendEmail from './Components/ReminderEmail';
import Navbar from './Components/NavBar';
import ResumeEvaluator from './Components/ResumeEvaluator';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const ApplicationStatus = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected'
};

const App = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/applications')
      .then((response) => response.json())
      .then((data) => setApplications(data));
  }, []);

  const handleAddApplication = (application) => {
    fetch('http://localhost:3000/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(application)
    })
      .then((response) => response.json())
      .then((data) => {
        setApplications([...applications, data]);
        sendEmail(data.email, data.remindInMinutes);
      });
  };

  const handleSaveApplication = (id, status, notes) => {
    fetch(`http://localhost:3000/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, notes })
    })
      .then((response) => response.json())
      .then(() => {
        setApplications((prevApplications) =>
          prevApplications.map((app) =>
            app.id === id ? { ...app, status, notes } : app
          )
        );
      });
  };

  return (

    <Router>
      <div>
        
        <Navbar />

        <Routes>
          <Route path="/" element={
            <>

              <Box maxWidth="sm" sx={{ mt: 4, mx: "auto", textAlign: "center" }}>
                <Typography variant="h5" gutterBottom>
                  Job Applications
                </Typography>
                {Object.values(ApplicationStatus).map((status) => (
                  <ApplicationList
                    key={status}
                    status={status}
                    applications={applications}
                    onSave={handleSaveApplication}
                  />
                ))}
              </Box>

            </>
          } />
          <Route path="/resume" element={<ResumeEvaluator />} />
          <Route path="/new-application" element={<ApplicationForm onAddApplication={handleAddApplication} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
