const express = require('express');
const db = require('../db');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    const result = await db.query(
      'INSERT INTO issues (title, description, category, priority, status, reporter_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [title, description, category, priority || 'MEDIUM', 'OPEN', req.user.id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not create issue' });
  }
});

router.get('/', authenticateToken, async (req, res) => {
  try {
    const query = req.user.role === 'admin'
      ? 'SELECT issues.*, users.username AS reporter FROM issues JOIN users ON issues.reporter_id = users.id ORDER BY created_at DESC'
      : 'SELECT issues.*, users.username AS reporter FROM issues JOIN users ON issues.reporter_id = users.id WHERE reporter_id = $1 ORDER BY created_at DESC';

    const params = req.user.role === 'admin' ? [] : [req.user.id];
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not fetch issues' });
  }
});

router.put('/:id', authenticateToken, authorizeRole('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status, assignee_id } = req.body;
    const result = await db.query(
      'UPDATE issues SET status = COALESCE($1, status), assignee_id = COALESCE($2, assignee_id) WHERE id = $3 RETURNING *',
      [status, assignee_id, id]
    );

    if (!result.rows.length) {
      return res.status(404).json({ error: 'Issue not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Could not update issue' });
  }
});

module.exports = router;
