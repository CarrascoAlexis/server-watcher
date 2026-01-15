const { verifyPassword, generateToken } = require('../utils/auth');
const User = require('../models/User');

const AuthController = {
  register: (req, res) => {
    try {
      const { username, email, password } = req.body;
      
      if (!username || !email || !password) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
      
      const user = User.create(username, email, password);
      res.status(201).json({ userId: user.id, message: 'User registered successfully' });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },

  login: (req, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ error: 'Missing username or password' });
      }
      
      const user = User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: 'User not found' });
      }
      
      if (!verifyPassword(password, user.password_hash)) {
        return res.status(401).json({ error: 'Invalid password' });
      }
      
      const token = generateToken(user.id);
      res.json({ userId: user.id, token });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getMe: (req, res) => {
    try {
      const user = User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.json(user);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
};

module.exports = AuthController;
