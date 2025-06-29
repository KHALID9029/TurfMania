import React from 'react';

const RegistrationForm = () => {
    return (
        <div className="max-w-sm mx-auto p-4 bg-[#1e1e1e] rounded-lg shadow-md">
            <form className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-400">First name</label>
                        <input
                            type="text"
                            className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400">Last name</label>
                        <input
                            type="text"
                            className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400">E-mail</label>
                    <input
                        type="email"
                        className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400">Phone</label>
                    <input
                        type="tel"
                        className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400">National ID</label>
                    <input
                        type="text"
                        className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400">Password</label>
                    <input
                        type="password"
                        className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400">Confirm Password</label>
                    <input
                        type="password"
                        className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-400">Street</label>
                    <input
                        type="text"
                        className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-xs font-medium text-gray-400">Post Code</label>
                        <input
                            type="text"
                            className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-400">City</label>
                        <input
                            type="text"
                            className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        type="submit"
                        className="py-1.5 px-4 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-[#42b59e] hover:bg-[#42B932] transition duration-300 ease-in-out"
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RegistrationForm;