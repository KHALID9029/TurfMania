import { getServerSession } from "next-auth/next";
import authOptions from "@/app/api/auth/authOptions";
import { redirect } from "next/navigation";

export default async function AuthRedirectPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = session.user.role;
  if (role === "Player") {
    redirect("/homePage");
  } else if (role === "Owner") {
    redirect("/owner/dashboard");
  } else {
    redirect("/homePage");
  }
}
