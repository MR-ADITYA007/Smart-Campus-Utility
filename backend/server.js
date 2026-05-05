require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const issueRoutes = require('./routes/issues');
const announcementRoutes = require('./routes/announcements');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/issues', issueRoutes);
app.use('/api/announcements', announcementRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Smart Campus Utility API' });
});

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
