const sprintService = require('../services/sprintService');


// =========================
// CREATE
// =========================
exports.createSprint = (req, res) => {
  try {

    const sprint = sprintService.create(req.body);

    res.status(201).json(sprint);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Erro ao criar sprint'
    });

  }
};


// =========================
// GET ALL
// =========================
exports.getSprints = (req, res) => {
  try {

    const sprints = sprintService.getAll();

    res.json(sprints);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Erro ao listar sprints'
    });

  }
};


// =========================
// GET BY ID
// =========================
exports.getSprintById = (req, res) => {
  try {

    const id = parseInt(req.params.id);

    const sprint = sprintService.getById(id);

    if (!sprint) {
      return res.status(404).json({
        error: 'Sprint não encontrada'
      });
    }

    res.json(sprint);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Erro ao obter sprint'
    });

  }
};


// =========================
// UPDATE
// =========================
exports.updateSprint = (req, res) => {
  try {

    const id = parseInt(req.params.id);

    const sprint = sprintService.update(id, req.body);

    res.json(sprint);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Erro ao atualizar sprint'
    });

  }
};


// =========================
// DELETE
// =========================
exports.deleteSprint = (req, res) => {
  try {

    const id = parseInt(req.params.id);

    sprintService.delete(id);

    res.json({
      message: 'Sprint removida com sucesso'
    });

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Erro ao remover sprint'
    });

  }
};


// =========================
// GET BY PROJECT
// =========================
exports.getSprintsByProject = (req, res) => {
  try {

    const projectId = parseInt(req.params.projectId);

    const sprints = sprintService.getByProject(projectId);

    res.json(sprints);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Erro ao listar sprints do projeto'
    });

  }
};


// =========================
// START SPRINT
// =========================
exports.startSprint = (req, res) => {
  try {

    const id = parseInt(req.params.id);

    const sprint = sprintService.start(id);

    res.json(sprint);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Erro ao iniciar sprint'
    });

  }
};


// =========================
// COMPLETE SPRINT
// =========================
exports.completeSprint = (req, res) => {
  try {

    const id = parseInt(req.params.id);

    const sprint = sprintService.complete(id);

    res.json(sprint);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Erro ao concluir sprint'
    });

  }
};


// =========================
// GET TASKS FROM SPRINT
// =========================
exports.getSprintTasks = (req, res) => {
  try {

    const sprintId = parseInt(req.params.id);

    const tasks = sprintService.getTasks(sprintId);

    res.json(tasks);

  } catch (err) {

    console.error(err);

    res.status(500).json({
      error: 'Erro ao listar tarefas da sprint'
    });

  }
};

// =========================
// GET ACTIVE SPRINT
// =========================
exports.getActiveSprint = async (req, res) => {

   try {

      const sprint = await sprintService.getActiveSprint(
         req.query.projectId
      );

      res.json(sprint);

   } catch (error) {

      res.status(500).json({
         message: error.message
      });

   }

};