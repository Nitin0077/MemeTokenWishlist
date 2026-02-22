require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Project = require('./project.model');

const app = express();

app.use(cors());
app.use(express.json());

connectDB();

// GET all projects
app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST add project
app.post('/projects', async (req, res) => {
  try {
    const project = new Project(req.body);
    const saved = await project.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT update project
app.put('/projects/:id', async (req, res) => {
  try {
    const updated = await Project.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: 'Project not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE project
app.delete('/projects/:id', async (req, res) => {
  try {
    const deleted = await Project.findOneAndDelete({ id: req.params.id });
    if (!deleted) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: '🚀 CryptoDesk API running' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});