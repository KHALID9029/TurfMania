"use client";
import { useSession } from "next-auth/react";
import FadeContent from "@/components/fadeContent";
import TextPressure from "@/components/customTextStyle/textPressure";
import Navbar from "@/components/bars/navbar";
import BookingDto from "@/dto/bookingDto";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";


export default function DashboardPage() {
  const { data: session, status } = useSession();
  const userId = session?.user?.userId;
  const [bookings, setBookings] = useState<BookingDto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    async function fetchBookings() {
      setLoading(true);
      try {
        const res = await fetch(`/api/booking?userId=${userId}`);
        const data = await res.json();
        if (res.ok) {
          setBookings(data);
        } else {
          throw new Error("Failed to fetch bookings");
        }
      } catch {
        toast.error("Failed to load bookings");
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, [userId]);

  const today = new Date().toISOString().slice(0, 10);
  const upcoming = bookings.filter(b => b.date >= today);

  if (status === "loading") return <h1 className="flex justify-center items-center">Loading...</h1>;
  if (!session) return <p>Please sign in.</p>;

  return (
    <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
      <div className="flex flex-col items-center w-full justify-start min-h-screen px-4 gap-6">
        <Navbar
          activePage="Dashboard"
          navItems={[
            { label: "Home", href: "/homePage" },
            { label: "Turfs", href: "/browse_turfs" },
            { label: "Dashboard" },
            { label: "Bookings" },
            { label: "Account" },
          ]}
        />
        {/* Welcome Banner */}
        <div className="flex flex-col items-center justify-center text-center w-auto ">
          <TextPressure
            text="Welcome!"
            flex={true}
            alpha={false}
            stroke={false}
            width={true}
            weight={true}
            italic={true}
            textColor="#ffffff"
            strokeColor="#00a6ffff"
            minFontSize={36}
          />

          {/* User Name */}
          <h1 className="text-3xl text-blue-400 mt-10">
            {session.user.name}
          </h1>
        </div>
        <div className="flex flex-col items-center w-full max-w-4xl mt-10">
          <h2 className="text-2xl font-bold mb-4 text-white">Upcoming Bookings</h2>
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : upcoming.length === 0 ? (
            <div className="text-gray-400">No upcoming bookings.</div>
          ) : (
            <ul className="space-y-4 w-full">
              {upcoming.map(b => (
                <li key={b.bookingId} className="bg-gray-800 rounded-lg p-4 flex flex-col gap-2">
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
