import { IUser } from '@/models/User';
import { NextRequest, NextResponse } from "next/server";

import{
    getAllUsersService,
    getUserByIdService,
    postUserService,
    putUserService,
    deleteUserService
} from "@/services/userServices";


// Helper function to parse request to playerDto
async function parseRequestToPlayerDto(data: FormData) {
    
    const body ={
        id: data.get('id') as string,
        name: data.get('name') as string,
        email: data.get('email') as string,
        phone: data.get('phone') as string,
        nid: data.get('nid') as string,
        role: data.get('role') as string || 'Player', // Default to 'Player' if not provided
        street: data.get('street') as string,
        postCode: data.get('postCode') as string,
        city: data.get('city') as string
    }

    return {
        userId: parseInt(body.id) || 0,
        name: body.name,
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
    const userId = parseInt(id as string) || 0;

    if(id) {
        return getUserByIdService(userId);
    } else {
        return getAllUsersService(req);
    }
}

/** POST: Create a new user */
export async function POST(req: NextRequest){
    const data = await req.formData();
    //console.log(data);
    const playerDto = await parseRequestToPlayerDto(data);
    const player = playerDto as IUser;
    player.password = data.get('password') as string;

    //console.log("Parsed player DTO:", playerDto);
    if(!playerDto){
        return NextResponse.json({ error: "Invalid player data" }, { status: 400 });
    }

    return postUserService(player);
}


/** PUT: Update an existing player */
export async function PUT(req: NextRequest){

    const {searchParams} = new URL(req.url);
    const id = searchParams.get('id');
    const userId = parseInt(id as string) || 0;

    const data = await req.formData();
    const playerDto = await parseRequestToPlayerDto(data);

    if(!playerDto || !id) {
        return NextResponse.json({ error: "Invalid player data or ID" }, { status: 400 });
    }

    return putUserService(userId, playerDto);
}

/** DELETE: Delete a player */
export async function DELETE(req: NextRequest){
    const {searchParams} = new URL(req.url);
    const id = searchParams.get('id');
    const userId = parseInt(id as string) || 0;
    return deleteUserService(userId);
}