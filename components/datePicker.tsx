import React, { useEffect, useState } from "react";

interface DatePickerInputProps {
  onDateSelect: (date: string) => void;
  initialDate?: string; // expected format: "YYYY-MM-DD"
}

export default function DatePickerInput({ onDateSelect, initialDate }: DatePickerInputProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate || "");

  useEffect(() => {
    // Update local state if initialDate prop changes
    setSelectedDate(initialDate || "");
  }, [initialDate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value; // "YYYY-MM-DD"
    setSelectedDate(value);
    onDateSelect(value);
  };

  return (
    <div className="relative max-w-sm">
      <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
        <svg
          className="w-4 h-4 text-gray-500 dark:text-gray-400"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
        </svg>
      </div>
      <input
        id="default-datepicker"
        type="date"
        value={selectedDate}
        onChange={handleChange}
        placeholder="Select date"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
      />
    </div>
  );
}
