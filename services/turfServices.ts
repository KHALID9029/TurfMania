import { NextRequest, NextResponse } from "next/server";
import turfDto from "@/dto/turfDto";
import { ITurf } from "@/models/Turf";

import {
    getAllTurfs,
    getTurfById,
    postTurf,
    putTurf,
    deleteTurf
} from "@/repositories/turfRepository";

export async function getAllTurfsService(req: NextRequest) {
    return getAllTurfs(req);
}

export async function getTurfByIdService(id: string) {
    if(!id) {
        return NextResponse.json({ error: "Turf ID is required" }, { status: 400 });
    }
    return getTurfById(id);
}
export async function postTurfService(turf: ITurf) {

    if (!turf || !turf.name || !turf.street || !turf.postCode || !turf.city || !turf.ownerId || !turf.location) {
        return NextResponse.json({ error: "Invalid turf data" }, { status: 400 });
    }

    if(turf.photos.length <3) {
        return NextResponse.json({ error: "At least 3 photos are required" }, { status: 400 });
    }

    if(!turf.size || !turf.size.width || !turf.size.height) {
        return NextResponse.json({ error: "Size information is required" }, { status: 400 });
    }

    if(!turf.rate || turf.rate <= 0) {
        return NextResponse.json({ error: "Rate must be a positive number" }, { status: 400 });
    }

    return postTurf(turf);
}


export async function putTurfService(id: string, turfDto: turfDto) {

    const updateData: Partial<ITurf> = turfDto;
    
    try{
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
    }catch (error) {
        console.error("Error updating turf:", error);
        return NextResponse.json({ error: "Failed to update turf" }, { status: 500 });
    }
}


export async function deleteTurfService(req: NextRequest) {
    
    const {searchParams} = new URL(req.url);
    const id = searchParams.get('id');
    
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
        console.error("Error deleting turf:", error);
        return NextResponse.json({ error: "Failed to delete turf" }, { status: 500 });
    }
    
}