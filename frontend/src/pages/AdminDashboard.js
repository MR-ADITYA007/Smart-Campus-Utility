import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
  Divider,
  Alert,
  Chip,
} from '@mui/material';
import api from '../api';
import { useAuth } from '../auth/AuthContext';
import Announcements from '../components/Announcements';
import useAnnouncements from '../hooks/useAnnouncements';
import useIssues from '../hooks/useIssues';

function AdminDashboard() {
  const { logout, user } = useAuth();
  const { issues, loading: issuesLoading, error: issuesError, updateIssue } = useIssues();
  const { announcements, loading: announcementsLoading, error: announcementsError, addAnnouncement } = useAnnouncements();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePublish = async (event) => {
    event.preventDefault();
    try {
      const res = await api.post('/announcements', { title, content });
      addAnnouncement(res.data);
      setTitle('');
      setContent('');
    } catch (error) {
      console.error('Failed to publish announcement:', error);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await api.put(`/issues/${id}`, { status });
      updateIssue(res.data);
    } catch (error) {
      console.error('Failed to update issue status:', error);
    }
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Admin Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Hi {user.username}, review campus issues and announcements.
            </Typography>
          </Box>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Publish Announcement
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Box component="form" onSubmit={handlePublish} noValidate>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
                margin="normal"
              />
              <TextField
                label="Content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                fullWidth
                multiline
                rows={5}
                margin="normal"
              />
              <Button type="submit" variant="contained" sx={{ mt: 2 }}>
                Publish Announcement
              </Button>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Announcement Feed
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {announcementsLoading && <Typography>Loading announcements...</Typography>}
            {announcementsError && <Alert severity="error">{announcementsError}</Alert>}
            <Announcements announcements={announcements} />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Issue Management
          </Typography>
          {issuesLoading && <Typography>Loading issues...</Typography>}
          {issuesError && <Alert severity="error" sx={{ mb: 2 }}>{issuesError}</Alert>}
          <Grid container spacing={3}>
            {issues.length === 0 && !issuesLoading && (
              <Grid item xs={12}>
                <Alert severity="info">No issues reported yet.</Alert>
              </Grid>
            )}
            {issues.map((issue) => (
              <Grid item xs={12} md={6} key={issue.id}>
                <Card elevation={2}>
                  <CardHeader title={issue.title} subheader={`Status: ${issue.status}`} />
                  <CardContent>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {issue.description}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Category:</strong> {issue.category}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Priority:</strong> {issue.priority}
                    </Typography>
                    <Typography variant="body2">
                      <strong>Reporter:</strong> {issue.reporter}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button size="small" onClick={() => handleStatusUpdate(issue.id, 'IN_PROGRESS')}>
                      In Progress
                    </Button>
                    <Button size="small" onClick={() => handleStatusUpdate(issue.id, 'RESOLVED')}>
                      Resolve
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default AdminDashboard;
