import React from 'react';
import Link from 'next/link';
import BackgroundCircles from '@/components/backgroundCircles';
const LoginPage = () => {
    return (
        <div className=" min-h-screen bg-transparent flex items-center justify-center p-4">
            <BackgroundCircles />
            <div className='flex flex-col items-center space-y-4 '>
                <h1 className="text-2xl font-bold text-center text-gray-300 mb-6"><span className='text-[#44B5E9]'>Welcome!</span> Let's Log In!</h1>

                <div className="w-full max-w-md bg-black rounded-lg shadow-md p-8">


                    <form className="space-y-6">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                className="w-full border-0 border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 bg-transparent"
                                placeholder=""
                            />
                        </div>

                        <div className='mb-0'>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                className="w-full border-0 border-b-2 border-gray-400 focus:outline-none focus:border-blue-500 bg-transparent"
                                placeholder=""
                            />
                        </div>
                        <div className=" text-right">
                            <Link href="/forgot-password" className="text-[10px] text-blue-600 hover:text-blue-800 hover:underline">
                                Forgot Password?
                            </Link>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Log In
                        </button>
                    </form>



                    <div className="mt-8 pt-6 text-center">
                        <p className="text-sm text-gray-300 mb-4">Didn't Register yet?</p>
                        <div className="flex justify-center space-x-4">
                            <Link
                                href="/register/player"
                                className="w-full px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition duration-200"
                            >
                                Register as Player
                            </Link>
                            <Link
                                href="/register/owner"
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

export default LoginPage;