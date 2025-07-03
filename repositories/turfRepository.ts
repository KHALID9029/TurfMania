import { connectDB } from "@/lib/mongoose";
import Turf, {ITurf} from "@/models/Turf";
import { NextRequest, NextResponse } from "next/server";

/** GET: Fetches all turf from the database**/
export async function getAllTurfs(req: NextRequest){
    console.log(req);
    try{
        await connectDB();
        const turfs = await Turf.find();
        return NextResponse.json(turfs);
    }catch (error) {
        console.error("Error fetching turfs:", error);
        return NextResponse.json({ error: "Failed to fetch turfs" }, { status: 500 });
    }
}



export async function getTurfById(id: string){
    try {
        await connectDB();
        const turf = await Turf.findById(id);
        if (!turf) {
            return NextResponse.json({ error: "Turf not found" }, { status: 404 });
        }
        return NextResponse.json(turf);
    } catch (error) {
        console.error("Error fetching turf:", error);
        return NextResponse.json({ error: "Failed to fetch turf" }, { status: 500 });
    }
}



/** POST: Creates a new turf in the database **/
export async function postTurf(turf: ITurf) {
    console.log("postTurf called with turf(repo):", turf);
    try{
        await connectDB();
        const newTurf = await Turf.create(turf);
        return NextResponse.json(newTurf, { status: 201 });
    }catch (error) {
        console.error("Error creating turf:", error);
        return NextResponse.json({ error: "Failed to create turf" }, { status: 500 });
    }
}


/** PUT: Updates an existing turf in the database **/
export async function putTurf(id: string, updateData: Partial<ITurf>) {
    try {
        await connectDB();
        const updatedTurf = await Turf.findByIdAndUpdate(id, updateData, {
            new: true, // Return the updated document
            runValidators: true // Validate the update against the schema
        });
        if (!updatedTurf) {
            return NextResponse.json({ error: "Turf not found" }, { status: 404 });
        }
        return NextResponse.json(updatedTurf);
    } catch (error) {
        console.error("Error updating turf:", error);
        return NextResponse.json({ error: "Failed to update turf" }, { status: 500 });
    }
}


/** DELETE: Deletes a turf from the database **/
export async function deleteTurf(id: string) {
    try {
        await connectDB();
        const deletedTurf = await Turf.findByIdAndDelete(id);
        if (!deletedTurf) {
            return NextResponse.json({ error: "Turf not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Turf removed successfully" });
    } catch (error) {
        console.error("Error removing turf:", error);
        return NextResponse.json({ error: "Failed to remove turf" }, { status: 500 });
    }
}