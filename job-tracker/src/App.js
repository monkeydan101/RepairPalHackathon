import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

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
      <h1>Job Applications</h1>
      <ul>
        {applications.map(app => (
          <li key={app.id}>
            {app.company} - {app.position} - {app.status}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Company"
          value={newApplication.company}
          onChange={(e) => setNewApplication({ ...newApplication, company: e.target.value })}
        />
        <input
          type="text"
          placeholder="Position"
          value={newApplication.position}
          onChange={(e) => setNewApplication({ ...newApplication, position: e.target.value })}
        />
        <input
          type="date"
          placeholder="Date Applied"
          value={newApplication.dateApplied}
          onChange={(e) => setNewApplication({ ...newApplication, dateApplied: e.target.value })}
        />
        <input
          type="text"
          placeholder="Status"
          value={newApplication.status}
          onChange={(e) => setNewApplication({ ...newApplication, status: e.target.value })}
        />
        <button type="submit">Add Application</button>
      </form>
    </div>
  );
}

export default App;