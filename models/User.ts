import mongoose, {Schema, Document, model} from "mongoose";

export interface IUser extends Document{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nid: string;
    role: string;
    password: string;
    street: string;
    postCode: string;
    city: string;
}


const UserSchema: Schema = new Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        phone: {type: String, required: true, unique: true},
        nid: {type: String, required: true, unique: true},
        role: {type: String, required: true, enum: ["Player", "Owner"], default: "Player"},
        password: {type: String, required: true},
        street: {type: String, required: false},
        postCode: {type: String, required: false},
        city: {type: String, required: false}
    }
);

export default mongoose.models.User || model<IUser>("User", UserSchema);