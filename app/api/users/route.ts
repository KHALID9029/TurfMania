import { IUser } from '@/models/User';
import { NextRequest, NextResponse } from "next/server";

import{
    getAllPlayersService,
    getPlayerByIdService,
    postPlayerService,
    putPlayerService,
    deletePlayerService
} from "@/services/userServices";


// Helper function to parse request to playerDto
async function parseRequestToPlayerDto(data: FormData) {
    
    const body ={
        id: data.get('id') as string,
        firstName: data.get('firstName') as string,
        lastName: data.get('lastName') as string,
        email: data.get('email') as string,
        phone: data.get('phone') as string,
        nid: data.get('nid') as string,
        role: data.get('role') as string || 'Player', // Default to 'Player' if not provided
        street: data.get('street') as string,
        postCode: data.get('postCode') as string,
        city: data.get('city') as string
    }

    return {
        _id: body.id,
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        nid: body.nid,
        role: body.role,
        street: body.street,
        postCode: body.postCode,
        city: body.city
    }
}


/** GET: Fetch all players or a specific player by ID */
export async function GET(req: NextRequest){

    const {searchParams} = new URL(req.url);
    const id = searchParams.get('id');

    if(id) {
        return getPlayerByIdService(id);
    } else {
        return getAllPlayersService(req);
    }
}

/** POST: Create a new player */
export async function POST(req: NextRequest){

    //console.log(req);
    //console.log("postPlayerService is:", postPlayerService);

    const data = await req.formData();
    //console.log(data);
    const playerDto = await parseRequestToPlayerDto(data);
    const player = playerDto as IUser;
    player.password = data.get('password') as string;

    //console.log("Parsed player DTO:", playerDto);
    if(!playerDto){
        return NextResponse.json({ error: "Invalid player data" }, { status: 400 });
    }

    return postPlayerService(player);
}


/** PUT: Update an existing player */
export async function PUT(req: NextRequest){

    const {searchParams} = new URL(req.url);
    const id = searchParams.get('id');

    const data = await req.formData();
    const playerDto = await parseRequestToPlayerDto(data);

    if(!playerDto || !id) {
        return NextResponse.json({ error: "Invalid player data or ID" }, { status: 400 });
    }

    return putPlayerService(id, playerDto);
}

/** DELETE: Delete a player */
export async function DELETE(req: NextRequest){
    return deletePlayerService(req);
}