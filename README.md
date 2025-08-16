# TurfMania

TurfMania is a modern web application for booking and managing sports turfs. Built with Next.js, TypeScript, and MongoDB, it provides a seamless experience for both players and turf owners.

## Features
- Browse available turfs with detailed information and images
- Book turfs for specific dates and time slots
- Manage bookings (view, cancel, upcoming/past separation)
- Owner dashboard for managing turf listings and bookings
- Secure authentication (NextAuth, Google, credentials)
- Responsive UI with custom components and animations
- File upload support for turf images
- Review system for players

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in required values (MongoDB URI, Google OAuth, NextAuth secret, Cloudinary, etc.)
3. **Run the development server:**
   ```bash
   npm run dev
   ```
4. **Open the app:**
   Visit [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure
- `app/` - Next.js app directory (routing, pages, API routes)
- `components/` - Reusable React components
- `models/` - Mongoose models for MongoDB
- `services/` - Business logic and data access
- `dto/` - Data transfer objects
- `lib/` - Utility functions and configuration
- `public/` - Static assets and images

## Technologies Used
- Next.js 15+
- TypeScript
- MongoDB & Mongoose
- NextAuth.js
- Framer Motion
- Cloudinary
- Tailwind CSS

## Deployment
Deploy easily on [Vercel](https://vercel.com/) or your preferred platform. See Next.js documentation for more details.

## Contributing
Contributions are welcome! Please open issues or submit pull requests for improvements and bug fixes.

## License
This project is licensed under the MIT License.

## Future Works
- Edit Turf Details (Owner)
- Profile settings for the owners
- Notifications functionalities for both owners and players

## Before Deployment
- Finish the future work tasks
- Some remaining issues in the product backlog
- Test the website throughly