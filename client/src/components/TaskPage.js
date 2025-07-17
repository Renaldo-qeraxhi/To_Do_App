import React, { useState, useEffect } from "react";

function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("pending"); // pending, completed, all
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [newTaskText, setNewTaskText] = useState("");
  const [searchText, setSearchText] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch("https://to-do-backend.onrender.com/tasks", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setTasks);
  }, [token]);

  // Filter by done status and search text
  const filteredTasks = tasks
    .filter((task) => {
      if (filter === "pending") return !task.done;
      if (filter === "completed") return task.done;
      return true;
    })
    .filter((task) =>
      task.text.toLowerCase().includes(searchText.toLowerCase())
    );

  const toggleTask = async (id, done) => {
    await fetch(`https://to-do-backend.onrender.com/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ done: !done }),
    });
    setTasks(tasks.map((t) => (t.id === id ? { ...t, done: !done } : t)));
  };

  const deleteTask = async (id) => {
    await fetch(`https://to-do-backend.onrender.com/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const startEditing = (task) => {
    setEditingId(task.id);
    setEditingText(task.text);
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) return;
    await fetch(`https://to-do-backend.onrender.com/auth/register/tasks/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: editingText }),
    });
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, text: editingText } : t))
    );
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  // Add a new task
  const addTask = async () => {
    if (!newTaskText.trim()) return;
    const response = await fetch("https://to-do-backend.onrender.com/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ text: newTaskText, done: false }),
    });
    const createdTask = await response.json();
    setTasks([...tasks, createdTask]);
    setNewTaskText("");
    setSearchText("");
  };

  return (
    <div className="container mt-5" style={{ maxWidth: 600 }}>
      <h2 className="mb-4 text-center">To-Do List</h2>

      {/* Add Task Input */}
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Add new task..."
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTask()}
        />
        <button className="btn btn-primary" onClick={addTask}>
          Add
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="search"
        className="form-control mb-3"
        placeholder="Search tasks..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />

      {/* Filter Tabs */}
      <div className="mb-3 d-flex justify-content-center gap-3">
        {["pending", "completed", "all"].map((f) => (
          <button
            key={f}
            className={`btn ${
              filter === f ? "btn-primary" : "btn-outline-primary"
            }`}
            onClick={() => setFilter(f)}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Tasks List */}
      <ul className="list-group shadow-sm rounded">
        {filteredTasks.length === 0 && (
          <li className="list-group-item text-center text-muted">
            No tasks found.
          </li>
        )}
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            className={`list-group-item d-flex justify-content-between align-items-center ${
              task.done ? "list-group-item-success" : ""
            }`}
          >
            {/* Editable Text */}
            {editingId === task.id ? (
              <input
                type="text"
                className="form-control me-3"
                value={editingText}
                onChange={(e) => setEditingText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") saveEdit(task.id);
                  if (e.key === "Escape") cancelEdit();
                }}
                autoFocus
              />
            ) : (
              <span
                style={{
                  textDecoration: task.done ? "line-through" : "none",
                  cursor: "pointer",
                  flex: 1,
                }}
                onClick={() => toggleTask(task.id, task.done)}
                title="Click to toggle done"
              >
                {task.text}
              </span>
            )}

            {/* Buttons */}
            <div className="d-flex gap-2">
              {editingId === task.id ? (
                <>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => saveEdit(task.id)}
                  >
                    Save
                  </button>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={cancelEdit}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    className="btn btn-sm btn-warning"
                    onClick={() => startEditing(task)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => deleteTask(task.id)}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskPage;
