/**
 * Doctor Dashboard Routes
 * GET    /api/doctor/profile        → Get doctor's own profile
 * GET    /api/doctor/appointments   → Get doctor's appointments with patient details
 * PUT    /api/doctor/appointments/:id/illness → Update patient illness, diagnosis, next visit
 * PUT    /api/doctor/appointments/:id/status  → Confirm/complete appointments
 */
const express = require('express');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/Doctor');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Middleware: check if user is a doctor
const isDoctor = (req, res, next) => {
    if (req.user.role !== 'doctor') {
        return res.status(403).json({ message: 'Access denied. Doctors only.' });
    }
    next();
};

// @route   GET /api/doctor/profile
// @desc    Get doctor's own profile
router.get('/profile', protect, isDoctor, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user._id });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }
        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   GET /api/doctor/appointments
// @desc    Get all appointments for this doctor (today or filtered by date)
router.get('/appointments', protect, isDoctor, async (req, res) => {
    try {
        const doctor = await Doctor.findOne({ userId: req.user._id });
        if (!doctor) {
            return res.status(404).json({ message: 'Doctor profile not found' });
        }

        const query = { doctor: doctor._id };

        // Filter by date if provided
        if (req.query.date) {
            query.date = req.query.date;
        }

        const appointments = await Appointment.find(query)
            .populate('patient', 'name email phone')
            .sort({ tokenNumber: 1 });

        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/doctor/appointments/:id/illness
// @desc    Add/update patient illness, diagnosis, and next visit date
router.put('/appointments/:id/illness', protect, isDoctor, async (req, res) => {
    try {
        const { illness, diagnosis, nextVisitDate } = req.body;
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (illness !== undefined) appointment.illness = illness;
        if (diagnosis !== undefined) appointment.diagnosis = diagnosis;
        if (nextVisitDate !== undefined) appointment.nextVisitDate = nextVisitDate;

        await appointment.save();

        const populated = await appointment.populate('patient', 'name email phone');
        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/doctor/appointments/:id/status
// @desc    Doctor confirms or completes an appointment
router.put('/appointments/:id/status', protect, isDoctor, async (req, res) => {
    try {
        const { status } = req.body;

        if (!['confirmed', 'completed', 'cancelled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        appointment.status = status;
        await appointment.save();

        const populated = await appointment.populate('patient', 'name email phone');
        res.json(populated);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
