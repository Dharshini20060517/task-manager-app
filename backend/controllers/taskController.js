const db = require("../config/db");

// CREATE TASK
exports.createTask = (req, res) => {
  const {
    title,
    description,
    status = "pending",
    priority = "medium",
    due_date = null,
  } = req.body;

  const user_id = req.user.id;

  const sql = `
    INSERT INTO tasks
    (user_id, title, description, status, priority, due_date)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      user_id,
      title,
      description,
      status,
      priority,
      due_date ? due_date.split("T")[0] : null,
    ],
    (err, result) => {
      if (err) {
        console.log("CREATE ERROR:", err);
        return res.status(500).json(err);
      }

      res.status(201).json({
        message: "Task created successfully",
      });
    }
  );
};

// GET TASKS
exports.getTasks = (req, res) => {
  const user_id = req.user.id;

  const sql =
    "SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC";

  db.query(sql, [user_id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    res.status(200).json(result);
  });
};

// UPDATE TASK (🔥 FIXED)
exports.updateTask = (req, res) => {
  const taskId = Number(req.params.id);
  const userId = req.user.id;

  const { title, description, status, priority, due_date } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "Title and Description required",
    });
  }

  const sql = `
    UPDATE tasks 
    SET title=?, description=?, status=?, priority=?, due_date=?
    WHERE id=? AND user_id=?
  `;

  db.query(
    sql,
    [
      title,
      description,
      status || "pending",
      priority || "medium",
      due_date ? due_date.split("T")[0] : null,
      taskId,
      userId,
    ],
    (err, result) => {
      if (err) {
        console.log("DB ERROR:", err);
        return res.status(500).json({
          message: "Database error",
          error: err.sqlMessage,
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message: "Task not found or unauthorized",
        });
      }

      res.json({ message: "Task updated successfully 🚀" });
    }
  );
};

// DELETE TASK
exports.deleteTask = (req, res) => {
  const { id } = req.params;
  const user_id = req.user.id;

  const sql = "DELETE FROM tasks WHERE id=? AND user_id=?";

  db.query(sql, [id, user_id], (err, result) => {
    if (err) {
      return res.status(500).json(err);
    }

    if (result.affectedRows === 0) {
      return res.status(403).json({
        message: "Task not found or unauthorized",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  });
};