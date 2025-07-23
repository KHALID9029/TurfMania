import { NextRequest, NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";


interface CloudinaryUploadResult{
    public_id: string;
    secure_url: string;
    //[key: string]: any; // Allow additional properties
}


export async function POST(request: NextRequest) {

    try{
        if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET){
            console.error("Cloudinary configuration is missing");
            return NextResponse.json({ error: "Cloudinary configuration is missing" }, { status: 500 });
        }

        const formdata = await request.formData();
        const file = formdata.get("file") as File | null;
        const subFolder = formdata.get("subFolder") as string | null;
        const folderPath = subFolder ? `turfmania/${subFolder}` : "Turf";

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    {
                        folder: folderPath,
                        use_filename: true,
                        unique_filename: true,
                        overwrite: true
                    },
                    (error, result) => {
                        if (error) {
                            console.error("Cloudinary upload error:", error);
                            reject(error);
                        } else {
                            console.log("Cloudinary upload result:", result);
                            resolve(result as CloudinaryUploadResult);
                        }
                    }
                )
                uploadStream.end(buffer);
            }
        )
        return NextResponse.json({ 
            publicId: result.public_id,
            secure_url: result.secure_url, 
        }, { status: 200 });

    }catch (error) {
        console.error("Error uploading image:", error);
        return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }
}


export async function DELETE(request: NextRequest) {
    try{
        const formData = await request.formData();
        const fileUrl = formData.get("fileUrl") as string | null;

        if (!fileUrl) {
            return NextResponse.json({ error: "File URL is required" }, { status: 400 });
        }

        // Extract public_id from the Cloudinary URL
    const publicId = fileUrl
      .split("/")
      .slice(-1)[0]
      .split(".")[0]; // assumes last part is filename like xyz.jpg

    const folder = "turfmania/profile_pictures"; // or extract from the URL if needed
    const fullPublicId = `${folder}/${publicId}`;

    console.log("Deleting file with public ID:", fullPublicId);

        if (!publicId) {
            return NextResponse.json({ error: "Invalid file URL" }, { status: 400 });
        }
        const result = await cloudinary.uploader.destroy(fullPublicId, {
            invalidate: true,
            resource_type: "image"
        });
        if (result.result === "ok") {
            return NextResponse.json({ message: "File deleted successfully" }, { status: 200 });
        } else {
            console.error("Cloudinary delete error:", result);
            return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
        }
    }catch (error) {
        console.error("Error deleting file:", error);
        return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
    }
}