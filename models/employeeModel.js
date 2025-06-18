// models/employeeModel.js
import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
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
      date: Date,
    },
  ],
});

const employeeSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "employee"],
    default: "employee",
  },
  taskCount: {
    active: { type: Number, default: 0 },
    newTask: { type: Number, default: 0 },
    completed: { type: Number, default: 0 },
    failed: { type: Number, default: 0 },
  },
  tasks: [taskSchema],
});

const Employee = mongoose.model("Employee", employeeSchema);

export default Employee;
