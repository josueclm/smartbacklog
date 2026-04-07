const express = require('express');
const cors = require('cors');
require('./config/db');
const path = require('path');

const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// API
app.use('/api/tasks', taskRoutes);

// Servir frontend
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/pages/backlog.html'));
});

app.listen(3000, () => {
  console.log("Servidor em http://localhost:3000");
});