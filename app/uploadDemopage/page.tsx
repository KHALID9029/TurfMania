"use client";
import { Upload } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import Link from "next/link";

export default function Home() {
  const [uploadFiles, setUploadFiles] = useState<File[]>([]);
  const [uploadFileLoading, setUploadFileLoading] = useState(false);
  const [fileLinks, setFileLinks] = useState<string[]>([]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (files) {
      setUploadFiles(Array.from(files)); // store as array
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!uploadFiles.length) {
      alert("At least one file is required");
      return;
    }

    setUploadFileLoading(true);
    const uploadedLinks: string[] = [];

    for (const file of uploadFiles) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("subFolder", "Demo"); // specify subfolder if needed

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
    alert("File(s) uploaded");
  }

  return (
    <div className="h-[100dvh] w-[100dvw] bg-gray-200 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col items-center gap-7 bg-white rounded-3xl shadow-2xl w-full p-7"
      >
        <h1 className="text-xl font-bold text-gray-400">Upload Files</h1>

        {/* hidden input */}
        <input
          type="file"
          id="file-input"
          onChange={handleFileChange}
          className="hidden"
          accept="image/*"
          multiple
        />

        {/* label for input */}
        <label
          htmlFor="file-input"
          className="flex items-center gap-2 bg-gray-100 border cursor-pointer border-gray-100 px-5 py-3 text-sm rounded-xl transition-all duration-200 hover:shadow-md"
        >
          <Upload size={17} />
          {uploadFiles.length > 0 ? "Change files" : "Upload files"}
        </label>

        {/* show preview */}
        {uploadFiles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {uploadFiles.map((file, index) => (
              <div key={index} className="flex flex-col gap-2 items-center">
                <span className="text-sm text-gray-600 max-w-[220px] truncate">
                  {file.name}
                </span>
                {file.type.startsWith("image/") && (
                  <Image
                    width={200}
                    height={200}
                    src={URL.createObjectURL(file)}
                    alt="preview"
                    className="max-w-[200px] rounded-lg"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* upload button */}
        <Button
          type="submit"
          variant="contained"
          size="small"
          disabled={uploadFileLoading}
          className="h-full !py-3 !px-8"
        >
          {uploadFileLoading ? (
            <div className="flex items-center gap-2">
              <CircularProgress size={20} color="inherit" />
              <span>Uploading...</span>
            </div>
          ) : (
            <span className="flex items-center gap-2">
              <Upload size={15} />
              Upload All
            </span>
          )}
        </Button>

        {/* show uploaded links */}
        {fileLinks.length > 0 && (
          <div className="flex flex-col gap-2 text-blue-500 text-sm underline">
            {fileLinks.map((link, index) => (
              <Link key={index} href={link} target="_blank">
                File {index + 1}
              </Link>
            ))}
          </div>
        )}
      </form>
    </div>
  );
}
