import React from 'react';
import { Card, CardContent, Chip, Grid, Typography } from '@mui/material';

function IssueList({ issues }) {
  if (!issues.length) {
    return <Typography>No issues found.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {issues.map((issue) => (
        <Grid item xs={12} key={issue.id}>
          <Card elevation={1}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {issue.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {issue.description}
              </Typography>
              <Chip label={`Category: ${issue.category}`} size="small" sx={{ mr: 1, mb: 1 }} />
              <Chip label={`Priority: ${issue.priority}`} size="small" color={
                issue.priority === 'URGENT' ? 'error' :
                issue.priority === 'HIGH' ? 'error' :
                issue.priority === 'MEDIUM' ? 'warning' : 'default'
              } sx={{ mr: 1, mb: 1 }} />
              <Chip label={`Status: ${issue.status}`} size="small" color={
                issue.status === 'OPEN' ? 'default' :
                issue.status === 'IN_PROGRESS' ? 'primary' :
                issue.status === 'RESOLVED' ? 'success' : 'secondary'
              } sx={{ mb: 1 }} />
              <Typography variant="caption" display="block">
                Reported by: {issue.reporter} • {new Date(issue.created_at).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}

export default IssueList;
