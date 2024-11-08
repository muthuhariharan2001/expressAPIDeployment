const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const fs = require('fs');
const cors = require('cors');
const dotenv = require('dotenv');

// Cross origin resource sharing

const app = express();
app.use(cors());
// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/tasks', {}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Failed to connect to MongoDB:", err);
});

const api = process.env.API_KEY;

// Define the schema for tasks
const taskSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
  address: String,
  city: String,
  image: String, // file path for image
  audio: String  // file path for audio
});

// Create a model from the schema
const Task = mongoose.model('Task', taskSchema);

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Ensure uploads folder exists
if (!fs.existsSync('./uploads')) {
  fs.mkdirSync('./uploads');
}

// Serve static files from the 'uploads' folder
app.use('/uploads', express.static('uploads'));

// Middleware to parse JSON (although we're using form-data in this case)
app.use(express.json());

// POST request to add a new task
app.post('/tasks', upload.fields([{ name: 'image' }, { name: 'audio' }]), async (req, res) => {
    try {
      const newTask = new Task({
        name: req.body.name,
        email: req.body.email,
        age: req.body.age,
        address: req.body.address,
        city: req.body.city,
        image: req.files['image'] ? req.files['image'][0].filename : null,
        audio: req.files['audio'] ? req.files['audio'][0].filename : null
      });
  
      const savedTask = await newTask.save();
      res.status(201).json(savedTask);
  
    } catch (error) {
      console.error("Error while saving task:", error);
      res.status(500).send("Internal Server Error");
    }
  });
  

// GET request to retrieve all tasks
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find(); // Fetch all tasks from the database
    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Start the server

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
