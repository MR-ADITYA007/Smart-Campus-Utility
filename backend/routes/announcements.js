const express = require('express');
const db = require('../db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM announcements ORDER BY published_at DESC');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch announcements' });
  }
});

router.post('/', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { title, content } = req.body;
    const result = await db.query(
      'INSERT INTO announcements (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create announcement' });
  }
});

module.exports = router;
