const express = require('express');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all tasks for a user
router.get('/', authMiddleware, (req, res) => {
    db.query('SELECT * FROM tasks WHERE user_id = ?', [req.user.userId], (err, results) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json(results);
    });
});

// Add a new task
router.post('/', authMiddleware, (req, res) => {
    const { name, description, status } = req.body;
    
    db.query('INSERT INTO tasks (user_id, name, description, status) VALUES (?, ?, ?, ?)', 
    [req.user.userId, name, description, status], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.status(201).json({ message: 'Task added successfully' });
    });
});

// Update a task
router.put('/:id', authMiddleware, (req, res) => {
    const { name, description, status } = req.body;
    
    db.query('UPDATE tasks SET name = ?, description = ?, status = ? WHERE id = ? AND user_id = ?', 
    [name, description, status, req.params.id, req.user.userId], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Task updated successfully' });
    });
});

// Delete a task
router.delete('/:id', authMiddleware, (req, res) => {
    db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [req.params.id, req.user.userId], (err) => {
        if (err) return res.status(500).json({ message: 'Database error' });
        res.json({ message: 'Task deleted successfully' });
    });
});

module.exports = router;