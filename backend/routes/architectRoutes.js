const express = require('express');
const router = express.Router();
const { authArchitect, getArchitectProfile, updateArchitectProfile } = require('../controllers/architectController');
const { protect, architect } = require('../middleware/authMiddleware');

router.post('/login', authArchitect);
router.get('/profile', protect, architect, getArchitectProfile);
router.put('/profile', protect, architect, updateArchitectProfile);

module.exports = router;
