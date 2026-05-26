const db = require('../config/db');

class UserService {

  // =========================
  // GET ALL
  // =========================
  getAll() {

    return db.prepare(`
      SELECT
        id,
        name,
        email,
        role,
        created_at
      FROM users
      ORDER BY id DESC
    `).all();

  }


  // =========================
  // GET BY ID
  // =========================
  getById(id) {

    return db.prepare(`
      SELECT
        id,
        name,
        email,
        role,
        created_at
      FROM users
      WHERE id = ?
    `).get(id);

  }


  // =========================
  // CREATE
  // =========================
  create(data) {

    const result = db.prepare(`
      INSERT INTO users (
        name,
        email,
        password,
        role
      )
      VALUES (?, ?, ?, ?)
    `).run(
      data.name,
      data.email,
      data.password,
      data.role || "Developer"
    );

    return this.getById(result.lastInsertRowid);

  }


  // =========================
  // UPDATE
  // =========================
  update(id, data) {

    db.prepare(`
      UPDATE users
      SET
        name = ?,
        email = ?,
        role = ?
      WHERE id = ?
    `).run(
      data.name,
      data.email,
      data.role,
      id
    );

    return this.getById(id);

  }


  // =========================
  // DELETE
  // =========================
  delete(id) {

    return db.prepare(`
      DELETE FROM users
      WHERE id = ?
    `).run(id);

  }

}

module.exports = new UserService();