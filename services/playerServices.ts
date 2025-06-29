import { NextRequest, NextResponse } from "next/server";
import PlayerDto from "@/dto/playerDto";
import {IPlayer} from "@/models/Player";

import {
    getAllPlayers,
    getPlayerById,
    postPlayer,
    putPlayer,
    deletePlayer
} from "@/repositories/playerRepository";

export async function getAllPlayersService(req: NextRequest) {
    return getAllPlayers(req);
}

export async function getPlayerByIdService(id: string) {
    if(!id) {
        return NextResponse.json({ error: "Player ID is required" }, { status: 400 });
    }
    return getPlayerById(id);
}

export async function postPlayerService(player: IPlayer) {

    if (!player || !player.firstName || !player.lastName || !player.email || !player.phone || !player.nid) {
        return NextResponse.json({ error: "Invalid player data" }, { status: 400 });
    }

    return postPlayer(player);
}

export async function putPlayerService(id: string, playerDto: PlayerDto) {

    const updateData: Partial<IPlayer> = playerDto;
    
    try{
        const player = await getPlayerById(id);
        
        if (!player) {
            return NextResponse.json({ error: "Player not found" }, { status: 404 });
        }

        // Apply updates only to fields that are provided
        // Dynamically construct the update object and exclude undefined or _id fields
        const updatePlayerData: Partial<IPlayer> = Object.fromEntries(
         Object.entries(updateData).filter(([key, value]) => key !== '_id' && value !== undefined && value !== null)
        );

        return putPlayer(id, updatePlayerData);
    }catch (error) {
        console.error("Error updating player:", error);
        return NextResponse.json({ error: "Failed to update player" }, { status: 500 });
    }
}


export async function deletePlayerService(req: NextRequest) {
    
    const {searchParams} = new URL(req.url);
    const id = searchParams.get('id');
    
    if (!id) {
        return NextResponse.json({ error: "Player ID is required" }, { status: 400 });
    }

    try {
        const player = await getPlayerById(id);
        
        if (!player) {
            return NextResponse.json({ error: "Player not found" }, { status: 404 });
        }

        return deletePlayer(id);
    } catch (error) {
        console.error("Error deleting player:", error);
        return NextResponse.json({ error: "Failed to delete player" }, { status: 500 });
    }
    
}