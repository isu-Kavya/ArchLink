const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const clientSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phoneNumber: { type: String },
  address: { type: String },
  role: { type: String, default: 'CLIENT', enum: ['CLIENT'] }
}, { timestamps: true });

clientSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

module.exports = mongoose.model('Client', clientSchema);
