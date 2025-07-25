import { NextRequest, NextResponse } from "next/server";
import { IReview } from "@/models/Review";
import Review from "@/models/Review";
import {
    getAllReviews,
    getReviewById,
    getReviewByUserAndTurf,
    getReviewsByUserId,
    getReviewsByTurfId,
    postReview,
    putReview,
    deleteReview,
} from "@/repositories/reviewRepository";
import ReviewDto from "@/dto/reviewDto";

import { putTurf } from "@/repositories/turfRepository";


export async function getAllReviewsService(req: NextRequest) {
    return getAllReviews(req);
}

export async function getReviewByIdService(id: number) {
    if (!id) {
        return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }
    return getReviewById(id);
}

export async function getReviewByUserAndTurfService(userId: number, turfId: number) {
    if (!userId || !turfId) {
        return NextResponse.json({ error: "User ID and Turf ID are required" }, { status: 400 });
    }
    return getReviewByUserAndTurf(userId, turfId);
}

export async function getReviewsByUserIdService(userID: number) {
    if (!userID) {
        return NextResponse.json({ error: "userID is required" }, { status: 400 });
    }
    return getReviewsByUserId(userID);
}

export async function getReviewsByTurfIdService(turfId: number) {
    if (!turfId) {
        return NextResponse.json({ error: "Turf ID is required" }, { status: 400 });
    }
    // Assuming you have a function to get reviews by turf ID
    return getReviewsByTurfId(turfId);
}

export async function postReviewService(rev: IReview) {



    const res = await postReview(rev); // fix: added await

    const allReviews = await Review.find({ turfId: rev.turfId });

    const totalRating = allReviews.reduce((acc, r) => acc + r.rating, 0);
    const avgRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

    await putTurf(rev.turfId, { rating: avgRating });

    return res;
}

export async function putReviewService(id: number, reviewDto: ReviewDto) {

    const updateData: Partial<IReview> = reviewDto;

    try {
        const review = await getReviewById(id);

        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        // Apply updates only to fields that are provided
        // Dynamically construct the update object and exclude undefined or _id fields
        const updateReviewData: Partial<IReview> = Object.fromEntries(
            Object.entries(updateData).filter(([key, value]) => key !== '_id' && key!=='reviewId' && key!=='turfId' && key!=='userId' && value !== undefined && value !== null)
        );


        const res = await putReview(id, updateReviewData);

        const allReviews = await Review.find({ turfId: reviewDto.turfId });

        const totalRating = allReviews.reduce((acc, r) => acc + r.rating, 0);
        const avgRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;

        await putTurf(reviewDto.turfId, { rating: avgRating });

        return res;

    } catch (error) {
        console.error("Error updating review:", error);
        return NextResponse.json({ error: "Failed to update review" }, { status: 500 });
    }
}


export async function deleteReviewService(id: number) {

    if (!id) {
        return NextResponse.json({ error: "Review ID is required" }, { status: 400 });
    }

    try {
        const review = await getReviewById(id);

        if (!review) {
            return NextResponse.json({ error: "Review not found" }, { status: 404 });
        }

        return deleteReview(id);
    } catch (error) {
        console.error("Error deleting review:", error);
        return NextResponse.json({ error: "Failed to delete review" }, { status: 500 });
    }

}

