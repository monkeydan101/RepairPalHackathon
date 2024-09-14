import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Container, Box, Typography, TextField, Button } from '@mui/material';
import emailjs from 'emailjs-com'; // Make sure to install emailjs-com

//init emailjs with your user id
emailjs.init('KMAWV91wrDXkqm3Hh');


const App = () => {
  const [applications, setApplications] = useState([]);
  const [newApplication, setNewApplication] = useState({
    id: '',
    company: '',
    position: '',
    dateApplied: '',
    status: 'PENDING',
    email: '',
    remindInMinutes: '' // Add remindInMinutes field
  });

  useEffect(() => {
    fetch('http://localhost:3000/applications')
      .then(response => response.json())
      .then(data => setApplications(data));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const applicationWithId = { ...newApplication, id: uuidv4() };
    fetch('http://localhost:3000/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(applicationWithId),
    })
    .then(response => response.json())
    .then(data => {
      setApplications([...applications, data]);
      setNewApplication({ id: '', company: '', position: '', dateApplied: '', status: 'PENDING', email: '', remindInMinutes: '' }); // reset the form
      sendEmail(newApplication.email, newApplication.remindInMinutes);
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
    <div>
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
      </Container>
    </div>
  );
};

export default App;