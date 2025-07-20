import cloudinary from "@/lib/cloudinary";
 
export async function POST(request: Request) {
  const body = await request.json();
  const { paramsToSign } = body;

  if(!process.env.CLOUDINARY_API_SECRET) {
    return Response.json({ error: "Cloudinary API secret is not set" }, { status: 500 });
  }
 
  const signature = cloudinary.utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);
  
  return Response.json({ signature });
}