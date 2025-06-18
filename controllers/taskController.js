// controllers/taskController.js
import Employee from "../models/employeeModel.js";

export const assignTask = async (req, res) => {
  const { employeeId, title, description, date, category } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const newTask = {
      title,
      description,
      date,
      category,
      newTask: true,
      active: false,
      completed: false,
      failed: false,
    };

    employee.tasks.push(newTask);
    employee.taskCount.newTask += 1;
    await employee.save();

    res.status(201).json({ message: "Task assigned", tasks: employee.tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const getEmployeeTasks = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    res.status(200).json({ tasks: employee.tasks });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateTaskStatus = async (req, res) => {
  const { employeeId, taskIndex, statusType } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const task = employee.tasks[taskIndex];
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Reset all status flags
    task.newTask = false;
    task.active = false;
    task.completed = false;
    task.failed = false;

    // Update only one status
    task[statusType] = true;

    // Recalculate taskCount
    const count = {
      newTask: 0,
      active: 0,
      completed: 0,
      failed: 0,
    };

    employee.tasks.forEach((t) => {
      if (t.newTask) count.newTask++;
      if (t.active) count.active++;
      if (t.completed) count.completed++;
      if (t.failed) count.failed++;
    });

    employee.taskCount = count;

    await employee.save();
    res
      .status(200)
      .json({ message: "Task status updated", task, taskCount: count });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const addCommentToTask = async (req, res) => {
  const { employeeId, taskId } = req.params;
  const { commentText } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee)
      return res.status(404).json({ message: "Employee not found" });

    const task = employee.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.comments.push({ text: commentText });
    await employee.save();

    res.status(200).json({ message: "Comment added", task });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error adding comment", error: err.message });
  }
};
