import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);

export class PaymentService {
  async createCheckoutSession(roomId: number, roomTitle: string, price: number) {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'huf',
            product_data: {
              name: roomTitle,
              description: `Booking for Room ID: ${roomId}`,
            },
            unit_amount: price * 100, // A Stripe fillérben (vagy fillér megfelelőjében) számol! (4500 HUF = 450000)
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/payment/cancel`,
    });

    return session;
  }
}