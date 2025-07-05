import mongoose, { Schema, Document, model } from "mongoose";
import { getNextSequence } from "@/lib/GetNextSequence";

export interface ITurf extends Document {
  turfId: number; // Custom auto-increment field for public use
  turfName: string;
  ownerId: number;
  photos?: string[];
  street: string;
  postCode: string;
  city: string;
  amenities?: string[];
  open: string;  // e.g., "06:00 AM"
  close: string; // e.g., "10:00 PM"
  turfSize: number;
  rate: number;
  lat: number;
  lng: number;

}


const TurfSchema: Schema = new Schema(
  {
    turfId: { type: Number, unique: true }, // Unique identifier for the turf
    turfName: { type: String, required: true },
    ownerId: { type: Number, required: true, ref: 'User' }, // Reference to the owner's user ID
    photos: { type: [String], required: false },
    street: { type: String, required: true },
    postCode: { type: String, required: true },
    city: { type: String, required: true },
    amenities: { type: [String], required: false }, // List of amenity names
    open: { type: String, required: true },
    close: { type: String, required: true },
    turfSize: { type: Number, required: true }, // e.g., "5-a-side", "7-a-side"
    rate: { type: Number, required: true }, // price per hour or slot
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  }
);


TurfSchema.virtual("owner", {
  ref: "User",          // The model to use for the relationship
  localField: "ownerId",// The field in TurfSchema to match
  foreignField: "userId", // The field in UserSchema to match against
  justOne: true,        // Get a single User document (not an array)
});

TurfSchema.pre<ITurf>("save", async function (next) {
  if (!this.turfId) {
    this.turfId = await getNextSequence("turfId");
  }
  next();
});

export default mongoose.models.Turf || model<ITurf>("Turf", TurfSchema, "turfs");