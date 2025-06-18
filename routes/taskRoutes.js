// routes/taskRoutes.js
import express from "express";
import {
  assignTask,
  getEmployeeTasks,
  updateTaskStatus,
  addCommentToTask,
} from "../controllers/taskController.js";


const router = express.Router();

router.post("/assign", assignTask); // Admin: assign task
router.get("/:employeeId", getEmployeeTasks); // Employee: get tasks
router.put("/update-status", updateTaskStatus); // Employee: update task status
router.put("/add-comment/:employeeId/:taskId", addCommentToTask);

export default router;
