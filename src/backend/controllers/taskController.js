const taskService = require('../services/taskService');


// =========================
// CREATE
// =========================
exports.createTask = (req, res) => {
  try {
    const task = taskService.create(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// GET ALL
// =========================
exports.getTasks = (req, res) => {
  try {
    const tasks = taskService.getAll();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// GET BACKLOG
// =========================
exports.getBacklogTasks = (req, res) => {
  try {
    const projectId = parseInt(req.query.projectId);
    const tasks = taskService.getBacklog(projectId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// GET BY ID
// =========================
exports.getTaskById = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const task = taskService.getById(id);

    if (!task) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// UPDATE
// =========================
exports.updateTask = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const task = taskService.update(id, req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// DELETE
// =========================
exports.deleteTask = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    taskService.delete(id);
    res.json({ message: "Task deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// UPDATE PRIORITY
// =========================
exports.updatePriority = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { priority } = req.body;

    const task = taskService.updatePriority(id, priority);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// UPDATE STATUS (KANBAN)
// =========================
exports.updateStatus = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const task = taskService.updateStatus(id, status);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// ADD TO SPRINT
// =========================
exports.addToSprint = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { sprintId } = req.body;

    const task = taskService.addToSprint(id, sprintId);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// REMOVE FROM SPRINT
// =========================
exports.removeFromSprint = (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const task = taskService.removeFromSprint(id);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// REORDER (DRAG & DROP)
// =========================
exports.reorderTasks = (req, res) => {
  try {
    const { tasks } = req.body; // array [{id}, {id}, ...]

    const result = taskService.reorder(tasks);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// FILTERS
// =========================
exports.getTasksByPriority = (req, res) => {
  try {
    const priority = req.params.level;
    const tasks = taskService.getByPriority(priority);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getTasksByProject = (req, res) => {
  try {
    const projectId = parseInt(req.params.projectId);
    const tasks = taskService.getByProject(projectId);
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getProjects = (req, res) => {
  try {
    const tasks = taskService.getProjects();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.getSprints = (req, res) => {
  try {
    const tasks = taskService.getSrojects();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};