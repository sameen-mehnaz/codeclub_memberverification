const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const db = require('../config/database');

const authController = {
  // Register a new user
  register: async (req, res) => {
    try {
      console.log("Incoming registration request:", req.body);

      const { username, password, role } = req.body;
      if (!username || !password || !role) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Check if user already exists
      const existingUser = await userModel.findByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: 'Username already exists' });
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, 10);
      const userId = await userModel.createUser(username, hashedPassword, role);

      console.log("User registered successfully with ID:", userId);
      res.status(201).json({ message: 'User registered successfully', userId });
    } catch (error) {
      console.error("Error registering user:", error);
      res.status(500).json({ message: 'Error registering user', error: error.message || error });
    }
  },

  // Login a user
  login: async (req, res) => {
    try {
      console.log("Login attempt with:", req.body);

      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
      }

      // Find the user in the database
      const user = await userModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Compare plaintext password with hashed password in DB
      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log(`Password match result for ${username}:`, isPasswordValid);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Set session info
      req.session.userId = user.id;
      req.session.role = user.role;

      console.log(`User ${username} logged in successfully`);
      res.json({ message: 'Login successful', userId: user.id, role: user.role });
    } catch (error) {
      console.error("Error logging in:", error);
      res.status(500).json({ message: 'Error logging in', error: error.message || error });
    }
  },

  // Logout user
  logout: (req, res) => {
    console.log("User logging out:", req.session.userId);

    req.session.destroy((err) => {
      if (err) {
        console.error("Error logging out:", err);
        return res.status(500).json({ message: 'Error logging out' });
      }
      res.clearCookie('connect.sid'); // optional: clear session cookie
      res.json({ message: 'Logout successful' });
    });
  },

  // Fetch all users
  getAllUsers: async (req, res) => {
    try {
      const [users] = await db.query('SELECT id, username, role FROM users');
      res.json(users);
    } catch (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ message: 'Error fetching users', error: error.message || error });
    }
  }
};

module.exports = authController;
