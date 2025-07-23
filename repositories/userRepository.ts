import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { connectDB } from "@/lib/mongoose";
import User, {IUser} from "@/models/User";
import { toUserDto } from "@/mapper/useMapper";

/** GET: Fetches all users from the database**/
export async function getAllUsers(req: NextRequest){
    console.log(req);
    try{
        await connectDB();
        const users = await User.find();
        const userDtos = users.map(user => {
            return toUserDto(user);
        }
        );
        return NextResponse.json(userDtos, { status: 200 });
    }catch (error) {
        console.error("Error fetching Users:", error);
        return NextResponse.json({ error: "Failed to fetch Users" }, { status: 500 });
    }
}



export async function getUserById(id: number){
    try {
        await connectDB();
        const user = await User.findOne({ userId: id });           
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const userDto = toUserDto(user);
        return NextResponse.json(userDto, { status: 200 });
    } catch (error) {
        console.error("Error fetching User:", error);
        return NextResponse.json({ error: "Failed to fetch User" }, { status: 500 });
    }
}


export async function getUserByEmail(email: string) {
    try {
        await connectDB();
        const user = await User.findOne({ email: email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const userDto = toUserDto(user);
        return NextResponse.json(userDto, { status: 200 });
    } catch (error) {
        console.error("Error fetching User by email:", error);
        return NextResponse.json({ error: "Failed to fetch User by email" }, { status: 500 });
    }
}



/** POST: Creates a new user in the database **/
export async function postUser(user: IUser) {
    try{
        await connectDB();
        const newUser = await User.create(user);
        const userDto = toUserDto(newUser);
        return NextResponse.json(userDto, { status: 201 });
    }catch (error) {
        console.error("Error creating User:", error);
        return NextResponse.json({ error: "Failed to create User" }, { status: 500 });
    }
}


/** PUT: Updates an existing user in the database **/
export async function putUser(id: number, updateData: Partial<IUser>) {
    try {
        await connectDB();
        const updatedUser = await User.findOneAndUpdate({ userId: id }, updateData, {
            new: true, // Return the updated document
            runValidators: true // Validate the update against the schema
        });
        if (!updatedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        const userDto = toUserDto(updatedUser);
        return NextResponse.json(userDto, { status: 200 });
    } catch (error) {
        console.error("Error updating User:", error);
        return NextResponse.json({ error: "Failed to update User" }, { status: 500 });
    }
}


/** DELETE: Deletes a user from the database **/
export async function deleteUser(id: number) {
    try {
        await connectDB();
        const deletedUser = await User.findOneAndDelete({ userId: id });
        if (!deletedUser) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting User:", error);
        return NextResponse.json({ error: "Failed to delete User" }, { status: 500 });
    }
}


// Check the password for a user
export async function passCheck(password: string, email: string) {
    try {
        await connectDB();
        const user = await User.findOne({ email: email });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
        if (!user.password) {
            return NextResponse.json({ error: "Password login unavailable for this account" }, { status: 403 });
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
        }
        return NextResponse.json({ message: "Password is correct" }, { status: 200 });
    } catch (error) {
        console.error("Error checking password:", error);
        return NextResponse.json({ error: "Failed to check password" }, { status: 500 });
    }
}


export async function passwordReset(userId: number, prevPassword: string, newPassword: string) {
    try{
        await connectDB();
        const user = await User.findOne({ userId: userId });
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!user.password) {
            return NextResponse.json({ error: "Password login unavailable for this account" }, { status: 403 });
        }

        const isPasswordCorrect = await bcrypt.compare(prevPassword, user.password);

        if (!isPasswordCorrect) {
            return NextResponse.json({ error: "Incorrect previous password" }, { status: 401 });
        }

        // Hash the new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
        user.password = hashedNewPassword;

        const updatedUser = await user.save();
        const userDto = toUserDto(updatedUser);
        
        return NextResponse.json(userDto, { status: 200 });
    }catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
    }
}