import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import Employee from "./models/employeeModel.js";

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.error("MongoDB connection failed ❌", err.message);
  }
};

const createSeedData = async () => {
  await Employee.deleteMany(); // Clear old data

  // 👨‍💼 Admin with secure password
  const adminPassword = await bcrypt.hash("Admin@123", 10);
  const admin = {
    firstname: "Admin",
    email: "admin@example.com",
    password: adminPassword,
    role: "admin",
  };

  // 👨‍🔧 5 Employees with sample tasks and unique passwords
  const employees = [
    {
      firstname: "Aarav",
      email: "aarav@example.com",
      plainPassword: "Aarav@123",
    },
    {
      firstname: "Meera",
      email: "meera@example.com",
      plainPassword: "Meera@123",
    },
    {
      firstname: "Kabir",
      email: "kabir@example.com",
      plainPassword: "Kabir@123",
    },
    {
      firstname: "Isha",
      email: "isha@example.com",
      plainPassword: "Isha@123",
    },
    {
      firstname: "Rohan",
      email: "rohan@example.com",
      plainPassword: "Rohan@123",
    },
  ];

  for (const emp of employees) {
    emp.password = await bcrypt.hash(emp.plainPassword, 10);
    emp.role = "employee";
    delete emp.plainPassword;

    emp.tasks = [
      {
        title: "Design Logo",
        description: "Create logo for new project",
        date: "2024-06-01",
        category: "Design",
        newTask: true,
        active: false,
        completed: false,
        failed: false,
      },
      {
        title: "Client Meeting",
        description: "Attend client intro meeting",
        date: "2024-06-02",
        category: "Meeting",
        newTask: false,
        active: true,
        completed: false,
        failed: false,
      },
      {
        title: "Write Report",
        description: "Write performance report",
        date: "2024-06-03",
        category: "Documentation",
        newTask: false,
        active: false,
        completed: true,
        failed: false,
      },
    ];

    emp.taskCount = {
      newTask: emp.tasks.filter((t) => t.newTask).length,
      active: emp.tasks.filter((t) => t.active).length,
      completed: emp.tasks.filter((t) => t.completed).length,
      failed: emp.tasks.filter((t) => t.failed).length,
    };
  }

  await Employee.insertMany([admin, ...employees]);
  console.log("✅ Seed data inserted successfully");
};

const run = async () => {
  await connectDB();
  await createSeedData();
  mongoose.connection.close();
};

run();
