"use client"

import {
  LayoutDashboard,
  MapPin,
  CalendarDays,
  Bell,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import clsx from "clsx"
import { useState } from "react"

const navItems = [
  { name: "Dashboard", icon: <LayoutDashboard />, href: "/owner/dashboard" },
  { name: "My Turfs", icon: <MapPin />, href: "/owner/turfs" },
  { name: "Bookings", icon: <CalendarDays />, href: "/owner/bookings" },
]

const others = [
  { name: "Notifications", icon: <Bell />, href: "/owner/notifications" },
  { name: "Settings", icon: <Settings />, href: "/owner/settings" },
]

const Sidebar = () => {
  const pathname = usePathname()
  const router = useRouter()
  const [expanded, setExpanded] = useState(true)

  const handleLogout = () => {
    alert("Logged out!")
    router.push("/homePage")
  }

  return (
    <aside
      className={clsx(
        "h-screen bg-[#1e1e1e] text-white flex flex-col justify-between p-4 transition-all duration-300 ease-in-out",
        expanded ? "w-60" : "w-20"
      )}
    >
      <div>
        {/* Toggle Collapse */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setExpanded((prev) => !prev)}
            className="text-gray-400 hover:text-white transition"
          >
            {expanded ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
          </button>
        </div>

        {/* Profile picture Circle */}
        <div className="flex justify-center mb-6">
          <div className={clsx(expanded?"w-16 h-16 bg-red-600 rounded-full":"w-10 h-10 bg-red-600 rounded-full" )} />
        </div>

        {/* Main Nav Items */}
        <ul className="space-y-2 text-sm">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={clsx(
                  "flex items-center px-3 py-2 rounded-md transition-colors space-x-3",
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

        {/* Others Section */}
        <div className="mt-6 border-t border-gray-700 pt-4 text-xs text-gray-500">
          {expanded && <p className="px-3 mb-2">Others</p>}
          <ul className="space-y-2 text-sm">
            {others.map((item) => (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={clsx(
                    "flex items-center px-3 py-2 rounded-md transition-colors space-x-3",
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

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className={clsx(
          "flex items-center justify-center bg-red-600 text-white rounded-md py-2 font-bold hover:bg-red-700 transition w-full",
          expanded ? "justify-center space-x-2" : "justify-center"
        )}
      >
        <LogOut size={16} />
        {expanded && <span>Logout</span>}
      </button>
    </aside>
  )
}


export default Sidebar;