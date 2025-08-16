"use client";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FC, ReactElement } from "react";
import toast from "react-hot-toast";

interface NavItem {
  label: string;
  href?: string; // Optional: Dashboard will be handled with onClick
}

interface NavbarProps {
  activePage: string;
  navItems: NavItem[];
}

export const Navbar: FC<NavbarProps> = ({ activePage, navItems }): ReactElement => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleDashboardRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("You need to log in to access the dashboard.");
      router.push("/login");
    } else if (session.user.role === "Owner") {
      router.push("/owner/dashboard");
    } else {
      router.push("/player/dashboard");
    }
  };

  const handleAccountRedirect = (e: React.MouseEvent) => {
    e.preventDefault();
    if(!session){
      toast.error("You need to log in to access account page");
      router.push("/login");
    }else if(session.user.role === "Owner"){
      router.push(`/owner/account/${session.user.userId}`)
    }else{
      router.push(`/player/account/${session.user.userId}`);
    }
  };

  const activeClass =
    "text-cyan-400 [text-shadow:0_0_5px_#22d3ee,0_0_10px_#22d3ee,0_0_20px_#22d3ee]";
  const inactiveClass = "hover:text-cyan-400";

  return (
    <nav className="flex justify-center items-center px-10 py-5 border-b border-gray-800">
      <h1 className="text-2xl font-bold text-sky-400 absolute left-8">TURFMANIA</h1>

      <ul className="hidden md:flex space-x-8 text-sm">
        {navItems.map((item,index) => (
          <li
            key={index}
            className={
              activePage === item.label ? activeClass : inactiveClass
            }
            onClick={
              item.label === "Dashboard" ? handleDashboardRedirect : item.label === "Account"? handleAccountRedirect : undefined
            }
          >
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <span className="cursor-pointer">{item.label}</span>
            )}
          </li>
        ))}
      </ul>

      {!session && (
        <Link href="/login">
          <button className="bg-cyan-400 hover:bg-cyan-500 px-5 py-1 rounded-full font-semibold text-black text-sm absolute right-8 top-1/30">
            LOGIN
          </button>
        </Link>
      )}

      {session && (
        <Link href="/player/notifications" className="absolute right-10">
          <Bell />
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
