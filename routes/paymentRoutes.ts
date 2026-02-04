import { Router } from 'express';
import { confirmBooking, createPaymentIntent } from '../controllers/paymentController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js'; // Ha kell védelem

const router = Router();

// Teszteléshez érdemes először auth nélkül, majd visszatenni
router.post('/create-intent', authenticateToken, createPaymentIntent);

router.post('/add', authenticateToken, confirmBooking);

export default router;