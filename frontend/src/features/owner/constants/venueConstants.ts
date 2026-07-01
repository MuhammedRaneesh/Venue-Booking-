import type { LatLngTuple } from "../types/owner.type";


export const categoryOptions = [
    "Wedding Hall",
    "Convention Center",
    "Conference Hall",
    "Banquet Hall",
    "Party Hall",
    "Outdoor Venue",
    "Resort",
    "Auditorium",
] as const;


export const dayOptions = [
    { value: "Monday",    label: "Mon" },
    { value: "Tuesday",   label: "Tue" },
    { value: "Wednesday", label: "Wed" },
    { value: "Thursday",  label: "Thu" },
    { value: "Friday",    label: "Fri" },
    { value: "Saturday",  label: "Sat" },
    { value: "Sunday",    label: "Sun" },
] as const;

export type WorkingDay = (typeof dayOptions)[number]["value"];




export const MAX_PHOTOS = 10;
export const MAX_IMAGE_SIZE_MB = 5;
export const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;

export const DEFAULT_POSITION: LatLngTuple = [20.5937, 78.9629];

export const inputStyle =
    "w-full rounded-lg border border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-amber-500 focus:ring-2 focus:ring-amber-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 placeholder:text-gray-400";

export const labelStyle =
    "mb-1.5 block text-xs font-bold text-gray-700 uppercase tracking-wider";

export const errorStyle =
    "mt-1 text-xs font-medium text-red-600";

export const sectionCardStyle =
    "bg-white border border-gray-100 rounded-xl p-6 shadow-sm space-y-6";

export const stepBadgeStyle =
    "flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white";
