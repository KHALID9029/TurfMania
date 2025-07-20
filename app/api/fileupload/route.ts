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