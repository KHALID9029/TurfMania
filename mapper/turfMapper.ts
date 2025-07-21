import {ITurf} from "@/models/Turf";
import TurfDto from "@/dto/turfDto";

export function toTurfDto(turf: ITurf): TurfDto {
    return {
        turfId: turf.turfId,
        turfName: turf.turfName,
        ownerId: turf.ownerId,
        photos: turf.photos,
        street: turf.street,
        postCode: turf.postCode,
        city: turf.city,
        amenities: turf.amenities,
        open: turf.open,
        close: turf.close,
        turfSize: turf.turfSize,
        rate: turf.rate,
        lat: turf.lat,
        lng: turf.lng,
        rating: turf.rating
    };
}