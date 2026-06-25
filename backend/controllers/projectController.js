const Project = require('../models/Project');
const sendProjectNotification = require('../utils/emailService');

// Create a new project request
// route   POST /api/projects/request
// access  Private/Client
const createProjectRequest = async (req, res) => {
  try {
    const { projectTitle, projectDescription, projectType, budgetRange, preferredCompletionDate, location, architectId } = req.body;

    const project = await Project.create({
      projectTitle,
      projectDescription,
      projectType,
      budgetRange,
      preferredCompletionDate,
      location,
      clientId: req.user._id,
      architectId,
      status: 'pending'
    });

    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: 'Invalid project data' });
  }
};

// Get logged in client's projects
// route   GET /api/projects/my-projects
// access  Private/Client
const getMyProjects = async (req, res) => {
  try {
    const projects = await Project.find({ clientId: req.user._id })
      .populate('architectId', 'fullName email profilePicture')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};

// Get projects assigned to architect
// route   GET /api/projects/architect-requests
// access  Private/Architect
const getArchitectRequests = async (req, res) => {
  try {
    const projects = await Project.find({ architectId: req.user._id })
      .populate('clientId', 'fullName email')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching requests' });
  }
};

// Update project status (Mark as responded)
// route   PATCH /api/projects/:id/respond
// access  Private/Architect
const updateProjectStatus = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('clientId', 'email fullName')
      .populate('architectId', 'fullName');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    if (project.architectId._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Handle status updates from request body if provided
    const { status } = req.body;

    if (status) {
        project.status = status;
        // If closing, we assume email is sent
        if (status === 'closed') {
            project.emailSent = true;
        }
    } else {
        // Fallback toggle logic if no explicit status provided
        if (project.status === 'responded') {
            project.status = 'closed';
            project.emailSent = true;
        } else if (project.status === 'pending') {
            project.status = 'responded';
        }
    }
    
    await project.save();

    // Trigger email notification
    if (project.clientId && project.clientId.email) {
        await sendProjectNotification(
            project.clientId.email,
            req.user.fullName, // Architect Name from session/token user
            project.projectTitle
        );
    } else {
        console.warn('Client email not found for notification.');
    }

    res.json(project);
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({ message: 'Error updating project' });
  }
};

// Get all projects (Admin)
// route   GET /api/projects/all
// access  Private/Admin
const getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find({})
      .populate('clientId', 'fullName')
      .populate('architectId', 'fullName')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
};


module.exports = { 
  createProjectRequest, 
  getMyProjects, 
  getArchitectRequests, 
  updateProjectStatus,
  getAllProjects
};
