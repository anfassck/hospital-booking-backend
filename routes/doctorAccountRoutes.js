const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Get current logged-in doctor user info
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Update password for current logged-in doctor
router.put('/me/password', protect, async (req, res) => {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: 'Password required' });
    try {
        const hashed = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(req.user.id, { password: hashed });
        res.json({ message: 'Password updated' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
