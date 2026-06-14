import { motion } from "framer-motion";
import { FaEdit, FaTrash } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function TaskCard({ task, onEdit, onDelete, onToggle }) {

  // =========================
  // OVERDUE LOGIC
  // =========================
  const isOverdue =
    task.due_date &&
    new Date(task.due_date) < new Date() &&
    task.status !== "completed";

  // =========================
  // COUNTDOWN TIMER
  // =========================
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    if (!task.due_date || task.status === "completed") return;

    const interval = setInterval(() => {
      const now = new Date();
      const due = new Date(task.due_date);
      const diff = due - now;

      if (diff <= 0) {
        setTimeLeft("⛔ Overdue");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);

      setTimeLeft(`${hours}h ${minutes}m left`);
    }, 1000);

    return () => clearInterval(interval);
  }, [task.due_date, task.status]);

  // =========================
  // NOTIFICATION (ONLY ONCE)
  // =========================
  useEffect(() => {
    if (!isOverdue) return;

    const key = `notified-${task.id}`;
    const hasNotified = localStorage.getItem(key);

    if (!hasNotified) {
      alert(`⚠ Task "${task.title}" is overdue!`);
      localStorage.setItem(key, "true");
    }
  }, [isOverdue, task.id, task.title]);

  // =========================
  // AUTO PRIORITY BOOST
  // =========================
  const isBoosted =
    isOverdue || task.priority === "high";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        boxShadow: isOverdue
          ? "0 0 20px rgba(255,0,0,0.4)"
          : "0 0 0px rgba(0,0,0,0)",
      }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.3 }}
      className={`p-4 rounded-xl shadow-md transition relative ${
        isOverdue
          ? "border-2 border-red-500 bg-red-50 dark:bg-red-900/20 animate-pulse"
          : "bg-white dark:bg-gray-800"
      }`}
    >

      {/* HEADER */}
      <div className="flex items-center justify-between">

        <h2 className="font-bold text-lg text-gray-800 dark:text-white">
          {task.title}
        </h2>

        {/* TOGGLE */}
        <input
          type="checkbox"
          className="w-4 h-4 cursor-pointer"
          checked={task.status === "completed"}
          onChange={() => onToggle(task)}
        />
      </div>

      {/* DESCRIPTION */}
      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
        {task.description}
      </p>

      {/* COUNTDOWN TIMER */}
      {task.due_date && (
        <p className="text-sm mt-1 text-gray-500 dark:text-gray-300">
          ⏰ {timeLeft}
        </p>
      )}

      {/* OVERDUE WARNING */}
      {isOverdue && (
        <span className="text-red-500 text-sm font-semibold block mt-1">
          ⚠ Overdue
        </span>
      )}

      {/* TAGS */}
      <div className="flex gap-2 mt-3 flex-wrap">

        <span
          className={`px-2 py-1 text-xs rounded-full ${
            isBoosted
              ? "bg-red-100 text-red-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {isBoosted ? "🔥 high (boosted)" : task.status}
        </span>

        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
          {task.priority}
        </span>

      </div>

      {/* ACTIONS */}
      <div className="flex gap-3 mt-4">

        <button
          onClick={() => onEdit(task)}
          className="flex items-center gap-1 bg-yellow-400 text-white px-3 py-1 rounded active:scale-95 hover:scale-105 transition"
        >
          <FaEdit />
          Edit
        </button>

        <button
          onClick={() => onDelete(task.id)}
          className="flex items-center gap-1 bg-red-500 text-white px-3 py-1 rounded active:scale-95 hover:scale-105 transition"
        >
          <FaTrash />
          Delete
        </button>

      </div>

    </motion.div>
  );
}
