import { Request, Response } from 'express';
import { hashPassword, comparePasswords } from '../services/passwordService';
import { generateToken } from '../services/authService';
import prisma from '../models/user';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await hashPassword(password);
    const user = await prisma.create({
      data: {
        email,
        password: hashedPassword,
      },
    });
    const token = generateToken(user);
    res.status(201).json({ token });
  } catch (error:any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      // El error P2002 indica violación de la restricción única en el campo de correo electrónico
      res.status(400).json({ error: 'Email already exists' });
    } else {
      console.error('Register: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  try {
    const user = await prisma.findUnique({ where: { email } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    const passwordMatch = await comparePasswords(password, user.password);
    if (!passwordMatch) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const token = generateToken(user);
    res.status(200).json({ token });
  } catch (error) {
    console.error('Login: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
