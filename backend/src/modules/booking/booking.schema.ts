import { Schema, model, Types } from "mongoose";

const bookingSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        venueId: {
            type: Schema.Types.ObjectId,
            ref: "Venue",
            required: true,
            index: true,
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        bookingDate: {
            type: Date,
            required: true,
        },
        startDateTime: {
            type: Date,
        },
        endDateTime: {
            type: Date,
        },

        eventType: {
            type: String,
            required: true,
            trim: true,
        },
        guestCount: {
            type: Number,
            required: true,
            min: 1,
        },
        specialRequest: {
            type: String,
            trim: true,
            default: "",
        },

        totalAmount: {
            type: Number,
            required: true,
            min: 0,
        },

        platformFee: {
            type: Number,
            default: 0,
            min: 0,
        },

        ownerPayout: {
            type: Number,
            default: 0,
            min: 0,
        },

        bookingStatus: {
            type: String,
            enum: ["pending", "approved", "rejected", "cancelled", "completed", "expired"],
            default: "pending",
            index: true,
        },
        cancelledAt: {
            type: Date,
            default: null,
        },
        cancellationReason: {
            type: String,
            default: "",
        },
        bookingType: {
            type: String,
            enum: ["hourly", "full-day"],
            default: "hourly",
        },
        paymentType: {
            type: String,
            default: "full",
        },
        amountPaid: {
            type: Number,
            default: 0,
            min: 0,
        },
        paymentStatus: {
            type: String,
            enum: ["unpaid", "fully_paid", "refunded"],
            default: "unpaid",
            index: true,
        },
        balanceDueDate: {
            type: Date,
            default: null,
        },
        razorpayOrderId: {
            type: String,
            default: null,
        },

        razorpayPaymentId: {
            type: String,
            default: null,
        },

        razorpaySignature: {
            type: String,
            default: null,
        },

        paidAt: {
            type: Date,
            default: null
        },
    },
    {
        timestamps: true,
    }
);

bookingSchema.index({ venueId: 1, startDateTime: 1, endDateTime: 1 });

export const Booking = model("Booking", bookingSchema);
