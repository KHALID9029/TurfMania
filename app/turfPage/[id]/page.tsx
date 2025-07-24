'use client';

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { MapPin } from "lucide-react";
import { Star } from "lucide-react";
import { Modal } from "@mui/material";
import Box from "@mui/material/Box";


import TurfDto from "@/dto/turfDto";
import TimeSlots from "@/components/slotGenerator";
import { getFormattedAddress } from "@/lib/utils";
import DatePickerInput from "@/components/datePicker";
import { Pencil } from "lucide-react";
import ReviewDto from "@/dto/reviewDto";
import Stepper, { Step } from "@/components/stepper";
import toast from "react-hot-toast";

// import FadeContent from "@/components/fadeContent";
// import Navbar from "@/components/bars/navbar"

export default function TurfPage() {
    const { id } = useParams();
    const [turf, setTurf] = useState<TurfDto>();


    const { data: session } = useSession();

    const [mainImage, setMainImage] = useState("/images/turf1.png");

    const [formattedAddress, setFormattedAddress] = useState<string | null>(null);

    //Rating logic
    const [rating, setRating] = useState<number>(0);

    const [reviewText, setReviewText] = useState<string>("");

    const [reviews, setReviews] = useState<ReviewDto[]>([]);

    const [userReview, setUserReview] = useState<ReviewDto | null>(null);

    const [editMode, setEditMode] = useState(false);

    //This is Not connected to backed yet
    const [selectedSlots, setSelectedSlots] = useState<string[]>([]);
    const [cost, setCost] = useState(0);
    const [openPaymentModal, setOpenPaymentModal] = useState(false);

    const [showStepper, setShowStepper] = useState(false);


    useEffect(() => {
        if (!turf) return;

        async function fetchAddress() {
            if (turf) {
                const address = await getFormattedAddress(turf.lat, turf.lng, process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!);
                console.log("Formatted Address:", address);
                setFormattedAddress(address);
            }
        }

        fetchAddress();
    }, [turf]);


    useEffect(() => {
        if (!id) return;

        async function fetchTurfAndReviews() {
            try {
                const res = await fetch(`/api/turf?id=${id}`);
                const data = await res.json();
                setTurf(data);
                setMainImage(data.photos?.[0] || "/images/turf1.png");

                const reviewRes = await fetch(`/api/review?turfId=${data.turfId}`);
                const reviewData = await reviewRes.json();
                if (Array.isArray(reviewData)) {
                    setReviews(reviewData);
                } else {
                    console.warn("Unexpected review data:", reviewData);
                    setReviews([]); // fallback to empty array
                }
            } catch (err) {
                console.error("Failed to load turf or reviews", err);
            }
        }

        fetchTurfAndReviews();
    }, [id]);


    const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);

    // Callback when date is selected or removed
    const handleDateSelect = (date: string) => {
        console.log("Date selected or removed:", date);
        setSelectedDate(date);

    };





    const handleSubmitReview = async () => {
        if (!reviewText || rating === 0 || !session?.user?.userId || !turf?.turfId) return;

        const formData = new FormData();
        formData.append("userId", String(session.user.userId));
        formData.append("turfId", String(turf.turfId));
        formData.append("name", session.user.name || "Anonymous");
        formData.append("rating", String(rating));
        formData.append("text", reviewText);
        formData.append("date", new Date().toISOString());

        try {
            const res = await fetch("/api/review", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to submit review");

            const submittedReview = await res.json();

            setReviews((prev) => [submittedReview, ...prev]);
            setReviewText("");

            setRating(0);
        } catch (err) {
            console.error("Review submission failed:", err);
        }
    };






    // Update local user review and reflect in reviews array
    const updateUserReview = (updated: ReviewDto) => {
        setUserReview(updated);
        setReviews((prev) =>
            prev.map((r) => (r.userId === session?.user.userId ? updated : r))
        );
    };

    // Save changes (e.g. to backend or local confirmation)
    const saveUserReview = async (review: ReviewDto) => {
        if (!review.id) return;

        const formData = new FormData();
        formData.append("reviewId", String(review.id));
        formData.append("userId", String(review.userId));
        formData.append("turfId", String(review.turfId));
        formData.append("name", review.name);
        formData.append("rating", String(review.rating));
        formData.append("text", review.text || "");
        formData.append("date", new Date().toISOString());

        try {
            const res = await fetch(`/api/review?reviewId=${review.id}`, {
                method: "PUT",
                body: formData,
            });

            if (!res.ok) throw new Error("Failed to update review");

            const updated = await res.json();
            updateUserReview(updated);
        } catch (err) {
            console.error("Review update failed:", err);
        }
    };



    useEffect(() => {
        if (session?.user?.userId && reviews.length > 0) {
            const found = reviews.find((r) => r.userId === session.user.userId) || null;
            setUserReview(found);
        }
    }, [session, reviews]);


    // From 6:00 AM - 6:30 AM get only 6:00 AM
    // From 6:30 AM - 7:00 AM get only 6:30 AM
    const handlePayment = async () => {
        if (!turf || !selectedDate || selectedSlots.length === 0 || !session?.user || turf.rate <= 0) {
            toast.error("Booking failed: Missing required information");
            console.error("Booking failed: Missing required information");
            return;
        }

        const totalCost = (selectedSlots.length/2) * turf.rate;   
        setCost(totalCost);
        setOpenPaymentModal(true);
        console.log("Cost calculated:", cost);
    }

    const handleBooking = async () => {
        if (!turf || !selectedDate || selectedSlots.length === 0 || !session?.user || cost <= 0) {
            toast.error("Booking failed: Missing required information");
            console.error("Booking failed: Missing required information");
            return;
        }
        try{
            const data = new FormData();
            data.set('turfId', String(turf.turfId));
            data.set('userId', String(session.user.userId));
            data.set('date', selectedDate);
            data.set('startTime', selectedSlots[0].split(" - ")[0].trim());
            data.set('endTime', selectedSlots[selectedSlots.length - 1].split(" - ")[1].trim());
            data.set('cost', String(cost)); // Assuming rate is 1000 per hour
            // Payment gateway add korle than kaj korbo eitar upor
            data.set('paymentStatus', 'pending'); // Default to pending
            
            const response = await fetch('/api/booking', {
                method: 'POST',
                body: data,
            });

            if (!response.ok) {
                const errorData = await response.json();
                toast.error(errorData?.error || "Failed to register turf");
                throw new Error("Failed to create booking");
            }else{
                toast.success("Booking created successfully!");
                setOpenPaymentModal(false);
                window.location.reload(); // Reload to reflect the new booking
            }
        }catch (error) {
            console.error("Error creating booking:", error);
            toast.error("Failed to create booking");
        }
    }



    if (!turf) return <div className="text-white p-10">Loading turf data...</div>;

    return (
        <div className="bg-black text-white p-6 md:p-10 min-h-screen">

            {session?.user && (<button
                onClick={() => setShowStepper(prev => !prev)}
                className="fixed bottom-4 right-4 z-40 bg-green-600 hover:bg-green-700 text-white p-4 rounded-full shadow-xl block lg:hidden"
            >
                Book Now
            </button>)}

            {showStepper && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm block lg:hidden">
                    <div className="relative bg-transparent text-white w-11/12 max-w-md  text-center px-4 py-6">

                        {/* Stepper */}
                        <Stepper
                            initialStep={1}
                            onStepChange={(step) => {
                                console.log(step);
                            }}
                            onFinalStepCompleted={() => setShowStepper(false)}
                            canGoToNextStep={(step) => {
                                if (step === 1) {
                                    return selectedDate !== undefined;
                                }
                                if (step === 2) {
                                    return selectedSlots.length > 0;
                                }
                                return true;
                            }}
                            onClose={() => setShowStepper(false)}
                            backButtonText="Previous"
                            nextButtonText="Next"
                        >
                            <Step>
                                <h2>Select date</h2>
                                <DatePickerInput onDateSelect={handleDateSelect} initialDate={selectedDate} />
                            </Step>
                            <Step>
                                <h2>Select Slots</h2>
                                <h6>Price per hour: {turf.rate}</h6>
                                <TimeSlots
                                    open={turf.open}
                                    close={turf.close}
                                    selectedSlots={selectedSlots}
                                    setSelectedSlots={setSelectedSlots}
                                />
                            </Step>
                            <Step>
                                <p>Slot Booked!</p>
                                {selectedSlots.map((slot, index) => (
                                    <p key={index} className="text-sm text-gray-300">{slot}</p>
                                ))}
                            </Step>
                        </Stepper>
                    </div>
                </div>

            )}


            <div className="flex gap-2 items-center mb-2">
                <h1 className="text-2xl font-bold">{turf.turfName}
                </h1>
                <div className="flex text-yellow-400 text-2xl">
                    {Array.from({ length: 5 }, (_, i) => {
                        const starNumber = i + 1;
                        const turfRating = turf.rating || 0;
                        if (turfRating >= starNumber) return <span key={i}>★</span>;
                        else if (turfRating >= starNumber - 0.5) return <span key={i}>⯨</span>;
                        else return <span key={i}>☆</span>;
                    })}
                </div>
            </div>



            <div className="flex flex-col md:flex-row gap-6">
                {/* Left section */}
                <div className="flex-1">

                    <div className="w-full aspect-video relative rounded overflow-hidden">
                        <Image
                            src={mainImage || "/images/turf1.png"}
                            alt="Turf"
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="flex gap-2 mt-2">
                        {turf.photos?.slice(0, 4).map((url, i) => (
                            <Image
                                key={i}
                                src={url}
                                alt={`thumbnail-${i}`}
                                width={80}
                                height={60}
                                className="rounded object-cover cursor-pointer hover:opacity-80 transition"
                                onClick={() => setMainImage(url)}
                            />
                        ))}
                        {turf.photos && turf.photos.length > 4 && (
                            <div className="w-20 h-14 flex items-center justify-center bg-gray-500 rounded">
                                +{turf.photos.length - 4}
                            </div>
                        )}
                    </div>

                    <div className="mt-4"><strong >Amenities:</strong> </div>
                    <p className="flex flex-wrap gap-2 mt-4 text-gray-300">
                        

                        {turf.amenities?.map((amenity, idx) => (
                            <span
                                key={idx}
                                className="bg-gray-700 text-gray-200 text-[10px] md:text-[10px] px-2 py-0.5 rounded-full h-full"
                            >
                                {amenity}
                            </span>
                        ))}
                    </p>

                    <div className="mt-4">
                        <h2 className="text-xl font-semibold">Location:</h2>
                        <p className="flex items-center gap-2 text-sm text-gray-300">
                            <MapPin size={18} /> {formattedAddress || "Unknown Location"}
                        </p>
                        <div className="w-full h-60 mt-2">
                            <iframe
                                width="100%"
                                height="100%"
                                className="rounded"
                                loading="lazy"
                                allowFullScreen
                                src={`https://maps.google.com/maps?q=${turf.lat},${turf.lng}&z=15&output=embed`}
                            ></iframe>
                        </div>
                    </div>

                    {!reviews.some((review) => review.userId === session?.user.userId) &&

                        <div className="mt-6">
                            <h2 className="text-xl font-semibold">Write a review:</h2>
                            <div className="flex items-center gap-1 mt-1 mb-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                        key={star}
                                        size={24}
                                        onClick={() => setRating(star)}
                                        className={`cursor-pointer transition ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
                                            }`}
                                    />
                                ))}
                                <span className="text-sm text-gray-300 ml-2">{rating} star{rating === 1 ? "" : "s"}</span>
                            </div>

                            <textarea
                                className="w-full bg-[#1e1e1e] border border-gray-700 text-white rounded p-3 mt-2 min-h-[100px]"
                                placeholder="Write your thoughts..."
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                            ></textarea>

                            <button
                                onClick={handleSubmitReview}
                                className="mt-2 px-4 py-2 bg-green-600 rounded hover:bg-green-700">Submit</button>
                        </div>
                    }

                    {userReview && (
                        <div className="mt-6 text-xl font-semibold">
                            <h1>Your review: </h1>
                            <div className="bg-[#1e1e1e] rounded p-4 mt-2 relative">
                                {/* Pencil Icon */}
                                <button
                                    className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
                                    onClick={() => setEditMode((prev) => !prev)}
                                    aria-label="Edit Review"
                                >
                                    <Pencil size={18} />
                                </button>

                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-1">
                                    <div className="flex items-center gap-2">
                                        <Image
                                            src="/images/user_placeholder.png"
                                            width={30}
                                            height={30}
                                            alt="user"
                                            className="rounded-full"
                                        />
                                        <div className="flex flex-col">
                                            <span className="font-semibold">{userReview.name}</span>
                                            <span className="text-xs text-gray-400">{userReview.date.toLocaleString()}</span>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    {editMode ? (
                                        <div className="flex gap-1 items-center sm:mt-0 mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={20}
                                                    className={`cursor-pointer transition ${star <= userReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
                                                    onClick={() => {
                                                        const updatedReview = { ...userReview, rating: star, date: new Date() };
                                                        updateUserReview(updatedReview);
                                                    }}
                                                />
                                            ))}
                                            <span className="text-sm text-gray-300 ml-2">
                                                {userReview.rating} star{userReview.rating > 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex gap-1 items-center sm:mt-0 mt-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={20}
                                                    className={`${star <= userReview.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`}
                                                />
                                            ))}
                                            <span className="text-sm text-gray-300 ml-2">
                                                {userReview.rating} star{userReview.rating > 1 ? "s" : ""}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Text */}
                                {editMode ? (
                                    <>
                                        <textarea
                                            className="w-full bg-[#1e1e1e] border border-gray-700 text-white rounded p-3 mt-3 min-h-[100px]"
                                            value={userReview.text}
                                            onChange={(e) => {
                                                const updatedReview = { ...userReview, text: e.target.value ? e.target.value : "", date: new Date() };
                                                updateUserReview(updatedReview);
                                            }}
                                        />
                                        <button
                                            className="mt-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
                                            onClick={() => {
                                                saveUserReview(userReview);
                                                setEditMode(false);

                                            }}
                                        >
                                            Save Changes
                                        </button>
                                    </>
                                ) : (
                                    <p className="text-sm text-gray-300 mt-2">{userReview.text}</p>
                                )}
                            </div>
                        </div>
                    )}





                    <div className="mt-6">
                        <h2 className="text-xl font-semibold">Other reviews:</h2>
                        {reviews.length === 0 && <p className="text-gray-400 mt-2">Be the first one to review!</p>}
                        {reviews.length !== 0 && reviews.filter(r => r.userId !== session?.user?.userId).length === 0 ? (
                            <p className="text-gray-400 mt-2">No reviews yet from other users.</p>
                        ) : (
                            reviews
                                .filter((review) => review.userId !== session?.user?.userId)
                                .map((review, index) => (
                                    <div key={index} className="bg-[#1e1e1e] rounded p-4 mt-2">
                                        <div className="flex items-center gap-2 mb-1">
                                            <Image
                                                src="/images/user_placeholder.png"
                                                width={30}
                                                height={30}
                                                alt="user"
                                                className="rounded-full"
                                            />
                                            <div className="flex flex-col">
                                                <span className=" text-sm md:text-xl">{review.name}<span className="text-gray-400 text-xs md:text-sm"> UID: {review.userId}</span>
                                                </span>
                                                <span className="text-[8px] md:text-xs text-gray-400">{review.date.toLocaleString()}</span>
                                            </div>
                                            <div className="ml-auto flex gap-0.5">
                                                {[1, 2, 3, 4, 5].map((i) => (
                                                    <Star
                                                        key={i}
                                                        size={16}
                                                        className={i <= review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-300 mt-2">{review.text}</p>
                                    </div>
                                ))
                        )}
                    </div>

                </div>

                {/* Right section */}
                {session?.user && (
                    <div className="w-full md:w-2/5 bg-[#1e1e1e] rounded p-4 flex flex-col items-center h-fit sticky top-5 self-start hidden lg:block">
                        <p className="text-sm md:text-md text-gray-400 mb-2">
                            Cost Per Hour: <span className="text-white font-bold">{turf.rate} bdt</span>
                        </p>
                        <hr />
                        <label className="text-sm mt-4 text-white w-full">Select Date:</label>

                        <DatePickerInput onDateSelect={handleDateSelect} initialDate={selectedDate} />
                        <div className="w-full mt-4">
                            {
                                selectedDate && (
                                    <TimeSlots
                                        open={turf.open}
                                        close={turf.close}
                                        selectedSlots={selectedSlots}
                                        setSelectedSlots={setSelectedSlots}
                                        turfId={turf.turfId}
                                        date={selectedDate}
                                    />
                                )
                            }
                        </div>

                        <button 
                            onClick={()=>handlePayment()}
                            className="mt-4 w-full py-2 bg-green-600 rounded hover:bg-green-700">
                            Confirm
                        </button>
                    </div>
                )
                }
            </div>

            {/* Model for Payment*/}
        <Modal open={openPaymentModal} onClose={() => setOpenPaymentModal(false)}>
          <Box className="bg-zinc-900 rounded-lg p-6 m-auto mt-[20vh] w-[90%] max-w-md text-white shadow-lg overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Pay</h2>
              <button
                onClick={() => setOpenPaymentModal(false)}
                className="text-sm text-red-400 hover:text-red-600"
              >
                Close
              </button>
            </div>
            <div className="flex justify-between items-center mb-4">
                <p className="text-sm">Cost: {cost} BDT</p>
            </div>
                <div className="flex justify-center mt-4">

                <button
                    onClick={() => handleBooking()}
                    className="mt-4 w-full py-2 bg-green-600 rounded hover:bg-green-700"
                >
                    Pay Now
                </button>
                </div>
          </Box>
        </Modal>
        </div >
    );
}
