import React, { useState } from 'react';

interface RegisterFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    nationalId: string;
    password: string;
    confirmPassword: string;
    street: string;
    postCode: string;
    city: string;
}

const RegistrationForm: React.FC = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        nationalId: '',
        password: '',
        confirmPassword: '',
        street: '',
        postCode: '',
        city: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
        alert('Form submitted! Check console for details.');
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-black text-white p-4 rounded-lg w-full max-w-md mx-auto space-y-2 text-sm"
        >
            {/* First and Last Name */}
            <div className="flex gap-2">
                <input
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="flex-1 min-w-0 bg-gray-800 text-white px-2 py-1 rounded outline-none text-sm"
                />
                <input
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="flex-1 min-w-0 bg-gray-800 text-white px-2 py-1 rounded outline-none text-sm"
                />
            </div>

            {/* Email */}
            <input
                type="email"
                name="email"
                placeholder="E-mail"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-2 py-1 rounded outline-none text-sm"
            />

            {/* Phone */}
            <input
                type="text"
                name="phone"
                placeholder="Phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-2 py-1 rounded outline-none text-sm"
            />

            {/* National ID */}
            <input
                type="text"
                name="nationalId"
                placeholder="National ID"
                value={formData.nationalId}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-2 py-1 rounded outline-none text-sm"
            />

            {/* Password */}
            <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-2 py-1 rounded outline-none text-sm"
            />

            {/* Confirm Password */}
            <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-2 py-1 rounded outline-none text-sm"
            />

            {/* Street */}
            <input
                type="text"
                name="street"
                placeholder="Street"
                value={formData.street}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white px-2 py-1 rounded outline-none text-sm"
            />

            {/* Post Code and City */}
            <div className="flex gap-2">
                <input
                    type="text"
                    name="postCode"
                    placeholder="Post Code"
                    value={formData.postCode}
                    onChange={handleChange}
                    className="flex-1 min-w-0 bg-gray-800 text-white px-2 py-1 rounded outline-none text-sm"
                />
                <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={handleChange}
                    className="flex-1 min-w-0 bg-gray-800 text-white px-2 py-1 rounded outline-none text-sm"
                />
            </div>

            {/* Submit Button */}
            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-1.5 rounded hover:bg-green-600 transition text-sm"
            >
                Register
            </button>
        </form>
    );
};

export default RegistrationForm;
