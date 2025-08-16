"use client";

import { Pencil } from "lucide-react";
import React from "react";
import { useState, useEffect } from "react";
import UserDto from "@/dto/userDto";
import Image from "next/image";
import { useParams } from "next/navigation";

import Navbar from "@/components/bars/navbar";
import FadeContent from "@/components/fadeContent";
import toast from "react-hot-toast";
import { Modal } from "@mui/material";
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";
import { Upload } from "lucide-react";
import RegistrationForm from "@/components/Forms/registrationForm";
import ResetPasswordForm from "@/components/Forms/resetPasswordForm";

const PlayerAccountPage: React.FC = () => {
  const { id } = useParams();
  const [userInfo, setUserInfo] = useState<UserDto>();
  const [openImageModal, setOpenImageModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [openEditForm, setOpenEditForm] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  useEffect(() => {
    if (!id) return;
    async function fetchUser() {
      try {
        const res = await fetch(`/api/users?id=${id}`);
        const data = await res.json();
        if (res.ok) {
          setUserInfo(data);
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast.error("Failed to load user data");
      }
    }
    fetchUser();
  }, [id]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile || !userInfo) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("subFolder", "profile_pictures"); // Specify subfolder if needed

    try {
      const res = await fetch("/api/fileupload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.secure_url) {
        const previousProfilePicture = userInfo.profilePicture;
        // Send the new URL to your backend to update the user profile picture
        const formData = new FormData();
        formData.set("profilePicture", data.secure_url);

        const response = await fetch(`/api/users?id=${id}`, {
          method: "PUT",
          body: formData,
        });
        if (!response.ok) {
          throw new Error("Failed to update profile picture");
          toast.error("Failed to update profile picture");
        } else {
          toast.success("Profile picture updated successfully");
          // Delete the previous profile picture if it exists
          if (
            previousProfilePicture &&
            previousProfilePicture !== "/images/default-profile.png"
          ) {
            const formData = new FormData();
            formData.append("fileUrl", previousProfilePicture);
            await fetch("/api/fileupload", {
              method: "DELETE",
              body: formData,
            });
          }
        }

        setOpenImageModal(false);
        window.location.reload(); // reload to get updated image
      } else {
        console.error("Upload failed:", data);
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploading(false);
    }
  };

  if (!userInfo) {
    return <div className="text-white p-10">Loading user data...</div>; // Handle loading state
  }

  console.log("User Info:", userInfo);

  return (
    <FadeContent
      blur={true}
      duration={1000}
      easing="ease-out"
      initialOpacity={0}
    >
      <div className="flex flex-col items-center w-full justify-start min-h-screen px-4 gap-6 ">
        <Navbar
          activePage="Account"
          navItems={[
            { label: "Home", href: "/homePage" },
            { label: "Turfs", href: "/browse_turfs" },
            { label: "Dashboard" }, // Will trigger redirect logic
            { label: "Bookings"}, // will trigger redirect logic
            { label: "Account", href: "/player/account" },
          ]}
        />
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="relative w-30 h-30">
              <Image
                src={userInfo.profilePicture || "/images/default-profile.png"} // Fallback to default image if not set
                alt="Profile"
                className="w-30 h-30 rounded-full object-cover"
                width={120}
                height={120}
              />
              <div
                onClick={() => setOpenImageModal(true)}
                className="absolute -top-[0px] -right-[0px] bg-zinc-700 p-[2px] rounded-full cursor-pointer hover:bg-zinc-600"
              >
                <Pencil className="w-4 h-4 text-white" />
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold">{userInfo.name}</h2>
              <p className="text-gray-400 text-sm">ID: {userInfo?.userId}</p>
            </div>
          </div>

          {/* Personal Info */}
          <div className="relative bg-zinc-800 rounded-lg p-6 mb-6">
            <div className="absolute top-4 right-4">
              <Pencil
                onClick={() => setOpenEditForm(true)}
                className="text-white bg-zinc-700 p-1 rounded-full w-5 h-5 cursor-pointer  hover:bg-zinc-600"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Info label="First Name" value={userInfo.name} />
              <Info label="E-mail" value={userInfo.email} />
              {userInfo.phone && (
                <Info label="Phone no." value={userInfo.phone} />
              )}
              <Info label="User Role" value={userInfo.role} />
            </div>
          </div>

          {/* Address Info */}
          <div className="relative bg-zinc-800 rounded-lg p-6">
            <div className="absolute top-4 right-4">
              <Pencil
                onClick={() => setOpenEditForm(true)}
                className="text-white bg-zinc-700 p-1 rounded-full w-5 h-5 cursor-pointer  hover:bg-zinc-600"
              />
            </div>
            <h3 className="text-cyan-400 text-sm font-semibold mb-4">
              Address
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userInfo.street && (
                <Info label="Street" value={userInfo.street} />
              )}
              {userInfo.postCode && (
                <Info label="Postal Code" value={userInfo.postCode} />
              )}
              {userInfo.city && <Info label="City" value={userInfo.city} />}
            </div>
          </div>

          <div className="flex justify-end mt-6">
  <button
    onClick={() => setOpenPasswordModal(true)}
    className="text-sm bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-md"
  >
    Reset your password
  </button>
</div>

        </div>

        {/* Modal for image upload */}
        <Modal open={openImageModal} onClose={() => setOpenImageModal(false)}>
          <Box className="bg-zinc-900 rounded-lg p-6 m-auto mt-[20vh] w-[90%] max-w-md text-white shadow-lg">
            <h2 className="text-lg font-semibold mb-4">
              Upload New Profile Picture
            </h2>
            <div className="flex justify-center gap-2">
              {/* Hidden input */}
              <input
                type="file"
                id="file-input"
                accept="image/*"
                onChange={handleImageChange}
                className="mb-4 hidden"
              />

              {/* label for input */}

              <label
                htmlFor="file-input"
                className="
                            flex items-center gap-2 bg-sky-400 border cursor-pointer border-gray-100 px-5 py-3 
                            text-sm rounded-xl transition-all duration-200 mb-4 hover:shadow-md"
              >
                <Upload size={17} />
                {selectedFile ? "Change file" : "Choose file"}
              </label>
            </div>

            {/* show preview */}
            {selectedFile && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 items-center">
                  <Image
                    width={200}
                    height={200}
                    src={URL.createObjectURL(selectedFile)}
                    alt="preview"
                    className="max-w-[200px] rounded-lg"
                  />
                  <span className="text-sm text-gray-600 max-w-[220px] truncate">
                    {selectedFile.name}
                  </span>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                onClick={() => setOpenImageModal(false)}
                disabled={uploading}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white"
                onClick={handleImageUpload}
                disabled={uploading || !selectedFile}
              >
                {uploading ? <CircularProgress size={20} /> : "Upload"}
              </button>
            </div>
          </Box>
        </Modal>

        {/* Model for edit details*/}
        <Modal open={openEditForm} onClose={() => setOpenEditForm(false)}>
          <Box className="bg-zinc-900 rounded-lg p-6 m-auto mt-[20vh] w-[90%] max-w-md text-white shadow-lg overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Edit Profile Info</h2>
              <button
                onClick={() => setOpenEditForm(false)}
                className="text-sm text-red-400 hover:text-red-600"
              >
                Close
              </button>
            </div>
            <RegistrationForm
              role={userInfo.role}
              buttonclicked="edit"
              userInfo={userInfo}
            />
          </Box>
        </Modal>

        <Modal open={openPasswordModal} onClose={() => setOpenPasswordModal(false)}>
  <Box className="bg-zinc-900 rounded-lg p-6 m-auto mt-[20vh] w-[90%] max-w-md text-white shadow-lg">
    <h2 className="text-lg font-semibold mb-4">Reset Password</h2>
    <ResetPasswordForm
      userId={userInfo.userId}
      onClose={() => setOpenPasswordModal(false)}
    />
  </Box>
</Modal>

      </div>
    </FadeContent>
  );
};

interface InfoProps {
  label: string;
  value: string;
}

const Info: React.FC<InfoProps> = ({ label, value }) => (
  <div className="text-sm">
    <p className="text-gray-400">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default PlayerAccountPage;
