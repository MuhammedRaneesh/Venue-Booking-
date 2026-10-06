export type BookingStatus =
    | "pending"
    | "approved"
    | "rejected"
    | "cancelled"
    | "completed"
    | "expired";

export type PaymentType = "full";

export type PaymentStatus = "unpaid" | "fully_paid" | "refunded";
import { Types } from "mongoose";

export interface IBooking {
    userId: Types.ObjectId;
    venueId: Types.ObjectId;
    ownerId: Types.ObjectId;

    bookingDate: Date;
    startDateTime?: Date;
    endDateTime?: Date;

    eventType: string;
    guestCount: number;
    specialRequest?: string;

    totalAmount: number;
    bookingStatus: BookingStatus;

    paymentType: PaymentType;

    amountPaid: number;
    amountDue: number;
    paymentStatus: PaymentStatus;
    balanceDueDate?: Date | null;
}
