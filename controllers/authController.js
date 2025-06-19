import Employee from "../models/employeeModel.js";
import argon2 from "argon2";

// ✅ Login User
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Employee.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Correct order: argon2.verify(hashed, plain)
    const isMatch = await argon2.verify(user.password, password);
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

// ✅ Register User
export const register = async (req, res) => {
  const { firstname, email, password } = req.body;

  try {
    const existingUser = await Employee.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = new Employee({
      firstname,
      email,
      password: hashedPassword,
      role: "employee",
      taskCount: {
        newTask: 0,
        active: 0,
        completed: 0,
        failed: 0,
      },
      tasks: [],
    });

    await newUser.save();
    res.status(201).json({
      message: "User registered successfully",
      user: {
        _id: newUser._id,
        firstname: newUser.firstname,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
