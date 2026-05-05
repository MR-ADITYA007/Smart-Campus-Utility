import React, { useState } from 'react';
import { Box, Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

function IssueForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('technology');
  const [priority, setPriority] = useState('MEDIUM');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit({ title, description, category, priority });
    setTitle('');
    setDescription('');
    setCategory('Wi-Fi');
    setPriority('MEDIUM');
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ display: 'grid', gap: 2 }}>
      <TextField
        label="Issue Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        fullWidth
      />
      <TextField
        label="Issue Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
        fullWidth
        multiline
        rows={4}
      />
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 2 }}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select value={category} label="Category" onChange={(e) => setCategory(e.target.value)}>
            <MenuItem value="maintenance">Maintenance</MenuItem>
            <MenuItem value="facilities">Facilities</MenuItem>
            <MenuItem value="technology">Technology</MenuItem>
            <MenuItem value="academic">Academic</MenuItem>
            <MenuItem value="security">Security</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel>Priority</InputLabel>
          <Select value={priority} label="Priority" onChange={(e) => setPriority(e.target.value)}>
            <MenuItem value="LOW">LOW</MenuItem>
            <MenuItem value="MEDIUM">MEDIUM</MenuItem>
            <MenuItem value="HIGH">HIGH</MenuItem>
            <MenuItem value="URGENT">URGENT</MenuItem>
          </Select>
        </FormControl>
      </Box>
      <Button type="submit" variant="contained" color="primary">
        Submit Issue
      </Button>
    </Box>
  );
}

export default IssueForm;
