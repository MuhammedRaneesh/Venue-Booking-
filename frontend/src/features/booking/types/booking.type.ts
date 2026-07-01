export interface AvailabilityParams {
    venueId: string;
    date: string;
}
export interface Slot {
    start: string;
    end: string;
    booked: boolean;
}

export interface AvailabilityResponse {
    success: boolean
    slots: Slot[];
}

export interface AddBookingResponse {
    success: boolean,
    message: string,
}

export interface CreateBookingPayload {
    venueId: string;
    bookingDate: string;
    bookingType: "hourly" | "full-day";
    startTime?: string;
    endTime?: string;
    guestCount: number;
    eventType:
    | "Wedding"
    | "Birthday"
    | "Corporate"
    | "Engagement"
    | "Conference"
    | "Other";
    specialRequest?: string;
    paymentType: "full";
    totalAmount: number
    phoneNumber: string
}

export interface VenueSummary {
    _id: string;
    venueName: string;
    location: {
        address: {
            place: string;
            city: string;
            district: string;
            state: string;
            pincode: string;
        };
    };
    photos: string[];
}

export interface BookingHistory {
    _id: string;
    venueId: VenueSummary;
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

export interface CreatePaymentOrderPayload {
    bookingId: string
}
export interface RazorpayOrder {
    id: string
    amount: number
    currency: string
    receipt: string
}

export interface CreatePaymentOrderResponse {
    success: boolean,
    key: string
    data: {
        order: RazorpayOrder
        amountToPay: number
        paymentType: "full"
    }
}

export interface Window {
    Razorpay: any;
}

export interface VerifyPaymentResponse {
    success: boolean,
    message: string
}

export interface VerifyPaymentPayload {
    bookingId: string,
    razorpay_order_id: string,
    razorpay_payment_id: string,
    razorpay_signature: string
}

