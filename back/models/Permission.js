const { db } = require('../db/database');

const Permission = {
  create: (name, description = '') => {
    const stmt = db.prepare('INSERT INTO permissions (name, description) VALUES (?, ?)');
    const result = stmt.run(name, description);
    return { id: result.lastInsertRowid };
  },

  findById: (id) => {
    return db.prepare('SELECT * FROM permissions WHERE id = ?').get(id);
  },

  findAll: () => {
    return db.prepare('SELECT * FROM permissions').all();
  },

  assignToRole: (roleId, permissionId) => {
    const stmt = db.prepare(`
      INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
      VALUES (?, ?)
    `);
    return stmt.run(roleId, permissionId);
  },

  removeFromRole: (roleId, permissionId) => {
    const stmt = db.prepare('DELETE FROM role_permissions WHERE role_id = ? AND permission_id = ?');
    return stmt.run(roleId, permissionId);
  },

  getRolePermissions: (roleId) => {
    return db.prepare(`
      SELECT p.id, p.name, p.description
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `).all(roleId);
  },

  userHasPermission: (userId, permissionName) => {
    const result = db.prepare(`
      SELECT COUNT(*) as count
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN roles r ON rp.role_id = r.id
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = ? AND p.name = ?
    `).get(userId, permissionName);
    
    return result.count > 0;
  }
};

module.exports = Permission;
