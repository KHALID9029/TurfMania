import mongoose, {Schema, Document, model} from "mongoose";

export interface ITurf extends Document{
  name: string;
  street: string;
  postCode: string;
  city: string;
  ownerId: string; // Reference to the owner's user ID
  photos: string[]; // URLs or paths to image files
  location: {
    lat: number;
    lng: number;
  }; // Google Maps coordinates

  amenities?: string[]; // List of amenity names
  operatingHours?: {
    open: string;  
    close: string; 
  };

  size: {
    width: number;  
    height: number;
  };

  rate: number; // price per hour or slot
}


const TurfSchema: Schema = new Schema(
    {
        name: {type: String, required: true},
        street: {type: String, required: false},
        postCode: {type: String, required: false},
        city: {type: String, required: false},
        ownerId: {type: String, required: true}, // Reference to the owner's user ID
        photos: {type: [String], required: false}, // URLs or paths to image files
        location: {
            lat: {type: Number, required: true},
            lng: {type: Number, required: true}
        }, // Google Maps coordinates
        amenities: {type: [String], required: false}, // List of amenity names
        operatingHours: {
            open: {type: String, required: false},  
            close: {type: String, required: false} 
        },
        size: {
            width: {type: Number, required: true},  
            height: {type: Number, required: true}
        },
        rate: {type: Number, required: true} // price per hour or slot
    }
);

export default mongoose.models.Turf || model<ITurf>("Turf", TurfSchema, "turfs");