require("dotenv").config();

const config = require("./config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString);

const User = require("./models/user.model");
const Task = require("./models/task.model");
const taskRoutes = require("./routes/task.routes");

const express = require("express");
const cors = require("cors");

const app = express();

const jwt = require("jsonwebtoken");
const { authenticationToken, authenticateToken } = require("./utilities");
const taskModel = require("./models/task.model");

app.use(express.json());
app.use("/api/tasks", taskRoutes);



app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.json({ data: "hello" });
});

// backend done!!!

// create account

app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full name is required" });
  }
  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }
  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const isUser = await User.findOne({ email: email });

  if (isUser) {
    return res.json({
      error: true,
      message: "User already exists with this email",
    });
  }

  const user = new User({
    fullName,
    email,
    password,
  });

  await user.save();
  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration successful",
  });
});

// login

app.post("/login", async (req, res) => {
  const { email, password } = req.body || {};

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }
  const userInfo = await User.findOne({ email: email });

  if (!userInfo) {
    return res.status(400).json({ message: "User not found with this email" });
  }

  if (userInfo.email == email && userInfo.password == password) {
    const user = { user: userInfo };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "36000m",
    });
    return res.json({
      error: false,
      message: "Login successful",
      email,
      accessToken,
    });
  } else {
    return res.status(400).json({
      error: true,
      message: "Invalid Credentials",
    });
  }
});

// Get-User

app.get("/get-user", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const isUser = await User.findOne({ _id: user._id });
  if (!isUser) {
    return res.sendStatus(401);
  }
  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email,
      _id: isUser._id,
      createdOn: isUser.createdOn,
    },
    message: "",
  });
});

// add task

// app.post("/add-task", authenticateToken, async (req, res) => {
//   const { title, content } = req.body || {};
//   const { user } = req.user;

//   if (!title) {
//     return res.status(400).json({ error: true, message: "Title is required" });
//   }
//   if (!content) {
//     return res.status(400).json({ error: true, message: "Content is requied" });
//   }

//   try {
//     const task = new Task({
//       title,
//       content,
//       userId: user._id,
//     });

//     await task.save();

//     return res.json({
//       error: false,
//       task,
//       message: "Task added successfully",
//     });
//   } catch (error) {
//     return res.status(500).json({
//       error: true,
//       message: "Internal Server Error",
//     });
//   }
// });
app.post("/add-task", authenticateToken, async (req, res) => {
  const { title, content, dueDate } = req.body || {};
  const { user } = req.user;

  if (!title) {
    return res.status(400).json({ error: true, message: "Title is required" });
  }
  if (!content) {
    return res.status(400).json({ error: true, message: "Content is requied" });
  }
  if (!dueDate) {
    return res.status(400).json({ error: true, message: "Content is requied" });
  }

  try {
    const task = new Task({
      title,
      content,
      dueDate,
      userId: user._id,
    });

    await task.save();

    return res.json({
      error: false,
      task,
      message: "Task added successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// edit task

app.put("/edit-task/:taskId", authenticateToken, async (req, res) => {
  const taskId = req.params.taskId;
  const { title, content, dueDate, isPinned } = req.body;
  const { user } = req.user;

  if (!title && !content && !dueDate) {
    return res
      .status(400)
      .json({ error: true, message: "No changes provided" });
  }

  try {
    const task = await Task.findOne({ _id: taskId, userId: user._id });
    if (!task) {
      return res.status(404).json({ error: true, message: "Task not found" });
    }

    if (title) task.title = title;
    if (content) task.content = content;
    if (dueDate) task.dueDate = dueDate;
    if (isPinned) task.isPinned = isPinned;

    await task.save();

    return res.json({
      error: false,
      task,
      message: "Task updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});


// get all tasks

app.get("/get-all-tasks", authenticateToken, async (req, res) => {
  const { user } = req.user;

  try {
    const tasks = await Task.find({ userId: user._id }).sort({ isPinned: -1 });
    return res.json({
      error: false,
      tasks,
      message: "All tasks retrieved successfully ",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// get task by dueDate sorting

app.get("/tasks", authenticateToken, async (req, res) => {

   const { user } = req.user;
  const { sortBy } = req.query;

  try {
    let sortOptions = {};

    // If sortBy is dueDate, sort ascending
    if (sortBy === "dueDate") {
      sortOptions = { dueDate: 1 }; // ascending
    }

    const tasks = await Task.find({ userId: user._id }).sort(sortOptions);

    return res.json({
      error: false,
      tasks,
      message: "All tasks retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});


// Get a specific task
app.get("/tasks/:id", authenticateToken, async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const task = await Task.findOne({ _id: id, userId });
    if (!task) return res.status(404).json({ error: true, message: "Task not found" });
    res.json({ success: true, task });
  } catch (err) {
    res.status(500).json({ error: true, message: err.message });
  }
});

// delete tasks

app.delete("/delete-task/:taskId", authenticateToken, async (req, res) => {
  const taskId = req.params.taskId;
  const { user } = req.user;

  try {
    const task = await Task.findOne({ _id: taskId, userId: user._id });

    if (!task) {
      return res.status(404).json({ error: true, message: "task not found" });
    }
    await Task.deleteOne({ _id: taskId, userId: user._id });

    return res.json({
      error: false,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// update isPinned value

app.put("/update-task-pinned/:taskId", authenticateToken, async (req, res) => {
  const taskId = req.params.taskId;
  const { isPinned } = req.body;
  const { user } = req.user;

  try {
    const task = await Task.findOne({ _id: taskId, userId: user._id });
    if (!task) {
      return res.status(404).json({ error: true, message: "Task not found" });
    }

    task.isPinned = isPinned;

    await task.save();

    return res.json({
      error: false,
      task,
      message: "Task updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

// tick 
app.put('/task-status/:taskId', authenticateToken, async (req, res) => {
  const taskId = req.params.taskId;
  const { completed } = req.body;
  const { user } = req.user;

  try {
    const task = await Task.findOne({ _id: taskId, userId: user._id });
    if (!task) {
      return res.status(404).json({ error: true, message: "Task not found" });
    }

    task.completed = completed;

    await task.save();

    return res.json({
      error: false,
      task,
      message: "Task updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
  // try {
  //   const updatedTask = await Task.findByIdAndUpdate(
  //     req.params.id,
  //     { $set: req.body },
  //     { new: true }
  //   );
  //   res.json(updatedTask);
  // } catch (error) {
  //   res.status(500).json({ error: 'Failed to update task' });
  // }
});


// Serach-tasks

app.get("/search-tasks/", authenticateToken, async (req, res) => {
  const { user } = req.user;
  const { query } = req.query;

  if (!query) {
    return res
      .status(400)
      .json({ error: true, message: "Search query is required" });
  }
  try {
    const matchingTasks = await Task.find({
      userId: user._id,
      $or: [
        { title: { $regex: new RegExp(query, "i") } },
        { content: { $regex: new RegExp(query, "i") } },
      ],
    });

    return res.json({
      error: false,
      tasks: matchingTasks,
      message: "Notes matching the search query retrieved successfully ",
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "Internal Server Error",
    });
  }
});

app.listen(8000);

module.exports = app;
