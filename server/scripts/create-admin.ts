const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")
const User = require("../models/user.model")

// Load environment variables
dotenv.config()

// Admin user credentials
const adminUser = {
  name: "DevOps Administrator",
  email: "devopsdeveloper@",
  password: "Devopinator@",
  role: "admin",
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/devops-dashboard")
    console.log(`MongoDB Connected: ${conn.connection.host}`)
    return conn
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`)
    process.exit(1)
  }
}

// Create admin user
const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingUser = await User.findOne({ email: adminUser.email })

    if (existingUser) {
      console.log("Admin user already exists")
      return
    }

    // Create new admin user
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(adminUser.password, salt)

    const user = await User.create({
      name: adminUser.name,
      email: adminUser.email,
      password: hashedPassword,
      role: adminUser.role,
    })

    console.log(`Admin user created: ${user.email}`)
  } catch (error) {
    console.error(`Error creating admin user: ${error.message}`)
  }
}

// Run the script
const run = async () => {
  const conn = await connectDB()
  await createAdminUser()
  await mongoose.disconnect()
  console.log("Database connection closed")
}

run()
