import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8000";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`);

      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }

      const data = await response.json();
      setTasks(data);
    } catch (err) {
      setError("Could not connect to the backend.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const addTask = async (event) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          priority,
          status: "TODO",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      setTitle("");
      setDescription("");
      setPriority("MEDIUM");

      await fetchTasks();
    } catch (err) {
      setError("Could not create task.");
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/api/tasks/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      await fetchTasks();
    } catch (err) {
      setError("Could not delete task.");
    }
  };

  const updateStatus = async (task) => {
    const nextStatus =
      task.status === "TODO"
        ? "IN_PROGRESS"
        : task.status === "IN_PROGRESS"
        ? "COMPLETED"
        : "TODO";

    try {
      const response = await fetch(`${API_URL}/api/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: nextStatus,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      await fetchTasks();
    } catch (err) {
      setError("Could not update task.");
    }
  };

  return (
    <div className="app">
      <header>
        <h1>DevOps Task Manager</h1>
        <p>Manage tasks while building a production-style DevOps pipeline.</p>
      </header>

      <main>
        <section className="task-form">
          <h2>Add New Task</h2>

          <form onSubmit={addTask}>
            <input
              type="text"
              placeholder="Task title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <textarea
              placeholder="Task description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />

            <select
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Task"}
            </button>
          </form>
        </section>

        {error && <p className="error">{error}</p>}

        <section className="tasks">
          <h2>Tasks</h2>

          {tasks.length === 0 ? (
            <p>No tasks found.</p>
          ) : (
            tasks.map((task) => (
              <article className="task-card" key={task.id}>
                <div>
                  <h3>{task.title}</h3>
                  <p>{task.description}</p>

                  <span>Priority: {task.priority}</span>
                  <span> Status: {task.status}</span>
                </div>

                <div className="task-actions">
                  <button onClick={() => updateStatus(task)}>
                    Change Status
                  </button>

                  <button onClick={() => deleteTask(task.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
