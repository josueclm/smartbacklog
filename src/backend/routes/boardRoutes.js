const express = require('express');

const router = express.Router();

const boardController = require('../controllers/boardController');


// =========================
// BOARD
// =========================

// tarefas agrupadas por status
router.get('/sprint/:sprintId', boardController.getBoard);

// mover task no board
router.patch('/task/:taskId/status', boardController.updateTaskStatus);

// reorder dentro da coluna
router.patch('/reorder', boardController.reorderTasks);


module.exports = router;