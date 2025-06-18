// models/taskModel.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
  },
  title: String,
  description: String,
  date: String,
  category: String,
  active: Boolean,
  newTask: Boolean,
  completed: Boolean,
  failed: Boolean,
  comments: [
    {
      text: String,
      date: { type: Date, default: Date.now },
    },
  ],
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
