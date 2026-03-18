import express from "express";
import { Task } from "../models/Task.js";
import { requireAuth } from "../middleware/require.Auth.js";

export const taskRouter = express.Router();

taskRouter.get("/", async (req, res) => {
  try {
    const where = {
      user_id: req.user.id,
    };
    if (req.query.done !== undefined) {
      if (req.query.done !== "true" && req.query.done !== "false") {
        return res
          .status(400)
          .json({ message: 'done must be "true" or "false"' });
      }
      where.done = req.query.done === "true";
    }

    if (req.query.priority !== undefined) {
      const p = Number(req.query.priority);
      if (![1, 2].includes(p)) {
        return res.status(400).json({ message: "priority must be 1 or 2" });
      }
      where.priority = p;
    }

    let orderBy = [["id", "DESC"]];
    if (req.query.sort === "priority") {
      const dir = req.query.order === "desc" ? "DESC" : "ASC";
      orderBy = [
        ["priority", dir],
        ["id", "DESC"],
      ];
    }

    const page = req.query.page === undefined ? 1 : Number(req.query.page);
    const limit = req.query.limit === undefined ? 20 : Number(req.query.limit);

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({ message: "page must be an integer >= 1" });
    }
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) {
      return res
        .status(400)
        .json({ message: "limit must be an integer between 1 and 100" });
    }

    const offset = (page - 1) * limit;

    const { rows, count } = await Task.findAndCountAll({
      where,
      order: orderBy,
      limit,
      offset,
    });

    return res.json({
      data: rows,
      page,
      limit,
      total: count,
      totalPages: Math.ceil(count / limit),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Failed to fetch" });
  }
});

taskRouter.post("/", async (req, res) => {
  try {
    const { title, done, priority } = req.body;
    const t = String(title ?? "").trim();
    if (!t) return res.status(400).json({ message: "Title is required" });
    let validatedPriority = null;

    if (priority !== undefined && priority !== null) {
      const p = Number(priority);

      if (![1, 2].includes(p)) {
        return res.status(400).json({
          message: "priority must be 1 (important/red) or 2 (normal/orange)",
        });
      }

      validatedPriority = p;
    }
    const task = await Task.create({
      title: t,
      priority: validatedPriority,
      done: done ?? false,
      user_id: req.user.id,
    });
    res.status(201).json(task);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Failed to create task" });
  }
});

taskRouter.patch("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const task = await Task.findOne({
      where:{id,user_id:req.user.id}
    });

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    const { title, done, priority } = req.body;
    if (title !== undefined) {
      const t = String(title).trim();
      if (t.length == 0) {
        return res.status(400).json({ message: "Title can not be empty" });
      }

      task.set({
        title: t,
      });
    }
    if (done !== undefined) {
      if (typeof done !== "boolean") {
        return res.status(400).json({ message: "done must be boolean" });
      }
      task.set({ done });
    }
    if (priority !== undefined) {
      if (priority === null) {
        task.set({ priority: null });
      } else {
        const p = Number(priority);
        if (![1, 2].includes(p)) {
          return res.status(400).json({ message: "priority must be 1 or 2" });
        }
        task.set({ priority: p });
      }
    }

    await task.save();
    return res.status(200).json(task);
  } catch (e) {
    console.error(e);

    return res.status(500).json({ message: "Failed to update task" });
  }
});

taskRouter.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const deletedCount = await Task.destroy({ where: { id,user_id:req.user.id } });
    if (deletedCount == 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    return res.status(204).send();
  } catch (e) {
    console.error(e);

    return res.status(500).json({ message: "Failed to delete the task" });
  }
});
