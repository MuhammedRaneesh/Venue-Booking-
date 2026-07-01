import { Schema, model } from "mongoose";

const wishlistSchema = new Schema(
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
  },
  {
    timestamps: true,
  }
);

wishlistSchema.index(
  { userId: 1, venueId: 1 },
  { unique: true }
);

export const Wishlist = model(
  "Wishlist",
  wishlistSchema
);