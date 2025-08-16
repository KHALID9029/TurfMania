"use client"

import Sidebar from "@/components/bars/sidebar"
import TurfCard from "@/components/turfCard"
import { redirect, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react"
import TurfDto from "@/dto/turfDto"

const fetchTurfs = async (ownerId: number) =>  {
    try {
        const response = await fetch(`/api/turf?ownerId=${ownerId}`, {
            method: 'GET',
        });

        if (!response.ok) {
            throw new Error("Failed to fetch turfs");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching turfs:", error);
        return [];
    }
}



export default function Turf() {
    const router = useRouter()
    const { data: session } = useSession()
    const [turfs, setTurfs] = useState<TurfDto[]>([]);

    useEffect(() => {
        if (session && session.user) {
            const ownerId = parseInt(session.user.id);
            fetchTurfs(ownerId).then((data) => setTurfs(data));
        }
    }, [session]);

    if (!session || !session.user) {
        redirect("/403")
    }

    const handleAddTurf = () => {
        router.push("/owner/addTurf")
    }

    return (
        <div className="relative flex min-h-screen bg-[#121212] text-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Turf Cards */}
            <main className="flex-1 p-6 relative z-10 flex flex-col min-h-0">
                <div className="flex justify-between items-center pr-10 md:pr-0">
                    <h1 className="text-2xl font-bold">MY TURFS</h1>
                    <button
                        className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-xl shadow-lg transition-all"
                        onClick={handleAddTurf}
                    >
                        List Turf
                    </button>
                </div>

                {/* Scrollable grid with fading edges */}
                <div className="relative flex-1 mt-5">
                    <div
                        className="custom-scrollbar overflow-y-auto p-4 pt-4 pb-10"
                        style={{ maxHeight: "90svh" }}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {turfs.map((turf, i) => (
                                <TurfCard
                                    key={`${turf.turfName}-${i}`}
                                    name={turf.turfName}
                                    location={turf.city}
                                    imageUrl={turf.photos && turf.photos.length > 0 ? turf.photos[0] : "/images/turf1.png"}
                                    amenities={turf.amenities ?? []}
                                    rating={turf.rating?? 0}
                                    rate={turf.rate}
                                    onClick={() => router.push(`/turfPage/${turf.turfId}`)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Top Fade */}
                    <div className="pointer-events-none absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[#121212] to-transparent z-20" />

                    {/* Bottom Fade */}
                    <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#121212] to-transparent z-20" />
                </div>
            </main>

            {/* Floating CTA Button */}

        </div>
    )
}
