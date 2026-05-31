const boardService = require('../services/boardService');


// =========================
// GET BOARD
// =========================
exports.getBoard = (req, res) => {

   try {

      const { sprintId } = req.params;

      const data =
         boardService.getBoard(sprintId);

      res.json(data);

   } catch (err) {

      console.error(err);

      res.status(500).json({
         error: 'Erro ao carregar board'
      });

   }

};


// =========================
// UPDATE TASK STATUS
// =========================
exports.updateTaskStatus = (req, res) => {

   try {

      const { taskId } = req.params;

      const { status } = req.body;

      const task =
         boardService.updateTaskStatus(
            taskId,
            status
         );

      res.json(task);

   } catch (err) {

      console.error(err);

      res.status(500).json({
         error: 'Erro ao atualizar status'
      });

   }

};


// =========================
// REORDER TASKS
// =========================
exports.reorderTasks = (req, res) => {

   try {

      const { tasks } = req.body;

      boardService.reorderTasks(tasks);

      res.json({
         success: true
      });

   } catch (err) {

      console.error(err);

      res.status(500).json({
         error: 'Erro ao reordenar tarefas'
      });

   }

};