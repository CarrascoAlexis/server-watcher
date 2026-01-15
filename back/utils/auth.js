const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
  } catch {
    return null;
  }
};

module.exports = {
  hashPassword,
  verifyPassword,
  generateToken,
  verifyToken,
  JWT_SECRET
};
