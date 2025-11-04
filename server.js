// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config(); // 👈 Load .env file

// === MIDDLEWARES ===
app.use(express.json());

// Allow requests from your Expo app or APK
app.use(
  cors({
    origin: '*', // You can restrict later to your Expo app domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);

// === DATABASE CONNECTION ===
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB (Atlas) Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// === SCHEMA & MODEL ===
const TodoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
});

const TodoModel = mongoose.model('Todo', TodoSchema);

// === ROUTES ===

// Create Todo
app.post('/do-backend', async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTodo = new TodoModel({ title, description });
    await newTodo.save();
    res.status(201).json(newTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Get all Todos
app.get('/do-backend', async (req, res) => {
  try {
    const todos = await TodoModel.find();
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Update Todo
app.put('/do-backend/:id', async (req, res) => {
  try {
    const { title, description } = req.body;
    const id = req.params.id;
    const updatedTodo = await TodoModel.findByIdAndUpdate(
      id,
      { title, description },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.json(updatedTodo);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Delete Todo
app.delete('/do-backend/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await TodoModel.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Test route
app.get('/test', (req, res) => {
  res.send('✅ Backend is running correctly!');
});

// === START SERVER ===
const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on http://192.168.29.14:${PORT}`);
});
