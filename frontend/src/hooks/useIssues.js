import { useEffect, useState } from 'react';
import api from '../api';

export default function useIssues() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchIssues = async () => {
    try {
      setLoading(true);
      const response = await api.get('/issues');
      setIssues(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load issues');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const addIssue = (newIssue) => {
    setIssues(prev => [newIssue, ...prev]);
  };

  const updateIssue = (updatedIssue) => {
    setIssues(prev => prev.map(issue =>
      issue.id === updatedIssue.id ? updatedIssue : issue
    ));
  };

  return {
    issues,
    loading,
    error,
    refetch: fetchIssues,
    addIssue,
    updateIssue
  };
}