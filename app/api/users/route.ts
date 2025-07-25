import { IUser } from '@/models/User';
import { NextRequest, NextResponse } from "next/server";

import{
    getAllUsersService,
    getUserByIdService,
    postUserService,
    putUserService,
    deleteUserService,
    passwordResetService
} from "@/services/userServices";

import { parseRequestToPlayerDto } from "@/mapper/useMapper";


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
    const isPasswordReset = searchParams.get('resetPassword') === 'true';

    if(isPasswordReset) {
        const data = await req.formData();
        const prevPassword = data.get('prevPassword') as string;
        const newPassword = data.get('newPassword') as string;

        if (!prevPassword || !newPassword) {
            return NextResponse.json({ error: "Previous and new passwords are required." }, { status: 400 });
        }

        // Call the service to reset password
        return passwordResetService(userId,  prevPassword, newPassword );
    }

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