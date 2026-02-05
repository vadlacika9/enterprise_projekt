import { Router } from 'express';
import { confirmBooking, createPaymentIntent } from '../controllers/paymentController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/create-intent', authenticateToken, createPaymentIntent);

router.post('/add', authenticateToken, confirmBooking);

export default router;