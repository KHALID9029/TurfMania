import { IReview } from "@/models/Review";
import ReviewDto from "@/dto/reviewDto";

export function toReviewDto(review: IReview): ReviewDto {
    return {
        id: review.reviewId,
        turfId: review.turfId,
        userId: review.userId,
        name: review.name,
        rating: review.rating,
        text: review.text,
        date: review.date
    };
}
