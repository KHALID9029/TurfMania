"use client"

import TurfCard from "@/components/turfCard"
import { useRouter } from "next/navigation"
import { useRef, useState, useEffect, useMemo } from "react";
import Navbar from "@/components/bars/navbar"
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ITurf } from "@/models/Turf";
import FadeContent from "@/components/fadeContent";




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

    if (newIndex < 0) newIndex = turfs.length -1 ; // Wrap around if needed

    newIndex = newIndex % (turfs.length); // Wrap around if needed
    console.log(turfs.length, "Total Turfs");
    console.log("New Index:", newIndex);

    scrollRef.current.scrollTo({
      left: newIndex * cardWidth,
      behavior: "smooth",
    });

    setCurrentIndex(newIndex);
  };


  const [sortOption, setSortOption] = useState("price");

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [turfs, setTurfs] = useState<ITurf[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  useEffect(() => {
    async function fetchTurfs() {
      try {
        const res = await fetch("/api/turf");
        if (!res.ok) throw new Error("Failed to fetch turfs");
        const data = await res.json();
        setTurfs(data); // assuming `data` is an array
        console.log("Fetched turfs:", data);
      } catch (err) {
        console.error("Error loading turfs:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchTurfs();
  }, []);


  const filteredAndSortedTurfs = useMemo(() => {
    // First filter by search query (if any)
    const filteredBySearch = turfs.filter((turf) => {
      const query = searchQuery.toLowerCase();
      return (
        turf.turfName.toLowerCase().includes(query) ||
        turf.city.toLowerCase().includes(query)
      );
    });

    // Then filter by selected tags (amenities)
    const filteredByTags = filteredBySearch.filter((turf) =>
      selectedTags.every((tag) => turf.amenities?.includes(tag))
    );

    // Then sort the filtered results
    return filteredByTags.sort((a, b) => {
      let compare = 0;

      if (sortOption === "price") compare = a.rate - b.rate;
      else if (sortOption === "size") compare = (a.turfSize ?? 0) - (b.turfSize ?? 0);
      else if (sortOption === "rating") compare = (a.rating ?? 0) - (b.rating ?? 0);

      return sortDirection === "asc" ? compare : -compare;
    });

  }, [turfs, selectedTags, sortOption, searchQuery, sortDirection]);




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
    <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
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
                  key={`${turf.turfName}-${i}`}
                  ref={i === 0 ? cardRef : null}
                  className="shrink-0 w-[300px] h-[400px] md:w-[300px] snap-start"
                >
                  <TurfCard
                    name={turf.turfName}
                    location={turf.city}
                    imageUrl={turf.photos?.[0] || "/images/turf1.png"} // Fallback image
                    amenities={turf.amenities ? turf.amenities : []}
                    rating={turf.rating ? turf.rating : 1}
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 md:px-10">

            {/* Search Bar */}
            <div className="md:px-10 mr-5">
              <input
                type="text"
                placeholder="Search turfs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full md:w-96 bg-black border border-gray-600 rounded-md text-white px-4 py-2 focus:outline-none focus:border-green-500"
              />
            </div>
            {/* Sort by */}
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
              <button
                onClick={() => setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"))}
                className="text-white text-sm ml-2 border px-2 py-1 rounded hover:bg-gray-800"
              >
                {sortDirection === "asc" ? "↑ Asc" : "↓ Desc"}
              </button>

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
                    key={`${turf.turfName}-${i}`}
                    name={turf.turfName}
                    location={turf.city}
                    imageUrl={turf.photos?.[0] || "/images/turf1.png"} // Fallback image
                    amenities={turf.amenities ? turf.amenities : []}
                    rating={turf.rating ? turf.rating : 1}
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
    </FadeContent>
  )
}
