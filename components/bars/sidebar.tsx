"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import clsx from "clsx"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  MapPin,
  CalendarDays,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
  UploadIcon
} from "lucide-react"



const others = [
  { name: "Notifications", icon: <Bell />, href: "/owner/notifications" },
  { name: "Settings", icon: <Settings />, href: "/owner/settings" },
]

const Sidebar = () => {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [expanded, setExpanded] = useState(true)
  const { data: session } = useSession()
  const userId = session?.user.userId

  const navItems = [
    { name: "Dashboard", icon: <LayoutDashboard />, href: "/owner/dashboard" },
    { name: "My Turfs", icon: <MapPin />, href: "/owner/turfs" },
    { name: "Bookings", icon: <CalendarDays />, href: `/owner/bookings/${userId}` },
    { name: "List turf", icon: <UploadIcon />, href: "/owner/addTurf" },
  ]

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={clsx(
          "hidden md:flex h-screen bg-[#1e1e1e] text-white flex-col justify-between p-4 transition-all duration-300 ease-in-out",
          expanded ? "w-60" : "w-20"
        )}
      >

        <div>
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setExpanded((prev) => !prev)}
              className="text-gray-400 hover:text-white transition"
            >
              {expanded ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
            </button>
          </div>
          <div className="flex space-between items-center mb-6">
            {/* <div className="w-16 h-16 bg-red-600 rounded-full" /> */}
            <img src="/images/turf3.jpg" className={clsx(expanded && "md:w-20 md:h-20 bg-transparent rounded-full","w-12 h-12 bg-transparent rounded-full" )} />
          </div>
           {expanded && <h6 className="text-sm pl-2 mb-4">{session?.user.name}</h6>}

          <ul className="space-y-2 text-sm">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center space-x-3 px-3 py-2 rounded-md",
                    pathname === item.href
                      ? "bg-gradient-to-r from-indigo-500 to-indigo-400 text-white"
                      : "hover:bg-gray-800 text-gray-300"
                  )}
                >
                  <span>{item.icon}</span>
                  {expanded && <span>{item.name}</span>}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-6 border-t border-gray-700 pt-4 text-xs text-gray-500">
            <ul className="space-y-2 text-sm">
              {others.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center space-x-3 px-3 py-2 rounded-md",
                      pathname === item.href
                        ? "bg-gradient-to-r from-indigo-500 to-indigo-400 text-white"
                        : "hover:bg-gray-800 text-gray-300"
                    )}
                  >
                    <span>{item.icon}</span>
                    {expanded && <span>{item.name}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/homePage" })}
          className="flex items-center justify-center w-full bg-red-600 text-white rounded-md py-2 font-bold hover:bg-red-700 transition"
        >
          <LogOut className="mr-2" size={16} />
          {expanded && <span>Logout</span>}
        </button>
      </aside>

      {/* Mobile burger icon (top-right corner) */}
      <div className="md:hidden absolute top-4 right-4 z-50">
        <button
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="bg-gray-800 text-white p-1 mt-2 rounded-md"
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>

        {mobileMenuOpen && (
          <div className="absolute right-0  mt-2 w-52 bg-[#1e1e1e] rounded-lg shadow-lg border border-gray-700 z-50">
            <ul className="py-2 text-sm text-white">
              {[...navItems, ...others].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={clsx(
                      "flex items-center px-4 py-2 space-x-2 hover:bg-gray-700",
                      pathname === item.href && "bg-gray-800"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
              <li className="border-t border-gray-600 mt-2">
                <button
                  onClick={() => signOut({ callbackUrl: "/homePage" })}
                  className="w-full flex items-center px-4 py-2 text-left text-red-400 hover:bg-gray-700 space-x-2"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  )
}

export default Sidebar
