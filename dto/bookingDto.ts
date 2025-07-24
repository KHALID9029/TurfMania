export default interface BookingDto {
    bookingId: number;
    userId: number; // Reference to the user who made the booking
    turfId: number; // Reference to the turf being booked
    date: string; // Date of the booking
    startTime: string; // Start time of the booking in HH:mm format
    endTime: string; // End time of the booking in HH:mm format
    cost: number; // Cost of the booking, optional
    paymentStatus: string;
}