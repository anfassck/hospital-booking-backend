const express = require('express');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/admin/users
// @desc    Get all doctor users (admin only)
// @access  Private/Admin
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({ role: 'doctor' }).select('-password'); // omit password hash
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/admin/users/:id
// @desc    Update doctor user's email and/or password (admin only)
// @access  Private/Admin
router.put('/users/:id', protect, admin, async (req, res) => {
    try {
        const { email, password, name, phone } = req.body;
        const update = {};
        if (email) update.email = email;
        if (name) update.name = name;
        if (phone) update.phone = phone;
        if (password) update.password = password; // pre-save hook will hash
        const user = await User.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User updated', user: { _id: user._id, name: user.name, email: user.email, phone: user.phone, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
