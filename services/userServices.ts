import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import UserDto from "@/dto/userDto";
import {IUser} from "@/models/User";

import {
    getAllUsers,
    getUserById,
    getUserByEmail,
    postUser,
    putUser,
    deleteUser,
    passCheck
} from "@/repositories/userRepository";

export async function getAllUsersService(req: NextRequest) {
    return getAllUsers(req);
}

export async function getUserByIdService(id: number) {
    if(!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    return getUserById(id);
}

export async function getUserByEmailService(email: string) {
    if (!email) {
        return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }
    return getUserByEmail(email);
}

export async function postUserService(User: IUser) {

    if(User.password){
        User.password = await bcrypt.hash(User.password,12)
    }

    return postUser(User);
}

export async function putUserService(id: number, userDto: UserDto) {

    const updateData: Partial<IUser> = userDto;
    
    try{
        const user = await getUserById(id);
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Apply updates only to fields that are provided
        // Dynamically construct the update object and exclude undefined or _id fields
        const updateUserData: Partial<IUser> = Object.fromEntries(
         Object.entries(updateData).filter(([key, value]) => key !== '_id' && value !== undefined && value !== null)
        );

        return putUser(id, updateUserData);
    }catch (error) {
        console.error("Error updating User:", error);
        return NextResponse.json({ error: "Failed to update User" }, { status: 500 });
    }
}


export async function deleteUserService(id: number) {
    
    if (!id) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    try {
        const user = await getUserById(id);
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return deleteUser(id);
    } catch (error) {
        console.error("Error deleting User:", error);
        return NextResponse.json({ error: "Failed to delete User" }, { status: 500 });
    }
    
}


// Check the password for a user
export async function passCheckService(password: string, email: string) {
    if(!password || !email)
        return NextResponse.json({ error: "Password and user are required" }, { status: 400 });

    return passCheck(password, email);
}