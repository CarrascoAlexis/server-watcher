const { db } = require('../db/database');

const Role = {
  create: (name, description = '') => {
    const stmt = db.prepare('INSERT INTO roles (name, description) VALUES (?, ?)');
    const result = stmt.run(name, description);
    return { id: result.lastInsertRowid };
  },

  findById: (id) => {
    return db.prepare('SELECT * FROM roles WHERE id = ?').get(id);
  },

  findAll: () => {
    return db.prepare('SELECT * FROM roles').all();
  },

  assignToUser: (userId, roleId) => {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO user_roles (user_id, role_id)
      VALUES (?, ?)
    `);
    return stmt.run(userId, roleId);
  },

  removeFromUser: (userId, roleId) => {
    const stmt = db.prepare('DELETE FROM user_roles WHERE user_id = ? AND role_id = ?');
    return stmt.run(userId, roleId);
  },

  getUserRoles: (userId) => {
    return db.prepare(`
      SELECT r.id, r.name, r.description
      FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = ?
    `).all(userId);
  }
};

module.exports = Role;
