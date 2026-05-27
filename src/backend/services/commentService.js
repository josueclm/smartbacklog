const db = require('../config/db');



class CommentService {

   // =========================
   // GET BY TASK
   // =========================

   getByTask(taskId) {

      return db.prepare(`

         SELECT
            comments.*,

            users.name as user_name,
            users.role as user_role

         FROM comments

         LEFT JOIN users
            ON users.id = comments.user_id

         WHERE comments.task_id = ?

         ORDER BY comments.id DESC

      `).all(taskId);

   }


   // =========================
   // CREATE
   // =========================

   create(data) {

      const result =
         db.prepare(`

            INSERT INTO comments (

               task_id,
               user_id,
               content

            )

            VALUES (?, ?, ?)

         `).run(

            data.task_id,
            data.user_id,
            data.content

         );

      return this.getById(
         result.lastInsertRowid
      );

   }


   // =========================
   // GET BY ID
   // =========================

   getById(id) {

      return db.prepare(`

         SELECT
            comments.*,

            users.name as user_name,
            users.role as user_role

         FROM comments

         LEFT JOIN users
            ON users.id = comments.user_id

         WHERE comments.id = ?

      `).get(id);

   }


   // =========================
   // UPDATE
   // =========================

   update(id, content) {

      db.prepare(`

         UPDATE comments

         SET
            content = ?,
            updated_at = CURRENT_TIMESTAMP

         WHERE id = ?

      `).run(content, id);

      return this.getById(id);

   }


   // =========================
   // DELETE
   // =========================

   delete(id) {

      return db.prepare(`

         DELETE FROM comments

         WHERE id = ?

      `).run(id);

   }

}


module.exports =
   new CommentService();