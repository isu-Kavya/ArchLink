const Client = require('../models/Client');
const Architect = require('../models/Architect');
const Project = require('../models/Project'); // Import Project model
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcrypt');


// Auth client & get token
// route   POST /api/client/login
// access  Public
const authClient = async (req, res) => {
  const { email, password } = req.body;

  const client = await Client.findOne({ email });

  if (client && (await bcrypt.compare(password, client.password))) {
    res.json({
      _id: client._id,
      fullName: client.fullName,
      email: client.email,
      role: client.role,
      token: generateToken(client._id, client.role),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// Register a new client
// route   POST /api/client/register
// access  Public
const registerClient = async (req, res) => {
  const { fullName, email, password, phoneNumber, address } = req.body;

  const clientExists = await Client.findOne({ email });

  if (clientExists) {
    return res.status(400).json({ message: 'Client already exists' });
  }

  const client = await Client.create({
    fullName,
    email,
    password,
    phoneNumber,
    address
  });

  if (client) {
    res.status(201).json({
      _id: client._id,
      fullName: client.fullName,
      email: client.email,
      role: client.role,
      token: generateToken(client._id, client.role),
    });
  } else {
    res.status(400).json({ message: 'Invalid client data' });
  }
};

// Get all architects (for client to browse)
// route   GET /api/client/architects
// access  Public
const getArchitects = async (req, res) => {
  try {
    const architects = await Architect.find({}).select('-password');
    // Ensure profilePicture has full path if needed, or rely on frontend to prepend base URL
    res.json(architects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching architects' });
  }
};

// Get single architect details with past projects
// route   GET /api/client/architects/:id
// access  Public
const getArchitectById = async (req, res) => {
  try {
    const architect = await Architect.findById(req.params.id).select('-password');
    
    if (!architect) {
      return res.status(404).json({ message: 'Architect not found' });
    }

    // Find closed projects for this architect
    const pastProjects = await Project.find({ 
      architectId: req.params.id, 
      status: 'Closed' 
    }).select('projectTitle projectDescription projectType location createdAt');

    res.json({
      ...architect.toObject(),
      pastProjects
    });
  } catch (error) {
    console.error(error);
    if (error.kind === 'ObjectId') {
        return res.status(404).json({ message: 'Architect not found' });
    }
    res.status(500).json({ message: 'Error fetching architect details' });
  }
};

// Get current client profile
// route   GET /api/client/profile
// access  Private/Client
const getClientProfile = async (req, res) => {
  const client = await Client.findById(req.user._id).select('-password');
  if (client) {
    res.json(client);
  } else {
    res.status(404).json({ message: 'Client not found' });
  }
};

// Update client profile
// route   PUT /api/client/profile
// access  Private/Client
const updateClientProfile = async (req, res) => {
  const client = await Client.findById(req.user._id);

  if (client) {
    client.fullName = req.body.fullName || client.fullName;
    client.phoneNumber = req.body.phoneNumber || client.phoneNumber;
    client.address = req.body.address || client.address;
    
    // Allow password update if provided
    if (req.body.password) {
      client.password = req.body.password;
    }

    const updatedClient = await client.save();

    res.json({
      _id: updatedClient._id,
      fullName: updatedClient.fullName,
      email: updatedClient.email,
      phoneNumber: updatedClient.phoneNumber,
      address: updatedClient.address,
      role: updatedClient.role,
      token: generateToken(updatedClient._id, updatedClient.role),
    });
  } else {
    res.status(404).json({ message: 'Client not found' });
  }
};

module.exports = { authClient, registerClient, getArchitects, getClientProfile, updateClientProfile, getArchitectById };
