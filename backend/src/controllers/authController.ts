import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createUser, findUserByEmail, createUserInfo } from '../models/user';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role, department, ...roleInfo } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await createUser({ username, email, password: hashedPassword, role, department });
    await createUserInfo(user.id, role, roleInfo);

    res.status(201).json({ message: 'User registered successfully', userId: user.id });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign(
      { userId: user.id, role: user.role, department: user.department },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );
    res.json({ message: 'Login successful', token, role: user.role, department: user.department });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
};