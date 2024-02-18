import express from 'express';
import { createUser, getAllUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware para verificar el token JWT
const authenticateToken = (req: express.Request, res: express.Response, next: express.NextFunction) => {
  // Obtiene el token del encabezado Authorization
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Verifica y decodifica el token JWT
  jwt.verify(token, process.env.JWT_SECRET || 'default_secret', (err, decoded) => {
    if (err) {
      console.error('Authenticate Token: ', err);
      return res.status(403).json({ error: 'Forbidden' });
    }
    // Almacena la información decodificada del token en la solicitud para uso posterior
    // req.user = decoded;
    next();
  });
}

router.post('/', authenticateToken, createUser);
router.get('/', authenticateToken, getAllUsers);
router.get('/:id', authenticateToken, getUserById);
router.put('/:id', authenticateToken, updateUser);
router.delete('/:id', authenticateToken, deleteUser);

export default router;
