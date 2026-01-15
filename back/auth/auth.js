const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { db } = require('../db/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-prod';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '7d';

const hashPassword = (password) => {
  return bcryptjs.hashSync(password, 10);
};

const verifyPassword = (password, hash) => {
  return bcryptjs.compareSync(password, hash);
};

const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

const registerUser = (username, email, password) => {
  try {
    const passwordHash = hashPassword(password);
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(username, email, passwordHash);
    return { id: result.lastInsertRowid };
  } catch (err) {
    throw new Error(err.message);
  }
};

const loginUser = (username, password) => {
  const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  if (!user) {
    throw new Error('User not found');
  }
  
  if (!verifyPassword(password, user.password_hash)) {
    throw new Error('Invalid password');
  }
  
  const token = generateToken(user.id);
  return { userId: user.id, token };
};

const getUserById = (userId) => {
  return db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(userId);
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  registerUser,
  loginUser,
  getUserById,
  JWT_SECRET
};
