"use client"

import Sidebar from "@/components/bars/sidebar"
import TurfCard from "@/components/turfCard"
import { useRouter } from "next/navigation"

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

]

export default function Turf() {
    const router = useRouter()

    const handleAddTurf = () => {
        router.push("/owner/addTurf")
    }

    return (
        <div className="relative flex min-h-screen bg-[#121212] text-white">
            {/* Inject scrollbar styles */}
            <style
                dangerouslySetInnerHTML={{
                    __html: `
    .custom-scrollbar {
      scrollbar-width: none; /* Firefox - hide by default */
    }

    .custom-scrollbar::-webkit-scrollbar {
      width: 0px; /* Chrome/Safari - hide by default */
    }

    /* On hover: show styled scrollbar */
    .custom-scrollbar:hover {
      scrollbar-width: thin;
      scrollbar-color: #3b82f6 #2e2e2e;
    }

    .custom-scrollbar:hover::-webkit-scrollbar {
      width: 6px;
    }

    .custom-scrollbar:hover::-webkit-scrollbar-track {
      background: #2e2e2e;
    }

    .custom-scrollbar:hover::-webkit-scrollbar-thumb {
      background-color: #3b82f6;
      border-radius: 6px;
    }

    .custom-scrollbar::-webkit-scrollbar-button {
      display: none;
      height: 0;
    }
  `,
                }}
            />


            {/* Sidebar */}
            <Sidebar />

            {/* Turf Cards */}
            <main className="flex-1 p-6  relative z-10 flex flex-col min-h-0">
                <h1>MY TURFS</h1>
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

            {/* Floating CTA Button */}
            <button
                className="fixed bottom-6 right-6 z-50 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl shadow-lg transition-all"
                onClick={handleAddTurf}
            >
                List Turf
            </button>
        </div>
    )
}
