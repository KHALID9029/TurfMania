import { NextRequest, NextResponse } from "next/server";
import { ITurf } from "@/models/Turf";

import {
    getAllTurfs,
    getTurfById,
    getTurfByName,
    getTurfsByOwnerId,
    postTurf,
    putTurf,
    deleteTurf,
} from "@/repositories/turfRepository";
import turfDto from "@/dto/turfDto";

export async function getAllTurfsService(req: NextRequest) {
    return getAllTurfs(req);
}

export async function getTurfByIdService(id: number) {
    if (!id) {
        return NextResponse.json({ error: "Turf ID is required" }, { status: 400 });
    }
    return getTurfById(id);
}

export async function getTurfByNameService(name: string) {
    if (!name) {
        return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    return getTurfByName(name);
}

export async function getTurfsByOwnerIdService(ownerId: number) {
    if (!ownerId) {
        return NextResponse.json({ error: "Owner ID is required" }, { status: 400 });
    }
    // Assuming you have a function to get turfs by owner ID
    return getTurfsByOwnerId(ownerId);
}

export async function postTurfService(Turf: ITurf) {


    return postTurf(Turf);
}

export async function putTurfService(id: number, turfDto: Partial<ITurf>) {

    const updateData: Partial<ITurf> = turfDto;

    try {
        const turf = await getTurfById(id);

        if (!turf) {
            return NextResponse.json({ error: "Turf not found" }, { status: 404 });
        }

        // Apply updates only to fields that are provided
        // Dynamically construct the update object and exclude undefined or _id fields
        const updateTurfData: Partial<ITurf> = Object.fromEntries(
            Object.entries(updateData).filter(([key, value]) => key !== '_id' && value !== undefined && value !== null)
        );
        
        return putTurf(id, updateTurfData);
    } catch (error) {
        console.error("Error updating Turf:", error);
        return NextResponse.json({ error: "Failed to update Turf" }, { status: 500 });
    }
}


export async function deleteTurfService(id: number) {

    if (!id) {
        return NextResponse.json({ error: "Turf ID is required" }, { status: 400 });
    }

    try {
        const turf = await getTurfById(id);

        if (!turf) {
            return NextResponse.json({ error: "Turf not found" }, { status: 404 });
        }

        return deleteTurf(id);
    } catch (error) {
        console.error("Error deleting Turf:", error);
        return NextResponse.json({ error: "Failed to delete Turf" }, { status: 500 });
    }

}

