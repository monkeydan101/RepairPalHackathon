import React, { useState } from 'react';
import { TextField, Button, Typography, Select, MenuItem, Box } from '@mui/material';
import { v4 as uuidv4 } from 'uuid';

const ApplicationStatus = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected'
};

const ApplicationForm = ({ onAddApplication }) => {
  const [newApplication, setNewApplication] = useState({
    id: '',
    company: '',
    position: '',
    dateApplied: '',
    status: ApplicationStatus.PENDING,
    email: '',
    remindInMinutes: '',
    notes: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewApplication(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const applicationWithId = { ...newApplication, id: uuidv4() };
    onAddApplication(applicationWithId);
    setNewApplication({
      id: '',
      company: '',
      position: '',
      dateApplied: '',
      status: ApplicationStatus.PENDING,
      email: '',
      remindInMinutes: '',
      notes: ''
    });
  };

  return (
    <Box maxWidth="sm" sx={{ mt: 4, mx: "auto", textAlign: "center" }}>
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
                height: '30px',
                fontSize: '16px'
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
  );
};

export default ApplicationForm;
