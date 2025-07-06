"use client";
import { FC, ReactElement, useState, useEffect } from "react";

const amenitiesOptions = [
  "Washroom",
  "Locker",
  "Parking",
  "Wi-Fi",
  "Changing Room",
  "First Aid Kit",
  "Drinking Water",
  "Seating Area",
  "Cafeteria",
  "Shower",
  "Lighting (Night Play)",
  "Scoreboard",
  "Sound System",
  "CCTV Security",
  "Covered Roof",
  "Shoe Rental",
  "Equipment Rental",
  "Air Conditioning",
];

interface SelectAmenitiesProps {
  selectedAmenities: string[];
  setSelectedAmenities: (amenities: string[]) => void;
  onClose: () => void;
}

export const SelectAmenities: FC<SelectAmenitiesProps> = (props): ReactElement => {
    // Destructure props
    const { selectedAmenities, setSelectedAmenities, onClose } = props;

    const [localSelection, setLocalSelection] = useState<string[]>([]);

    useEffect(() => {
        setLocalSelection(selectedAmenities);
    }, [selectedAmenities]);

    const handleToggle = (amenity: string) => {
    setLocalSelection((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleDone = () => {
    setSelectedAmenities(localSelection);
    onClose();
  };

  const handleCancel = () => {
    onClose(); // simply close without changing parent state
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
        onClick={handleCancel} // close on outside click
    >
      <div className="custom-scrollbar bg-gray-900 text-white rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // prevent closing on inner click
    >
        <h3 className="text-lg font-semibold mb-4">Select Amenities</h3>

        <div className="grid grid-cols-2 gap-2">
          {amenitiesOptions.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={localSelection.includes(amenity)}
                onChange={() => handleToggle(amenity)}
                className="accent-green-500"
              />
              <span>{amenity}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-end mt-4 space-x-2">
          <button
            onClick={handleCancel}
            className="bg-gray-700 rounded px-4 py-2 hover:bg-gray-600"
          >
            Cancel
          </button>
          <button
            onClick={handleDone}
            className="bg-green-600 rounded px-4 py-2 hover:bg-green-500"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}


export default SelectAmenities;