'use client'

import Sidebar from "@/components/sidebar"
import Head from "next/head"

export default function Dashboard() {
  return (
    <>
      <Head>
        <title>Owner Dashboard</title>
      </Head>
      <div className="flex">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <main className="flex-1 bg-[#121212] p-6 text-white">
          <h1 className="text-2xl font-semibold mb-4">Welcome to the Dashboard</h1>
          {/*  Replace this with  actual dashboard content */}
        </main>
      </div>
    </>
  )
}
