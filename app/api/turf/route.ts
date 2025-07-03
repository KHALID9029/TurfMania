import { ITurf } from '@/models/Turf';
import { NextRequest, NextResponse } from "next/server";

import{
    getAllTurfsService,
    getTurfByIdService,
    postTurfService,
    putTurfService,
    deleteTurfService
} from "@/services/turfServices";


// Helper function to parse request to turfDto
async function parseRequestToTurfDto(data: FormData) {
  const body = {
    id: data.get('id') as string,
    name: data.get('name') as string,
    street: data.get('street') as string,
    postCode: data.get('postCode') as string,
    city: data.get('city') as string,
    ownerId: data.get('ownerId') as string,
    photos: JSON.parse(data.get('photos') as string) as string[], // assuming it's sent as a JSON string
    lat: parseFloat(data.get('lat') as string),
    lng: parseFloat(data.get('lng') as string),
    amenities: JSON.parse(data.get('amenities') as string) as string[], // optional, can be handled more defensively
    open: data.get('open') as string,
    close: data.get('close') as string,
    width: parseFloat(data.get('width') as string),
    height: parseFloat(data.get('height') as string),
    rate: parseFloat(data.get('rate') as string)
  };

  return {
    _id: body.id,
    name: body.name,
    street: body.street,
    postCode: body.postCode,
    city: body.city,
    ownerId: body.ownerId,
    photos: body.photos,
    location: {
      lat: body.lat,
      lng: body.lng
    },
    amenities: body.amenities,
    operatingHours: {
      open: body.open,
      close: body.close
    },
    size: {
      width: body.width,
      height: body.height
    },
    rate: body.rate
  };
}



/** GET: Fetch all turfs or a specific player by ID */
export async function GET(req: NextRequest){

    const {searchParams} = new URL(req.url);
    const id = searchParams.get('id');

    if(id) {
        return getTurfByIdService(id);
    } else {
        return getAllTurfsService(req);
    }
}

/** POST: Create a new turf */
export async function POST(req: NextRequest){


    const data = await req.formData();
    //console.log(data);
    const turfDto = await parseRequestToTurfDto(data);
    const turf = turfDto as ITurf;


    //console.log("Parsed player DTO:", playerDto);
    if(!turfDto){
        return NextResponse.json({ error: "Invalid turf data" }, { status: 400 });
    }

    return postTurfService(turf);
}


/** PUT: Update an existing turf */
export async function PUT(req: NextRequest){

    const {searchParams} = new URL(req.url);
    const id = searchParams.get('id');

    const data = await req.formData();
    const turfDto = await parseRequestToTurfDto(data);

    if(!turfDto || !id) {
        return NextResponse.json({ error: "Invalid turf data or ID" }, { status: 400 });
    }

    return putTurfService(id, turfDto);
}

/** DELETE: Delete a turf */
export async function DELETE(req: NextRequest){
    return deleteTurfService(req);
}