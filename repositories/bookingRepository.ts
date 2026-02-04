import {prisma} from '../lib/prisma.js';

export class BookingRepository {
    // Tranzakciót használunk, hogy a fizetés és foglalás egyszerre jöjjön létre
    async createBookingWithPayment(data: {
        userId: number;
        roomId: number;
        amount: number;
        stripeId: string;
    }) {
        return await prisma.$transaction(async (tx : any) => {
            // 1. Payment létrehozása
            const payment = await tx.payment.create({
                data: {
                    user_id: data.userId,
                    total_price: data.amount,
                    method:"card"
                }
            });

            // 2. Booking létrehozása
            const booking = await tx.booking.create({
                data: {
                    room_id: data.roomId,
                    payment_id: payment.payment_id, // Kapcsoljuk a fizetéshez
                    start_date: new Date(), // Itt majd a tényleges dátumot használd
                    end_date: new Date(),
                    status: "confirmed"
                }
            });

            return { payment, booking };
        });
    }
}