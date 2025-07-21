import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Turf, { ITurf } from "@/models/Turf";
import { toTurfDto } from "@/mapper/turfMapper";

/** GET: Fetches all users from the database**/
export async function getAllTurfs(req: NextRequest) {
    console.log(req);
    try {
        await connectDB();
        const turfs = await Turf.find();
        const turfDtos = turfs.map(turf => {
            return toTurfDto(turf);
        }
        );
        return NextResponse.json(turfDtos, { status: 200 });
    } catch (error) {
        console.error("Error fetching Turfs:", error);
        return NextResponse.json({ error: "Failed to fetch Turfs" }, { status: 500 });
    }
}



export async function getTurfById(id: number) {
    try {
        await connectDB();
        const turf = await Turf.findOne({ turfId: id });
        if (!turf) {
            return NextResponse.json({ error: "Turf not found" }, { status: 404 });
        }
        const turfDto = toTurfDto(turf);
        return NextResponse.json(turfDto, { status: 200 });
    } catch (error) {
        console.error("Error fetching turf:", error);
        return NextResponse.json({ error: "Failed to fetch turf" }, { status: 500 });
    }
}


export async function getTurfByName(name: string) {
    try {
        await connectDB();
        const turf = await Turf.findOne({ tufName: name });
        if (!turf) {
            return NextResponse.json({ error: "Turf not found" }, { status: 404 });
        }
        const turfDto = toTurfDto(turf);
        return NextResponse.json(turfDto, { status: 200 });
    } catch (error) {
        console.error("Error fetching turf by name:", error);
        return NextResponse.json({ error: "Failed to fetch turf by name" }, { status: 500 });
    }
}

export async function getTurfsByOwnerId(ownerId: number) {
    try {
        await connectDB();
        const turfs = await Turf.find({ ownerId: ownerId });
        if (!turfs || turfs.length === 0) {
            return NextResponse.json({ error: "No turfs found for this owner" }, { status: 404 });
        }
        const turfDtos = turfs.map(turf => toTurfDto(turf));
        return NextResponse.json(turfDtos, { status: 200 });
    } catch (error) {
        console.error("Error fetching turfs by owner ID:", error);
        return NextResponse.json({ error: "Failed to fetch turfs by owner ID" }, { status: 500 });
    }
}



/** POST: Creates a new user in the database **/
export async function postTurf(turf: ITurf) {
    try {
        await connectDB();
        const newTurf = await Turf.create(turf);
        console.log("New Turf created:", newTurf);
        const turfDto = toTurfDto(newTurf);
        return NextResponse.json(turfDto, { status: 201 });
    } catch (error) {
        console.error("Error creating turf:", error);
        return NextResponse.json({ error: "Failed to create turf" }, { status: 500 });
    }
}


/** PUT: Updates an existing turf in the database **/
export async function putTurf(id: number, updateData: Partial<ITurf>) {
    try {
        await connectDB();


        const numericFields = [
            'ownerId',
            'turfSize',
            'rate',
            'lat',
            'lng',
            'rating',
        ];

        for (const field of numericFields) {
            if (field in updateData) {
                const value = updateData[field as keyof Partial<ITurf>];
                if (value === undefined || value === null || Number.isNaN(value as number)) {
                    delete updateData[field as keyof Partial<ITurf>];
                }
            }
        }


        const updatedTurf = await Turf.findOneAndUpdate({ turfId: id }, updateData, {
            new: true, // Return the updated document
            runValidators: true // Validate the update against the schema
        });
        if (!updatedTurf) {
            return NextResponse.json({ error: "Turf not found" }, { status: 404 });
        }
        const turfDto = toTurfDto(updatedTurf);
        return NextResponse.json(turfDto, { status: 200 });
    } catch (error) {
        console.error("Error updating Turf:", error);
        return NextResponse.json({ error: "Failed to update Turf" }, { status: 500 });
    }
}


/** DELETE: Deletes a user from the database **/
export async function deleteTurf(id: number) {
    try {
        await connectDB();
        const deletedTurf = await Turf.findOneAndDelete({ turfId: id });
        if (!deletedTurf) {
            return NextResponse.json({ error: "Turf not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Turf deleted successfully" });
    } catch (error) {
        console.error("Error deleting turf:", error);
        return NextResponse.json({ error: "Failed to delete turf" }, { status: 500 });
    }
}
