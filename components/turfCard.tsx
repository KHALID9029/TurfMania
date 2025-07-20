import { MapPin } from "lucide-react";

type TurfProps = {
  name: string;
  location: string;
  imageUrl: string;
  amenities: string[];
  rating: number;
  rate: number; // rate per hour
};

const TurfCard = ({ name, location, imageUrl, amenities, rating, rate }: TurfProps) => {
  const visibleAmenities = amenities.slice(0, 3);
  const remainingCount = amenities.length - visibleAmenities.length;

  return (
    <div className="bg-[#2a2a2a] rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300 flex flex-col h-full">
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
       <div className="p-4 text-white flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-base md:text-lg">{name}</h3>
          <div className="flex items-center text-xs md:text-sm text-gray-300">
            <MapPin size={14} className="mr-1" />
            {location}
          </div>
        </div>

        <p className="text-xs md:text-sm text-gray-400 mb-1">Amenities:</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {visibleAmenities.map((amenity, idx) => (
            <span
              key={idx}
              className="bg-gray-700 text-gray-200 text-[10px] md:text-xs px-2 py-0.5 rounded-full"
            >
              {amenity}
            </span>
          ))}

          {remainingCount > 0 && (
            <span className="bg-gray-700 text-gray-200 text-[10px] md:text-xs px-2 py-0.5 rounded-full">
              +{remainingCount}
            </span>
          )}
        </div>

         <div className="flex justify-between text-xs md:text-sm text-gray-300 mt-auto">
          <div className="flex text-yellow-400">
            {Array.from({ length: 5 }, (_, i) => {
              const starNumber = i + 1;
              if (rating >= starNumber) {
                return <span key={i}>★</span>; // full star
              } else if (rating >= starNumber - 0.5) {
                return <span key={i}>⯨</span>; // half star
              } else {
                return <span key={i}>☆</span>; // empty star
              }
            })}
          </div>
          <div>
            <span className="">Rate:</span> ৳{rate}/hr
          </div>
        </div>
      </div>
    </div>
  );
};

export default TurfCard;
