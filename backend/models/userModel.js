const db = require('../config/database');

const userModel = {
  createUser: async (username, hashedPassword, role) => {
    const [result] = await db.execute(
      'INSERT INTO users (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role]
    );
    return result.insertId;
  },
  
  findByUsername: async (username) => {
    const [rows] = await db.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  },
  
  getUserDetails: async (userId) => {
    const [rows] = await db.execute(
      'SELECT u.id, u.username, u.role, ud.full_name, ud.email, ud.phone, ud.address ' +
      'FROM users u ' +
      'LEFT JOIN user_details ud ON u.id = ud.user_id ' +
      'WHERE u.id = ?',
      [userId]
    );
    return rows[0];
  },
  
  getAllUsers: async () => {
    const [rows] = await db.execute(
      'SELECT u.id, u.username, u.role, ud.full_name, ud.email ' +
      'FROM users u ' +
      'LEFT JOIN user_details ud ON u.id = ud.user_id'
    );
    return rows;
  },
  
  updateUserDetails: async (userId, details) => {
    const { full_name, email, phone, address } = details;
    
    const [existingRows] = await db.execute(
      'SELECT * FROM user_details WHERE user_id = ?',
      [userId]
    );
    
    if (existingRows.length > 0) {
      await db.execute(
        'UPDATE user_details SET full_name = ?, email = ?, phone = ?, address = ? WHERE user_id = ?',
        [full_name, email, phone, address, userId]
      );
    } else {
      await db.execute(
        'INSERT INTO user_details (user_id, full_name, email, phone, address) VALUES (?, ?, ?, ?, ?)',
        [userId, full_name, email, phone, address]
      );
    }
    
    return true;
  }
};

module.exports = userModel;
