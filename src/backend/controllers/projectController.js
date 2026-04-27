const projectService = require('../services/projectService');


// =========================
// CREATE
// =========================
exports.createProject = (req, res) => {
  try {
    const project = projectService.create(req.body);
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// GET ALL
// =========================
exports.getProjects = (req, res) => {
  try {
    const projects = projectService.getAll();
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// GET BY ID
// =========================
exports.getProjectById = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const project = projectService.getById(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// UPDATE
// =========================
exports.updateProject = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const project = projectService.update(id, req.body);
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// DELETE
// =========================
exports.deleteProject = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    projectService.delete(id);
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// UPDATE STATUS
// =========================
exports.updateProjectStatus = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;

    const project = projectService.updateStatus(id, status);
    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// PROJECT WITH TASKS
// =========================
exports.getProjectWithTasks = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const project = projectService.getWithTasks(id);

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(project);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// PROJECT STATS (AGILE)
// =========================
exports.getProjectStats = (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const stats = projectService.getStats(id);
    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// =========================
// SEARCH
// =========================
exports.searchProjects = (req, res) => {
  try {
    const { q } = req.query;
    const projects = projectService.search(q || "");
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};