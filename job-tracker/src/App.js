import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { TextField, Button, Container, Typography, Box, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { BrowserRouter as Router } from 'react-router-dom';

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
  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState(ApplicationStatus.PENDING);

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
        setNewApplication({ id: '', company: '', position: '', dateApplied: '', status: ApplicationStatus.PENDING }); // reset the form
      });
  };

  const handleEditClick = (app) => {
    setEditId(app.id);
    setEditStatus(app.status);
  };

  const handleSaveClick = (id) => {
    const updatedApplications = applications.map((app) =>
      app.id === id ? { ...app, status: editStatus } : app
    );
    setApplications(updatedApplications);
    setEditId(null); // Exit edit mode

    // PUT request
    fetch(`http://localhost:3000/applications/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: editStatus })
    });
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
            <Select
              fullWidth
              margin="normal"
              value={newApplication.status}
              onChange={(e) => setNewApplication({ ...newApplication, status: e.target.value })}
            >
              {Object.values(ApplicationStatus).map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
            <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>
              Add Application
            </Button>
          </form>
        </Box>
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Job Applications
          </Typography>

          <List subheader="Pending">
            {applications.filter((app) => app.status === 'Pending').map((app) => (
              <ListItem key={app.id}>
                <ListItemText
                  primary={`${app.company} - ${app.position}`}
                  secondary={
                    editId === app.id ? (
                      <Select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                      >
                        {Object.values(ApplicationStatus).map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      app.status
                    )
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
            {applications.filter((app) => app.status === 'Accepted').map((app) => (
              <ListItem key={app.id}>
                <ListItemText
                  primary={`${app.company} - ${app.position}`}
                  secondary={
                    editId === app.id ? (
                      <Select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                      >
                        {Object.values(ApplicationStatus).map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      app.status
                    )
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
            {applications.filter((app) => app.status === 'Rejected').map((app) => (
              <ListItem key={app.id}>
                <ListItemText
                  primary={`${app.company} - ${app.position}`}
                  secondary={
                    editId === app.id ? (
                      <Select
                        value={editStatus}
                        onChange={(e) => setEditStatus(e.target.value)}
                      >
                        {Object.values(ApplicationStatus).map((status) => (
                          <MenuItem key={status} value={status}>
                            {status}
                          </MenuItem>
                        ))}
                      </Select>
                    ) : (
                      app.status
                    )
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
      </Container>
    </Router>
  );
}

export default App;
