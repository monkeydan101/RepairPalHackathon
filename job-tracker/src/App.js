import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TextField, Button, Container, Typography, Box, List, ListItem, ListItemText } from '@mui/material';

const ApplicationStatus = Object.freeze({
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected'
});

function App() {
  const [applications, setApplications] = useState([]);
  const [newApplication, setNewApplication] = useState({
    id: '',
    company: '',
    position: '',
    dateApplied: '',
    status: ApplicationStatus.PENDING
  });

  useEffect(() => {
    fetch('http://localhost:3000/applications')
      .then(response => response.json())
      .then(data => setApplications(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const applicationWithId = {...newApplication, id: uuidv4()};
    fetch('http://localhost:3000/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationWithId),
    })
    .then(response => response.json())
    .then(data => {
      setApplications([...applications, data]);
      setNewApplication({ id: '', company: '', position: '', dateApplied: '', status: '' }); // reset the form
    });
  };

  return (
    <div>
      {/* <h1>Job Applications</h1>
      <ul>
        {applications.map(app => (
          <li key={app.id}>
            {app.company} - {app.position} - {app.status}
          </li>
        ))}
      </ul> */}

      <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Add New Application
        </Typography>
        <form onSubmit={handleSubmit}>
        <TextField
            fullWidth
            margin="normal"
            label="Company"
            variant="outlined"
            value={newApplication.company}
            onChange={(e) => setNewApplication({ ...newApplication, company: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Position"
            variant="outlined"
            value={newApplication.position}
            onChange={(e) => setNewApplication({ ...newApplication, position: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Date Applied"
            type="date"
            InputLabelProps={{ shrink: true }}
            variant="outlined"
            value={newApplication.dateApplied}
            onChange={(e) => setNewApplication({ ...newApplication, dateApplied: e.target.value })}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Status"
            variant="outlined"
            value={newApplication.status}
            onChange={(e) => setNewApplication({ ...newApplication, status: e.target.value })}
          />
          <Button
            fullWidth
            variant="contained"
            color="primary"
            type="submit"
            sx={{ mt: 2 }}
          >
            Add Application
          </Button>
        </form>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Job Applications
        </Typography>
        <List>
          {applications.map(app => (
            <ListItem key={app.id}>
              <ListItemText
                primary={`${app.company} - ${app.position}`}
                secondary={app.status}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Container>
    </div>
  );
}

export default App;