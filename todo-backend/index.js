const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

require('dotenv').config();
const { authRouter } = require("./auth");
const SECRET_KEY = process.env.SECRET_KEY;


const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use("/auth", authRouter);

let tasks = [];

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) return res.sendStatus(401);

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

app.get("/tasks", authenticateToken, (req, res) => res.json(tasks));

app.post("/tasks", authenticateToken, (req, res) => {
  const newTask = {
    id: Date.now(),
    text: req.body.text || "",
    done: false,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

app.put("/tasks/:id", authenticateToken, (req, res) => {
  const id = Number(req.params.id);
  let found = false;

  tasks = tasks.map(task =>
    task.id === id ? (found = true, { ...task, ...req.body }) : task
  );

  found ? res.json(tasks.find(t => t.id === id)) : res.sendStatus(404);
});

app.delete("/tasks/:id", authenticateToken, (req, res) => {
  const id = Number(req.params.id);
  const before = tasks.length;
  tasks = tasks.filter(t => t.id !== id);
  tasks.length < before ? res.sendStatus(204) : res.sendStatus(404);
});

app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
