"use client"

import Sidebar from "@/components/bars/sidebar"
import TurfCard from "@/components/turfCard"
import { useRouter } from "next/navigation"
import { useRef, useState, useEffect, useMemo } from "react";
import Navbar from "@/components/bars/navbar"
import { ChevronLeft, ChevronRight } from "lucide-react";
const turfs = [
  {
    name: "TurfZone",
    location: "Dhaka",
    image: "/images/turf1.png",
    amenities: ["Covered Roof", "Wi-Fi", "Lighting (Night Play)", "Sound System", "Drinking Water"],
    rating: 4.6,
    rate: 1300,
    size: 140,
  },
  {
    name: "GreenField",
    location: "Sylhet",
    image: "/images/turf1.png",
    amenities: ["Locker", "Parking", "Wi-Fi", "Changing Room"],
    rating: 3.9,
    rate: 850,
    size: 95,
  },
  {
    name: "PlayHub",
    location: "Rajshahi",
    image: "/images/turf1.png",
    amenities: ["Shower", "First Aid Kit", "CCTV Security", "Air Conditioning"],
    rating: 4.3,
    rate: 1000,
    size: 125,
  },
  {
    name: "GoalGround",
    location: "Khulna",
    image: "/images/turf1.png",
    amenities: ["Lighting (Night Play)", "Changing Room", "Parking", "Covered Roof", "Shoe Rental", "Wi-Fi"],
    rating: 4.7,
    rate: 1200,
    size: 135,
  },
  {
    name: "ArenaX",
    location: "Chittagong",
    image: "/images/turf1.png",
    amenities: ["Scoreboard", "Drinking Water", "Locker", "Seating Area", "Wi-Fi"],
    rating: 4.1,
    rate: 950,
    size: 120,
  },
  {
    name: "TurfRepublic",
    location: "Narayanganj",
    image: "/images/turf1.png",
    amenities: ["CCTV Security", "Parking", "Washroom", "Seating Area", "Changing Room", "Equipment Rental"],
    rating: 3.8,
    rate: 780,
    size: 100,
  },
  {
    name: "KickOff",
    location: "Gazipur",
    image: "/images/turf1.png",
    amenities: ["Shower", "Air Conditioning", "Locker", "Covered Roof", "First Aid Kit"],
    rating: 4.0,
    rate: 890,
    size: 90,
  },
  {
    name: "TheDome",
    location: "Comilla",
    image: "/images/turf1.png",
    amenities: ["Lighting (Night Play)", "Parking", "Changing Room", "Seating Area", "Wi-Fi"],
    rating: 4.9,
    rate: 1450,
    size: 148,
  },
  {
    name: "ElitePitch",
    location: "Barisal",
    image: "/images/turf1.png",
    amenities: ["Cafeteria", "Seating Area", "Washroom", "Shoe Rental"],
    rating: 3.7,
    rate: 560,
    size: 105,
  },
];





