const express = require('express');
const router = express.Router();

const sprintController = require('../controllers/sprintController');


// =========================
// EXTRA ROUTES
// =========================

// listar sprints por projeto
router.get('/project/:projectId', sprintController.getSprintsByProject);

// backlog/tasks da sprint
router.get('/:id/tasks', sprintController.getSprintTasks);

// iniciar sprint
router.patch('/:id/start', sprintController.startSprint);

// concluir sprint
router.patch('/:id/complete', sprintController.completeSprint);

router.get("/active", sprintController.getActiveSprint);

// =========================
// CRUD
// =========================

router.post('/', sprintController.createSprint);

router.get('/', sprintController.getSprints);

router.get('/:id', sprintController.getSprintById);

router.put('/:id', sprintController.updateSprint);

router.delete('/:id', sprintController.deleteSprint);


module.exports = router;