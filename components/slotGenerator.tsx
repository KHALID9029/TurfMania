"use client";

import React, { useState, useEffect } from "react";

type TimeSlotProps = {
  open: string;
  close: string;
  selectedSlots: string[];
  setSelectedSlots: React.Dispatch<React.SetStateAction<string[]>>;
  turfId: number;
  date: string;
};

function parseTime(timeStr: string): Date {
  const [time, modifier] = timeStr.split(" ");
  // eslint-disable-next-line prefer-const
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return date;
}

function formatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  return `${hours}:${minutesStr} ${ampm}`;
}

function formatSingleTimeRange(input: string): string {
  const [start, end] = input.split("-").map((part) => part.trim());
  const [startTime, startPeriod] = start.split(" ");
  const [endTime, endPeriod] = end.split(" ");

  if (startPeriod === endPeriod) {
    return `(${startTime} - ${endTime}) ${startPeriod}`;
  } else {
    return input; // Keep original if AM and PM differ
  }
}

const TimeSlots: React.FC<TimeSlotProps> = ({
  open,
  close,
  selectedSlots,
  setSelectedSlots,
  turfId,
  date

}) => {
  const startTime = parseTime(open);
  const endTime = parseTime(close);

  const slots: string[] = [];
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  let current = new Date(startTime);

  while (current < endTime) {
    const next = new Date(current.getTime() + 30 * 60 * 1000);
    if (next > endTime) break;
    slots.push(`${formatTime(current)} - ${formatTime(next)}`);
    current = next;
  }

  useEffect(() => {
  async function fetchBookings() {
    try {
      const res = await fetch(`/api/booking?turfId=${turfId}&date=${date}`);
      const data = await res.json();
      console.log(data);

      const disabled: string[] = [];

      const now = new Date();
      const isToday =
        new Date(date).toDateString() === new Date().toDateString();

      data.forEach((booking: { startTime: string; endTime: string }) => {
        const start = parseTime(booking.startTime);
        const end = parseTime(booking.endTime);
        let current = new Date(start);

        while (current < end) {
          const next = new Date(current.getTime() + 30 * 60 * 1000);
          if (next > end) break;

          // If today, skip times that have already passed
          if (!isToday || next > now) {
            disabled.push(`${formatTime(current)} - ${formatTime(next)}`);
          }

          current = next;
        }
      });

      // Also block past slots for today that are not part of any booking
      if (isToday) {
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);
        let current = new Date(startOfDay);

        while (current < now) {
          const next = new Date(current.getTime() + 30 * 60 * 1000);
          if (next <= now) {
            const slot = `${formatTime(current)} - ${formatTime(next)}`;
            if (!disabled.includes(slot)) {
              disabled.push(slot);
            }
          }
          current = next;
        }
      }

      setBookedSlots(disabled);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    }
  }

  fetchBookings();
  console.log("Fetching bookings for turfId:", turfId, "on date:", date);
  console.log("Booked slots:", bookedSlots);
// eslint-disable-next-line react-hooks/exhaustive-deps
}, [turfId, date]);


  // To let only select consecutive slots
  const [firstSelectedSlot, setFirstSelectedSlot] = useState<string | null>(null);

  const toggleSlot = (slot: string) => {
    if (!firstSelectedSlot) {
      // First click: set starting point
      setFirstSelectedSlot(slot);
      setSelectedSlots([slot]);
    } else {
      // Second click: select range
      const startIndex = slots.indexOf(firstSelectedSlot);
      const endIndex = slots.indexOf(slot);

      if (startIndex === -1 || endIndex === -1) {
        // Invalid index; reset
        setFirstSelectedSlot(null);
        setSelectedSlots([]);
        return;
      }

      const [from, to] =
        startIndex < endIndex ? [startIndex, endIndex] : [endIndex, startIndex];
      const range = slots.slice(from, to + 1);

      setSelectedSlots(range);
      setFirstSelectedSlot(null); // Reset to allow new selection
    }
    // setSelectedSlots((prev) =>
    //     prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
    // );
  };

  return (
    <div className="relative">
      <div className="grid grid-cols-3 md:grid-cols-4 gap-2 bg-black backdrop-blur-md p-4 rounded-lg overflow-y-auto max-h-[340px] custom-scrollbar">
        {slots.map((slot, i) => (
          <div
            key={i}
            onClick={() => {
    if (!bookedSlots.includes(slot)) {
      toggleSlot(slot);
    }
  }}
            className={`rounded p-2 text-center text-[8px] md:text-sm transition 
    h-10 md:h-15 flex items-center justify-center
    ${
      bookedSlots.includes(slot)
        ? "bg-gray-300 text-gray-600 cursor-not-allowed opacity-60"
        : selectedSlots.includes(slot)
        ? "bg-green-600 text-white cursor-pointer"
        : "bg-gray-400 text-black hover:bg-gray-500 cursor-pointer"
    }`}
          >
            {formatSingleTimeRange(slot)}
          </div>
        ))}
      </div>

      <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black to-transparent z-10 rounded-t-lg" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black to-transparent z-10 rounded-b-lg" />
      <div className="flex justify-center mt-4">
        <button
          onClick={() => {
            setSelectedSlots([]);
            setFirstSelectedSlot(null);
          }}
          className="mb-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
        >
          Clear Selection
        </button>
      </div>
    </div>
  );
};

export default TimeSlots;
