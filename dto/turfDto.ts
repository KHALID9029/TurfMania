
export default interface TurfDto {
  turfId: number;
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