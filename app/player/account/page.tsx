"use client";

import { Pencil } from "lucide-react";
import React from "react";
import Navbar from "@/components/bars/navbar";
import FadeContent from "@/components/fadeContent";

const PlayerAccountPage: React.FC = () => {
    const userInfo = {
        uid: "2314342344",
        firstName: "Kochi",
        lastName: "Khalid",
        dob: "29th June, 2002",
        email: "kochiKhalid@gmail.com",
        phone: "01778350809",
        role: "Player",
        city: "Chittagong",
        road: "Agrabad Road",
        postalCode: "Bandar-4100",
    };

    return (
        <FadeContent blur={true} duration={1000} easing="ease-out" initialOpacity={0}>
            <div className="flex flex-col items-center w-full justify-start min-h-screen px-4 gap-6 ">

                <Navbar
                    activePage="Account"
                    navItems={[
                        { label: "Home", href: "/homePage" },
                        { label: "Turfs", href: "/browse_turfs" },
                        { label: "Dashboard" }, // Will trigger redirect logic
                        { label: "Bookings", href: "/bookings" },
                        { label: "Account", href: "/player/account" },
                    ]}
                />
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="relative w-30 h-30">
                            <img
                                src="/images/turf3.jpg"
                                alt="Profile"
                                className="w-30 h-30 rounded-full object-cover"
                            />
                            <div className="absolute -top-[0px] -right-[0px] bg-zinc-700 p-[2px] rounded-full cursor-pointer hover:bg-zinc-600">
                                <Pencil className="w-4 h-4 text-white" />
                            </div>
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold">
                                {userInfo.firstName} {userInfo.lastName}
                            </h2>
                            <p className="text-gray-400 text-sm">UID: {userInfo.uid}</p>
                        </div>
                    </div>


                    {/* Personal Info */}
                    <div className="relative bg-zinc-800 rounded-lg p-6 mb-6">
                        <div className="absolute top-4 right-4">
                            <Pencil className="text-white bg-zinc-700 p-1 rounded-full w-5 h-5 cursor-pointer  hover:bg-zinc-600" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Info label="First Name" value={userInfo.firstName} />
                            <Info label="Last Name" value={userInfo.lastName} />
                            <Info label="Date of Birth" value={userInfo.dob} />
                            <Info label="E-mail" value={userInfo.email} />
                            <Info label="Phone no." value={userInfo.phone} />
                            <Info label="User Role" value={userInfo.role} />
                        </div>
                    </div>

                    {/* Address Info */}
                    <div className="relative bg-zinc-800 rounded-lg p-6">
                        <div className="absolute top-4 right-4">
                            <Pencil className="text-white bg-zinc-700 p-1 rounded-full w-5 h-5 cursor-pointer  hover:bg-zinc-600" />
                        </div>
                        <h3 className="text-cyan-400 text-sm font-semibold mb-4">Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Info label="City" value={userInfo.city} />
                            <Info label="Road" value={userInfo.road} />
                            <Info label="Postal Code" value={userInfo.postalCode} />
                        </div>
                    </div>
                </div>
            </div>
        </FadeContent>
    );
};

interface InfoProps {
    label: string;
    value: string;
}

const Info: React.FC<InfoProps> = ({ label, value }) => (
    <div className="text-sm">
        <p className="text-gray-400">{label}</p>
        <p className="font-medium">{value}</p>
    </div>
);

export default PlayerAccountPage;
