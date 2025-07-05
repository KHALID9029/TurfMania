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
        operatingHours: {
            from: {
                hour: turf.operatingHours.from.hour,
                minute: turf.operatingHours.from.minute,
                period: turf.operatingHours.from.period
            },
            to: {
                hour: turf.operatingHours.to.hour,
                minute: turf.operatingHours.to.minute,
                period: turf.operatingHours.to.period
            }
        },
        turfSize: turf.turfSize,
        rate: turf.rate,
        location: {
            lat: turf.location.lat,
            lng: turf.location.lng
        }
    };
}