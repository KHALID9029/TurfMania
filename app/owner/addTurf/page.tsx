"use client";

import Sidebar from "@/components/bars/sidebar";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { Upload } from "lucide-react";
import Image from "next/image";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const MapSelector = dynamic(() => import("@/components/mapSelector"), {
  ssr: false,
});

export default function AddTurf() {
  const router = useRouter();

  const { data: session } = useSession();
  // TODO: Get session from context or props if needed
  // Example: const { data: session } = useSession();

  interface FormData {
    turfName: string;
    ownerId: number;
    photos?: string[];
    street: string;
    postCode: string;
    city: string;
    amenities?: string[];
    open: string; // e.g., "06:00 AM"
    close: string; // e.g., "10:00 PM"
    turfSize: number;
    rate: number;
    lat: number;
    lng: number;
  }

  const [formData, setFormData] = useState<FormData>({
    turfName: "",
    ownerId: session?.user.userId || 0,
    photos: [],
    street: "",
    postCode: "",
    city: "",
    amenities: [],
    open: "06:00 AM",
    close: "10:00 PM",
    turfSize: 0,
    rate: 0,
    lat: 23.8103,
    lng: 90.4125,
  });

  const amenityArray = [
    "Washroom",
    "Locker",
    "Parking",
    "Wi-Fi",
    "Changing Room",
    "First Aid Kit",
    "Drinking Water",
    "Seating Area",
    "Cafeteria",
    "Shower",
    "Lighting (Night Play)",
    "Scoreboard",
    "Sound System",
    "CCTV Security",
    "Covered Roof",
    "Shoe Rental",
    "Equipment Rental",
    "Air Conditioning",
  ];

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [field]: value,
    }));
        console.log(formData);
  };

  interface AmenityToggleHandler {
    (amenity: string): void;
  }

  const handleAmenityToggle: AmenityToggleHandler = (amenity) => {
    setFormData((prev: FormData) => ({
      ...prev,
      amenities: (prev.amenities ?? []).includes(amenity)
        ? (prev.amenities ?? []).filter((a: string) => a !== amenity)
        : [...(prev.amenities ?? []), amenity],
    }));
  };

  const handleTimeChange = (
    field: "open" | "close",
    hour: string,
    minute: string,
    period: "AM" | "PM"
  ) => {
    const formatted = `${hour}:${minute} ${period}`;
    setFormData((prev) => ({
      ...prev,
      [field]: formatted,
    }));

  };

  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadFileLoading, setUploadFileLoading] = useState(false);
  const [fileLinks, setFileLinks] = useState<string[]>([]);

  formData.photos = fileLinks;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files).filter(
        (newFile) => !uploadFiles.some((file) => file.name === newFile.name)
      );
      setUploadFiles((prevFiles) => [...prevFiles, ...newFiles]); // store as array
    }
  }

  function handleFileRemove(index: number) {
    setUploadFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }

  async function handleFileUpload() {
    if (!uploadFiles.length) {
      return;
    }
    setUploadFileLoading(true);
    const uploadedLinks: string[] = [];

    for (const file of uploadFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subFolder", "Turfs"); // specify subfolder if needed

      const response = await fetch("/api/fileupload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        alert(`Error uploading ${file.name}`);
        continue;
      }

      const data = await response.json();
      if (data.error) {
        alert(data.error);
        continue;
      }

      //const fileUrl = `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${data.publicId}`;
      const fileUrl = data.secure_url;
      console.log(`File uploaded: ${fileUrl}`);
      uploadedLinks.push(fileUrl);
    }

    setFileLinks(uploadedLinks);
    setUploadFileLoading(false);
    setUploadFiles([]);

    formData.photos = uploadedLinks;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if ( uploadFiles.length < 3) {
      toast.error("Please upload at least 3 photos");
      return;
    }
    await handleFileUpload();
    console.log(formData);

    try {
      const data = new FormData();
      data.set("turfName", formData.turfName);
      data.set("ownerId", String(formData.ownerId)); // convert number to string
      if (formData.photos) {
        formData.photos.forEach((photo, index) => {
          data.append(`photos[${index}]`, photo);
        });
      }
      data.set("street", formData.street);
      data.set("postCode", formData.postCode);
      data.set("city", formData.city);
      data.set("open", formData.open);
      data.set("close", formData.close);
      data.set("turfSize", String(formData.turfSize));
      data.set("rate", String(formData.rate));
      data.set("lat", String(formData.lat));
      data.set("lng", String(formData.lng));

      // For array-type field like amenities
      formData.amenities?.forEach((amenity, index) => {
        data.append(`amenities[${index}]`, amenity);
      });

      console.log("Submitting turf data:", Object.fromEntries(data.entries()));

      const response = await fetch("/api/turf", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast.error(errorData?.error || "Failed to register turf");
        throw new Error("Failed to register turf");
      } else {
        toast.success("Turf registered successfully! Redirecting...");
        router.push("dashboard"); // or wherever you want to go
      }
    } catch (error) {
      console.error("Turf registration error:", error);
      toast.error("An unexpected error occurred");
    }
  };

  useEffect(() => {
    console.log("Latest formData:", formData);
  }, [formData]);

  return (
    <>
      <Head>
        <title>LIST YOUR TURF</title>
      </Head>
      <div className="flex flex-col md:flex-row md:h-screen min-h-screen bg-[#121212] text-white overflow-y-auto">
        {/* Sidebar */}

        <Sidebar />

        {/* Main Content */}
      
          <form
            onSubmit={uploadFileLoading ? undefined : handleSubmit} 
            className="flex-1 p-6 overflow-y-auto">
            <h1 className="text-lg mb-8">
              List Your <span className="text-[#44B5E9]">Turf</span>
            </h1>
            <div className="max-w-4xl mx-auto space-y-6 ">
              {/* Turf Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Turf Name
                </label>
                <input
                  required
                  type="text"
                  value={formData.turfName}
                  onChange={(e) =>
                    handleInputChange("turfName", e.target.value)
                  }
                  className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-xl focus:outline-none focus:border-green-500"
                  placeholder="Enter turf name"
                />
              </div>
              <h1 className="block text-lg font-medium mb-2">Turf Address</h1>
              <hr />
              {/* Turf Address */}
              <div>
                <label className="block text-sm font-medium mb-2">Street</label>
                <input
                  type="text"
                  required
                  value={formData.street}
                  onChange={(e) => handleInputChange("street", e.target.value)}
                  className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                  placeholder="Street"
                />
              </div>

              {/* Post Code and City */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Post Code
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.postCode}
                    onChange={(e) =>
                      handleInputChange("postCode", e.target.value)
                    }
                    className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                    placeholder="Post code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    required
                    type="text"
                    value={formData.city}
                    onChange={(e) => handleInputChange("city", e.target.value)}
                    className="w-full p-3 bg-[#2a2a2a] border border-gray-600 rounded-lg focus:outline-none focus:border-green-500"
                    placeholder="City"
                  />
                </div>
              </div>

              {/* Select on map */}
              {/* Select on map (with interactive Google Map) */}

              <div>
                <label className="block text-sm font-medium mb-2">
                  Select on map
                </label>
                <div className="relative rounded-lg border-none overflow-hidden">
                  <MapSelector
                    lat={formData.lat}
                    lng={formData.lng}
                    onLocationSelect={(lat, lng) =>
                      setFormData((prev) => ({
                        ...prev,
                        location: { lat, lng },
                      }))
                    }
                  />
                </div>
              </div>

              {/* Turf Details */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Turf Details
                </label>
                <p className="text-xs text-gray-400 mb-2">
                  Upload at least 3 photos of the turf
                </p>

                <div className="w-full flex justify-center items-center min-h-32 max-h-64 bg-[#2a2a2a] border border-gray-600 rounded-lg border-dashed p-4 overflow-y-auto">
                  <div className="flex justify-center items-center mb-3">
                    <input
                      type="file"
                      id="file-input"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="file-input"
                      className="flex items-center gap-2 bg-black-100 border cursor-pointer border-gray-100 px-5 py-3 text-sm rounded-xl transition-all duration-200 hover:shadow-md"
                    >
                      <Upload size={17} />
                      {uploadFiles.length > 0
                        ? "Add more files"
                        : "Upload files"}
                    </label>
                  </div>
                </div>
              </div>
              {/* Show preview of uploaded files */}
              <div className="flex flex-start flex-wrap gap-1 mt-4">
                {uploadFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative group w-22 h-22 rounded-md overflow-hidden  bg-transparent flex items-center justify-center"
                  >
                    {/* - Remove Button */}
                    <button
                      type="button"
                      onClick={() => handleFileRemove(index)}
                      className="absolute top-0 right-0 z-10 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 opacity-100 transition-opacity hover:bg-red-700"
                      title="Remove"
                    >
                      -
                    </button>
                    <div className=" group w-20 h-20 rounded-md overflow-hidden border border-gray-600 bg-[#1f1f1f]">
                      {/* Image Preview */}
                      <Image
                        src={URL.createObjectURL(file)}
                        alt={`Preview ${index}`}
                        width={70}
                        height={70}
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Amenities the turf provides:
                </label>
                <div className="flex flex-wrap gap-2 mb-4">
                  {amenityArray.map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => handleAmenityToggle(amenity)}
                      className={`px-2 py-1 rounded-lg border ${
                        formData.amenities?.includes(amenity)
                          ? "bg-green-600 border-green-600"
                          : "bg-[#2a2a2a] border-gray-600"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Operating Hours */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Operating Hours:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Open Time */}
                  <div>
                    <p className="text-sm mb-2">Open</p>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={formData.open.split(":")[0].padStart(2, "0")}
                        onChange={(e) =>
                          handleTimeChange(
                            "open",
                            e.target.value,
                            formData.open.split(":")[1].split(" ")[0],
                            formData.open.split(" ")[1] as "AM" | "PM"
                          )
                        }
                        className="p-2 bg-[#2a2a2a] border border-gray-600 rounded text-center"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option
                            key={i}
                            value={String(i + 1).padStart(2, "0")}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.open.split(":")[1].split(" ")[0]}
                        onChange={(e) =>
                          handleTimeChange(
                            "open",
                            formData.open.split(":")[0],
                            e.target.value,
                            formData.open.split(" ")[1] as "AM" | "PM"
                          )
                        }
                        className="p-2 bg-[#2a2a2a] border border-gray-600 rounded text-center"
                      >
                        {["00", "15", "30", "45"].map((minute) => (
                          <option key={minute} value={minute}>
                            {minute}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.open.split(" ")[1]}
                        onChange={(e) =>
                          handleTimeChange(
                            "open",
                            formData.open.split(":")[0],
                            formData.open.split(":")[1].split(" ")[0],
                            e.target.value as "AM" | "PM"
                          )
                        }
                        className="p-2 bg-[#2a2a2a] border border-gray-600 rounded text-center"
                      >
                        <option value="AM">AM</option>
                        <option value="PM">PM</option>
                      </select>
                    </div>
                  </div>

                  {/* Close Time */}
                  <div>
                    <p className="text-sm mb-2">Close</p>
                    <div className="grid grid-cols-3 gap-2">
                      <select
                        value={formData.close.split(":")[0].padStart(2, "0")}
                        onChange={(e) =>
                          handleTimeChange(
                            "close",
                            e.target.value,
                            formData.close.split(":")[1].split(" ")[0],
                            formData.close.split(" ")[1] as "AM" | "PM"
                          )
                        }
                        className="p-2 bg-[#2a2a2a] border border-gray-600 rounded text-center"
                      >
                        {Array.from({ length: 12 }, (_, i) => (
                          <option
                            key={i}
                            value={String(i + 1).padStart(2, "0")}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.close.split(":")[1].split(" ")[0]}
                        onChange={(e) =>
                          handleTimeChange(
                            "close",
                            formData.close.split(":")[0],
                            e.target.value,
                            formData.close.split(" ")[1] as "AM" | "PM"
                          )
                        }
                        className="p-2 bg-[#2a2a2a] border border-gray-600 rounded text-center"
                      >
                        {["00", "15", "30", "45"].map((minute) => (
                          <option key={minute} value={minute}>
                            {minute}
                          </option>
                        ))}
                      </select>
                      <select
                        value={formData.close.split(" ")[1]}
                        onChange={(e) =>
                          handleTimeChange(
                            "close",
                            formData.close.split(":")[0],
                            formData.close.split(":")[1].split(" ")[0],
                            e.target.value as "AM" | "PM"
                          )
                        }
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
                  <label className="block text-sm font-medium mb-2">
                    Turf Size:
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={formData.turfSize}
                      onChange={(e) =>
                        handleInputChange("turfSize", e.target.value)
                      }
                      className="flex-1 p-3 bg-[#2a2a2a] border border-gray-600 rounded-l-lg focus:outline-none focus:border-green-500 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Size"
                    />
                    <span className="px-3 py-3 bg-[#3a3a3a] border border-gray-600 rounded-r-lg border-l-0">
                      m²
                    </span>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Rate (per 60 mins slot):
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      value={formData.rate}
                      onChange={(e) =>
                        handleInputChange("rate", e.target.value)
                      }
                      className="flex-1 p-3 bg-[#2a2a2a] border border-gray-600 rounded-l-lg focus:outline-none focus:border-green-500 appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      placeholder="Rate"
                    />
                    <span className="px-3 py-3 bg-[#3a3a3a] border border-gray-600 rounded-r-lg border-l-0">
                      BDT
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex justify-center pt-6">
                <Button
                  type="submit"
                  variant="contained"
                  size="small"
                  className="h-full !py-3 !px-8"
                >
                  {uploadFileLoading ? (
                    <span className="flex items-center gap-2">
                      <CircularProgress size={20} sx={{ color: "white" }} />
                      Submitting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Upload size={15} />
                      SUBMIT
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </form>
        
      </div>
    </>
  );
}
