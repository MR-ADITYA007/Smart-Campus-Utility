import React from 'react';
import { Card, CardContent, Grid, Typography } from '@mui/material';

function Announcements({ announcements }) {
  if (!announcements.length) {
    return <Typography>No announcements yet.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {announcements.map((announcement) => (
        <Grid item xs={12} key={announcement.id}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {announcement.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {announcement.content}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Published: {new Date(announcement.published_at).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default Announcements;
