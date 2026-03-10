const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const Doctor = require('../models/Doctor');
const User = require('../models/User');

let counter = 1;
function generateEmail() {
    // Simple deterministic email that always passes validation
    return `doctor${counter++}@hospital.com`;
}

function generatePassword(length = 10) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let pwd = '';
    for (let i = 0; i < length; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pwd;
}

(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const doctors = await Doctor.find();
        if (!doctors.length) {
            console.log('No doctors found in the database.');
            process.exit(0);
        }
        console.log('Doctor credentials (email / temporary password):');
        for (const doc of doctors) {
            // Skip if already linked to a user account
            if (doc.userId) {
                const existingUser = await User.findById(doc.userId);
                if (existingUser) {
                    console.log(`${existingUser.email} / (already set)`);
                    continue;
                }
            }
            const email = generateEmail();
            const tempPass = generatePassword();
            const hashed = await bcrypt.hash(tempPass, 10);
            const user = await User.create({
                name: doc.name || 'Doctor',
                email,
                password: hashed,
                role: 'doctor',
                phone: doc.phone || '0000000000'
            });
            doc.userId = user._id;
            await doc.save();
            console.log(`${email} / ${tempPass}`);
        }
        console.log('All doctors now have linked user accounts.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
})();
