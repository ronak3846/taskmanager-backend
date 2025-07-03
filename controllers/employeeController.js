import Employee from "../models/employeeModel.js";
import argon2 from "argon2";

// Existing Controllers
export const getAllEmployees = async (req, res) => {
  try {
    const employees = await Employee.find({ role: "employee" }).select(
      "_id firstname email taskCount"
    );
    res.status(200).json(employees);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEmployeeTasks = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee.tasks || []);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// controllers/employeeController.js

export const deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};



// ✅ Accept Task: newTask → active
export const acceptTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const employee = await Employee.findOne({ "tasks._id": taskId });

    const task = employee.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.newTask = false;
    task.active = true;

    employee.taskCount.newTask--;
    employee.taskCount.active++;

    await employee.save();
    res.status(200).json({ message: "Task accepted" });
  } catch (error) {
    res.status(500).json({ message: "Accept failed", error: error.message });
  }
};

// ✅ Complete Task: active → completed
export const completeTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const employee = await Employee.findOne({ "tasks._id": taskId });

    const task = employee.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.active = false;
    task.completed = true;

    employee.taskCount.active--;
    employee.taskCount.completed++;

    await employee.save();
    res.status(200).json({ message: "Task completed" });
  } catch (error) {
    res.status(500).json({ message: "Complete failed", error: error.message });
  }
};

// ✅ Fail Task: active → failed
export const failTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const employee = await Employee.findOne({ "tasks._id": taskId });

    const task = employee.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.active = false;
    task.failed = true;

    employee.taskCount.active--;
    employee.taskCount.failed++;

    await employee.save();
    res.status(200).json({ message: "Task failed" });
  } catch (error) {
    res.status(500).json({ message: "Flag failed", error: error.message });
  }
};

// ✅ Add Comment to a Task
export const addTaskComment = async (req, res) => {
  const { taskId } = req.params;
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const employee = await Employee.findOne({ "tasks._id": taskId });

    if (!employee) {
      return res.status(404).json({ message: "Task not found" });
    }

    const task = employee.tasks.id(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found in employee" });
    }

    task.comments.push({ text, date: new Date() });

    await employee.save();
    res.status(200).json({ message: "Comment added successfully", task });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



// ✅ View profile
export const getProfile = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id).select("-password");
    if (!employee) return res.status(404).json({ message: "User not found" });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Update name/email
export const updateProfile = async (req, res) => {
  const { firstname, email } = req.body;
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      { firstname, email },
      { new: true }
    ).select("-password");
    res.json(employee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Change password
export const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  try {
    const user = await Employee.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await argon2.verify(user.password, currentPassword); // ✅ FIXED
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect current password" });

    const hashedPassword = await argon2.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

