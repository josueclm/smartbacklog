const db = require('../config/db');

class TaskService {

  // =========================
  // CREATE
  // =========================
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
        position,
        project_id,
        sprint_id,
        assigned_to
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(
      task.title,
      task.description || "",
      task.user_story || "",
      task.acceptance_criteria || "",
      task.priority || "MEDIUM",
      "TODO",
      task.story_points || 0,
      task.position || Date.now(), // fallback para ordenação
      task.projectId || null,
      task.sprintId || null,
      task.assignedTo || null
    );

    return this.getById(result.lastInsertRowid);
  }


  // =========================
  // GET ALL
  // =========================
  getAll() {
    return db.prepare(`
      SELECT * FROM tasks
      ORDER BY created_at DESC
    `).all();
  }


  // =========================
  // BACKLOG (SEM SPRINT)
  // =========================
  getBacklog(projectId) {
    return db.prepare(`
      SELECT * FROM tasks
      WHERE sprint_id IS NULL
      AND project_id = ?
      ORDER BY position ASC
    `).all(projectId);
  }


  // =========================
  // GET BY SPRINT
  // =========================
  getBySprint(sprintId) {
    return db.prepare(`
      SELECT * FROM tasks
      WHERE sprint_id = ?
      ORDER BY status, position
    `).all(sprintId);
  }


  // =========================
  // GET BY ID
  // =========================
  getById(id) {
    return db.prepare(`
      SELECT * FROM tasks WHERE id = ?
    `).get(id);
  }


  // =========================
  // UPDATE
  // =========================
  update(id, data) {
    db.prepare(`
      UPDATE tasks SET
        title = ?,
        description = ?,
        priority = ?,
        user_story = ?,
        acceptance_criteria = ?,
        status = ?,
        story_points = ?,
        assigned_to = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(
      data.title,
      data.description,
      data.priority,
      data.user_story,
      data.acceptance_criteria,
      data.status,
      data.story_points,
      data.assignedTo,
      id
    );

    return this.getById(id);
  }


  // =========================
  // DELETE
  // =========================
  delete(id) {
    db.prepare(`DELETE FROM tasks WHERE id = ?`).run(id);
  }


  // =========================
  // PRIORITY
  // =========================
  updatePriority(id, priority) {
    db.prepare(`
      UPDATE tasks SET priority = ?
      WHERE id = ?
    `).run(priority, id);

    return this.getById(id);
  }


  // =========================
  // STATUS (KANBAN)
  // =========================
  updateStatus(id, status) {
    db.prepare(`
      UPDATE tasks SET status = ?
      WHERE id = ?
    `).run(status, id);

    return this.getById(id);
  }


  // =========================
  // ADD TO SPRINT
  // =========================
  addToSprint(taskId, sprintId) {
    db.prepare(`
      UPDATE tasks SET sprint_id = ?
      WHERE id = ?
    `).run(sprintId, taskId);

    return this.getById(taskId);
  }


  // =========================
  // REMOVE FROM SPRINT
  // =========================
  removeFromSprint(taskId) {
    db.prepare(`
      UPDATE tasks SET sprint_id = NULL
      WHERE id = ?
    `).run(taskId);

    return this.getById(taskId);
  }


  // =========================
  // REORDER BACKLOG (DRAG & DROP)
  // =========================
  reorder(tasks) {
    const update = db.prepare(`
      UPDATE tasks SET position = ?
      WHERE id = ?
    `);

    const transaction = db.transaction((tasks) => {
      tasks.forEach((task, index) => {
        update.run(index * 10, task.id); // melhor prática
      });
    });

    transaction(tasks);

    return { success: true };
  }


  // =========================
  // FILTERS
  // =========================
  getByPriority(priority) {
    return db.prepare(`
      SELECT * FROM tasks
      WHERE priority = ?
    `).all(priority);
  }


  getByProject(projectId) {
    return db.prepare(`
      SELECT * FROM tasks
      WHERE project_id = ?
      ORDER BY created_at DESC
    `).all(projectId);
  }


  getProject(id) {
    return db.prepare(`
      SELECT * FROM projects
      WHERE id = ?
      ORDER BY created_at DESC
    `).all(id);
  }


  getProjects() {
    return db.prepare(`
      SELECT * FROM projects
      ORDER BY created_at DESC
    `).all();
  }
  
  getSprints() {
    return db.prepare(`
      SELECT * FROM sprints
      ORDER BY created_at DESC
    `).all();
  }
}

module.exports = new TaskService();