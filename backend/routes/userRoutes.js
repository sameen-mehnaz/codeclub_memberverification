const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

router.get('/me', authMiddleware.isAuthenticated, userController.getUser);
router.get('/all', authMiddleware.isAdmin, userController.getAllUsers);

module.exports = router;
