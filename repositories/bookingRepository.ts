import { NextResponse } from "next/server";

import { connectDB } from "@/lib/mongoose";
import Booking, { IBooking } from "@/models/Booking";
import { toBookingDto } from "@/mapper/bookingMapper";


/** GET: Fetches all bookings */
export async function getAllBookings() {
    try {
        await connectDB();
        const bookings = await Booking.find().populate('user').populate('turf');
        const bookingDtos = bookings.map(booking => toBookingDto(booking));
        return NextResponse.json(bookingDtos, { status: 200 });
    } catch (error) {
        console.error("Error fetching Bookings:", error);
        return NextResponse.json({ error: "Failed to fetch Bookings" }, { status: 500 });
    }
}


// GET: Fetches a booking by ID
export async function getBookingById(id: number) {
    try {
        await connectDB();
        const booking = await Booking.findOne({ bookingId: id }).populate('user').populate('turf');
        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }
        const bookingDto = toBookingDto(booking);
        return NextResponse.json(bookingDto, { status: 200 });
    } catch (error) {
        console.error("Error fetching Booking:", error);
        return NextResponse.json({ error: "Failed to fetch Booking" }, { status: 500 });
    }
}


// Get all the bookings of a user by userId
export async function getAllBookingsByUserId(userId: number) {
    try {
        await connectDB();
        const bookings = await Booking.find({ userId: userId }).populate('user').populate('turf');
        const bookingDtos = bookings.map(booking => toBookingDto(booking));
        return NextResponse.json(bookingDtos, { status: 200 });
    } catch (error) {
        console.error("Error fetching Bookings by User ID:", error);
        return NextResponse.json({ error: "Failed to fetch Bookings by User ID" }, { status: 500 });
    }
}


// Get all the bookings of a turf by turfId
export async function getAllBookingsByTurfId(turfId: number) {
    try {
        await connectDB();
        const bookings = await Booking.find({ turfId: turfId }).populate('user').populate('turf');
        const bookingDtos = bookings.map(booking => toBookingDto(booking));
        return NextResponse.json(bookingDtos, { status: 200 });
    } catch (error) {   
        console.error("Error fetching Bookings by Turf ID:", error);
        return NextResponse.json({ error: "Failed to fetch Bookings by Turf ID" }, { status: 500 });
    }
}


// POST: Creates a new booking
export async function postBooking(booking: IBooking) {
    try {
        await connectDB();
        const newBooking = await Booking.create(booking);
        const bookingDto = toBookingDto(newBooking);
        return NextResponse.json(bookingDto, { status: 201 });
    } catch (error) {
        console.error("Error creating Booking:", error);
        return NextResponse.json({ error: "Failed to create Booking" }, { status: 500 });
    }
}


// PUT: Updates an existing booking
export async function putBooking(id: number, bookingDto: Partial<IBooking>) {
    try {
        await connectDB();
        const booking = await Booking.findOneAndUpdate(
            { bookingId: id },bookingDto,
            { new: true, runValidators: true }
        ).populate('user').populate('turf');
        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }
        const updatedBookingDto = toBookingDto(booking);
        return NextResponse.json(updatedBookingDto, { status: 200 });
    } catch (error) {
        console.error("Error updating Booking:", error);
        return NextResponse.json({ error: "Failed to update Booking" }, { status: 500 });
    }
}


// DELETE: Deletes a booking
export async function deleteBooking(id: number) {
    try {
        await connectDB();
        const booking = await Booking.findOneAndDelete({ bookingId: id });
        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Booking deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting Booking:", error);
        return NextResponse.json({ error: "Failed to delete Booking" }, { status: 500 });
    }
}