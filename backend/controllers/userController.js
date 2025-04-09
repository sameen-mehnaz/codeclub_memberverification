const userModel = require('../models/userModel');

const userController = {
  getUser: async (req, res) => {
    try {
      const user = await userModel.getUserDetails(req.session.userId);
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user details', error });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await userModel.getAllUsers();
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error });
    }
  }
};

module.exports = userController;
