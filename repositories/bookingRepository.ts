import {prisma} from '../lib/prisma.js';

export class BookingRepository {
    async createBookingWithPayment(data: {
        userId: number;
        roomId: number;
        amount: number;
        stripeId: string;
    }) {
        return await prisma.$transaction(async (tx : any) => {
            const payment = await tx.payment.create({
                data: {
                    user_id: data.userId,
                    total_price: data.amount,
                    method:"card"
                }
            });

            const booking = await tx.booking.create({
                data: {
                    room_id: data.roomId,
                    payment_id: payment.payment_id,
                    start_date: new Date(),
                    end_date: new Date(),
                    status: "confirmed"
                }
            });

            return { payment, booking };
        });
    }
}