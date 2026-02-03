import { Router } from 'express';
import { getUsers, getUserById, register, login } from '../controllers/userController.js';
import { authenticateToken, requireRole } from '../middlewares/authMiddleware.js';


const router = Router();

router.get('/', authenticateToken, requireRole('ADMIN'), getUsers);

router.get('/:id', authenticateToken, getUserById);

router.post('/register', register);

router.post('/login', login);

export default router;