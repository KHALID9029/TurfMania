import React from "react";

type TimeSlotProps = {
    open: string;
    close: string;
    selectedSlots: string[];
    setSelectedSlots: React.Dispatch<React.SetStateAction<string[]>>;
};

function parseTime(timeStr: string): Date {
    const [time, modifier] = timeStr.split(" ");
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

const TimeSlots: React.FC<TimeSlotProps> = ({ open, close, selectedSlots, setSelectedSlots }) => {
    const startTime = parseTime(open);
    const endTime = parseTime(close);

    const slots: string[] = [];
    let current = new Date(startTime);

    while (current < endTime) {
        const next = new Date(current.getTime() + 30 * 60 * 1000);
        if (next > endTime) break;
        slots.push(`${formatTime(current)} - ${formatTime(next)}`);
        current = next;
    }

    const toggleSlot = (slot: string) => {
        setSelectedSlots((prev) =>
            prev.includes(slot) ? prev.filter((s) => s !== slot) : [...prev, slot]
        );
    };

    return (
        <div className="relative">
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2 bg-black backdrop-blur-md p-4 rounded-lg overflow-y-auto max-h-[240px] custom-scrollbar">
                {slots.map((slot, i) => (
                    <div
                        key={i}
                        onClick={() => toggleSlot(slot)}
                        className={`cursor-pointer rounded p-2 text-center text-[8px] md:text-sm transition h-full
                            ${selectedSlots.includes(slot)
                                ? "bg-green-600 text-white"
                                : "bg-gray-400 text-black hover:bg-gray-500"}`}
                    >
                        {slot}
                    </div>
                ))}
            </div>

            <div className="pointer-events-none absolute top-0 left-0 right-0 h-6 bg-gradient-to-b from-black to-transparent z-10 rounded-t-lg" />
            <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-black to-transparent z-10 rounded-b-lg" />
        </div>
    );
};

export default TimeSlots;
