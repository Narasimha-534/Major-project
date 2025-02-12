import pool from '../config/database';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: 'student' | 'faculty' | 'admin';
  department: string;
}

export const createUser = async (user: Omit<User, 'id'>) => {
  const { username, email, password, role, department } = user;
  const query = 'INSERT INTO users (username, email, password, role, department) VALUES ($1, $2, $3, $4, $5) RETURNING *';
  const values = [username, email, password, role, department];
  const result = await pool.query(query, values);
  return result.rows[0];
};

export const findUserByEmail = async (email: string): Promise<User | null> => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const values = [email];
  const result = await pool.query(query, values);
  return result.rows[0] || null;
};

export const createUserInfo = async (userId: number, role: string, info: any) => {
  let query = '';
  let values = [];

  switch (role) {
    case 'student':
      query = 'INSERT INTO student_info (user_id, student_id, year_of_study) VALUES ($1, $2, $3)';
      values = [userId, info.studentId, info.yearOfStudy];
      break;
    case 'faculty':
      query = 'INSERT INTO faculty_info (user_id, faculty_id, position) VALUES ($1, $2, $3)';
      values = [userId, info.facultyId, info.position];
      break;
    case 'admin':
      query = 'INSERT INTO admin_info (user_id, admin_id, access_level) VALUES ($1, $2, $3)';
      values = [userId, info.adminId, info.accessLevel];
      break;
    default:
      throw new Error('Invalid role');
  }

  await pool.query(query, values);
};