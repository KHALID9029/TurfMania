import mongoose, {Schema, Document, model} from "mongoose";
import { getNextSequence } from "@/lib/GetNextSequence";


export  interface IReview extends Document {
  reviewId: number;           // Unique ID (UUID or DB _id)
  turfId: number;       // ID of the turf being reviewed
  userId: number;       // ID of the reviewer (linked to user)
  name: string;         // Display name of the reviewer
  rating: number;       // 1 to 5
  text?: string;         // The review message
  date: Date;           // Created or last updated timestamp
}

const ReviewSchema: Schema = new Schema(
    {
        reviewId: { type: Number, unique: true },
        turfId: { type: Number, required: true, ref: "Turf" },
        userId: { type: Number, required: true, ref: "User" },
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        text: { type: String, default: "" },
        date: { type: Date, default: Date.now }
    }
);

// Enforce "one review per user per turf"
ReviewSchema.index({ userId: 1, turfId: 1 }, { unique: true });

ReviewSchema.pre<IReview>("save", async function (next) {
    if (!this.reviewId) {
        this.reviewId = await getNextSequence("reviewId");
    }
    next();
});


export default mongoose.models.Review || model<IReview>("Review", ReviewSchema,"reviews");