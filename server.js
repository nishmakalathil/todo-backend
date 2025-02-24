const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const dbpassword = process.env.DB_PASSWORD;
console.log("DB Password:", dbpassword);  

mongoose.connect(`mongodb+srv://anuktha-ryan_10:${dbpassword}@main.fyl7i.mongodb.net/?retryWrites=true&w=majority&appName=main`, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
    console.log("DB connected successfully");
})
.catch(error => {
    console.error("DB connection failed:", error);  
});

const TaskSchema = new mongoose.Schema({
  task: String,
  isCompleted: Boolean
});

const Task = mongoose.model('task', TaskSchema);

const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  phone: String
});

const User = mongoose.model('user', UserSchema);

const app = express();
const PORT = process.env.PORT || 3000;

// Use environment variables to set the origin 
const allowedOrigins = ['https://react-assaignment-4.vercel.app' || 'http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || origin === allowedOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use((req, res, next) => {
  console.log("working");
  next();
});

app.get("/", (req, res) => {
  Task.find()
  .then(taskItems => {
    console.log(taskItems);
    res.send({ taskItems });
  })
  .catch(error => {
    console.error("Error fetching tasks:", error); 
    res.status(500).send("Failed to fetch tasks");
  });
});

app.post("/", (req, res) => {
  Task.create({ task: req.body.task, isCompleted: false })
  .then(task => {
    console.log("Task created:", task);
    res.send("success");
  })
  .catch(error => {
    console.error("Error creating task:", error);
    res.status(500).send("Failed to create task");
  });
});

app.put("/task/:id", (req, res) => {
  Task.findByIdAndUpdate(req.params.id, { task: req.body.task }, { new: true })
    .then(updatedTask => {
      res.send(updatedTask);
    })
    .catch(error => {
      console.error("Error updating task:", error);
      res.status(500).send("Failed to update task");
    });
});

app.delete("/task/:id", (req, res) => {
  Task.findByIdAndDelete(req.params.id)  
  .then(data => {
    res.send("success");
  })
  .catch(error => {
    res.status(400).json({ message: "something went wrong" });  
  });
});

app.listen(PORT, () => {
  console.log('Server is running on port ${PORT}');  
});
