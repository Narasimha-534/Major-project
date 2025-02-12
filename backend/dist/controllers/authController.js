import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createUser, findUserByEmail, createUserInfo } from "../models/user.js";

export const register = async (req, res) => {
  try {
    console.log("Received registration data:", req.body)
    const { username, email, password, role, department, ...roleInfo } = req.body

    // Check if user already exists
    const existingUser = await findUserByEmail(email)
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await createUser({ username, email, password: hashedPassword, role, department })
    console.log("User created:", user)

    if (user) {
      await createUserInfo(user.id, role, roleInfo)
      console.log("User info created for role:", role)

      console.log("User registered successfully:", user)
      res.status(201).json({ message: "User registered successfully", userId: user.id })
    } else {
      throw new Error("User creation failed")
    }
  } catch (error) {
    console.error("Error in register controller:", error)
    res.status(500).json({ message: "Error registering user", error: error.message, stack: error.stack })
  }
}

export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await findUserByEmail(email)
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }
    const token = jwt.sign({ userId: user.id, role: user.role, department: user.department }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    })
    res.json({ message: "Login successful", token, role: user.role, department: user.department })
  } catch (error) {
    console.error("Error in login controller:", error)
    res.status(500).json({ message: "Error logging in", error: error.message, stack: error.stack })
  }
}

