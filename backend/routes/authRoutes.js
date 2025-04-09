const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();

// Simple logging middleware to track requests
router.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  console.log("Request body:", req.body);
  next();
});

// Registration Route
router.post('/register', async (req, res) => {
  try {
    await authController.register(req, res);  // Handle registration logic
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: 'Internal server error during registration' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    await authController.login(req, res);  // Handle login logic
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: 'Internal server error during login' });
  }
});

// Logout Route
router.post('/logout', async (req, res) => {
  try {
    await authController.logout(req, res);  // Handle logout logic
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: 'Internal server error during logout' });
  }
});

// Get All Users Route
router.get('/users', async (req, res) => {
  try {
    await authController.getAllUsers(req, res);  // Fetch users logic
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: 'Error fetching users' });
  }
});

// Generic error handling middleware (if something goes wrong not caught above)
router.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: 'An unexpected error occurred' });
});

module.exports = router;
