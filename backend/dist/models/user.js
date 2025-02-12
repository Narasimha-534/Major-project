import pool from "../config/database.js";


export const createUser = async ({ username, email, password, role, department }) => {
  const query =
    "INSERT INTO users (username, email, password, role, department) VALUES ($1, $2, $3, $4, $5) RETURNING *"
  const values = [username, email, password, role, department]
  try {
    const result = await pool.query(query, values)
    console.log("User created:", result.rows[0])
    return result.rows[0]
  } catch (error) {
    console.error("Error creating user:", error)
    throw error
  }
}

export const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1"
  const values = [email]
  try {
    const result = await pool.query(query, values)
    console.log("User found:", result.rows[0])
    return result.rows[0]
  } catch (error) {
    console.error("Error finding user by email:", error)
    throw error
  }
}

export const createUserInfo = async (userId, role, info) => {
  let query = ""
  let values = []

  switch (role) {
    case "student":
      query = "INSERT INTO student_info (user_id, student_id, year_of_study) VALUES ($1, $2, $3) RETURNING *"
      values = [userId, info.studentId, info.yearOfStudy]
      break
    case "faculty":
      query = "INSERT INTO faculty_info (user_id, faculty_id, position) VALUES ($1, $2, $3) RETURNING *"
      values = [userId, info.facultyId, info.position]
      break
    case "admin":
      query = "INSERT INTO admin_info (user_id, admin_id, admin_level, department) VALUES ($1, $2, $3, $4) RETURNING *"
      values = [userId, info.adminId, info.adminLevel, info.adminLevel === "department" ? info.department : null]
      break
    default:
      throw new Error("Invalid role")
  }

  try {
    const result = await pool.query(query, values)
    console.log("User info created:", result.rows[0])
    return result.rows[0]
  } catch (error) {
    console.error("Errcor creating user info:", error)
    throw error
  }
}

