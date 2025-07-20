import { NextRequest, NextResponse } from "next/server";
import { IReview } from "@/models/Review";

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

export async function postReviewService(Review: IReview) {


    return postReview(Review);
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
            Object.entries(updateData).filter(([key, value]) => key !== '_id' && value !== undefined && value !== null)
        );

        return putReview(id, updateReviewData);
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

