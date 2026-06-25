const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const architectSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  specialization: { type: String },
  yearsOfExperience: { type: Number },
  profileDescription: { type: String },
  portfolioLink: { type: String },
  profilePicture: { type: String, default: '/uploads/placeholder.jpg' }, 
  availabilityStatus: { type: String, default: 'Available', enum: ['Available', 'Busy', 'On Leave'] },
  portfolioProjects: [{
    title: { type: String, required: true },
    images: [{ type: String }] 
  }],
  role: { type: String, default: 'ARCHITECT', enum: ['ARCHITECT'] }
}, { timestamps: true });

architectSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Architect', architectSchema);
