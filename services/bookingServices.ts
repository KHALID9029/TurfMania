import { NextResponse } from "next/server";

import BookingDto from "@/dto/bookingDto";
import { IBooking } from "@/models/Booking";

import {
    getAllBookings,
    getBookingById,
    getAllBookingsByUserId,
    getAllBookingsByTurfId,
    postBooking,
    putBooking,
    deleteBooking
} from "@/repositories/bookingRepository";


export async function getAllBookingsService() {
    return getAllBookings();
}

export async function getBookingByIdService(id: number) {
    if (!id) {
        return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }
    return getBookingById(id);
}

export async function getAllBookingsByUserIdService(userId: number) {
    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    return getAllBookingsByUserId(userId);
}

export async function getAllBookingsByTurfIdService(turfId: number) {
    if (!turfId) {
        return NextResponse.json({ error: "Turf ID is required" }, { status: 400 });
    }
    return getAllBookingsByTurfId(turfId);
}

export async function postBookingService(booking: IBooking) {
    if (!booking) {
        return NextResponse.json({ error: "Booking data is required" }, { status: 400 });
    }
    return postBooking(booking);
}


export async function putBookingService(id: number, bookingDto: BookingDto) {

    const updateData: Partial<IBooking> = bookingDto;

    try{
        const booking = await getBookingById(id);
        
        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        // Apply updates only to fields that are provided
        const updateBookingData: Partial<IBooking> = Object.fromEntries(
            Object.entries(updateData).filter(([key, value]) => key !== '_id' && key !== 'bookingId' && key!=='turfId' && key!=='userId' && value !== undefined && value !== null)
        );

        return putBooking(id, updateBookingData);
    }catch (error) {
        console.error("Error updating Booking:", error);
        return NextResponse.json({ error: "Failed to update Booking" }, { status: 500 });
    }
}


export async function deleteBookingService(id: number) {
    if (!id) {
        return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    try {
        const booking = await getBookingById(id);
        
        if (!booking) {
            return NextResponse.json({ error: "Booking not found" }, { status: 404 });
        }

        return deleteBooking(id);
    } catch (error) {
        console.error("Error deleting Booking:", error);
        return NextResponse.json({ error: "Failed to delete Booking" }, { status: 500 });
    }
}