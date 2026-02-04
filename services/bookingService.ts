// services/bookingService.ts
import { BookingRepository } from '../repositories/bookingRepository.js';

const bookingRepo = new BookingRepository();

export class BookingService {
    async finalizeBookingAfterPayment(data: { userId: number, roomId: number, amount: number, stripeId: string }) {
        // 1. Ellenőrizzük az adatokat
        if (!data.userId || !data.roomId) {
            throw new Error("Missing metadata from Stripe event");
        }

        const finalAmount = data.amount / 100;

        // 2. Átadjuk a repository-nak (JAVÍTOTT SZINTAKTIKA)
        return await bookingRepo.createBookingWithPayment({
            userId: data.userId,     // Kulcs: Érték párokat kell megadni
            roomId: data.roomId,     // Nem írhatod csak azt, hogy data.roomId
            amount: finalAmount, 
            stripeId: data.stripeId
        });
    }
}