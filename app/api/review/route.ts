
import { IReview } from '@/models/Review';
import { NextRequest, NextResponse } from "next/server";

import {
  getAllReviewsService,
  getReviewByIdService,
  getReviewByUserAndTurfService,
  getReviewsByUserIdService,
  getReviewsByTurfIdService,
  postReviewService,
  putReviewService,
  deleteReviewService
} from "@/services/reviewServices";



// Helper function to parse request to reviewDto
async function parseRequestToReviewDto(data: FormData) {
  const body = {
    id: parseInt(data.get('reviewId') as string) || 0,
    turfId: parseInt(data.get('turfId') as string),
    userId: parseInt(data.get('userId') as string),
    name: data.get('name') as string,
    rating: parseFloat(data.get('rating') as string),
    text: data.get('comment') as string,  // 'comment' from form, mapped to 'text'
    date: data.get('date') ? new Date(data.get('date') as string) : new Date(),
  };

  return {
    id: body.id,
    turfId: body.turfId,
    userId: body.userId,
    name: body.name,
    rating: body.rating,
    text: body.text,
    date: body.date,
  };
}




/** GET: Fetch all review or a specific review by ID */
export async function GET(req: NextRequest) {

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('reviewId');
  const reviewId = parseInt(id as string) || 0;

  const turfId = searchParams.get('turfId');
  const turfIdInt = parseInt(turfId as string) || 0;

  const userId = searchParams.get('userId');
  const userIdInt = parseInt(userId as string) || 0;


  if (userIdInt > 0 && turfIdInt > 0) {
    return getReviewByUserAndTurfService(userIdInt, turfIdInt);
  }

  if (userIdInt > 0) {
    return getReviewsByUserIdService(userIdInt);
  }

  if (turfIdInt > 0) {
    return getReviewsByTurfIdService(turfIdInt);
  }

  if (id) {
    return getReviewByIdService(reviewId);
  }
  if (turfIdInt > 0) {
    return getReviewsByTurfIdService(turfIdInt);
  }
  else {
    return getAllReviewsService(req);
  }
}

/** POST: Create a new review */
export async function POST(req: NextRequest) {
  const data = await req.formData();

  //console.log("Received form data:", Object.fromEntries(data.entries()));
  const reviewDto = await parseRequestToReviewDto(data);

  //console.log("Parsed turf DTO:", turfDto);
  const review = reviewDto as IReview;

  //console.log("Parsed turf DTO:", turfDto);
  if (!reviewDto) {
    return NextResponse.json({ error: "Invalid review data" }, { status: 400 });
  }

  return postReviewService(review);
}


/** PUT: Update an existing review */
export async function PUT(req: NextRequest) {

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('reviewId');
  const reviewId = parseInt(id as string) || 0;

  const data = await req.formData();
  const reviewDto = await parseRequestToReviewDto(data);

  if (!reviewDto || !id) {
    return NextResponse.json({ error: "Invalid review data or ID" }, { status: 400 });
  }

  return putReviewService(reviewId, reviewDto);
}

/** DELETE: Delete a review */
export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('reviewId');
  const reviewId = parseInt(id as string) || 0;
  return deleteReviewService(reviewId);
}