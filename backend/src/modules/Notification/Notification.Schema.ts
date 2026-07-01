import { Schema, model } from "mongoose";
const notificationSchema = new Schema(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        senderId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            default: null
        },
        type: {
            type: String,
            default: "",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 160,
        },

        message: {
            type: String,
            default: "",
            trim: true,
            maxlength: 500,
        },

        data: {
            type: Schema.Types.Mixed,
            default: {},
        },
        isRead: {
            type: Boolean,
            default: false,
            index: true,
        },
        readAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

notificationSchema.index({ userId: 1, createdAt: -1, });

notificationSchema.index({ userId: 1, isRead: 1, });

export const Notification = model("Notification", notificationSchema);