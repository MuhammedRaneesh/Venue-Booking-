import { Document, Types } from "mongoose";

export interface IVenue extends Document {
  owner: Types.ObjectId;
  venueName: string;
  description: string;
  category: string;
  capacity: number;
  pricing: {
    pricePerHour: number;
    pricePerDay: number;
  };
  amenities: string[];
  photos: string[];
  location: {
    type: string;
    coordinates: [number, number];

    address: {
      place: string;
      city: string;
      district: string;
      state: string;
      pincode: string;
    };
  };
  availability: {
    workingDays: string[];
    openTime: string;
    closeTime: string;
  };
  paymentPolicy: {
    acceptsFullPayment: boolean;
  };
  status: "pending" | "approved" | "rejected" | "suspended";
  isActive: boolean;
  isFeatured: boolean;

  averageRating: number;
  totalReviews: number;

  createdAt: Date;
  updatedAt: Date;
}