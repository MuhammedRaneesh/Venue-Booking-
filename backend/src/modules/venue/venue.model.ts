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
  bookingSettings: {
    minimumBookingHours: number;
    maximumBookingDaysInAdvance: number;
    autoApproveBookings: boolean;
  };
  cancellationPolicy: {
    refundPercentage: number;
    cancellationAllowedBeforeHours: number;
  };
  venueRules: string[];
  policies: {
    smokingAllowed: boolean;
    alcoholAllowed: boolean;
    outsideFoodAllowed: boolean;
    petsAllowed: boolean;
  };
  status: "pending" | "approved" | "rejected" | "suspended";
  isActive: boolean;
  isFeatured: boolean;

  averageRating: number;
  totalReviews: number;

  createdAt: Date;
  updatedAt: Date;
}