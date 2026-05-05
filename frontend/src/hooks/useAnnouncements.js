import { useEffect, useState } from 'react';
import api from '../api';

export default function useAnnouncements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await api.get('/announcements');
      setAnnouncements(response.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const addAnnouncement = (newAnnouncement) => {
    setAnnouncements(prev => [newAnnouncement, ...prev]);
  };

  return { announcements, loading, error, refetch: fetchAnnouncements, addAnnouncement };
}
