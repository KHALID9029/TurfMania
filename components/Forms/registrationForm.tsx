"use client";

import React, {FC, ReactElement, useState} from 'react';
import { useRouter } from 'next/navigation';

interface playerFormData{
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nid: string;
    password: string;
    confirmPassword?: string; // Optional, not used in submission
    street: string;
    postCode: string;
    city: string;
}

// Hudai diye rakhlam, pore lagle use korbe
interface RegistrationFormProps {
    error?: string;
    buttonclicked?: string;
}

export const RegistrationForm: FC<RegistrationFormProps> = (
    props
): ReactElement => {
    // hudai
    const { error } = props;
    console.log("RegistrationForm error:", error);

    const router = useRouter();

    const [formData, setFormData] = useState<playerFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nid: '',
        password: '',
        confirmPassword: '',
        street: '',
        postCode: '',
        city: ''
    });

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if(formData.password !== formData.confirmPassword) {
            console.error("Passwords do not match");
            // Handle password mismatch (e.g., show a notification)
            return;
        }

        try{
            const data = new FormData();
            data.set('firstName', formData.firstName);
            data.set('lastName', formData.lastName);
            data.set('email', formData.email);
            data.set('phone', formData.phone);
            data.set('nid', formData.nid);
            data.set('password', formData.password);
            data.set('street', formData.street);
            data.set('postCode', formData.postCode);
            data.set('city', formData.city);

            const response = await fetch('/api/players', {
                method: 'POST',
                body:data,
            })
            if(!response.ok){
                throw new Error('Failed to register player');
            }else{
                router.push('/login');
            }
        }catch (error) {
            console.error("Registration error:", error);
            // Handle error (e.g., show a notification)
        }
    }

    return (
        <div className="max-w-sm mx-auto p-4 bg-[#1e1e1e] rounded-lg shadow-md">
            <form className="space-y-3" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label
                            htmlFor='firstName' 
                            className="block text-xs font-medium text-gray-400"
                        >
                            First Name
                        </label>
                        <input
                            type="text"
                            id= "firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor='lastName' 
                            className="block text-xs font-medium text-gray-400"
                        >
                            Last Name
                        </label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            required
                            className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                <div>
                    <label 
                        htmlFor='email'
                        className="block text-xs font-medium text-gray-400"
                    >
                        E-mail
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        pattern='^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$' // Basic email validation
                        className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label 
                        htmlFor='phone'
                        className="block text-xs font-medium text-gray-400"
                    >
                        Phone
                    </label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        pattern="[0-9]{11}" // Assuming Bangladeshi phone number format
                        className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor='nid' 
                        className="block text-xs font-medium text-gray-400"
                    >
                        National ID
                    </label>
                    <input
                        type="text"
                        id="nid"
                        name="nid"
                        value={formData.nid}
                        onChange={handleInputChange}
                        required
                        className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label 
                        htmlFor='password'
                        className="block text-xs font-medium text-gray-400"
                    >
                        Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label
                        htmlFor='confirmPassword' 
                        className="block text-xs font-medium text-gray-400"
                    >
                        Confirm Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        minLength={6}
                        className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    <label 
                        htmlFor='street'
                        className="block text-xs font-medium text-gray-400"
                    >
                        Street
                    </label>
                    <input
                        type="text"
                        id="street"
                        name="street"
                        value={formData.street}
                        onChange={handleInputChange}
                        className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label htmlFor='postCode' className="block text-xs font-medium text-gray-400">Post Code</label>
                        <input
                            type="text"
                            id="postCode"
                            name="postCode"
                            value={formData.postCode}
                            onChange={handleInputChange}
                            className="mt-1 block w-full text-sm bg-[#3B3939] text-white rounded-md shadow-sm py-1 px-2 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor='city' className="block text-xs font-medium text-gray-400">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleInputChange}
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