const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectTitle: { type: String, required: true },
  projectDescription: { type: String, required: true },
  projectType: { type: String },
  budgetRange: { type: String },
  preferredCompletionDate: { type: Date },
  location: { type: String },
  status: { type: String, default: 'pending', enum: ['pending', 'responded', 'closed'] },
  emailSent: { type: Boolean, default: false },
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true },
  architectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Architect' }
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);
