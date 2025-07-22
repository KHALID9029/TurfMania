import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Review, { IReview } from "@/models/Review";
import { toReviewDto } from "@/mapper/reviewMapper";

/** GET: Fetches all reviews from the database**/
export async function getAllReviews(req: NextRequest) {
    console.log(req);
    try {
        await connectDB();
        const reviews = await Review.find();
        const reviewDtos = reviews.map(review => {
            return toReviewDto(review);
        }
        );
        return NextResponse.json(reviewDtos, { status: 200 });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
    }
}



export async function getReviewById(id: number) {
    try {
        await connectDB();
        const review = await Review.findOne({ reviewId: id });
        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }
        const reviewDto = toReviewDto(review);
        return NextResponse.json(reviewDto, { status: 200 });
    } catch (error) {
        console.error("Error fetching review:", error);
        return NextResponse.json({ error: "Failed to fetch review" }, { status: 500 });
    }
}

export async function getReviewByUserAndTurf(userId: number, turfId: number) {
    try {
        await connectDB();
        const review = await Review.findOne({ userId, turfId });

        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        const reviewDto = toReviewDto(review);
        return NextResponse.json(reviewDto, { status: 200 });
    } catch (error) {
        console.error("Error fetching review by userId and turfId:", error);
        return NextResponse.json({ error: "Failed to fetch review" }, { status: 500 });
    }
}


export async function getReviewsByUserId(userID: number) {
    try {
        await connectDB();
        const reviews = await Review.find({ userId: userID });

        if (!reviews || reviews.length === 0) {
            return NextResponse.json({ error: "No reviews found" }, { status: 404 });
        }

        const reviewDtos = reviews.map(toReviewDto);
        return NextResponse.json(reviewDtos, { status: 200 });
    } catch (error) {
        console.error("Error fetching reviews by userID:", error);
        return NextResponse.json({ error: "Failed to fetch reviews by userID" }, { status: 500 });
    }
}


export async function getReviewsByTurfId(turfID: number) {
    try {
        await connectDB();
        const reviews = await Review.find({ turfId: turfID });
        if (!reviews || reviews.length === 0) {
            return NextResponse.json({ error: "No reviews found for this turf" }, { status: 404 });
        }
        const reviewDtos = reviews.map(review => toReviewDto(review));
        return NextResponse.json(reviewDtos, { status: 200 });
    } catch (error) {
        console.error("Error fetching reviews by turf ID:", error);
        return NextResponse.json({ error: "Failed to fetch reviews by turf ID" }, { status: 500 });
    }
}



/** POST: Creates a new review in the database **/
export async function postReview(review: IReview) {
    try {
        await connectDB();
        const newReview = await Review.create(review);
        console.log("New Review created:", newReview);
        const reviewDto = toReviewDto(newReview);
        return NextResponse.json(reviewDto, { status: 201 });
    } catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && (error as any).code === 11000) {
            return NextResponse.json({ error: "User has already reviewed this turf." }, { status: 409 });
        }
        console.error("Error creating review:", error);
        return NextResponse.json({ error: "Failed to create review" }, { status: 500 });
    }
}


/** PUT: Updates an existing Review in the database **/
export async function putReview(id: number, updateData: Partial<IReview>) {
    try {
        await connectDB();
        const updatedReview = await Review.findOneAndUpdate({ reviewId: id }, updateData, {
            new: true, // Return the updated document
            runValidators: true // Validate the update against the schema
        });
        if (!updatedReview) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }
        const reviewDto = toReviewDto(updatedReview);
        return NextResponse.json(reviewDto, { status: 200 });
    } catch (error) {
        console.error("Error updating review:", error);
        return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
    }
}


/** DELETE: Deletes a review from the database **/
export async function deleteReview(id: number) {
    try {
        await connectDB();
        const deletedReview = await Review.findOneAndDelete({ reviewId: id });
        if (!deletedReview) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }
        return NextResponse.json({ message: "Review deleted successfully" });
    } catch (error) {
        console.error("Error deleting review:", error);
        return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
    }
}
