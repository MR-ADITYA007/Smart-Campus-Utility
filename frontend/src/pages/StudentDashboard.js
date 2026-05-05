import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Grid, Paper, Typography, Divider, Alert, Chip } from '@mui/material';
import api from '../api';
import { useAuth } from '../auth/AuthContext';
import IssueForm from '../components/IssueForm';
import IssueList from '../components/IssueList';
import Announcements from '../components/Announcements';
import useAnnouncements from '../hooks/useAnnouncements';
import useIssues from '../hooks/useIssues';

function StudentDashboard() {
  const { logout, user } = useAuth();
  const { issues, loading: issuesLoading, error: issuesError, addIssue } = useIssues();
  const { announcements, loading: announcementsLoading, error: announcementsError } = useAnnouncements();
  const navigate = useNavigate();

  const handleCreate = async (payload) => {
    try {
      const res = await api.post('/issues', payload);
      addIssue(res.data);
    } catch (error) {
      console.error('Failed to create issue:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
          <Box>
            <Typography variant="h4" gutterBottom>
              Student Dashboard
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Welcome back, {user.username}.
            </Typography>
          </Box>
          <Button variant="contained" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <Typography variant="body2" sx={{ mb: 1 }}>
              Report a campus issue quickly and track its status from your dashboard.
            </Typography>
            <Chip label="Active Issues" color="primary" sx={{ mr: 1 }} />
            <Chip label={`Total: ${issues.length}`} />
            {issuesLoading && <Typography variant="body2" sx={{ mt: 1 }}>Loading issues...</Typography>}
            {issuesError && <Alert severity="error" sx={{ mt: 1 }}>{issuesError}</Alert>}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Report an Issue
            </Typography>
            <IssueForm onSubmit={handleCreate} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Your Issues
            </Typography>
            <IssueList issues={issues} />
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Announcements
            </Typography>
            <Divider sx={{ mb: 2 }} />
            {announcementsLoading && <Typography>Loading announcements...</Typography>}
            {announcementsError && <Alert severity="error">{announcementsError}</Alert>}
            <Announcements announcements={announcements} />
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default StudentDashboard;
