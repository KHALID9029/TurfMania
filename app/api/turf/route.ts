import { ITurf } from '@/models/Turf';
import { NextRequest, NextResponse } from "next/server";

import {
  getAllTurfsService,
  getTurfByIdService,
  postTurfService,
  putTurfService,
  deleteTurfService
} from "@/services/turfServices";


// Helper function to parse request to turfDto
async function parseRequestToTurfDto(data: FormData) {
  const body = {
    turfId: parseInt(data.get('turfId') as string) || 0,
    turfName: data.get('turfName') as string,
    ownerId: parseInt(data.get('ownerId') as string || '0'),
    photos: data.get('photos')
      ? JSON.parse(data.get('photos') as string) as string[]
      : [],
    street: data.get('street') as string,
    postCode: data.get('postCode') as string,
    city: data.get('city') as string,
    amenities: data.get('amenities')
      ? JSON.parse(data.get('amenities') as string) as string[]
      : [],
    open: data.get('open') as string,
    close: data.get('close') as string,
    turfSize: parseFloat(data.get('turfSize') as string),
    rate: parseFloat(data.get('rate') as string),
    lat: parseFloat(data.get('lat') as string),
    lng: parseFloat(data.get('lng') as string),
  };

  return {
    turfId: body.turfId,
    turfName: body.turfName,
    ownerId: body.ownerId,
    photos: body.photos,
    street: body.street,
    postCode: body.postCode,
    city: body.city,
    amenities: body.amenities,
    open: body.open,
    close: body.close,
    turfSize: body.turfSize,
    rate: body.rate,
    lat: body.lat,
    lng: body.lng
  };
}



/** GET: Fetch all turfs or a specific player by ID */
export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const turfId = parseInt(id as string) || 0;

  if (id) {
    return getTurfByIdService(turfId);
  } else {
    return getAllTurfsService(req);
  }
}

/** POST: Create a new user */
export async function POST(req: NextRequest) {
  const data = await req.formData();
  //console.log(data);
  const turfDto = await parseRequestToTurfDto(data);
  const turf = turfDto as ITurf;

  //console.log("Parsed turf DTO:", turfDto);
  if (!turfDto) {
    return NextResponse.json({ error: "Invalid turf data" }, { status: 400 });
  }

  return postTurfService(turf);
}


/** PUT: Update an existing turf */
export async function PUT(req: NextRequest) {

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const turfId = parseInt(id as string) || 0;

  const data = await req.formData();
  const turfDto = await parseRequestToTurfDto(data);

  if (!turfDto || !id) {
    return NextResponse.json({ error: "Invalid turf data or ID" }, { status: 400 });
  }

  return putTurfService(turfId, turfDto);
}

/** DELETE: Delete a player */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const turfId = parseInt(id as string) || 0;
  return deleteTurfService(turfId);
}