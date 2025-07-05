"use client"

import Sidebar from "@/components/bars/sidebar"
import Head from "next/head"
import TrueFocus from '@/components/truefocus';
//import Lightning from '@/components/backgrounds/lightingBackground';
import { useRouter } from "next/navigation"

const Dashboard=()=> {

      const router = useRouter()
  
      const handleAddTurf = () => {
          router.push("/owner/addTurf")
      }

  return (
    <>
      <Head>
        <title>session.username</title>
      </Head>
      <div className="flex min-h-screen bg-[#121212] text-white">
    
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Cards Row */}
          <h1 className="pb-5">DASHBOARD</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Book vs Cancels */}
            <div className="bg-[#1f1f1f] p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-300">Book Vs Cancels</h2>
                  <p className="text-xs text-gray-500">
                    Sat, 14th June, 2025 12:45 PM
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300">
                  Today
                </span>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex justify-between items-center">
                  <p className=" text-sm md:text-lg pr-2">Bookings</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm md:text-xl font-semibold">12</span>
                    <span className="text-green-400 text-xs font-medium">↑2.8%</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-sm md:text-lg">Cancels</p>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm md:text-xl font-semibold">3</span>
                    <span className="text-green-400 text-xs font-medium">↓1.2%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Today's Statistics */}
            <div className="bg-[#1f1f1f] p-6 rounded-xl shadow-md">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-sm font-semibold text-gray-300">Today’s statistics</h2>
                  <p className="text-xs text-gray-500">
                    Sat, 14th June, 2025 12:45 PM
                  </p>
                </div>
                <span className="text-xs px-2 py-0.5 bg-gray-700 rounded-full text-gray-300">
                  Today
                </span>
              </div>

              <div className="mt-8">
                <p className="text-lg mb-2">Income</p>
                <div className="flex items-end justify-between">
                  <span className="text-3xl font-bold tracking-wide">
                    15,280 <span className="text-xl">BDT</span>
                  </span>
                  <span className="text-green-400 text-sm font-medium mb-1">↑2.8%</span>
                </div>
                <hr className="mt-4 border-gray-600" />
              </div>
            </div>
          </div>

          {/* CTA Section */}
          <div className="text-center mt-20">
            <h1 className="text-3xl font-medium pb-5">
              Want to{" "}
            </h1>
             <TrueFocus
                sentence="Earn More"
                manualMode={false}
                blurAmount={5}
                borderColor="#44B5E9"
                animationDuration={1.5}
                pauseBetweenAnimations={0.5}
              />
            <button className="mt-6 px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-semibold text-base transition"
            onClick={handleAddTurf}
            >
              List your turf
            </button>
          </div>
        </main>
      </div>
    </>
  )
}


export default Dashboard;