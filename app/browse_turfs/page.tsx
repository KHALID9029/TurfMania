"use client";
import React, { useState, useEffect, useRef } from "react";

import BackgroundCircles from "@/components/backgrounds/backgroundCircles";
import Navbar from "@/components/bars/navbar";
import TurfCard from "@/components/turfCard";
import SelectAmenities from "@/components/Forms/selectAmenities";

const turfs = [
  {
    name: "ChattoTurf",
    location: "Chittagong",
    image: "/images/turf1.png",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800,
  },
  {
    name: "ChattoTurf",
    location: "Chittagong",
    image: "/images/turf1.png",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800,
  },
  {
    name: "ChattoTurf",
    location: "Chittagong",
    image: "/images/turf1.png",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800,
  },
  {
    name: "ChattoTurf",
    location: "Chittagong",
    image: "/images/turf1.png",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800,
  },
];

const nearbyTurfs = [
  {
    name: "ChattoTurf",
    location: "Chittagong",
    image: "/images/turf1.png",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800,
  },
  {
    name: "BoroTurf",
    location: "Chittagong",
    image: "/images/turf2.jpg",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800,
  },
  {
    name: "MajhariTurf",
    location: "Chittagong",
    image: "/images/turf3.jpg",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800,
  },
  {
    name: "OnekChattoTurf",
    location: "Chittagong",
    image: "/images/turf4.jpg",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800,
  },
];

const BrowsePage = () => {
  // For nearby Turfs section
  const [activeIndex, setActiveIndex] = useState(0);
  const len = nearbyTurfs.length;
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const getWrappedIndex = (index: number) => (index + len) % len;

  const getCardStyle = (index: number) => {
    const leftIndex = getWrappedIndex(activeIndex - 1);
    const rightIndex = getWrappedIndex(activeIndex + 1);

    const base =
      "absolute transition-all duration-500 ease-in-out w-[90vw] sm:w-[400px] rounded-xl overflow-hidden group cursor-pointer";

    if (index === activeIndex) {
      return `${base} z-20 scale-110`;
    } else if (index === leftIndex) {
      return `${base} -translate-x-[120%] z-10 opacity-80`;
    } else if (index === rightIndex) {
      return `${base} translate-x-[120%] z-10 opacity-80`;
    } else {
      return `hidden`; // hide all other cards
    }
  };

  // Auto-rotation effect
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => getWrappedIndex(prev + 1));
      }, 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);

  // For All Turfs section
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <main className="bg-transparent text-white font-sans">
      <BackgroundCircles />
      {/* Navigation Bar */}
      <Navbar activePage="Turfs" />

      <div className="min-h-screen text-white p-4 md:p-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">
            <span className="text-cyan-400">Browse</span> Turfs
          </h1>
        </div>

        {/* Turfs Nearby Section */}
        <section className="flex-1 p-6 relative z-10 flex flex-col min-h-0 mb-8">
          <h2 className="text-lg font-semibold mb-4">Nearby Turfs</h2>
          <div
            className="relative w-full overflow-x-hidden flex justify-center items-center min-h-[400px] py-10"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {nearbyTurfs.map((turf, i) => (
              <div
                key={`${turf.name}-${i}`}
                className={getCardStyle(i)}
                onClick={() => setActiveIndex(i)}
              >
                <TurfCard
                  name={turf.name}
                  location={turf.location}
                  imageUrl={turf.image}
                  amenities={turf.amenities}
                  rating={turf.rating}
                  rate={turf.rate}
                />
              </div>
            ))}
          </div>
        </section>

        {/* All Turfs Section */}
        <section>
          <h2 className="text-lg font-semibold mb-4">All Turfs</h2>
          <div className="flex flex-wrap items-center justify-between mb-4 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">Sort by:</span>
              <select className="bg-gray-800 text-white rounded p-1 text-sm">
                <option selected>Default</option>
                <option>Rating</option>
                <option>Price</option>
                <option>Turf Size</option>
              </select>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-300">Tags:</span>
              <div className="flex space-x-1 flex-wrap">
                {selectedAmenities.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-700 text-green-400 rounded-full px-2 py-0.5 text-xs flex items-center space-x-1"
                  >
                    <span>{tag}</span>
                    <button
                      onClick={() =>
                        setSelectedAmenities(
                          selectedAmenities.filter((a) => a !== tag)
                        )
                      }
                      className="text-red-400 hover:text-red-300 focus:outline-none ml-1"
                      title="Remove"
                    >
                      &times;
                    </button>
                  </span>
                ))}

                {selectedAmenities.length > 3 && (
                  <span className="bg-gray-700 text-green-400 rounded-full px-2 py-0.5 text-xs">
                    +{selectedAmenities.length - 3}
                  </span>
                )}

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="bg-gray-700 text-green-400 rounded-full px-2 py-0.5 text-xs flex items-center justify-center hover:bg-gray-600"
                  title="Choose amenities"
                >
                  +
                </button>
              </div>
            </div>

            {isModalOpen && (
              <SelectAmenities
                selectedAmenities={selectedAmenities}
                setSelectedAmenities={setSelectedAmenities}
                onClose={() => setIsModalOpen(false)}
              />
            )}
          </div>

          {/* Turf Cards */}
          <main className="flex-1 p-6  relative z-10 flex flex-col min-h-0">
            <div
              className="custom-scrollbar grid grid-cols-1 md:grid-cols-2 mt-5 lg:grid-cols-3 gap-4 p-4 pt-4 pb-10 overflow-y-auto"
              style={{ maxHeight: "90svh" }}
            >
              {turfs.map((turf, i) => (
                <TurfCard
                  key={`${turf.name}-${i}`}
                  name={turf.name}
                  location={turf.location}
                  imageUrl={turf.image}
                  amenities={turf.amenities}
                  rating={turf.rating}
                  rate={turf.rate}
                />
              ))}
            </div>
          </main>
        </section>
      </div>
    </main>
  );
};

export default BrowsePage;
