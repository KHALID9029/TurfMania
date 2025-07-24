import { IBooking } from "@/models/Booking";
import { NextRequest, NextResponse } from "next/server";

import {
    getAllBookingsService,
    getBookingByIdService,
    getAllBookingsByUserIdService,
    getAllBookingsByTurfIdService,
    postBookingService,
    putBookingService,
    deleteBookingService
} from "@/services/bookingServices";

import { parseRequestToBookingDto } from "@/mapper/bookingMapper";


/** GET: Fetch all bookings or a specific booking by ID */
export async function GET(req: NextRequest) {

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const userId = parseInt(searchParams.get('userId') as string) || 0;
    const turfId = parseInt(searchParams.get('turfId') as string) || 0;

    if (id) {
        return getBookingByIdService(parseInt(id));
    } else if (userId) {
        return getAllBookingsByUserIdService(userId);
    } else if (turfId) {
        return getAllBookingsByTurfIdService(turfId);
    } else {
        return getAllBookingsService();
    }
}

/** POST: Create a new booking */
export async function POST(req: NextRequest) {
    const data = await req.formData();
    const bookingDto = await parseRequestToBookingDto(data);
    const booking = bookingDto as IBooking;
    if (!bookingDto) {
        return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
    }
    return postBookingService(booking);
}


/** PUT: Update an existing booking */
export async function PUT(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    const data = await req.formData();
    const bookingDto = await parseRequestToBookingDto(data);
    
    if (!bookingDto) {
        return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
    }

    return putBookingService(parseInt(id), bookingDto);
}

/** DELETE: Delete a booking */
export async function DELETE(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
        return NextResponse.json({ error: "Booking ID is required" }, { status: 400 });
    }

    return deleteBookingService(parseInt(id));
}