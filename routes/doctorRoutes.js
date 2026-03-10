const express = require('express');
const Doctor = require('../models/Doctor');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/doctors
// @desc    Get all doctors
// @access  Public
router.get('/', async (req, res) => {
    try {
        const { specialty, search } = req.query;
        let query = {};

        if (specialty && specialty !== 'All') {
            query.specialty = specialty;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { specialty: { $regex: search, $options: 'i' } }
            ];
        }

        const doctors = await Doctor.find(query).populate('userId', 'email password').sort({ createdAt: -1 });
        res.json(doctors);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/doctors/:id
// @desc    Get single doctor
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/doctors
// @desc    Add a new doctor (also creates login account)
// @access  Private/Admin
router.post('/', protect, admin, async (req, res) => {
    try {
        const { email, password, ...doctorData } = req.body;

        let userId = null;

        // If email & password provided, create a doctor user account
        if (email && password) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'A user with this email already exists' });
            }

            const userAccount = await User.create({
                name: doctorData.name,
                email,
                password,
                role: 'doctor'
            });
            userId = userAccount._id;
        }

        const doctor = await Doctor.create({
            ...doctorData,
            userId
        });

        res.status(201).json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/doctors/:id
// @desc    Update a doctor
// @access  Private/Admin
router.put('/:id', protect, admin, async (req, res) => {
    try {
        let doctor = await Doctor.findById(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        const { email, password, ...doctorUpdates } = req.body;
        // Update doctor fields
        doctor = await Doctor.findByIdAndUpdate(req.params.id, doctorUpdates, { new: true, runValidators: true });
        // Update linked user account if email or password provided
        if (email || password) {
            const user = await User.findById(doctor.userId);
            if (user) {
                if (email) user.email = email;
                if (password) user.password = password; // will be hashed by pre-save hook
                await user.save();
            }
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/doctors/:id
// @desc    Delete a doctor
// @access  Private/Admin
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndDelete(req.params.id);
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor not found' });
        }
        res.json({ message: 'Doctor removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
