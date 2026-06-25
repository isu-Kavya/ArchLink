const express = require('express');
const router = express.Router();
const { authClient, registerClient, getArchitects, getClientProfile, updateClientProfile, getArchitectById } = require('../controllers/clientController');
const { protect, client } = require('../middleware/authMiddleware');

router.post('/login', authClient);
router.post('/register', registerClient);
router.get('/architects', getArchitects);
router.get('/architects/:id', getArchitectById);
router.get('/profile', protect, client, getClientProfile);
router.put('/profile', protect, client, updateClientProfile);

module.exports = router;
