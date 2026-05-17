const db = require('../config/db');


class BoardService {

   // =========================
   // GET BOARD
   // =========================
   getBoard(sprintId) {

      const tasks = db.prepare(`
         SELECT
            t.*,
            u.name as assigned_user_name
         FROM tasks t
         LEFT JOIN users u
            ON u.id = t.assigned_to
         WHERE t.sprint_id = ?
         ORDER BY
            t.status,
            t.position ASC,
            t.id DESC
      `).all(sprintId);


      return {

         TODO:
            tasks.filter(t => t.status === 'TODO'),

         IN_PROGRESS:
            tasks.filter(t => t.status === 'IN_PROGRESS'),

         DONE:
            tasks.filter(t => t.status === 'DONE')

      };

   }


   // =========================
   // UPDATE STATUS
   // =========================
   updateTaskStatus(taskId, status) {

      db.prepare(`
         UPDATE tasks
         SET
            status = ?,
            updated_at = CURRENT_TIMESTAMP
         WHERE id = ?
      `).run(status, taskId);


      return db.prepare(`
         SELECT *
         FROM tasks
         WHERE id = ?
      `).get(taskId);

   }


   // =========================
   // REORDER TASKS
   // =========================
   reorderTasks(tasks) {

      const update =
         db.prepare(`
            UPDATE tasks
            SET position = ?
            WHERE id = ?
         `);

      const transaction =
         db.transaction((tasks) => {

            tasks.forEach((task, index) => {

               update.run(
                  index,
                  task.id
               );

            });

         });

      transaction(tasks);

   }

}


module.exports = new BoardService();