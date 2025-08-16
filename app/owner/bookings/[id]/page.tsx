"use client";

import Sidebar from "@/components/bars/sidebar";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import TurfDto from "@/dto/turfDto";
import BookingDto from "@/dto/bookingDto";


const fetchBookings = async (turfId: number): Promise<BookingDto[]> => {
  try {
    const response = await fetch(`/api/booking?turfId=${turfId}`);
    if (!response.ok) throw new Error("Failed to fetch bookings");
    return await response.json();
  } catch {
    return [];
  }
};

export default function OwnerBookingsPage() {
    
  const { data: session } = useSession();

  const ownerId = session?.user?.userId;
  const [turfs, setTurfs] = useState<TurfDto[]>([]);
  const [bookingsByTurf, setBookingsByTurf] = useState<Record<number, BookingDto[]>>({});
  const [loading, setLoading] = useState(true);

  

  useEffect(() => {
    if (!ownerId) return;
    async function loadData() {
      setLoading(true);
      const turfsData = await fetch(`/api/turf?ownerId=${ownerId}`);
      const turfDto = await turfsData.json();
      setTurfs(turfDto);
      const bookingsData: Record<number, BookingDto[]> = {};
      for (const turf of turfDto) {
        bookingsData[turf.turfId] = await fetchBookings(turf.turfId);
      }
      setBookingsByTurf(bookingsData);
      setLoading(false);
    }
    loadData();
  }, [ownerId]);

  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <Head>
        <title>Owner Bookings</title>
      </Head>
      <div className="flex min-h-screen bg-[#121212] text-white">
        <Sidebar />
        <main className="flex-1 p-6">
          <h1 className="pb-5 text-2xl font-bold">MY TURF BOOKINGS</h1>
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : turfs.length === 0 ? (
            <div className="text-gray-400">No turfs found.</div>
          ) : (
            turfs.map(turf => (
              <section key={turf.turfId} className="mb-10">
                <h2 className="text-xl font-semibold mb-2 text-blue-400">{turf.turfName}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Upcoming Bookings */}
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-green-400">Upcoming Bookings</h3>
                    {bookingsByTurf[turf.turfId]?.filter(b => b.date >= today).length === 0 ? (
                      <div className="text-gray-400">No upcoming bookings.</div>
                    ) : (
                      <ul className="space-y-2">
                        {bookingsByTurf[turf.turfId]?.filter(b => b.date >= today).map(b => (
                          <li key={b.bookingId} className="bg-gray-800 rounded-lg p-3 flex flex-col gap-1">
                            <span>User: {b.userId}</span>
                            <span>Date: {b.date} {b.startTime}-{b.endTime}</span>
                            <span>Cost: {b.cost} | Status: {b.paymentStatus}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  {/* Past Bookings */}
                  <div>
                    <h3 className="text-lg font-bold mb-2 text-yellow-400">Past Bookings</h3>
                    {bookingsByTurf[turf.turfId]?.filter(b => b.date < today).length === 0 ? (
                      <div className="text-gray-400">No past bookings.</div>
                    ) : (
                      <ul className="space-y-2">
                        {bookingsByTurf[turf.turfId]?.filter(b => b.date < today).map(b => (
                          <li key={b.bookingId} className="bg-gray-700 rounded-lg p-3 flex flex-col gap-1">
                            <span>User: {b.userId}</span>
                            <span>Date: {b.date} {b.startTime}-{b.endTime}</span>
                            <span>Cost: {b.cost} | Status: {b.paymentStatus}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            ))
          )}
        </main>
      </div>
    </>
  );
}
