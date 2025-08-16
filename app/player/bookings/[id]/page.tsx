"use client"

import Navbar from "@/components/bars/navbar";
import FadeContent from "@/components/fadeContent";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import BookingDto from "@/dto/bookingDto";


const PlayerBookingsPage: React.FC = () => {
    const { id } = useParams();
    const [bookings, setBookings] = useState<BookingDto[]>([]);
    const [loading, setLoading] = useState(true);
    const [cancelingId, setCancelingId] = useState<number|null>(null);

    useEffect(() => {
        if (!id) return;
        async function fetchBookings() {
            setLoading(true);
            try {
                const res = await fetch(`/api/booking?userId=${id}`);
                const data = await res.json();
                if (res.ok) {
                    setBookings(data);
                } else {
                    throw new Error("Failed to fetch bookings");
                }
            } catch (error) {
                toast.error("Failed to load bookings");
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchBookings();
    }, [id]);

    // Split bookings
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = bookings.filter(b => b.date >= today);
    const previous = bookings.filter(b => b.date < today);

    async function handleCancel(bookingId: number) {
        setCancelingId(bookingId);
        try {
            const res = await fetch(`/api/booking?id=${bookingId}`, { method: "DELETE" });
            if (res.ok) {
                toast.success("Booking cancelled");
                setBookings(bookings.filter(b => b.bookingId !== bookingId));
            } else {
                toast.error("Failed to cancel booking");
            }
        } catch {
            toast.error("Failed to cancel booking");
        } finally {
            setCancelingId(null);
        }
    }

    return (
        <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
            <div className="flex flex-col items-center w-full justify-start min-h-screen px-4 gap-6 ">
                <Navbar
                    activePage="Bookings"
                    navItems={[
                        { label: "Home", href: "/homePage" },
                        { label: "Turfs", href: "/browse_turfs" },
                        { label: "Dashboard" },
                        { label: "Bookings" },
                        { label: "Account", href: "/player/account" },
                    ]}
                />
                <div className="w-full max-w-2xl mt-8">
                    <h2 className="text-2xl font-bold mb-4 text-white">Upcoming Bookings</h2>
                    {loading ? (
                        <div className="text-white">Loading...</div>
                    ) : upcoming.length === 0 ? (
                        <div className="text-gray-400">No upcoming bookings.</div>
                    ) : (
                        <ul className="space-y-4">
                            {upcoming.map(b => (
                                <li key={b.bookingId} className="bg-gray-800 rounded-lg p-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Turf: {b.turfId}</span>
                                        <span>{b.date} {b.startTime}-{b.endTime}</span>
                                    </div>
                                    <span>Cost: {b.cost} | Status: {b.paymentStatus}</span>
                                    {/* <button
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 disabled:opacity-50"
                                        onClick={() => handleCancel(b.bookingId)}
                                        disabled={cancelingId === b.bookingId}
                                    >
                                        {cancelingId === b.bookingId ? "Cancelling..." : "Cancel Booking"}
                                    </button> */}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <div className="w-full max-w-2xl mt-12">
                    <h2 className="text-2xl font-bold mb-4 text-white">Previous Bookings</h2>
                    {loading ? (
                        <div className="text-white">Loading...</div>
                    ) : previous.length === 0 ? (
                        <div className="text-gray-400">No previous bookings.</div>
                    ) : (
                        <ul className="space-y-4">
                            {previous.map(b => (
                                <li key={b.bookingId} className="bg-gray-700 rounded-lg p-4 flex flex-col gap-2">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Turf: {b.turfId}</span>
                                        <span>{b.date} {b.startTime}-{b.endTime}</span>
                                    </div>
                                    <span>Cost: {b.cost} | Status: {b.paymentStatus}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </FadeContent>
    );
}

export default PlayerBookingsPage;