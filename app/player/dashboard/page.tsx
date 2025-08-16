"use client";
import { useSession, signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import FadeContent from "@/components/fadeContent";
import TextPressure from "@/components/customTextStyle/textPressure";
import Navbar from "@/components/bars/navbar";
import SpotlightCard from "@/components/spotlightCard";




export default function DashboardPage() {
  const { data: session, status } = useSession();
  console.log("Session Data:", session);

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
            { label: "Dashboard" }, // Will trigger redirect logic
            { label: "Bookings", href: "/bookings" },
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
          Upcoming Bookings
       </div>
      </div>
    </FadeContent>
  );
}
