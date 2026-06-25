const express = require('express');
const router = express.Router();
const { authAdmin, registerArchitect, getAllArchitects, deleteArchitect, getSystemStats } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/login', authAdmin);
router.post('/register-architect', protect, admin, registerArchitect);
router.get('/architects', protect, admin, getAllArchitects);
router.delete('/architects/:id', protect, admin, deleteArchitect);
router.get('/stats', protect, admin, getSystemStats);

module.exports = router;
