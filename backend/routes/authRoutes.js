const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const router = express.Router();
const SECRET_KEY = "your_secret_key"; // Change this for security

// Signup Route
// Signup Route
router.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    
    try {
        // Check if user exists
        db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
            if (results.length > 0) {
                return res.status(400).json({ message: 'User already exists' });
            }
            
            // Hash password and save user
            const hashedPassword = await bcrypt.hash(password, 10);
            db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', 
            [name, email, hashedPassword], (err) => {
                if (err) return res.status(500).json({ message: 'Database error' });
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login Route
// Backend: authRoutes.js
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
        if (results.length === 0) return res.status(400).json({ message: 'Invalid credentials' });

        const user = results[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, name: user.name }); // Ensure the token is returned
    });
});

module.exports = router;
