import { Schema, model } from "mongoose";

const ownerProfileSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        businessName: {
            type: String,
            required: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
        },

        address: {
            type: String,
            required: true,
        },

        city: {
            type: String,
            required: true,
        },

        state: {
            type: String,
            required: true,
        },

        pincode: {
            type: String,
            required: true,
        },

        gstNumber: {
            type: String,
            default: "",
        },

        profileImage: {
            type: String,
            default: "",
        },
        rejectionReason: {
            type: String,
            default: null
        },
    },
    {
        timestamps: true,
    }
);

export const OwnerProfile = model("OwnerProfile", ownerProfileSchema);