import React, { useState } from 'react';
import { TextField, Button, Typography, Box, CircularProgress } from '@mui/material';
import { Stars } from 'lucide-react';

function ResumeEvaluator() {
  const [resumeText, setResumeText] = useState('');
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const handleEvaluate = (e) => {
    e.preventDefault();
    setLoading(true);

    fetch('http://localhost:3000/resume/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: resumeText }),
    })
    .then(response => response.json())
    .then(data => {
      setEvaluation(data.content);
      setLoading(false);
    })
    .catch(error => {
      console.error('Error:', error);
      setLoading(false);
    });
  };

  return (
    <Box maxWidth="sm" sx={{ mt: 4, mx: "auto", textAlign: "center" }}>
      <Typography variant="h4" component="h1" gutterBottom>
      <Stars className="text-purple-600 w-10 h-10 mr-2 animate-pulse" />
         AI Resume Evaluator
      </Typography>
      <form onSubmit={handleEvaluate}>
        <TextField
          label="Paste Your Resume Here"
          multiline
          fullWidth
          rows={8}
          variant="outlined"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
          {loading ? <CircularProgress size={24} /> : 'Evaluate Resume'}
        </Button>
      </form>
      
      {evaluation && (
        <Box sx={{ mt: 4, p: 2, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
          <Typography variant="h6">Evaluation Result:</Typography>
          <Typography variant="body1">{evaluation}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default ResumeEvaluator;
