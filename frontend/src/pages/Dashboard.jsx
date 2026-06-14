import { useEffect, useState } from "react";
import API from "../services/api";
import TaskForm from "../components/TaskForm";
import Navbar from "../components/Navbar";
import TaskCard from "../components/TaskCard";
import TaskChart from "../components/TaskChart";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

export default function Dashboard() {

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("latest");   // ✅ ADDED
  const [darkMode, setDarkMode] = useState(false);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const deleteTask = async (id) => {
    await API.delete(`/tasks/${id}`);
    toast.success("Task deleted");
    fetchTasks();
  };

  const updateTask = async () => {
    try {
      if (!editingTask?.title || !editingTask?.description) {
        toast.error("Title and Description required");
        return;
      }

      const payload = {
        title: editingTask.title,
        description: editingTask.description,
        status: editingTask.status || "pending",
        priority: editingTask.priority || "medium",
        due_date: editingTask.due_date || null,
      };

      await API.put(`/tasks/${editingTask.id}`, payload);

      toast.success("Task updated successfully 🚀");

      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Failed to update task");
    }
  };

  const toggleTask = async (task) => {
    const updated = {
      ...task,
      status: task.status === "completed" ? "pending" : "completed",
    };

    await API.put(`/tasks/${task.id}`, updated);

    if (updated.status === "completed") {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
      });
    }

    toast.success("Task updated");
    fetchTasks();
  };

  // ================= FILTER =================
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.description.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ? true : task.status === filter;

    return matchesSearch && matchesFilter;
  });

  // ================= SORTING (ADDED) =================
  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === "priority") {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    }

    if (sortBy === "completed") {
      return (b.status === "completed") - (a.status === "completed");
    }

    return new Date(b.created_at) - new Date(a.created_at);
  });

  // ================= STATS =================
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === "completed").length;
  const pendingTasks = tasks.filter(t => t.status === "pending").length;
  const highPriorityTasks = tasks.filter(t => t.priority === "high").length;

  return (
    <div className={darkMode ? "dark" : ""}>

      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 transition">

        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6"
        >

          <TaskForm refresh={fetchTasks} />
          <TaskChart tasks={tasks} />

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">

            <div className="bg-blue-500 text-white p-4 rounded-xl shadow-lg">
              Total Tasks
              <p className="text-2xl font-bold">{totalTasks}</p>
            </div>

            <div className="bg-yellow-500 text-white p-4 rounded-xl shadow-lg">
              Pending
              <p className="text-2xl font-bold">{pendingTasks}</p>
            </div>

            <div className="bg-green-500 text-white p-4 rounded-xl shadow-lg">
              Completed
              <p className="text-2xl font-bold">{completedTasks}</p>
            </div>

            <div className="bg-red-500 text-white p-4 rounded-xl shadow-lg">
              High Priority
              <p className="text-2xl font-bold">{highPriorityTasks}</p>
            </div>

          </div>

          {/* WELCOME BANNER */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-xl mb-6 shadow-lg mt-6"
          >
            <h2 className="text-2xl font-bold">Welcome Back 🚀</h2>
            <p>Stay productive and complete your goals.</p>
          </motion.div>

          {/* TITLE */}
          <div className="mt-6 mb-2">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              Your Dashboard
            </h2>
            <p className="text-gray-500 dark:text-gray-300">
              Manage your tasks efficiently 🚀
            </p>
          </div>

          {/* SEARCH + FILTER + SORT */}
          <div className="mt-4 flex flex-col lg:flex-row gap-3 lg:items-center lg:justify-between">

            <input
              type="text"
              placeholder="🔍 Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="border p-2 rounded-lg w-full md:w-1/2"
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="latest">Latest</option>
              <option value="priority">Priority</option>
              <option value="completed">Completed</option>
            </select>

            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "progress", "completed"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    filter === status
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {status.toUpperCase()}
                </button>
              ))}
            </div>

          </div>

          {/* LOADING */}
          {loading && (
            <div className="text-center mt-10 text-gray-500 animate-pulse">
              Loading tasks...
            </div>
          )}

          {/* EMPTY */}
          {!loading && sortedTasks.length === 0 && (
            <div className="text-center mt-10 text-gray-600">
              <h2 className="text-xl font-semibold">📭 No Tasks Found</h2>
              <p>Create your first task 🚀</p>
            </div>
          )}

          {/* TASK GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">

            <AnimatePresence>
              {sortedTasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <TaskCard
                    task={task}
                    onEdit={setEditingTask}
                    onDelete={deleteTask}
                    onToggle={toggleTask}
                  />
                </motion.div>
              ))}
            </AnimatePresence>

          </div>

          {/* EDIT MODAL */}
          <AnimatePresence>
            {editingTask && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center"
              >
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl w-96"
                >
                  <h2 className="text-lg font-bold mb-3">Edit Task</h2>

                  <input
                    className="border p-2 w-full mb-2 rounded"
                    value={editingTask.title || ""}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, title: e.target.value })
                    }
                  />

                  <input
                    className="border p-2 w-full mb-2 rounded"
                    value={editingTask.description || ""}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, description: e.target.value })
                    }
                  />

                  <select
                    className="border p-2 w-full mb-2 rounded"
                    value={editingTask.status || "pending"}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, status: e.target.value })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>

                  <select
                    className="border p-2 w-full mb-2 rounded"
                    value={editingTask.priority || "medium"}
                    onChange={(e) =>
                      setEditingTask({ ...editingTask, priority: e.target.value })
                    }
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>

                  <div className="flex gap-2 mt-3">

                    <button
                      onClick={updateTask}
                      className="bg-green-500 text-white px-3 py-2 rounded active:scale-95"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setEditingTask(null)}
                      className="bg-gray-400 text-white px-3 py-2 rounded active:scale-95"
                    >
                      Cancel
                    </button>

                  </div>

                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

        </motion.div>
      </div>
    </div>
  );
}