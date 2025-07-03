import { connectDB } from "@/lib/mongoose";
//import PlayerDto from "@/dto/playerDto";
import Player, {IUser} from "@/models/User";
import { NextRequest, NextResponse } from "next/server";

/** GET: Fetches all players from the database**/
export async function getAllPlayers(req: NextRequest){
    console.log(req);
    try{
        await connectDB();
        const players = await Player.find();
        return NextResponse.json(players);
    }catch (error) {
        console.error("Error fetching players:", error);
        return NextResponse.json({ error: "Failed to fetch players" }, { status: 500 });
    }
}



export async function getPlayerById(id: string){
    try {
        await connectDB();
        const player = await Player.findById(id);
        if (!player) {
            return NextResponse.json({ error: "Player not found" }, { status: 404 });
        }
        return NextResponse.json(player);
    } catch (error) {
        console.error("Error fetching player:", error);
        return NextResponse.json({ error: "Failed to fetch player" }, { status: 500 });
    }
}



/** POST: Creates a new player in the database **/
export async function postPlayer(player: IUser) {
    console.log("postPlayer called with player(repo):", player);
    try{
        await connectDB();
        const newPlayer = await Player.create(player);
        return NextResponse.json(newPlayer, { status: 201 });
    }catch (error) {
        console.error("Error creating player:", error);
        return NextResponse.json({ error: "Failed to create player" }, { status: 500 });
    }
}


/** PUT: Updates an existing player in the database **/
export async function putPlayer(id: string, updateData: Partial<IUser>) {
    try {
        await connectDB();
        const updatedPlayer = await Player.findByIdAndUpdate(id, updateData, {
            new: true, // Return the updated document
            runValidators: true // Validate the update against the schema
        });
        if (!updatedPlayer) {
            return NextResponse.json({ error: "Player not found" }, { status: 404 });
        }
        return NextResponse.json(updatedPlayer);
    } catch (error) {
        console.error("Error updating player:", error);
        return NextResponse.json({ error: "Failed to update player" }, { status: 500 });
    }
}


/** DELETE: Deletes a player from the database **/
export async function deletePlayer(id: string) {
    try {
        await connectDB();
        const deletedPlayer = await Player.findByIdAndDelete(id);
        if (!deletedPlayer) {
            return NextResponse.json({ error: "Player not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Player deleted successfully" });
    } catch (error) {
        console.error("Error deleting player:", error);
        return NextResponse.json({ error: "Failed to delete player" }, { status: 500 });
    }
}