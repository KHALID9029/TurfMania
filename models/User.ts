import mongoose, {Schema, Document, model} from "mongoose";
import { getNextSequence } from "@/lib/GetNextSequence";

export interface IUser extends Document{
    userId: number; // Custom auto-increment field for public use
    name: string;
    email: string;
    phone?: string;
    nid?: string;
    role: string;
    password?: string;
    street?: string;
    postCode?: string;
    city?: string;
    profilePicture?: string; // Optional profile picture field
}


const UserSchema: Schema = new Schema(
    {
        userId: {type: Number, unique: true}, // Custom auto-increment field for public use
        name: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        phone: {type: String, required: false, unique: true},
        nid: {type: String, required: false, unique: true},
        role: {type: String, required: true, enum: ["Player", "Owner"], default: "Player"},
        password: {type: String, select: false}, // Password field, not returned in queries by default
        street: {type: String, required: false},
        postCode: {type: String, required: false},
        city: {type: String, required: false},
        profilePicture: { type: String, required: false }, // Optional profile picture field
    }
);

UserSchema.pre<IUser>("save", async function(next) {
    if(!this.userId){
        this.userId = await getNextSequence("userId");
    }
    next();
});

export default mongoose.models.User || model<IUser>("User", UserSchema);