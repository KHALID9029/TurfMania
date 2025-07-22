export default interface ReviewDto {
  id: number;           // Unique ID (UUID or DB _id)
  turfId: number;       // ID of the turf being reviewed
  userId: number;       // ID of the reviewer (linked to user)
  name: string;         // Display name of the reviewer
  rating: number;       // 1 to 5
  text?: string;         // The review message
  date: Date;           // Created or last updated timestamp
}