"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import React from "react";
import Link from "next/link";
import { getSession } from "next-auth/react";
import toast from "react-hot-toast";

import BackgroundCircles from "@/components/backgrounds/backgroundCircles";

const SIgnInPage = () => {
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const toastId = toast.loading("Logging you in. Please wait...");

    const res = await signIn("credentials", {
      redirect: false, // so we can handle manually
      email,
      password,
    });

    if (res?.error) {
      alert(res.error); // or better: setError state
      toast.error(res.error, { id: toastId });
    } else {
        const session = await getSession();
        if(!session){
            toast.error("Could not get session.", { id: toastId });
            router.push("/homePage");
        }

        toast.success("Logged in successfully!Redirecting...", { id: toastId });

        const role = session?.user.role;
        if(role === "Player"){
            router.push("/homePage");
        }else if(role === "Owner"){
            router.push("/owner/dashboard");
        }else{
            router.push("/homePage");
        }
    }
  };

  return (
    <div className=" min-h-screen bg-transparent flex items-center justify-center p-4">
      <BackgroundCircles />
      <div className="flex flex-col items-center space-y-4 ">
        <h1 className="text-2xl font-bold text-center text-gray-300 mb-6">
          <span className="text-[#44B5E9]">Welcome!</span> Let&apos;s Log In!
        </h1>

        <div className="w-full max-w-md bg-black rounded-lg shadow-md p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                E-mail
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full border-0 border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 bg-transparent"
                placeholder=""
                required
              />
            </div>

            <div className="mb-0">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full border-0 border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 bg-transparent"
                placeholder=""
              />
            </div>
            <div className=" text-right">
              <Link
                href="/forgot-password"
                className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline"
              >
                Forgot Password?
              </Link>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: "/api/auth/redirect" })}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-200"
            >
              Continue with Google
            </button>
          </form>

          <div className="mt-8 pt-6 text-center">
            <p className="text-sm text-gray-300 mb-4">
              Didn&apos;t Register yet?
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/register?role=Player"
                className="w-full px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition duration-200"
              >
                Register as Player
              </Link>
              <Link
                href="/register?role=Owner"
                className="w-full px-2 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 transition duration-200"
              >
                Register as Owner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SIgnInPage;
