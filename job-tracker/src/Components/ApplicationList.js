import React from 'react';
import { List, Typography } from '@mui/material';
import ApplicationItem from './ApplicationItem';

const ApplicationList = ({ applications, status, onSave }) => {
  return (
    <List subheader={status}>
      <hr />
      {applications
        .filter((app) => app.status === status)
        .map((app) => (
          <ApplicationItem key={app.id} app={app} onSave={onSave} />
        ))}
    </List>
  );
};

export default ApplicationList;
