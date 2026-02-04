// backend/controllers/paymentController.ts
import { type Response } from 'express';
import Stripe from 'stripe';
import { type AuthRequest } from '../middlewares/authMiddleware.js'; // Importáld a saját típusodat!
import { BookingService } from '../services/bookingService.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const bookingService = new BookingService();

export const confirmBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentIntentId, roomId } = req.body;
    const userId = req.user.id;

    // 1. Biztonsági ellenőrzés: Lekérjük a Stripe-tól a fizetés állapotát
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: "A fizetés még nem ment végbe sikeresen!" });
    }

    // 2. Service hívása: Ő fogja a Repository-n keresztül tranzakcióban menteni a Payment-et és a Booking-ot
    const result = await bookingService.finalizeBookingAfterPayment({
      userId: Number(userId),
      roomId: Number(roomId),
      amount: paymentIntent.amount, // Centben/fillérben érkezik
      stripeId: paymentIntent.id
    });

    res.status(201).json({ message: "Foglalás sikeresen rögzítve!", result });
  } catch (error: any) {
    console.error("Booking confirmation error:", error.message);
    res.status(500).json({ error: error.message });
  }
};

export const createPaymentIntent = async (req: AuthRequest, res: Response) => {
  try {
    const { amount, roomId } = req.body;
    console.log(req.user)

    // Ellenőrizzük, hogy van-e bejelentkezett user (a middleware után vagyunk)
    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Stripe centben/fillérben számol
      currency: 'ron',
      automatic_payment_methods: { enabled: true },
      // KRITIKUS: Ezt kapja meg a Webhook a sikeres fizetés után
      metadata: {
        roomId: roomId.toString(),
        userId: req.user.id.toString(), // Most már nem lesz hiba!
      },
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Stripe hiba:", error.message);
    res.status(400).json({ error: error.message });
  }
};