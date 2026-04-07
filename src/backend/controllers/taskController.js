const taskService = require('../services/taskService');

exports.createTask = (req, res) => {
  const task = taskService.create(req.body);
  res.json(task);
};

exports.getTasks = (req, res) => {
  res.json(taskService.getAll());
};

exports.updateTask = (req, res) => {
  const id = parseInt(req.params.id);
  const task = taskService.update(id, req.body);
  res.json(task);
};

exports.deleteTask = (req, res) => {
  const id = parseInt(req.params.id);
  taskService.delete(id);
  res.json({ message: "Deleted" });
};