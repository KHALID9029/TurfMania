export default interface turfDto {
  _id: string;
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
  
  operatingHours: {
    open: string;  
    close: string; 
  };

  size: {
    width: number;  
    height: number;
  };

  rate: number; // price per hour or slot
}
