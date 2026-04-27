const db = require('../config/db');

class ProjectService {

  // =========================
  // CREATE
  // =========================
  create(project) {
    const result = db.prepare(`
      INSERT INTO projects (
        name,
        description,
        status
      )
      VALUES (?, ?, ?)
    `).run(
      project.name,
      project.description || "",
      project.status || "ACTIVE"
    );

    return this.getById(result.lastInsertRowid);
  }


  // =========================
  // GET ALL
  // =========================
  getAll() {
    return db.prepare(`
      SELECT * FROM projects
      ORDER BY created_at DESC
    `).all();
  }


  // =========================
  // GET BY ID
  // =========================
  getById(id) {
    return db.prepare(`
      SELECT * FROM projects
      WHERE id = ?
    `).get(id);
  }


  // =========================
  // UPDATE
  // =========================
  update(id, data) {
    db.prepare(`
      UPDATE projects SET
        name = ?,
        description = ?,
        status = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.name,
      data.description,
      data.status,
      id
    );

    return this.getById(id);
  }


  // =========================
  // DELETE
  // =========================
  delete(id) {
    db.prepare(`
      DELETE FROM projects
      WHERE id = ?
    `).run(id);

    return { success: true };
  }


  // =========================
  // STATUS
  // =========================
  updateStatus(id, status) {
    db.prepare(`
      UPDATE projects SET status = ?
      WHERE id = ?
    `).run(status, id);

    return this.getById(id);
  }


  // =========================
  // PROJECT WITH TASKS
  // =========================
  getWithTasks(projectId) {
    const project = this.getById(projectId);

    if (!project) return null;

    const tasks = db.prepare(`
      SELECT * FROM tasks
      WHERE project_id = ?
      ORDER BY created_at DESC
    `).all(projectId);

    return {
      ...project,
      tasks
    };
  }


  // =========================
  // PROJECT STATS (AGILE)
  // =========================
  getStats(projectId) {
    const stats = db.prepare(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status = 'TODO' THEN 1 ELSE 0 END) as todo,
        SUM(CASE WHEN status = 'DOING' THEN 1 ELSE 0 END) as doing,
        SUM(CASE WHEN status = 'DONE' THEN 1 ELSE 0 END) as done,
        SUM(story_points) as total_points
      FROM tasks
      WHERE project_id = ?
    `).get(projectId);

    return stats;
  }


  // =========================
  // SEARCH
  // =========================
  search(query) {
    return db.prepare(`
      SELECT * FROM projects
      WHERE name LIKE ?
      ORDER BY created_at DESC
    `).all(`%${query}%`);
  }

}

module.exports = new ProjectService();