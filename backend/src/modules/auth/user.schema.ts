import { model, Schema } from "mongoose"
import { IUser } from "./user.model.js"

const userSchema = new Schema<IUser>({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: false,
        select: false
    },
    googleId: {
        type: String,
        default: null,
        select: false
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    role: {
        type: String,
        default: 'user',
        enum: ['user', 'venue_owner', 'admin']
    },
    phoneNumber: {
        type: String
    },
    profileImage: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    ownerStatus: {
        type: String,
        enum: ["NONE", "PENDING", "APPROVED", "REJECTED"],
        default: "NONE",
    },
    refreshToken: {
        type: String,
    }
},
    {
        timestamps: true
    })

export const User = model("User", userSchema)