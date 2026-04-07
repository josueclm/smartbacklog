const db = require('../config/db');

class TaskService {

  create(task) {
    const result = db.prepare(`
      INSERT INTO tasks (
        title,
        description,
        user_story,
        acceptance_criteria,
        priority,
        status,
        story_points,
        project_id,
        sprint_id,
        assigned_to
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      task.title,
      task.description || "",
      task.user_story || "",
      task.acceptance_criteria || "",
      task.priority || "MEDIUM",
      "TODO",
      task.story_points || 0,
      task.projectId || null,
      task.sprintId || null,
      task.assignedTo || null
    );

    return {
      id: result.lastInsertRowid,
      ...task,
      status: "TODO"
    };
  }

  getAll() {
    return db.prepare("SELECT * FROM tasks").all();
  }

  update(id, data) {
    db.prepare(`
      UPDATE tasks
      SET title = ?, priority = ?, status = ?
      WHERE id = ?
    `).run(
      data.title,
      data.priority,
      data.status,
      id
    );

    return this.getById(id);
  }

  getById(id) {
    return db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);
  }

  delete(id) {
    db.prepare("DELETE FROM tasks WHERE id = ?").run(id);
  }
}

module.exports = new TaskService();