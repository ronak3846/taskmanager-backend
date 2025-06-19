// controllers/authController.js
import Employee from "../models/employeeModel.js";
import argon2 from "argon2";


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Employee.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await argon2.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    res.status(200).json({
      _id: user._id,
      firstname: user.firstname,
      email: user.email,
      role: user.role,
      taskCount: user.taskCount,
      tasks: user.tasks,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ✅ NO `export default` at the bottom


export const register = async (req, res) => {
  const { firstname, email, password } = req.body;

  try {
    const existingUser = await Employee.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await argon2.hash(password, 10);

    const newUser = new Employee({
      firstname,
      email,
      password: hashedPassword,
      role: "employee",
      taskCount: { newTask: 0, active: 0, completed: 0, failed: 0 },
      tasks: [],
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: "User registered successfully", user: newUser });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
