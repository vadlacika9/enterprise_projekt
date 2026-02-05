import { type Response } from 'express';
import Stripe from 'stripe';
import { type AuthRequest } from '../middlewares/authMiddleware.js';
import { BookingService } from '../services/bookingService.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const bookingService = new BookingService();

export const confirmBooking = async (req: AuthRequest, res: Response) => {
  try {
    const { paymentIntentId, roomId } = req.body;
    const userId = req.user.id;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status !== 'succeeded') {
      return res.status(400).json({ error: "A fizetés még nem ment végbe sikeresen!" });
    }

    const result = await bookingService.finalizeBookingAfterPayment({
      userId: Number(userId),
      roomId: Number(roomId),
      amount: paymentIntent.amount, 
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

    if (!req.user || !req.user.id) {
        return res.status(401).json({ error: "Unauthorized" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), 
      currency: 'ron',
      automatic_payment_methods: { enabled: true },
      metadata: {
        roomId: roomId.toString(),
        userId: req.user.id.toString(),
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