export default function Turfs() {
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardWidth, setCardWidth] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Detect and set card width on resize
  useEffect(() => {
    const updateCardWidth = () => {
      if (cardRef.current) {
        const style = getComputedStyle(cardRef.current);
        const marginRight = parseInt(style.marginRight) || 16; // fallback to 16px if undefined
        setCardWidth(cardRef.current.offsetWidth + marginRight);
      }
    };

    updateCardWidth();
    window.addEventListener("resize", updateCardWidth);
    return () => window.removeEventListener("resize", updateCardWidth);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current || cardWidth === 0) return;

    let newIndex = currentIndex;

    if (direction === "left") {
      newIndex--;
    } else if (direction === "right") {
      newIndex++;
    }

    if (newIndex < 0) newIndex = turfs.length - 3; // Wrap around if needed

    newIndex = newIndex % (turfs.length - 2); // Wrap around if needed
    console.log(turfs.length, "Total Turfs");
    console.log("New Index:", newIndex);

    scrollRef.current.scrollTo({
      left: newIndex * cardWidth,
      behavior: "smooth",
    });

    setCurrentIndex(newIndex);
  };


  const [sortOption, setSortOption] = useState("price");

  const sortedTurfs = useMemo(() => {
    return [...turfs].sort((a, b) => {
      if (sortOption === "price") return a.rate - b.rate;
      if (sortOption === "size") return a.size - b.size; // Assuming you have a `size` field
      if (sortOption === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [turfs, sortOption]);

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");


  const filteredAndSortedTurfs = useMemo(() => {
    // First filter by search query (if any)
    const filteredBySearch = turfs.filter((turf) => {
      const query = searchQuery.toLowerCase();
      return (
        turf.name.toLowerCase().includes(query) ||
        turf.location.toLowerCase().includes(query)
      );
    });

    // Then filter by selected tags (amenities)
    const filteredByTags = filteredBySearch.filter((turf) =>
      selectedTags.every((tag) => turf.amenities.includes(tag))
    );

    // Then sort the filtered results
    return filteredByTags.sort((a, b) => {
      if (sortOption === "price") return a.rate - b.rate;
      if (sortOption === "size") return a.size - b.size;
      if (sortOption === "rating") return b.rating - a.rating;
      return 0;
    });
  }, [turfs, selectedTags, sortOption, searchQuery]);




  const amenityArray = [
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

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag]
    );
  };


  return (
    <div className="">

      <Navbar
        activePage="Turfs"
        navItems={[
          { label: "Home", href: "/homePage" },
          { label: "Turfs", href: "/browse_turfs" },
          { label: "Dashboard" }, // Will trigger redirect logic
          { label: "Bookings", href: "/bookings" },
          { label: "Account", href: "/player/account" },
        ]}
      />

      <main className="flex-1 p-6 relative z-10 flex flex-col min-h-0 ">





        <h1 className="text-xl">Nearby Turfs</h1>

        <div className="relative w-full flex justify-center">
          {/* Scrollable container */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto h-[450px] items-center gap-4 px-4 scroll-smooth scrollbar-hide snap-x snap-mandatory"
          >
            {turfs.map((turf, i) => (
              <div
                key={`${turf.name}-${i}`}
                ref={i === 0 ? cardRef : null}
                className="shrink-0 w-[300px] h-[400px] md:w-[300px] snap-start"
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

          {/* Left Button */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 md:left-0 top-1/2 transform -translate-y-1/2 z-20 md:h-full bg-black/60 hover:bg-black/80 text-white p-2 rounded-full md:rounded-none"
          >
            <ChevronLeft size={36} />
          </button>

          {/* Right Button */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-2 md:right-0 top-1/2 transform -translate-y-1/2 z-20 md:h-full bg-black/60 hover:bg-black/80 text-white p-2 rounded-full md:rounded-none"
          >
            <ChevronRight size={36} />
          </button>
        </div>

        {/* Sort by dropdown */}
        <h1 className="text-xl">Browse Turfs</h1>
        {/* Search Bar */}
        <div className="px-5 md:px-10 mt-4 mx-5">
          <input
            type="text"
            placeholder="Search turfs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-96 bg-black border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:border-green-500"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 md:px-10">

          <div>
            <label htmlFor="sort" className="ml-5 mr-2 text-sm font-medium text-white">
              Sort by:
            </label>
            <select
              id="sort"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="rounded-md border border-gray-600 bg-black text-white text-sm px-3 py-2 focus:outline-none"
            >
              <option value="price">Price</option>
              <option value="size">Size</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          <div className="ml-6 flex items-center gap-2 flex-wrap">
            <span className="text-sm text-white font-medium">Tags:</span>
            {selectedTags.map((tag, i) => (
              <span
                key={i}
                className="flex items-center gap-1 text-xs bg-white text-black px-2 py-1 rounded-full"
              >
                {tag}
                <button
                  onClick={() =>
                    setSelectedTags((prev) => prev.filter((t) => t !== tag))
                  }
                  className="text-red-600 hover:text-red-800 font-bold"
                  aria-label={`Remove ${tag}`}
                >
                  ×
                </button>
              </span>
            ))}

            <button
              onClick={() => setIsModalOpen(true)}
              className="text-white text-xl font-bold px-2 pb-1 hover:text-green-400"
              aria-label="Add Tag"
            >
              +
            </button>

            {isModalOpen && (
              <div className="fixed inset-0 z-50 bg-black-900 bg-opacity-10 backdrop-blur-sm flex shadow-lg items-center justify-center">

                <div className="bg-black rounded-lg p-6 max-w-md w-full">
                  <h2 className="text-lg font-semibold mb-4">Select Amenities</h2>
                  <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scrollbar">
                    {amenityArray.map((amenity) => (
                      <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(amenity)}
                          onChange={() => toggleTag(amenity)}
                          className="accent-green-600"
                        />
                        <span>{amenity}</span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-4 flex justify-end gap-2">
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 text-black"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setIsModalOpen(false)}
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>



        {/* Scrollable grid with fading edges */}
        <div className="relative flex-1 mt-5">
          <div
            className="custom-scrollbar overflow-y-auto p-4 pt-4 pb-10"
            style={{ maxHeight: "90svh" }}
          >
            {filteredAndSortedTurfs.length === 0 && <div className="flex justify-center items-center py-10 text-2xl"><p>No turfs with Selected filter</p></div>}
            <div className="grid grid-cols-1 md:grid-cols-2 md:p-10 md:m-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedTurfs.map((turf, i) => (
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
          </div>

          {/* Top Fade */}
          <div className="pointer-events-none absolute top-[-1.5px] md:top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#000000] to-transparent z-20" />

          {/* Bottom Fade */}
          <div className="pointer-events-none absolute bottom-[-1.5px] md:bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#000000] to-transparent z-20" />
        </div>
      </main>

    </div>
  )
}
