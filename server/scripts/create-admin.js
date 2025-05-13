const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const dotenv = require("dotenv")

// Load environment variables
dotenv.config()

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/devops-dashboard")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err))

// User Schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
      trim: true,
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please provide an email"],
      unique: true,
      match: [
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
      ],
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
)

const User = mongoose.model("User", userSchema)

// Admin user credentials
const adminUser = {
  name: "DevOps Administrator",
  email: "devopsdeveloper@example.com",
  password: "Devopinator@",
  role: "admin",
}

// Create admin user
const createAdminUser = async () => {
  try {
    // Check if admin user already exists
    const existingUser = await User.findOne({ email: adminUser.email })

    if (existingUser) {
      console.log("Admin user already exists")
      mongoose.disconnect()
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
    mongoose.disconnect()
  } catch (error) {
    console.error(`Error creating admin user: ${error.message}`)
    mongoose.disconnect()
  }
}

// Run the script
createAdminUser()
