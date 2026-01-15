const { db } = require('../db/database');

const DockerConfig = {
  create: (name, host, port = 2375, useTls = false, certPath = null, keyPath = null, caPath = null) => {
    const stmt = db.prepare(`
      INSERT INTO docker_configs (name, host, port, use_tls, cert_path, key_path, ca_path)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(name, host, port, useTls ? 1 : 0, certPath, keyPath, caPath);
    return { id: result.lastInsertRowid };
  },

  findById: (id) => {
    return db.prepare('SELECT * FROM docker_configs WHERE id = ?').get(id);
  },

  findAll: () => {
    return db.prepare('SELECT * FROM docker_configs').all();
  },

  update: (id, name, host, port, useTls, certPath, keyPath, caPath) => {
    const stmt = db.prepare(`
      UPDATE docker_configs
      SET name = ?, host = ?, port = ?, use_tls = ?, cert_path = ?, key_path = ?, ca_path = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);
    return stmt.run(name, host, port, useTls ? 1 : 0, certPath, keyPath, caPath, id);
  },

  delete: (id) => {
    const stmt = db.prepare('DELETE FROM docker_configs WHERE id = ?');
    return stmt.run(id);
  }
};

module.exports = DockerConfig;
