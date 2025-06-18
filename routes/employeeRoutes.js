// // routes/employeeRoutes.js
// import express from "express";
// import {
//   getAllEmployees,
//   getEmployeeTasks, // ✅ Import the correct controller
// } from "../controllers/employeeController.js";

// const router = express.Router();

// router.get("/", getAllEmployees); // ✅ Admin: Get all employees
// router.get("/:id/tasks", getEmployeeTasks); // ✅ Employee: Get tasks for one employee

// export default router;


import express from "express";
import {
  getAllEmployees,
  getEmployeeTasks,
  acceptTask,
  completeTask,
  failTask,
  addTaskComment,
  updateProfile,
  getProfile,
  changePassword,
} from "../controllers/employeeController.js";

const router = express.Router();

// Employee Dashboard APIs
router.get("/", getAllEmployees);
router.get("/:id/tasks", getEmployeeTasks);

router.put("/:id/profile", updateProfile);
router.get("/:id/profile", getProfile);
router.put("/:id/change-password", changePassword);




// Task status update routes
router.put("/tasks/:taskId/accept", acceptTask);
router.put("/tasks/:taskId/complete", completeTask);
router.put("/tasks/:taskId/fail", failTask);
router.post("/tasks/:taskId/comments", addTaskComment); // ✅ Add comment to task


export default router;
