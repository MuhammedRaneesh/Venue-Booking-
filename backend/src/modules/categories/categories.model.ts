import { Document, Types } from "mongoose";

export type CategoryStatus = "active" | "inactive";

export interface ICategory extends Document {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  description?: string;
  image: string;
  status: CategoryStatus;
  createdAt: Date;
  updatedAt: Date;
}
