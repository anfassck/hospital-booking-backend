/**
 * Doctor Model
 * Stores doctor profiles with specialty, experience, fees,
 * availability days, time slots, and ratings
 * Displayed as premium cards with micro-animations in frontend
 */
const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: [true, 'Please add doctor name'],
        trim: true
    },
    specialty: {
        type: String,
        required: [true, 'Please add specialty'],
        trim: true
    },
    experience: {
        type: Number,
        required: [true, 'Please add years of experience']
    },
    fee: {
        type: Number,
        required: [true, 'Please add consultation fee']
    },
    image: {
        type: String,
        default: ''
    },
    availability: {
        type: [String],
        default: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
    },
    timeSlots: {
        type: [String],
        default: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']
    },
    rating: {
        type: Number,
        default: 4.5,
        min: 0,
        max: 5
    },
    about: {
        type: String,
        default: ''
    },
    isAvailable: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
