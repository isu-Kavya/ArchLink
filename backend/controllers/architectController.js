const Architect = require('../models/Architect');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcrypt');

// Auth architect & get token
// route   POST /api/architect/login
// access  Public
const authArchitect = async (req, res) => {
  const { email, password } = req.body;

  const architect = await Architect.findOne({ email });

  if (architect && (await bcrypt.compare(password, architect.password))) {
    res.json({
      _id: architect._id,
      fullName: architect.fullName,
      email: architect.email,
      role: architect.role,
      token: generateToken(architect._id, architect.role),
    });
  } else {
    res.status(401).json({ message: 'Invalid email or password' });
  }
};

// Get current architect profile
// route   GET /api/architect/profile
// access  Private/Architect
const getArchitectProfile = async (req, res) => {
  const architect = await Architect.findById(req.user._id).select('-password');
  if (architect) {
    res.json(architect);
  } else {
    res.status(404).json({ message: 'Architect not found' });
  }
};

// Update architect profile
// route   PUT /api/architect/profile
// access  Private/Architect
const updateArchitectProfile = async (req, res) => {
  const architect = await Architect.findById(req.user._id);

  if (architect) {
    architect.fullName = req.body.fullName || architect.fullName;
    architect.phoneNumber = req.body.phoneNumber || architect.phoneNumber;
    architect.specialization = req.body.specialization || architect.specialization;
    architect.yearsOfExperience = req.body.yearsOfExperience || architect.yearsOfExperience;
    architect.profileDescription = req.body.profileDescription || architect.profileDescription;
    architect.portfolioLink = req.body.portfolioLink || architect.portfolioLink;
    architect.availabilityStatus = req.body.availabilityStatus || architect.availabilityStatus;
    architect.profilePicture = req.body.profilePicture || architect.profilePicture;

    if (req.body.password) {
      architect.password = req.body.password;
    }

    const updatedArchitect = await architect.save();

    res.json({
      _id: updatedArchitect._id,
      fullName: updatedArchitect.fullName,
      email: updatedArchitect.email,
      role: updatedArchitect.role,
      token: generateToken(updatedArchitect._id, updatedArchitect.role),
    });
  } else {
    res.status(404).json({ message: 'Architect not found' });
  }
};

// Upload portfolio project
// route   POST /api/architect/portfolio/upload
// access  Private/Architect
const uploadPortfolioProject = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No images uploaded' });
        }
        
        const { title } = req.body;
        if (!title) {
            return res.status(400).json({ message: 'Project title is required' });
        }

        const imagePaths = req.files.map(file => `/${file.path.replace(/\\/g, '/')}`);

        const architect = await Architect.findById(req.user._id);
        
        if (!architect) {
             return res.status(404).json({ message: 'Architect not found' });
        }

        const newProject = {
            title: title,
            images: imagePaths
        };

        architect.portfolioProjects.push(newProject);
        await architect.save();

        res.status(201).json(newProject);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error uploading portfolio' });
    }
}

module.exports = { authArchitect, getArchitectProfile, updateArchitectProfile, uploadPortfolioProject };
