"use client";
import { useSession } from "next-auth/react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation"
import { FC, ReactElement } from "react";



interface NavbarProps {
    activePage: string;
}

export const Navbar: FC<NavbarProps>=(
    props): ReactElement => {

    // Session data
    const { data: session } = useSession();
    const router = useRouter();

    const activePage = props.activePage || "Home";

    
    const handleTurfOwnerClick = (e: React.MouseEvent) => {
        e.preventDefault(); // prevent default navigation
        if (session?.user?.role === 'Owner') {
        router.push('/owner/dashboard');
        } else {
        router.push('/login');
        }
    };

    return(
        <nav className="flex justify-center items-center px-10 py-5 border-b border-gray-800">
                <h1 className="text-2xl font-bold text-sky-400 absolute left-8">TURFMANIA</h1>
                <ul className="hidden md:flex space-x-8 text-sm">
                  <li><Link href="/homePage" className={activePage=="Home"? "text-cyan-400 [text-shadow:0_0_5px_#22d3ee,0_0_10px_#22d3ee,0_0_20px_#22d3ee]": "hover:text-cyan-400"}>Home</Link></li>
                  <li><Link href="/browse_turfs" className={activePage=="Turfs"? "text-cyan-400 [text-shadow:0_0_5px_#22d3ee,0_0_10px_#22d3ee,0_0_20px_#22d3ee]": "hover:text-cyan-400"}>Turfs</Link></li>
                  <li onClick={handleTurfOwnerClick} className={activePage=="Turf Owner"? "text-cyan-400 [text-shadow:0_0_5px_#22d3ee,0_0_10px_#22d3ee,0_0_20px_#22d3ee]": "hover:text-cyan-400 cursor-pointer"}>Turf Owner</li>
                  <li><Link href="/about" className={activePage=="About"? "text-cyan-400 [text-shadow:0_0_5px_#22d3ee,0_0_10px_#22d3ee,0_0_20px_#22d3ee]": "hover:text-cyan-400"}>About Us</Link></li>
                  <li><Link href="/contact" className={activePage=="Contact"? "text-cyan-400 [text-shadow:0_0_5px_#22d3ee,0_0_10px_#22d3ee,0_0_20px_#22d3ee]": "hover:text-cyan-400"}>Contact us</Link></li>
                </ul>
                {
                  !session &&
                  <Link href="/login">
                  <button className="bg-cyan-400 hover:bg-cyan-500 px-5 py-1 rounded-full font-semibold text-black text-sm absolute right-8 top-1/30">
                    LOGIN
                  </button>
                </Link>
                }
                {
                  session &&
                <Link href="/player/notifications" className="absolute right-10">
                  <Bell/>
                </Link>
                }
                
        </nav>
    )
}

export default Navbar;