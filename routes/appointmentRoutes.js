/**
 * Appointment Routes
 * POST   /api/appointments         → Book an appointment (auth required)
 * GET    /api/appointments/my      → Get patient's own appointments
 * GET    /api/appointments         → Get all appointments (admin only)
 * PUT    /api/appointments/:id/status → Update status (confirm/cancel/complete)
 */
const express = require('express');
const Appointment = require('../models/Appointment');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// @route   POST /api/appointments
// @desc    Book an appointment
// @access  Private
router.post('/', protect, async (req, res) => {
    try {
        const { doctor, date, time, notes } = req.body;

        // Check how many tokens are booked for this doctor + date + time slot (max 60)
        const slotCount = await Appointment.countDocuments({
            doctor,
            date,
            time,
            status: { $ne: 'cancelled' }
        });

        if (slotCount >= 60) {
            return res.status(400).json({ message: 'All 60 tokens for this time slot are booked. Please choose another slot.' });
        }

        // Generate token number (per doctor per date — sequential across all slots)
        const todayAppointments = await Appointment.countDocuments({
            doctor,
            date,
            status: { $ne: 'cancelled' }
        });
        const tokenNumber = todayAppointments + 1;

        const appointment = await Appointment.create({
            patient: req.user._id,
            doctor,
            date,
            time,
            notes,
            tokenNumber
        });

        const populated = await appointment.populate([
            { path: 'doctor', select: 'name specialty fee image' },
            { path: 'patient', select: 'name email phone' }
        ]);

        res.status(201).json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/appointments/my
// @desc    Get logged in patient's appointments
// @access  Private
router.get('/my', protect, async (req, res) => {
    try {
        const appointments = await Appointment.find({ patient: req.user._id })
            .populate('doctor', 'name specialty fee image')
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/appointments
// @desc    Get all appointments (admin)
// @access  Private/Admin
router.get('/', protect, admin, async (req, res) => {
    try {
        const appointments = await Appointment.find()
            .populate('doctor', 'name specialty fee image')
            .populate('patient', 'name email phone')
            .sort({ createdAt: -1 });
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/appointments/:id/status
// @desc    Update appointment status
// @access  Private/Admin
router.put('/:id/status', protect, async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        // Allow admin to change any status, or patient to cancel their own
        if (req.user.role === 'admin') {
            appointment.status = req.body.status;
        } else if (appointment.patient.toString() === req.user._id.toString() && req.body.status === 'cancelled') {
            appointment.status = 'cancelled';
        } else {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await appointment.save();
        const populated = await appointment.populate([
            { path: 'doctor', select: 'name specialty fee image' },
            { path: 'patient', select: 'name email phone' }
        ]);

        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
