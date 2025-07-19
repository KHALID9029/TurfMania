"use client"

import Sidebar from "@/components/bars/sidebar"
import TurfCard from "@/components/turfCard"
import { useRouter } from "next/navigation"
import { useRef, useState, useEffect } from "react";
import Navbar from "@/components/bars/navbar"
import { ChevronLeft, ChevronRight } from "lucide-react";
const turfs = [
  {
    name: "ChattoTurf",
    location: "Chittagong",
    image: "/images/turf1.png",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800
  },
  {
    name: "ChattoTurf",
    location: "Chittagong",
    image: "/images/turf1.png",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800
  },
  {
    name: "ChattoTurf",
    location: "Chittagong",
    image: "/images/turf1.png",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800
  },
  {
    name: "ChattoTurf",
    location: "Chittagong",
    image: "/images/turf1.png",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800
  },
  {
    name: "ChattoTurf",
    location: "Chittagong",
    image: "/images/turf1.png",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800
  },
  {
    name: "ChattoTurf",
    location: "Chittagong",
    image: "/images/turf1.png",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800
  },
  {
    name: "ChattoTurf",
    location: "Chittagong",
    image: "/images/turf1.png",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800
  },
  {
    name: "ChattoTurf",
    location: "Chittagong",
    image: "/images/turf1.png",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800
  },
  {
    name: "ChattoTurf",
    location: "Chittagong",
    image: "/images/turf1.png",
    amenities: ["Washroom", "Locker", "Shower"],
    rating: 4.5,
    rate: 800
  },

]



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

    newIndex= newIndex % (turfs.length-2); // Wrap around if needed
    console.log(turfs.length, "Total Turfs");
    console.log("New Index:", newIndex);

    scrollRef.current.scrollTo({
      left: newIndex * cardWidth,
      behavior: "smooth",
    });

    setCurrentIndex(newIndex);
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
                className="shrink-0 w-[300px] md:w-[300px] snap-start"
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




        {/* Scrollable grid with fading edges */}
        <div className="relative flex-1 mt-5">
          <div
            className="custom-scrollbar overflow-y-auto p-4 pt-4 pb-10"
            style={{ maxHeight: "90svh" }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 md:p-10 md:m-2 lg:grid-cols-3 gap-4">
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
