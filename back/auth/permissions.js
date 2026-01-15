const { db } = require('../db/database');

const assignRoleToUser = (userId, roleId) => {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO user_roles (user_id, role_id)
    VALUES (?, ?)
  `);
  return stmt.run(userId, roleId);
};

const removeRoleFromUser = (userId, roleId) => {
  const stmt = db.prepare('DELETE FROM user_roles WHERE user_id = ? AND role_id = ?');
  return stmt.run(userId, roleId);
};

const getUserRoles = (userId) => {
  return db.prepare(`
    SELECT r.id, r.name, r.description
    FROM roles r
    JOIN user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = ?
  `).all(userId);
};

const getRolePermissions = (roleId) => {
  return db.prepare(`
    SELECT p.id, p.name, p.description
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    WHERE rp.role_id = ?
  `).all(roleId);
};

const createRole = (name, description = '') => {
  const stmt = db.prepare('INSERT INTO roles (name, description) VALUES (?, ?)');
  const result = stmt.run(name, description);
  return { id: result.lastInsertRowid };
};

const createPermission = (name, description = '') => {
  const stmt = db.prepare('INSERT INTO permissions (name, description) VALUES (?, ?)');
  const result = stmt.run(name, description);
  return { id: result.lastInsertRowid };
};

const assignPermissionToRole = (roleId, permissionId) => {
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO role_permissions (role_id, permission_id)
    VALUES (?, ?)
  `);
  return stmt.run(roleId, permissionId);
};

const userHasPermission = (userId, permissionName) => {
  const result = db.prepare(`
    SELECT COUNT(*) as count
    FROM permissions p
    JOIN role_permissions rp ON p.id = rp.permission_id
    JOIN roles r ON rp.role_id = r.id
    JOIN user_roles ur ON r.id = ur.role_id
    WHERE ur.user_id = ? AND p.name = ?
  `).get(userId, permissionName);
  
  return result.count > 0;
};

module.exports = {
  assignRoleToUser,
  removeRoleFromUser,
  getUserRoles,
  getRolePermissions,
  createRole,
  createPermission,
  assignPermissionToRole,
  userHasPermission
};
