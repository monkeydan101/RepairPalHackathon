import React, { useState } from 'react';
import { ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, Typography, Select, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';

const ApplicationStatus = {
  PENDING: 'Pending',
  ACCEPTED: 'Accepted',
  REJECTED: 'Rejected'
};

const ApplicationItem = ({ app, onSave }) => {
  const [editId, setEditId] = useState(null);
  const [editStatus, setEditStatus] = useState(app.status);
  const [editNotes, setEditNotes] = useState(app.notes);

  const handleEditClick = () => {
    setEditId(app.id);
  };

  const handleSaveClick = () => {
    onSave(app.id, editStatus, editNotes);
    setEditId(null);
  };

  return (
    <ListItem>
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
          <IconButton size="small" onClick={handleSaveClick}>
            <SaveIcon fontSize="small" /> Save
          </IconButton>
        ) : (
          <IconButton size="small" onClick={handleEditClick}>
            <EditIcon fontSize="small" /> Edit
          </IconButton>
        )}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default ApplicationItem;
