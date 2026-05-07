const express = require('express');
const router = express.Router();

const controller = require('../controllers/taskController');


// =========================
//  BACKLOG (BASE)
// =========================

// Listar tarefas do backlog (sem sprint)
router.get('/backlog', controller.getBacklogTasks);

// Criar nova tarefa
router.post('/', controller.createTask);

// Atualizar tarefa
router.put('/:id', controller.updateTask);

// Apagar tarefa
router.delete('/:id', controller.deleteTask);


// =========================
//  PRIORIDADE / ORDEM
// =========================

// Atualizar prioridade
router.patch('/:id/priority', controller.updatePriority);

// Reordenar tarefas (drag & drop)
router.patch('/reorder', controller.reorderTasks);


// =========================
//  SPRINT
// =========================

// Adicionar tarefa a sprint
router.patch('/:id/add-to-sprint', controller.addToSprint);

// Remover tarefa da sprint (voltar para backlog)
router.patch('/:id/remove-from-sprint', controller.removeFromSprint);


// =========================
//  FILTROS
// =========================
// Listar projeto
router.get('/projects', controller.getProjects);

// Listar Sprints
router.get('/sprints', controller.getSprints);

// Listar tarefas por projeto
router.get('/project/:projectId', controller.getTasksByProject);

// Filtrar por prioridade
router.get('/filter/priority/:level', controller.getTasksByPriority);


// =========================
//  DETALHE
// =========================

// Obter tarefa específica
router.get('/:id', controller.getTaskById);


module.exports = router;