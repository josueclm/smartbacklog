const Database = require('better-sqlite3');

const db = new Database('database.db');

// Ativar foreign keys (IMPORTANTE)
db.pragma('foreign_keys = ON');


//PROJECTS
db.prepare(`
  CREATE TABLE IF NOT EXISTS projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`).run();


//SPRINTS
db.prepare(`
  CREATE TABLE IF NOT EXISTS sprints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    project_id INTEGER,
    start_date DATE,
    end_date DATE,
    capacity INTEGER,
    status TEXT CHECK(status IN ('PLANNED','ACTIVE','COMPLETED')) DEFAULT 'PLANNED',

    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
  )
`).run();


//USERS
db.prepare(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT
  )
`).run();


//TASKS (CORE)
db.prepare(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    priority TEXT CHECK(priority IN ('HIGH','MEDIUM','LOW')) DEFAULT 'MEDIUM',
    status TEXT CHECK(status IN ('TODO','IN_PROGRESS','DONE')) DEFAULT 'TODO',
    user_story TEXT NOT NULL,
    acceptance_criteria TEXT NOT NULL,
    story_points INTEGER,
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


//COMMENTS
db.prepare(`
  CREATE TABLE IF NOT EXISTS comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
  )
`).run();


//AI SUGGESTIONS
db.prepare(`
  CREATE TABLE IF NOT EXISTS ai_suggestions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    task_id INTEGER,
    type TEXT,
    content TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE
  )
`).run();


// DADOS INICIAIS
db.prepare(`
  INSERT OR IGNORE INTO users (id, name, role)
  VALUES (1, 'Default User', 'Developer')
`).run();

console.log("Base de dados pronta");

module.exports = db;