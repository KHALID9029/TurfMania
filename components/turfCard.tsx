import { MapPin } from "lucide-react";
import FadeContent from "./fadeContent";
import Image from "next/image";
type TurfProps = {
  name: string;
  location: string;
  imageUrl: string;
  amenities: string[];
  rating: number;
  rate: number; // rate per hour
   onClick?: () => void; // Optional click handler for the card
};

const TurfCard = ({ name, location, imageUrl, amenities, rating, rate,onClick }: TurfProps) => {
  const visibleAmenities = amenities.slice(0, 3);
  const remainingCount = amenities.length - visibleAmenities.length;

  return (

    <div
    onClick={onClick}
     className="bg-[#2a2a2a] rounded-xl overflow-hidden shadow-md hover:scale-105 transition-transform duration-300 flex flex-col h-full">
  <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
    <Image
      src={imageUrl}
      alt={name}
      className="w-full h-48 object-cover"
      width={400}
      height={300}
    />
    <div className="p-4 text-white flex flex-col flex-grow">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-2 min-h-[40px]">
        <h3 title={name} className="text-base md:text-md truncate max-w-[180px]">{name}</h3>
        <div className="flex items-center text-xs md:text-sm text-gray-300">
          <MapPin size={14} className="mr-1" />
          {location}
        </div>
      </div>

      {/* Amenities */}
      <p className="text-xs md:text-sm text-gray-400 mb-1">Amenities:</p>
      <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
        {visibleAmenities.map((amenity, idx) => (
          <span
            key={idx}
            className="bg-gray-700 text-gray-200 text-[10px] md:text-[10px] px-2 py-0.5 rounded-full h-full"
          >
            {amenity}
          </span>
        ))}
        {remainingCount > 0 && (
          <span className="bg-gray-700 text-gray-200 text-[10px] md:text-xs px-2 py-0.5 rounded-full h-full">
            +{remainingCount}
          </span>
        )}
      </div>

      {/* Rating & Price */}
      <div className="flex justify-between text-xs md:text-sm text-gray-300 mt-auto">
        <div className="flex text-yellow-400">
          {Array.from({ length: 5 }, (_, i) => {
            const starNumber = i + 1;
            if (rating >= starNumber) return <span key={i}>★</span>;
            else if (rating >= starNumber - 0.5) return <span key={i}>⯨</span>;
            else return <span key={i}>☆</span>;
          })}
        </div>
        <div>
          <span className="">Rate:</span> ৳{rate}/hr
        </div>
      </div>
    </div>
  </FadeContent>
</div>


  );
};

export default TurfCard;
