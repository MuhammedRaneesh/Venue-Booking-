import { Schema, model } from "mongoose";

const venueSchema = new Schema(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    venueName: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "Wedding Hall",
        "Convention Center",
        "Conference Hall",
        "Banquet Hall",
        "Party Hall",
        "Outdoor Venue",
        "Resort",
        "Auditorium",
      ],
    },
    capacity: {
      type: Number,
      required: true,
      min: 1,
    },

    pricing: {
      pricePerHour: {
        type: Number,
        default: 0,
        min: 0,
      },

      pricePerDay: {
        type: Number,
        default: 0,
        min: 0,
      },
    },
    amenities: [
      {
        type: String,
      },
    ],
    photos: [
      {
        type: String,
      },
    ],

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number],
        default: [0, 0]
      },

      address: {
        place: {
          type: String,
          required: true,
        },

        city: {
          type: String,
          required: true,
        },

        district: {
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
      },
    },

    availability: {
      openTime: {
        type: String,
        required: true,
      },

      closeTime: {
        type: String,
        required: true,
      },
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "suspended"],
      default: "pending",
    },
    rejectionReason: {
      type: String,
      default: null
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

venueSchema.index({ location: "2dsphere" });

export const Venue = model("Venue", venueSchema);;