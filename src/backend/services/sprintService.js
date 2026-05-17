const db = require('../config/db');

class SprintService {

  // =========================
  // CREATE
  // =========================
  create(data) {

    const result = db.prepare(`
      INSERT INTO sprints (
        name,
        project_id,
        start_date,
        end_date,
        capacity,
        goal,
        status
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      data.name,
      data.project_id || null,
      data.start_date || null,
      data.end_date || null,
      data.capacity || 0,
      data.goal || null,
      data.status || 'PLANNED'
    );

    return this.getById(result.lastInsertRowid);
  }


  // =========================
  // GET ALL
  // =========================
  getAll() {

    return db.prepare(`
      SELECT
        sprints.*,
        projects.name as project_name
      FROM sprints
      LEFT JOIN projects
        ON projects.id = sprints.project_id
      ORDER BY sprints.id DESC
    `).all();
  }


  // =========================
  // GET BY ID
  // =========================
getById(id) {

   return db.prepare(`
      SELECT
         sprints.*,

         projects.name as project_name,

         COUNT(tasks.id) as total_tasks,

         COUNT(
            CASE
               WHEN tasks.status = 'DONE'
               THEN 1
            END
         ) as completed_tasks

      FROM sprints

      LEFT JOIN projects
         ON projects.id = sprints.project_id

      LEFT JOIN tasks
         ON tasks.sprint_id = sprints.id

      WHERE sprints.id = ?

      GROUP BY sprints.id
   `).get(id);

}


  // =========================
  // UPDATE
  // =========================
  update(id, data) {

    db.prepare(`
      UPDATE sprints
      SET
        name = ?,
        project_id = ?,
        start_date = ?,
        end_date = ?,
        capacity = ?,
        goal = ?,
        status = ?
      WHERE id = ?
    `).run(
      data.name,
      data.project_id || null,
      data.start_date || null,
      data.end_date || null,
      data.capacity || 0,
      data.goal || null,
      data.status || 'PLANNED',
      id
    );

    return this.getById(id);
  }


  // =========================
  // DELETE
  // =========================
  delete(id) {

    return db.prepare(`
      DELETE FROM sprints
      WHERE id = ?
    `).run(id);
  }

  getByProject(projectId) {

   return db.prepare(`
      SELECT
         s.*,

         /*
         |--------------------------------------------------------------------------
         | TOTAL TASKS
         |--------------------------------------------------------------------------
         */

         COUNT(t.id) as total_tasks,

         /*
         |--------------------------------------------------------------------------
         | COMPLETED
         |--------------------------------------------------------------------------
         */

         SUM(
            CASE
               WHEN t.status = 'DONE'
               THEN 1
               ELSE 0
            END
         ) as completed_tasks,

         /*
         |--------------------------------------------------------------------------
         | IN PROGRESS
         |--------------------------------------------------------------------------
         */

         SUM(
            CASE
               WHEN t.status = 'IN_PROGRESS'
               THEN 1
               ELSE 0
            END
         ) as in_progress_tasks,

         /*
         |--------------------------------------------------------------------------
         | DELAYED TASKS
         |--------------------------------------------------------------------------
         */

         SUM(
            CASE
               WHEN
                  t.due_date IS NOT NULL
                  AND t.due_date < DATE('now')
                  AND t.status != 'DONE'
               THEN 1
               ELSE 0
            END
         ) as delayed_tasks,

         /*
         |--------------------------------------------------------------------------
         | STORY POINTS
         |--------------------------------------------------------------------------
         */

         COALESCE(
            SUM(t.story_points),
            0
         ) as story_points,

         /*
         |--------------------------------------------------------------------------
         | COMPLETED STORY POINTS
         |--------------------------------------------------------------------------
         */

         COALESCE(
            SUM(
               CASE
                  WHEN t.status = 'DONE'
                  THEN t.story_points
                  ELSE 0
               END
            ),
            0
         ) as completed_story_points,

         /*
         |--------------------------------------------------------------------------
         | PROGRESS %
         |--------------------------------------------------------------------------
         */

         CASE
            WHEN COUNT(t.id) = 0
            THEN 0

            ELSE ROUND(
               (
                  SUM(
                     CASE
                        WHEN t.status = 'DONE'
                        THEN 1
                        ELSE 0
                     END
                  ) * 100.0
               ) / COUNT(t.id)
            )
         END as progress_percent

      FROM sprints s

      LEFT JOIN tasks t
         ON t.sprint_id = s.id

      WHERE s.project_id = ?

      GROUP BY s.id

      ORDER BY s.id DESC
   `).all(projectId);

}

  // =========================
  // START SPRINT
  // =========================
  start(id) {

    db.prepare(`
      UPDATE sprints
      SET status = 'ACTIVE'
      WHERE id = ?
    `).run(id);

    return this.getById(id);
  }


  // =========================
  // COMPLETE SPRINT
  // =========================
  complete(id) {

    db.prepare(`
      UPDATE sprints
      SET status = 'COMPLETED'
      WHERE id = ?
    `).run(id);

    return this.getById(id);
  }


  // =========================
  // GET TASKS FROM SPRINT
  // =========================
  getTasks(sprintId) {

    return db.prepare(`
      SELECT
        tasks.*,
        users.name as assigned_user
      FROM tasks
      LEFT JOIN users
        ON users.id = tasks.assigned_to
      WHERE sprint_id = ?
      ORDER BY tasks.id DESC
    `).all(sprintId);
  }


  // =========================
  // GET ACTIVE SPRINT
  // =========================
  getActiveSprint(projectId) {

    return db.prepare(`
      SELECT *
      FROM sprints
      WHERE
        project_id = ?
        AND status = 'ACTIVE'
      LIMIT 1
    `).get(projectId);
  }


  // =========================
  // GET SPRINT VELOCITY
  // =========================
  getVelocity(sprintId) {

    const result = db.prepare(`
      SELECT
        SUM(story_points) as total_points
      FROM tasks
      WHERE
        sprint_id = ?
        AND status = 'DONE'
    `).get(sprintId);

    return result.total_points || 0;
  }

   /*
   |--------------------------------------------------------------------------
   | GET ACTIVE SPRINT
   |--------------------------------------------------------------------------
   */

   getActiveSprint(projectId = null) {

      let query = `
         SELECT *
         FROM sprints
         WHERE status = 'ACTIVE'
      `;
      const params = [];
      if (projectId) {
         query += ` AND project_id = ?`;
         params.push(projectId);

      }
      query += `
         ORDER BY created_at DESC
         LIMIT 1
      `;

      return db.prepare(query).get(...params);

   }
  

}

module.exports = new SprintService();