import mongoose, {Schema, Document, model} from "mongoose";

export interface IPlayer extends Document{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nid: string;
    password: string;
    street: string;
    postCode: string;
    city: string;
}


const PlayerSchema: Schema = new Schema(
    {
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        email: {type: String, required: true, unique: true},
        phone: {type: String, required: true, unique: true},
        nid: {type: String, required: true, unique: true},
        password: {type: String, required: true},
        street: {type: String, required: false},
        postCode: {type: String, required: false},
        city: {type: String, required: false}
    }
);

export default mongoose.models.Player || model<IPlayer>("Player", PlayerSchema);