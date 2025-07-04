"use client"

import Sidebar from "@/components/bars/sidebar"
import Head from "next/head"
import TrueFocus from '@/components/truefocus';
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function AddTurf() {
    const router = useRouter()

    interface OperatingHour {
        hour: string;
        minute: string;
        period: 'AM' | 'PM';
    }

    interface FormData {
        turfName: string;
        turfAddress: string;
        street: string;
        postCode: string;
        city: string;
        turfDetails: string;
        amenities: string[];
        operatingHours: {
            from: OperatingHour;
            to: OperatingHour;
        };
        turfSize: string;
        rate: string;
    }

    const [formData, setFormData] = useState<FormData>({
        turfName: '',
        turfAddress: '',
        street: '',
        postCode: '',
        city: '',
        turfDetails: '',
        amenities: [],
        operatingHours: {
            from: { hour: '06', minute: '00', period: 'AM' },
            to: { hour: '06', minute: '00', period: 'PM' }
        },
        turfSize: '',
        rate: ''
    })

    interface OperatingHour {
        hour: string;
        minute: string;
        period: 'AM' | 'PM';
    }

    interface FormData {
        turfName: string;
        turfAddress: string;
        street: string;
        postCode: string;
        city: string;
        turfDetails: string;
        amenities: string[];
        operatingHours: {
            from: OperatingHour;
            to: OperatingHour;
        };
        turfSize: string;
        rate: string;
    }

    const handleInputChange = (field: keyof FormData, value: string) => {
        setFormData((prev: FormData) => ({
            ...prev,
            [field]: value
        }))
    }

    interface AmenityToggleHandler {
        (amenity: string): void;
    }

    const handleAmenityToggle: AmenityToggleHandler = (amenity) => {
        setFormData((prev: FormData) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((a: string) => a !== amenity)
                : [...prev.amenities, amenity]
        }))
    }

    interface HandleTimeChange {
        (type: 'from' | 'to', field: keyof OperatingHour, value: string): void;
    }

    const handleTimeChange: HandleTimeChange = (type, field, value) => {
        setFormData((prev: FormData) => ({
            ...prev,
            operatingHours: {
                ...prev.operatingHours,
                [type]: {
                    ...prev.operatingHours[type],
                    [field]: value
                }
            }
        }))
    }

    const handleSubmit = () => {
        // Handle form submission
        console.log('Form submitted:', formData)
    }

    return (
        <>
            <Head>
                <title>LIST YOUR TURF</title>
            </Head>
            <div className="flex flex-col md:flex-row md:h-screen min-h-screen bg-[#121212] text-white overflow-y-auto">

                {/* Sidebar */}

                <Sidebar />

                {/* Main Content */}
                <main className="flex-1 p-6 overflow-y-auto">

                    <h1 className="text-lg mb-8">List Your <span className="text-[#44B5E9]">Turf</span></h1>
                    <div className="max-w-4xl mx-auto space-y-6 ">
                        {/* Turf Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Turf Name</label>
                            <input
                                type="text"
                                value={formData.turfName}
                                onChange={(e) => handleInputChange('turfName', e.target.value)}
                                className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-xl focus:outline-none focus:border-green-500"
                                placeholder="Enter turf name"
                            />
                        </div>
                        <h1 className="block text-lg font-medium mb-2">Turf Address</h1>
                        <hr/>
                        {/* Turf Address */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Street</label>
                            <input
                                type="text"
                                value={formData.street}
                                onChange={(e) => handleInputChange('street', e.target.value)}
                                className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                                placeholder="Street"
                            />
                        </div>

                        {/* Post Code and City */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Post Code</label>
                                <input
                                    type="text"
                                    value={formData.postCode}
                                    onChange={(e) => handleInputChange('postCode', e.target.value)}
                                    className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                                    placeholder="Post code"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">City</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => handleInputChange('city', e.target.value)}
                                    className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                                    placeholder="City"
                                />
                            </div>
                        </div>

                        {/* Select on map */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Select on map</label>
                            <div className="relative">
                                <div className="w-full h-48 bg-[#2a2a2a] border border-gray-600 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-gray-600 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                            <span className="text-2xl">📍</span>
                                        </div>
                                        <p className="text-sm text-gray-400">Click on the map to select location</p>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-black bg-opacity-50 p-2 rounded text-xs">
                                    <p>Click on the map to</p>
                                    <p>place a pin and</p>
                                    <p>your turf more</p>
                                    <p>visible</p>
                                </div>
                            </div>
                        </div>

                        {/* Turf Details */}
                        <div>
                        
                            <label className="block text-sm font-medium mb-2">Turf Details</label>
                            <p className="text-xs text-gray-400 mb-2">Upload at least 3 photos of the turf</p>
                            <div className="w-full h-32 bg-[#2a2a2a] border border-gray-600 rounded-lg flex items-center justify-center border-dashed">
                                <div className="text-center">
                                    <div className="w-8 h-8 border-2 border-gray-400 rounded-full mx-auto mb-2 flex items-center justify-center">
                                        <span className="text-lg">+</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Amenities */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Amenities the turf provides:</label>
                            <div className="flex gap-2 mb-4">
                                {['Washroom', 'Locker', 'Parking'].map((amenity) => (
                                    <button
                                        key={amenity}
                                        onClick={() => handleAmenityToggle(amenity)}
                                        className={`px-4 py-2 rounded-lg border ${formData.amenities.includes(amenity)
                                            ? 'bg-green-600 border-green-600'
                                            : 'bg-[#2a2a2a] border-gray-600'
                                            }`}
                                    >
                                        {amenity}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Operating Hours */}
                        <div>
                            <label className="block text-sm font-medium mb-2">Operating Hours:</label>
                            <div className="grid grid-cols-2 gap-8">
                                {/* From */}
                                <div>
                                    <p className="text-sm mb-2">From</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        <select
                                            value={formData.operatingHours.from.hour}
                                            onChange={(e) => handleTimeChange('from', 'hour', e.target.value)}
                                            className="p-2 bg-[#2a2a2a] border border-gray-600 rounded text-center"
                                        >
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <option key={i} value={String(i + 1).padStart(2, '0')}>
                                                    {String(i + 1).padStart(2, '0')}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={formData.operatingHours.from.minute}
                                            onChange={(e) => handleTimeChange('from', 'minute', e.target.value)}
                                            className="p-2 bg-[#2a2a2a] border border-gray-600 rounded text-center"
                                        >
                                            {['00', '15', '30', '45'].map(minute => (
                                                <option key={minute} value={minute}>{minute}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={formData.operatingHours.from.period}
                                            onChange={(e) => handleTimeChange('from', 'period', e.target.value)}
                                            className="p-2 bg-[#2a2a2a] border border-gray-600 rounded text-center"
                                        >
                                            <option value="AM">AM</option>
                                            <option value="PM">PM</option>
                                        </select>
                                    </div>
                                </div>

                                {/* To */}
                                <div>
                                    <p className="text-sm mb-2">To</p>
                                    <div className="grid grid-cols-3 gap-2">
                                        <select
                                            value={formData.operatingHours.to.hour}
                                            onChange={(e) => handleTimeChange('to', 'hour', e.target.value)}
                                            className="p-2 bg-[#2a2a2a] border border-gray-600 rounded text-center"
                                        >
                                            {Array.from({ length: 12 }, (_, i) => (
                                                <option key={i} value={String(i + 1).padStart(2, '0')}>
                                                    {String(i + 1).padStart(2, '0')}
                                                </option>
                                            ))}
                                        </select>
                                        <select
                                            value={formData.operatingHours.to.minute}
                                            onChange={(e) => handleTimeChange('to', 'minute', e.target.value)}
                                            className="p-2 bg-[#2a2a2a] border border-gray-600 rounded text-center"
                                        >
                                            {['00', '15', '30', '45'].map(minute => (
                                                <option key={minute} value={minute}>{minute}</option>
                                            ))}
                                        </select>
                                        <select
                                            value={formData.operatingHours.to.period}
                                            onChange={(e) => handleTimeChange('to', 'period', e.target.value)}
                                            className="p-2 bg-[#2a2a2a] border border-gray-600 rounded text-center"
                                        >
                                            <option value="AM">AM</option>
                                            <option value="PM">PM</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Turf Size and Rate */}
                        <div className="grid gird-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Turf Size:</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={formData.turfSize}
                                        onChange={(e) => handleInputChange('turfSize', e.target.value)}
                                        className="flex-1 p-3 bg-[#2a2a2a] border border-gray-600 rounded-l-lg focus:outline-none focus:border-green-500"
                                        placeholder="Size"
                                    />
                                    <span className="px-3 py-3 bg-[#3a3a3a] border border-gray-600 rounded-r-lg border-l-0">
                                        m²
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Rate (per 90 mins slot):</label>
                                <div className="flex">
                                    <input
                                        type="text"
                                        value={formData.rate}
                                        onChange={(e) => handleInputChange('rate', e.target.value)}
                                        className="flex-1 p-3 bg-[#2a2a2a] border border-gray-600 rounded-l-lg focus:outline-none focus:border-green-500"
                                        placeholder="Rate"
                                    />
                                    <span className="px-3 py-3 bg-[#3a3a3a] border border-gray-600 rounded-r-lg border-l-0">
                                        BDT
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6">
                            <button
                                onClick={handleSubmit}
                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
                            >
                                SUBMIT
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
