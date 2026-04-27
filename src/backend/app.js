const express = require('express');
const cors = require('cors');
require('./config/db');
const path = require('path');

const taskRoutes = require('./routes/taskRoutes');
const projectRoutes = require('./routes/projectRoutes');
const mockAuth = require('./controllers/mokeUser');

const app = express();

app.use(mockAuth); // aplica a todas as rotas

app.use(cors());
app.use(express.json());

// API
app.use('/api/tasks', taskRoutes);
app.use('/api/projects', projectRoutes);

// Servir frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/backlog.html'));
});

app.get('/home', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/home.html'));
});

app.get('/board', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/board.html'));
});
app.get('/sprint', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/sprint.html'));
});

app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/projects.html'));
});

app.get('/team', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/team.html'));
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/login.html'));
});

app.listen(3000, () => {
  console.log("Servidor em http://localhost:3000");
});