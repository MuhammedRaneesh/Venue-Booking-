export interface AdminGetUser {
    search?: string
    role?: string
    isActive?: string
    page?: number
    limit?: number
}

export interface AdminGetVenueOwner {
    search?: string
    page?: number
    limit?: number
    ownerStatus?: string
}

export interface AdminGetBooking {
    bookingStatus?: string
    paymentStatus?: string
    startDate?: string
    endDate?: string
    page?: number
    limit?: number
}


// features/admin/types/venueTypes.ts
export interface AdminGetVenuesParams {
    search?: string
    page?: number
    limit?: number
    status?: string
    district?: string
    category?: string
}

export interface AdminVenueStatusPayload {
    id: string
    status: "approved" | "rejected" | "suspended"
    reason?: string
}

export interface VenueOwner {
    _id: string
    userName: string
    email: string
    profileImage?: string
    phoneNumber?: string
}

export interface VenueListItem {
    _id: string
    venueName: string
    category: string
    status: "pending" | "approved" | "rejected" | "suspended"
    createdAt: string
    isActive: boolean
    location: {
        address: {
            place: string
            city: string
            district: string
            state: string
            pincode: string
        }
    }
    owner: VenueOwner
}

export interface VenueDetail extends VenueListItem {
    description: string
    capacity: number
    pricing: {
        pricePerHour: number
        pricePerDay: number
    }
    amenities: string[]
    photos: string[]
    availability: {
        workingDays: string[]
        openTime: string
        closeTime: string
    }
    rejectionReason?: string
    averageRating: number
    totalReviews: number
}

export interface PaginationMeta {
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPreviousPage: boolean
}