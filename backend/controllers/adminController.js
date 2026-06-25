const Admin = require('../models/Admin');
const Architect = require('../models/Architect');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcrypt');

// Auth admin & get token
// route   POST /api/admin/login
// access  Public
const authAdmin = async (req, res) => {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });

  if (admin && (await bcrypt.compare(password, admin.password))) {
    res.json({
      _id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
      token: generateToken(admin._id, admin.role),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// Register a new architect
// route   POST /api/admin/register-architect
// access  Private/Admin
const registerArchitect = async (req, res) => {
  const { fullName, email, password, phoneNumber, specialization, yearsOfExperience, profileDescription, portfolioLink } = req.body;

  const architectExists = await Architect.findOne({ email });

  if (architectExists) {
    return res.status(400).json({ message: 'Architect already exists' });
  }

  // Password will be hashed by the pre-save hook in the Architect model
  const architect = await Architect.create({
    fullName,
    email,
    password,
    phoneNumber,
    specialization,
    yearsOfExperience,
    profileDescription,
    portfolioLink
  });

  if (architect) {
    res.status(201).json({
      _id: architect._id,
      fullName: architect.fullName,
      email: architect.email,
      role: architect.role,
    });
  } else {
    res.status(400).json({ message: 'Invalid architect data' });
  }
};

// Get all architects (Admin)
// route   GET /api/admin/architects
// access  Private/Admin
const getAllArchitects = async (req, res) => {
  try {
    const architects = await Architect.find({}).select('-password');
    res.json(architects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching architects' });
  }
};

// Delete architect
// route   DELETE /api/admin/architects/:id
// access  Private/Admin
const deleteArchitect = async (req, res) => {
  try {
    const architect = await Architect.findById(req.params.id);

    if (architect) {
      await architect.deleteOne();
      res.json({ message: 'Architect removed' });
    } else {
      res.status(404).json({ message: 'Architect not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error removing architect' });
  }
};

const Client = require('../models/Client');
const Project = require('../models/Project');

// Get system stats (Admin)
// route   GET /api/admin/stats
// access  Private/Admin
const getSystemStats = async (req, res) => {
  try {
    const totalUsers = await Admin.countDocuments({}) + await Architect.countDocuments({}) + await Client.countDocuments({});
    const totalArchitects = await Architect.countDocuments({});
    const totalClients = await Client.countDocuments({});
    const totalProjects = await Project.countDocuments({});
    
    res.json({
        totalUsers,
        totalArchitects,
        totalClients,
        totalProjects
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats' });
  }
};

module.exports = { authAdmin, registerArchitect, getAllArchitects, deleteArchitect, getSystemStats };
