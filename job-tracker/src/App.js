import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import emailjs from 'emailjs-com'; // Make sure to install emailjs-com
import { TextField, Button, Container, Typography, Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { BrowserRouter as Router } from 'react-router-dom';
import ResumeEvaluator from './ResumeEvaluator';

// Initialize EmailJS with your user ID
emailjs.init('KMAWV91wrDXkqm3Hh');

const ApplicationStatus = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected'
};

const App = () => {
  const [applications, setApplications] = useState([]);
  const [newApplication, setNewApplication] = useState({
    id: '',
    company: '',
    position: '',
    dateApplied: '',
    status: 'PENDING',
    email: '',
    remindInMinutes: '', // Add remindInMinutes field
    notes: ''
  });
  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState(ApplicationStatus.PENDING);
  const [editNotes, setEditNotes] = useState('');

  useEffect(() => {
    fetch('http://localhost:3000/applications')
      .then((response) => response.json())
      .then((data) => setApplications(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const applicationWithId = { ...newApplication, id: uuidv4() };
    fetch('http://localhost:3000/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationWithId)
    })
      .then((response) => response.json())
      .then((data) => {
        setApplications([...applications, data]);
        setNewApplication({ id: '', company: '', position: '', dateApplied: '', status: ApplicationStatus.PENDING, email: '', remindInMinutes: '', notes: '' }); // reset the form
        sendEmail(data.email, data.remindInMinutes); // Call sendEmail here
      });
  };

  const handleEditClick = (app) => {
    setEditId(app.id);
    setEditStatus(app.status);
    setEditNotes(app.notes);
  };

  const handleSaveClick = (id) => {
    fetch(`http://localhost:3000/applications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: editStatus, notes: editNotes })
    })
    .then(response => response.json())
    .then(updatedApp => {
      setApplications(applications.map(app => (app.id === id ? updatedApp : app)));
      setEditId(null);
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewApplication(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const sendEmail = (email, minutes) => {
    const milliseconds = minutes * 60 * 1000;

    setTimeout(() => {
      const templateParams = {
        to_email: newApplication.email,
        message: 'This is a reminder to follow up on your application at ' + newApplication.company + '.'
      };

      emailjs.send('service_zehmlri', 'template_7k0g1oq', templateParams, 'KMAWV91wrDXkqm3Hh')
        .then((response) => {
          console.log('Email sent successfully!', response.status, response.text);
        }, (error) => {
          console.error('Failed to send email.', error);
        });
    }, milliseconds);
  };

  return (
    <Router>
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
              name="company"
              value={newApplication.company}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Position"
              variant="outlined"
              name="position"
              value={newApplication.position}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              margin="normal"
              label="Date Applied"
              type="date"
              InputLabelProps={{ shrink: true }}
              variant="outlined"
              name="dateApplied"
              value={newApplication.dateApplied}
              onChange={handleChange}
            />
            <Select
              fullWidth
              margin="normal"
              name="status"
              value={newApplication.status}
              onChange={handleChange}
            >
              {Object.values(ApplicationStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
            <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
              Enter your email to be reminded to follow up
            </Typography>
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              variant="outlined"
              name="email"
              value={newApplication.email}
              onChange={handleChange}
            />
            <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 2 }}>
              Remind me in
              <TextField
                type="number"
                name="remindInMinutes"
                value={newApplication.remindInMinutes}
                onChange={handleChange}
                sx={{ width: '60px', mx: 1 }}
                InputProps={{
                  style: {
                    height: '30px', // Adjust the height as needed
                    fontSize: '16px' // Match the font size to the input text size
                  }
                }}
              />
              minutes
            </Typography>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Job Applications
          </Typography>
          <List subheader="Pending">
            <hr />
            {applications
              .filter((app) => app.status === ApplicationStatus.PENDING)
              .map((app) => (
                <ListItem key={app.id}>
                  <ListItemText
                    primary={`${app.company} - ${app.position}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Status: &nbsp;
                          {editId === app.id ? (
                            <Select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              sx={{ mt: 1, width: '150px' }}
                            >
                              {Object.values(ApplicationStatus).map((status) => (
                                <MenuItem key={status} value={status}>
                                  {status}
                                </MenuItem>
                              ))}
                            </Select>
                          ) : (
                            app.status
                          )}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Notes: &nbsp;
                          {editId === app.id ? (
                            <TextField
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              size="small"
                              multiline
                              rows={2}
                              sx={{ mt: 1, width: '300px' }}
                            />
                          ) : (
                            app.notes
                          )}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    {editId === app.id ? (
                      <IconButton size="small" onClick={() => handleSaveClick(app.id)}>
                        <SaveIcon fontSize="small" /> Save
                      </IconButton>
                    ) : (
                      <IconButton size="small" onClick={() => handleEditClick(app)}>
                        <EditIcon fontSize="small" /> Edit
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          </List>
          <List subheader="Accepted">
            <hr />
            {applications
              .filter((app) => app.status === ApplicationStatus.ACCEPTED)
              .map((app) => (
                <ListItem key={app.id}>
                  <ListItemText
                    primary={`${app.company} - ${app.position}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Status: &nbsp;
                          {editId === app.id ? (
                            <Select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              sx={{ mt: 1, width: '150px' }}
                            >
                              {Object.values(ApplicationStatus).map((status) => (
                                <MenuItem key={status} value={status}>
                                  {status}
                                </MenuItem>
                              ))}
                            </Select>
                          ) : (
                            app.status
                          )}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Notes: &nbsp;
                          {editId === app.id ? (
                            <TextField
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              size="small"
                              multiline
                              rows={2}
                              sx={{ mt: 1, width: '300px' }}
                            />
                          ) : (
                            app.notes
                          )}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    {editId === app.id ? (
                      <IconButton size="small" onClick={() => handleSaveClick(app.id)}>
                        <SaveIcon fontSize="small" /> Save
                      </IconButton>
                    ) : (
                      <IconButton size="small" onClick={() => handleEditClick(app)}>
                        <EditIcon fontSize="small" /> Edit
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          </List>
          <List subheader="Rejected">
            <hr />
            {applications
              .filter((app) => app.status === ApplicationStatus.REJECTED)
              .map((app) => (
                <ListItem key={app.id}>
                  <ListItemText
                    primary={`${app.company} - ${app.position}`}
                    secondary={
                      <>
                        <Typography component="span" variant="body2">
                          Status: &nbsp;
                          {editId === app.id ? (
                            <Select
                              value={editStatus}
                              onChange={(e) => setEditStatus(e.target.value)}
                              sx={{ mt: 1, width: '150px' }}
                            >
                              {Object.values(ApplicationStatus).map((status) => (
                                <MenuItem key={status} value={status}>
                                  {status}
                                </MenuItem>
                              ))}
                            </Select>
                          ) : (
                            app.status
                          )}
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          Notes: &nbsp;
                          {editId === app.id ? (
                            <TextField
                              value={editNotes}
                              onChange={(e) => setEditNotes(e.target.value)}
                              size="small"
                              multiline
                              rows={2}
                              sx={{ mt: 1, width: '300px' }}
                            />
                          ) : (
                            app.notes
                          )}
                        </Typography>
                      </>
                    }
                  />
                  <ListItemSecondaryAction>
                    {editId === app.id ? (
                      <IconButton size="small" onClick={() => handleSaveClick(app.id)}>
                        <SaveIcon fontSize="small" /> Save
                      </IconButton>
                    ) : (
                      <IconButton size="small" onClick={() => handleEditClick(app)}>
                        <EditIcon fontSize="small" /> Edit
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
          </List>
        </Box>
        <ResumeEvaluator />
      </Container>
    </Router>
  );
};

export default App;