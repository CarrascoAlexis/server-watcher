const { db } = require('../db/database');
const { hashPassword } = require('../utils/auth');

const User = {
  create: (username, email, password) => {
    const passwordHash = hashPassword(password);
    const stmt = db.prepare(`
      INSERT INTO users (username, email, password_hash)
      VALUES (?, ?, ?)
    `);
    const result = stmt.run(username, email, passwordHash);
    return { id: result.lastInsertRowid };
  },

  findByUsername: (username) => {
    return db.prepare('SELECT * FROM users WHERE username = ?').get(username);
  },

  findById: (id) => {
    return db.prepare('SELECT id, username, email, created_at FROM users WHERE id = ?').get(id);
  },

  findAll: () => {
    return db.prepare('SELECT id, username, email, created_at FROM users').all();
  }
};

module.exports = User;
