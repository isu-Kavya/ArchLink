const express = require('express');
const router = express.Router();
const { 
  createProjectRequest, 
  getMyProjects, 
  getArchitectRequests, 
  updateProjectStatus,
  getAllProjects 
} = require('../controllers/projectController');
const { protect, client, architect, admin } = require('../middleware/authMiddleware');

router.post('/request', protect, client, createProjectRequest);
router.get('/my-projects', protect, client, getMyProjects);
router.get('/architect-requests', protect, architect, getArchitectRequests);
router.patch('/:id/respond', protect, architect, updateProjectStatus);
router.get('/all', protect, admin, getAllProjects);

module.exports = router;
