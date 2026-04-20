const Database = require('better-sqlite3');

const db = new Database('database.db');

db.pragma('foreign_keys = ON');


// =========================
// USERS (LOGIN READY)
// =========================
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();


// =========================
// PROJECTS
// =========================
db.prepare(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_by INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (created_by) REFERENCES users(id)
  )
`).run();


// =========================
// PROJECT MEMBERS (EQUIPA)
// =========================
db.prepare(`
  CREATE TABLE IF NOT EXISTS project_members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER,
    user_id INTEGER,
    role TEXT DEFAULT 'member',
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
  )
`).run();


// =========================
// SPRINTS
// =========================
db.prepare(`
  CREATE TABLE IF NOT EXISTS sprints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    project_id INTEGER,
    start_date DATE,
    end_date DATE,
    capacity INTEGER,
    status TEXT CHECK(status IN ('PLANNED','ACTIVE','COMPLETED')) DEFAULT 'PLANNED',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )
`).run();


// =========================
// TASKS
// =========================
db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK(priority IN ('HIGH','MEDIUM','LOW')) DEFAULT 'MEDIUM',
    status TEXT CHECK(status IN ('TODO','IN_PROGRESS','DONE')) DEFAULT 'TODO',

    user_story TEXT,
    acceptance_criteria TEXT,

    story_points INTEGER,
    position INTEGER DEFAULT 0, -- importante para backlog reorder
    is_blocked INTEGER DEFAULT 0,

    project_id INTEGER,
    sprint_id INTEGER,
    assigned_to INTEGER,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME,

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE SET NULL,
    FOREIGN KEY (sprint_id) REFERENCES sprints(id) ON DELETE SET NULL,
    FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
  )
`).run();


// =========================
// COMMENTS
// =========================
db.prepare(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
  )
`).run();


// =========================
// AI SUGGESTIONS
// =========================
db.prepare(`
  CREATE TABLE IF NOT EXISTS ai_suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER,
    type TEXT, -- user_story, acceptance, priority
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
  )
`).run();


// =========================
// INDEXES (PERFORMANCE)
// =========================
db.prepare(`CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_tasks_sprint ON tasks(sprint_id)`).run();
db.prepare(`CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status)`).run();


// =========================
// SEED (DADOS INICIAIS)
// =========================
db.prepare(`
  INSERT OR IGNORE INTO users (id, name, email, role)
  VALUES (1, 'Default User', 'demo@email.com', 'Developer')
`).run();

db.prepare(`
  INSERT OR IGNORE INTO projects (id, name, description, created_by)
  VALUES (1, 'Projeto Base', 'Projeto inicial', 1)
`).run();

db.prepare(`
  INSERT OR IGNORE INTO project_members (project_id, user_id, role)
  VALUES (1, 1, 'admin')
`).run();


console.log("Base de dados pronta 🚀");

module.exports = db;