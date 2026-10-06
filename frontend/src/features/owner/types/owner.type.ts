import type { z } from "zod";
import { createVenueFormSchema, type VenueAddSchema } from "../validators/ownerValidation";


export type LatLngTuple = [number, number];
export type CoordinatesTuple = [number, number];
export type VenueFormValues = z.input<typeof createVenueFormSchema>;


export interface ResponseApplication {
    success: boolean;
    message: string;
}

export interface ResponseVenueAdd {
    success: boolean;
    message: string;
}

export interface VenueQueryParams {
    search?: string;
    category?: string;
    city?: string;
    district?: string;
    minCapacity?: number;
    maxCapacity?: number;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    amenities?: string;
    sort?: string;
    limit? : number;
    page? : number
}

export interface GetVenue {
    success: boolean;
    venue: Venue[];
    totalCount: number;
    pagination : {
        currentPage : number,
        Limit : number,
        totalPages : number ,
        hasNextPage : boolean ,
        hasPreviousPage : boolean
    }
}

export interface UpdateVenue {
    success: boolean;
    message: string;
}

export interface Venue {
    _id: string;
    owner: string;
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
        type: "Point";
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
    status: string;
    isActive: boolean;
    isFeatured: boolean;
    averageRating: number;
    totalReviews: number;
    createdAt: string;
    updatedAt: string;
}

export interface ApiErrorResponse {
    data?: {
        message?: string;
    };
    error?: string;
}

export interface ApplicationFormData {
    fullName: string;
    businessName: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    pincode: string;
    gstNumber?: string;
}

export interface GeoapifyProperties {
    formatted?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    town?: string;
    village?: string;
    county?: string;
    district?: string;
    state?: string;
    postcode?: string;
    lat: number;
    lon: number;
}

export interface GeoapifyFeature {
    properties: GeoapifyProperties;
}

export interface GeoapifyResponse {
    features: GeoapifyFeature[];
}

export interface LocationSuggestion {
    id: string;
    label: string;
    address: VenueAddSchema["location"]["address"];
    position: LatLngTuple;
}

// ─── VENUE SECTION & FORM STATE CONFIGURATIONS ────────────────────────────────
export interface VenueDetailSection {
    venueName: string;
    description: string;
    category: string;
    capacity: number;
    pricing: {
        pricePerHour: number;
        pricePerDay: number;
    };
    amenities: string[];
}

export interface VenueFormData {
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
        type: "Point";
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
}

// ─── BACKEND NETWORK TRANSMISSION PAYLOADS ───────────────────────────────────
export interface VenuePayload extends Omit<VenueAddSchema, "photos" | "location"> {
    location: {
        type: "Point";
        coordinates: CoordinatesTuple;
        address: VenueAddSchema["location"]["address"];
    };
}

interface PopulatedUser {
  _id: string;
  userName: string;
  email: string;
  phoneNumber?: string;
}
interface PopulatedVenue {
  _id: string;
  venueName: string;
  category: string;
  capacity: number;
  pricing?: {
    pricePerHour: number;
    pricePerDay: number;
  };
  photos?: string[];
  status: string;
}

export interface OwnerBookingItem {
  _id: string;
  userId: PopulatedUser;
  venueId: PopulatedVenue;
  bookingDate: string;
  bookingType: "hourly" | "full-day";
  startDateTime?: string;
  endDateTime?: string;
  guestCount: number;
  eventType: string;
  specialRequest?: string;
  paymentType: "full";
  totalAmount: number;
  bookingStatus: string;
  paymentStatus: string;
}

export interface Pagination {
  currentPage: number;
  Limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface getVenueOwnerQuery {
    search?: string;
    category?: string;
    sort?: string;
    limit? : number;
    page? : number
}

export type OwnerDashboardChartPeriod = "month" | "year" | "all";

export interface OwnerDashboardChartPoint {
    date: string;
    bookings: number;
    earnings: number;
    totalAmount?: number;
    revenue?: number;
}

export interface OwnerDashboardChartResponse {
    success: boolean;
    data: OwnerDashboardChartPoint[];
}

export interface OwnerDashboardRecentBooking {
    _id: string;
    bookingDate: string;
    bookingStatus: string;
    paymentStatus?: string;
    totalAmount?: number;
    amountPaid?: number;
    createdAt?: string;
    user?: {
        userName?: string;
        email?: string;
    } | null;
    venue?: {
        venueName?: string;
    } | null;
}

export interface OwnerDashboardSummaryResponse {
    success: boolean;
    totalVenues?: number;
    activeVenues?: number;
    inactiveVenues?: number;
    totalBookings?: number;
    pendingBookings?: number;
    totalEarnings?: number;
    recentBookings?: OwnerDashboardRecentBooking[];
    data?: Record<string, any>;
}

