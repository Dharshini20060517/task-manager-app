import { useState } from "react";
import API from "../services/api";
import toast from "react-hot-toast";

export default function TaskForm({ refresh }) {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    due_date: "",
    priority: "medium",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Title and Description required");
      return;
    }

    try {
      setLoading(true);

      await API.post("/tasks", {
        ...form,
        status: "pending",
      });

      toast.success("Task created 🚀");

      setForm({
        title: "",
        description: "",
        due_date: "",
        priority: "medium",
      });

      refresh();
    } catch (err) {
      toast.error("Failed to create task");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-xl shadow-md mb-6 border w-full">

      <h2 className="text-lg font-bold mb-3 text-gray-800 dark:text-white">
        ➕ Add Task
      </h2>

      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Title"
        className="border p-2 w-full mb-3 rounded text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
      />

      <input
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="border p-2 w-full mb-3 rounded text-sm sm:text-base focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="date"
        name="due_date"
        value={form.due_date}
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded"
      />

      <select
        name="priority"
        value={form.priority}
        onChange={handleChange}
        className="border p-2 w-full mb-3 rounded"
      >
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full px-4 py-2 rounded text-white transition active:scale-95 ${
          loading ? "bg-gray-400" : "bg-green-500 hover:bg-green-600"
        }`}
      >
        {loading ? "Creating..." : "Add Task"}
      </button>

    </div>
  );
}