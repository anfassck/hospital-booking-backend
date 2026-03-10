const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();
const User = require('../models/User');

function generatePassword(length = 8) {
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
        const doctors = await User.find({ role: 'doctor' });
        if (!doctors.length) {
            console.log('No doctor accounts found.');
            process.exit(0);
        }
        console.log('Doctor credentials (email / temporary password):');
        for (const doc of doctors) {
            const tempPass = generatePassword();
            const hashed = await bcrypt.hash(tempPass, 10);
            await User.updateOne({ _id: doc._id }, { password: hashed });
            console.log(`${doc.email} / ${tempPass}`);
        }
        console.log('Passwords have been reset to the above temporary values.');
        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
})();
