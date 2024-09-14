import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Box, TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { saveAs } from 'file-saver';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer';
import axios from 'axios'; // For making HTTP requests

// Define basic PDF styles using react-pdf's StyleSheet
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    lineHeight: 1.6,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  text: {
    marginBottom: 5,
  },
});

const MasterResume = () => {
  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      resume_name: '',
      name: '',
      experience: [{ position: '', organization: '', responsibilities: '' }],
      contactInfo: ['', '', ''],
      education: [{ schoolName: '', programName: '' }],
      projects: [{ projectName: '', projectDetails: '' }],
    },
  });

  const [resumeVersions, setResumeVersions] = useState([]);
  const [selectedVersion, setSelectedVersion] = useState(null);

  useEffect(() => {
    // Fetch the master resume from the backend on component load
    axios.get('http://localhost:3000/masterresume')
      .then((response) => {
        const fetchedResume = response.data;
        setResumeVersions([fetchedResume]); // Set the master resume as the initial version
        reset(fetchedResume); // Set form values based on the fetched resume
      })
      .catch((error) => {
        console.error('Error fetching master resume:', error);
      });
  }, [reset]);

  const onSubmit = (data) => {
    if (selectedVersion === null) {
      // Add a new resume version
      setResumeVersions([...resumeVersions, { ...data, id: resumeVersions.length }]);
    } else {
      // Update an existing resume version
      const updatedVersions = resumeVersions.map((resume) =>
        resume.id === selectedVersion ? { ...data, id: selectedVersion } : resume
      );
      setResumeVersions(updatedVersions);
    }
    reset();
    setSelectedVersion(null);

    // Send the updated resume to the backend
    axios.put('http://localhost:3000/api/masterresume', data)
      .then(() => {
        console.log('Master resume updated successfully');
      })
      .catch((error) => {
        console.error('Error updating master resume:', error);
      });
  };

  const handleEdit = (version) => {
    reset(version); // Populate the form with the selected version
    setSelectedVersion(version.id); // Set the selected version for editing
  };

  const handleCopy = (version) => {
    setResumeVersions([...resumeVersions, { ...version, id: resumeVersions.length }]); // Create a copy of the selected version
  };

  const handleDownload = (resume) => {
    const blob = new Blob([JSON.stringify(resume, null, 2)], {
      type: 'application/json',
    });
    saveAs(blob, `${resume.name}_resume.json`);
  };

  // PDF generation using react-pdf
  const ResumeDocument = ({ resume }) => (
    <Document>
      <Page style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>{resume.name}</Text>
          <Text>{resume.contactInfo.join(', ')}</Text>
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Experience</Text>
          {resume.experience && resume.experience.length > 0 ? (
            resume.experience.map((exp, index) => (
              <Text key={index} style={styles.text}>
                {exp.position} at {exp.organization}: {exp.responsibilities}
              </Text>
            ))
          ) : (
            <Text>No experience listed</Text>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Education</Text>
          {resume.education && resume.education.length > 0 ? (
            resume.education.map((edu, index) => (
              <Text key={index} style={styles.text}>
                {edu.schoolName} - {edu.programName}
              </Text>
            ))
          ) : (
            <Text>No education listed</Text>
          )}
        </View>
        <View style={styles.section}>
          <Text style={styles.title}>Projects</Text>
          {resume.projects && resume.projects.length > 0 ? (
            resume.projects.map((proj, index) => (
              <Text key={index} style={styles.text}>
                {proj.projectName}: {proj.projectDetails}
              </Text>
            ))
          ) : (
            <Text>No projects listed</Text>
          )}
        </View>
      </Page>
    </Document>
  );

  return (
    <Box maxWidth="sm" sx={{ mt: 4, mx: "auto", textAlign: "center" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Master Resume
      </Typography>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Name" fullWidth variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="contactInfo[0]"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Phone Number" fullWidth variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="contactInfo[1]"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Address" fullWidth variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="contactInfo[2]"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Email" fullWidth variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="experience[0].position"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Position" fullWidth variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="experience[0].organization"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Organization" fullWidth variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="experience[0].responsibilities"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Responsibilities" fullWidth variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="education[0].schoolName"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="School Name" fullWidth variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="education[0].programName"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Program Name" fullWidth variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="projects[0].projectName"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Project Name" fullWidth variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="projects[0].projectDetails"
              control={control}
              render={({ field }) => (
                <TextField {...field} label="Project Details" fullWidth variant="outlined" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary">
              {selectedVersion !== null ? 'Save Changes' : 'Create Resume Version'}
            </Button>
          </Grid>
        </Grid>
      </form>

      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Resume Versions
        </Typography>

        {resumeVersions.map((version) => (
          <Paper key={version.id} sx={{ padding: '20px', marginBottom: '15px' }}>
            {/* <Typography variant="h6">{version.name}</Typography> */}
            <Typography variant="h6">{version.resume_name}</Typography>
            <Typography>{version.contactInfo.join(', ')}</Typography>
            <Box sx={{ mt: 2 }}>
              <Button
                onClick={() => handleEdit(version)}
                variant="contained"
                color="secondary"
                sx={{ marginRight: 2 }}
              >
                Edit
              </Button>
              <Button
                onClick={() => handleCopy(version)}
                variant="contained"
                color="primary"
                sx={{ marginRight: 2 }}
              >
                Copy
              </Button>
              {/* <Button
                onClick={() => handleDownload(version)}
                variant="contained"
                sx={{ marginRight: 2 }}
              >
                Download JSON
              </Button> */}
              <PDFDownloadLink
                document={<ResumeDocument resume={version} />}
                fileName={`${version.name}_resume.pdf`}
                style={{ textDecoration: 'none' }}
              >
                {({ loading }) => (
                  <Button variant="contained" color="primary">
                    {loading ? 'Loading PDF...' : 'Download PDF'}
                  </Button>
                )}
              </PDFDownloadLink>
            </Box>
          </Paper>
        ))}
      </Box>
    </Box>
  );
};

export default MasterResume;