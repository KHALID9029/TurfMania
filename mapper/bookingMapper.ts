import { IBooking } from "@/models/Booking";
import BookingDto from "@/dto/bookingDto";

export function toBookingDto(booking: IBooking): BookingDto {
    return {
        bookingId: booking.bookingId,
        userId: booking.userId,
        turfId: booking.turfId,
        date: booking.date,
        startTime: booking.startTime,
        endTime: booking.endTime,
        cost: booking.cost,
        paymentStatus: booking.paymentStatus
    };
}

// Helper function to parse request to BookingDto
export async function parseRequestToBookingDto(data: FormData) {
    const body = {
        bookingId: data.get('bookingId') as string,
        userId: data.get('userId') as string,
        turfId: data.get('turfId') as string,
        date: data.get('date') as string,
        startTime: data.get('startTime') as string,
        endTime: data.get('endTime') as string,
        cost: parseFloat(data.get('cost') as string) || 0, // Default to 0 if not provided
        paymentStatus: data.get('paymentStatus') as string || 'pending' // Default to 'pending' if not provided
    };

    return {
        bookingId: parseInt(body.bookingId) || 0,
        userId: parseInt(body.userId) || 0,
        turfId: parseInt(body.turfId) || 0,
        date: body.date,
        startTime: body.startTime,
        endTime: body.endTime,
        cost: body.cost,
        paymentStatus: body.paymentStatus
    };
}