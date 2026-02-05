import { BookingRepository } from '../repositories/bookingRepository.js';

const bookingRepo = new BookingRepository();

export class BookingService {
    async finalizeBookingAfterPayment(data: { userId: number, roomId: number, amount: number, stripeId: string }) {
        if (!data.userId || !data.roomId) {
            throw new Error("Missing metadata from Stripe event");
        }

        const finalAmount = data.amount / 100;

        return await bookingRepo.createBookingWithPayment({
            userId: data.userId,
            roomId: data.roomId,
            amount: finalAmount,
            stripeId: data.stripeId
        });
    }
}