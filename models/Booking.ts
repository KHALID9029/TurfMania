import mongoose, {Schema, Document, model} from "mongoose";
import { getNextSequence } from "@/lib/GetNextSequence";

export interface IBooking extends Document{
    bookingId: number;
    userId: number; // Reference to the user who made the booking
    turfId: number; // Reference to the turf being booked
    date: string; // Date of the booking
    startTime: string; // Start time of the booking in HH:mm format
    endTime: string; // End time of the booking in HH:mm format
    cost: number; // Cost of the booking
    paymentStatus: string; // Status of the payment (e.g., "paid", "pending")
}


const BookingSchema: Schema = new Schema(
    {
        bookingId: {type: Number, unique: true}, // Custom auto-increment field for public use
        userId: {type: Number, required: true, ref: 'User'}, // Reference to the user who made the booking
        turfId: {type: Number, required: true, ref: 'Turf'}, // Reference to the turf being booked
        date: {type: String, required: true}, // Date of the booking
        startTime: {type: String, required: true}, // Start time of the booking in HH:mm format
        endTime: {type: String, required: true}, // End time of the booking in HH:mm format
        cost: {type: Number, required: true}, // Cost of the booking
        paymentStatus: {type: String, required: true, enum: ["paid", "pending"], default: "pending"} // Status of the payment
    }
);


BookingSchema.virtual("user", {
    ref: "User",          // The model to use for the relationship
    localField: "userId", // The field in BookingSchema to match
    foreignField: "userId", // The field in UserSchema to match against
    justOne: true,        // Get a single User document (not an array)
});

BookingSchema.virtual("turf", {
    ref: "Turf",          // The model to use for the relationship
    localField: "turfId", // The field in BookingSchema to match
    foreignField: "turfId", // The field in TurfSchema to match against
    justOne: true,        // Get a single Turf document (not an array)
});


BookingSchema.pre<IBooking>("save", async function(next) {
    if(!this.bookingId){
        this.bookingId = await getNextSequence("bookingId");
    }
    next();
});

export default mongoose.models.Booking || model<IBooking>("Booking", BookingSchema, "bookings");