import { Request, Response } from 'express';
import prisma from '../models/user';
import { hashPassword } from '../services/passwordService';

export const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await hashPassword(password); // Cifra la contraseña
    const user = await prisma.create({
      data: {
        email,
        password: hashedPassword, // Guarda la contraseña cifrada
      },
    });
    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      // El error P2002 indica violación de la restricción única en el campo de correo electrónico
      res.status(400).json({ error: 'Email already exists' });
    } else if (error.code === 'P2025') {
      res.status(404).json({ error: 'ID not found' });
    } else {
      console.error('Create User: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.findMany();
    res.status(200).json(users);
  } catch (error) {
    console.error('Get Users: ', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);
  try {
    const user = await prisma.findUnique({
      where: {
        id: userId,
      },
    });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'ID not found' });
    } else {
      console.error('Get User by Id: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);
  const { password } = req.body;

  try {
    let dataToUpdate: any = { ...req.body }; // Copia el cuerpo de la solicitud
    // Si hay una contraseña en la solicitud, cifra la nueva contraseña
    if (password) {
      const hashedPassword = await hashPassword(password); // Cifra la nueva contraseña
      dataToUpdate.password = hashedPassword; // Actualiza la contraseña cifrada en los datos a actualizar
    }

    // Actualiza el usuario en la base de datos
    const updatedUser = await prisma.update({
      where: {
        id: userId,
      },
      data: dataToUpdate, // Utiliza los datos actualizados
    });

    res.status(200).json(updatedUser);
  } catch (error: any) {
    if (error.code === 'P2002' && error.meta?.target?.includes('email')) {
      // El error P2002 indica violación de la restricción única en el campo de correo electrónico
      res.status(400).json({ error: 'Email already exists' });
    } else if (error.code === 'P2025') {
      res.status(404).json({ error: 'ID not found' });
    } else {
      console.error('Update User: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const userId = parseInt(req.params.id);
  try {
    await prisma.delete({
      where: {
        id: userId,
      },
    });
    res.status(200).json({ userId }).end();
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ error: 'ID not found' });
    } else {
      console.error('Delete User: ', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};
