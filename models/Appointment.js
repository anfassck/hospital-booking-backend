/**
 * Appointment Model
 * Stores patient-doctor appointment bookings
 * Status: pending → confirmed → completed (or cancelled)
 * Color-coded status badges in frontend UI
 */
const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Doctor',
        required: true
    },
    date: {
        type: String,
        required: [true, 'Please add appointment date']
    },
    time: {
        type: String,
        required: [true, 'Please add appointment time']
    },
    tokenNumber: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    },
    notes: {
        type: String,
        default: ''
    },
    illness: {
        type: String,
        default: ''
    },
    diagnosis: {
        type: String,
        default: ''
    },
    nextVisitDate: {
        type: String,
        default: ''
    }
}, { timestamps: true });

module.exports = mongoose.model('Appointment', appointmentSchema);
