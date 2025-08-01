"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

import Navbar from "@/components/bars/navbar";
import SpotlightCard from '@/components/spotlightCard';
import DarkVeil from "@/components/backgrounds/darkVeils";
import ShinyText from "@/components/customTextStyle/shinyText";


export default function HomePage() {

  // Session Data
  const { data: session } = useSession();

  // Sample images for the popular turfs section
  const images = ["/images/turf1.jpg", "/images/turf2.jpg", "/images/turf3.jpg", "/images/turf4.jpg"];
  const [activeIndex, setActiveIndex] = useState(0);
  const len = images.length;

  // Extra
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  const getWrappedIndex = (index: number) => (index + len) % len;

  const getCardStyle = (index: number) => {
    const leftIndex = getWrappedIndex(activeIndex - 1);
    const rightIndex = getWrappedIndex(activeIndex + 1);

    const base = "absolute transition-all duration-500 ease-in-out w-[300px] h-[200px] rounded-xl overflow-hidden group cursor-pointer";

    if (index === activeIndex) {
      return `${base} z-20 scale-110`;
    } else if (index === leftIndex) {
      return `${base} -translate-x-[100%] z-10 opacity-80`;
    } else if (index === rightIndex) {
      return `${base} translate-x-[100%] z-10 opacity-80`;
    } else {
      return `hidden`; // hide all other cards
    }
  };

  // Auto-rotation effect
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        setActiveIndex((prev) => getWrappedIndex(prev + 1));
      }, 3000);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPaused]);


  // Typing effect for the "Get started..." text
  const text = "Get started...";
  const [displayed, setDisplayed] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 100;
    const pauseTime = 1000;

    const handler = setTimeout(() => {
      if (!isDeleting && index < text.length) {
        setDisplayed((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      } else if (!isDeleting && index === text.length) {
        setTimeout(() => setIsDeleting(true), pauseTime);
      } else if (isDeleting && index > 0) {
        setDisplayed((prev) => prev.slice(0, -1));
        setIndex((prev) => prev - 1);
      } else if (isDeleting && index === 0) {
        setIsDeleting(false);
      }
    }, typingSpeed);

    return () => clearTimeout(handler);
  }, [index, isDeleting, text]);


  return (
    <main className="bg-transparent text-white font-sans">
      <div className="fixed inset-0 -z-10">
        <DarkVeil
        />
      </div>

      {/* Navigation Bar */}
      <Navbar
        activePage="Home"
        navItems={[
          { label: "Home", href: "/homePage" },
          { label: "Turfs", href: "/browse_turfs" },
          { label: "Dashboard" }, // Will trigger redirect logic
          { label: "About", href: "/about" },
          { label: "Contact", href: "/contact" },
        ]}
      />


      {/* Feature Cards */}
      <section className="flex justify-center items-center gap-10 px-10 py-16 flex-wrap">
        {[
          { title: "Simple", subtitle: "Book in Minutes", image: "/images/turf1.jpg" },
          { title: "Secure", subtitle: "Verified Listings", image: "/images/turf2.jpg" },
          { title: "Flexible", subtitle: "Anytime Access", image: "/images/turf3.jpg" },
        ].map((card, index) => (
          <SpotlightCard key={index} className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">
            <div
              key={index}
              className="relative w-90 h-120 rounded-xl overflow-hidden"
            >
              {/* Background Image */}


              {/* Optional dark overlay */}
              <div className="absolute inset-0 bg-transparent" />

              {/* Text Overlay */}
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center text-white px-4">


                <ShinyText text={card.title} disabled={false} speed={3} className='custom-class' />
                <ShinyText text={card.subtitle} disabled={false} speed={3} className='custom-class mt-2' />
              </div>
            </div>
          </SpotlightCard>
        ))}
      </section>



      {/* <SpotlightCard className="custom-spotlight-card" spotlightColor="rgba(0, 229, 255, 0.2)">

      </SpotlightCard> */}

      {/* Popular Turfs */}
      <section className="px-10 pb-100 relative h-[250px]">
        <h2 className="text-xl text-white mb-6">
          <span className="text-sky-400">Popular</span> Turfs
        </h2>

        <div
          className="relative flex justify-center items-center h-[200px]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {images.map((img, index) => (
            <div
              key={index}
              className={getCardStyle(index)}
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={img}
                alt={`Turf ${index + 1}`}
                fill
                className="object-cover rounded-xl"
              />
              <div className="absolute bottom-0 w-full bg-black/60 text-white text-center py-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Turf {index + 1}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      { !session?.user && (

      <section className="text-center py-16">
        <h3 className="text-lg text-white mb-6">
          {displayed}
          <span className="animate-pulse text-white">|</span>
        </h3>
        <div className="flex justify-center gap-6">
          <Link href="/register?role=Player">
            <button className="bg-cyan-400 hover:bg-cyan-500 text-black font-medium px-5 py-2 rounded">Register as Player</button>
          </Link>
          <Link href="/register?role=Owner">
            <button className="bg-white text-black font-medium px-5 py-2 rounded hover:bg-gray-300">Register as Owner</button>
          </Link>
        </div>
      </section>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 px-10 py-10 text-sm">
        <div className="grid md:grid-cols-3 gap-10">
          <div>
            <h4 className="font-bold text-white mb-2">Players</h4>
            <p>Browse Turfs</p>
            <p>Rent a turf</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">Owners</h4>
            <p>List your turf</p>
            <p>Manage bookings</p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-2">Contact us</h4>
            <p>Phone: 01793850809</p>
            <p>E-mail: turfmania@pmail.com</p>
            <div className="flex space-x-4 mt-2">
              <Link href="#"><i className="fab fa-facebook"></i></Link>
              <Link href="#"><i className="fab fa-instagram"></i></Link>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
