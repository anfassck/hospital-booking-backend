const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Doctor = require('./models/Doctor');

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany();
        await Doctor.deleteMany();

        // Create admin user
        const admin = await User.create({
            name: 'Admin',
            email: 'admin@hospital.com',
            phone: '9876543210',
            password: 'admin123',
            role: 'admin'
        });
        console.log('Admin user created:', admin.email);

        // Create sample doctors
        const doctors = await Doctor.insertMany([
            {
                name: 'Dr. Aisha Sharma',
                specialty: 'Cardiologist',
                experience: 15,
                fee: 800,
                rating: 4.8,
                about: 'Experienced cardiologist specializing in heart disease prevention, diagnosis, and treatment. Trained at AIIMS Delhi with over 15 years of practice.',
                image: 'https://ui-avatars.com/api/?name=Aisha+Sharma&background=0ea5e9&color=fff&size=200',
                availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM', '04:00 PM']
            },
            {
                name: 'Dr. Rajesh Patel',
                specialty: 'Dermatologist',
                experience: 10,
                fee: 600,
                rating: 4.6,
                about: 'Skilled dermatologist specializing in skin care, acne treatment, and cosmetic dermatology. Uses latest techniques in skin treatment.',
                image: 'https://ui-avatars.com/api/?name=Rajesh+Patel&background=8b5cf6&color=fff&size=200',
                availability: ['Monday', 'Wednesday', 'Friday'],
                timeSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']
            },
            {
                name: 'Dr. Priya Nair',
                specialty: 'Pediatrician',
                experience: 12,
                fee: 500,
                rating: 4.9,
                about: 'Compassionate pediatrician dedicated to providing comprehensive health care for infants, children, and adolescents.',
                image: 'https://ui-avatars.com/api/?name=Priya+Nair&background=ec4899&color=fff&size=200',
                availability: ['Monday', 'Tuesday', 'Thursday', 'Friday', 'Saturday'],
                timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']
            },
            {
                name: 'Dr. Mohammed Khan',
                specialty: 'Orthopedic',
                experience: 18,
                fee: 900,
                rating: 4.7,
                about: 'Expert orthopedic surgeon specializing in joint replacements, sports injuries, and spine surgery with over 18 years of surgical experience.',
                image: 'https://ui-avatars.com/api/?name=Mohammed+Khan&background=f59e0b&color=fff&size=200',
                availability: ['Tuesday', 'Wednesday', 'Thursday', 'Saturday'],
                timeSlots: ['09:00 AM', '11:00 AM', '02:00 PM', '04:00 PM', '05:00 PM']
            },
            {
                name: 'Dr. Sneha Gupta',
                specialty: 'Neurologist',
                experience: 14,
                fee: 1000,
                rating: 4.8,
                about: 'Board-certified neurologist treating disorders of the brain, spinal cord, and nervous system. Specializes in migraine and epilepsy treatment.',
                image: 'https://ui-avatars.com/api/?name=Sneha+Gupta&background=06b6d4&color=fff&size=200',
                availability: ['Monday', 'Wednesday', 'Friday'],
                timeSlots: ['10:00 AM', '11:00 AM', '02:00 PM', '03:00 PM']
            },
            {
                name: 'Dr. Vikram Singh',
                specialty: 'General Physician',
                experience: 8,
                fee: 400,
                rating: 4.5,
                about: 'Dedicated general physician providing primary healthcare services including diagnosis, treatment, and preventive care for all age groups.',
                image: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=10b981&color=fff&size=200',
                availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM']
            },
            {
                name: 'Dr. Ananya Reddy',
                specialty: 'Gynecologist',
                experience: 11,
                fee: 700,
                rating: 4.7,
                about: 'Experienced gynecologist providing comprehensive women\'s healthcare, prenatal care, and minimally invasive surgical procedures.',
                image: 'https://ui-avatars.com/api/?name=Ananya+Reddy&background=e11d48&color=fff&size=200',
                availability: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
                timeSlots: ['09:00 AM', '10:00 AM', '11:00 AM', '03:00 PM', '04:00 PM']
            },
            {
                name: 'Dr. Arjun Menon',
                specialty: 'ENT Specialist',
                experience: 9,
                fee: 550,
                rating: 4.6,
                about: 'ENT specialist treating conditions of the ear, nose, and throat. Expert in sinus surgery, hearing disorders, and voice problems.',
                image: 'https://ui-avatars.com/api/?name=Arjun+Menon&background=7c3aed&color=fff&size=200',
                availability: ['Tuesday', 'Wednesday', 'Friday', 'Saturday'],
                timeSlots: ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM']
            }
        ]);

        console.log(`${doctors.length} doctors seeded successfully`);
        console.log('\n--- Seed Complete ---');
        console.log('Admin Login: admin@hospital.com / admin123');

        process.exit(0);
    } catch (error) {
        console.error('Seed error:', error);
        process.exit(1);
    }
};

seedData();
