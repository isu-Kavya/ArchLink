require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('./models/Admin');

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding');

    const adminExists = await Admin.findOne({ email: 'admin@archlink.com' });
    if (adminExists) {
      console.log('Admin already exists');
      process.exit();
    }

    const admin = await Admin.create({
      fullName: 'System Admin',
      email: 'admin@archlink.com',
      password: 'adminpassword123',
      role: 'ADMIN'
    });

    console.log('Admin created successfully:', admin.email);
    process.exit();
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();
