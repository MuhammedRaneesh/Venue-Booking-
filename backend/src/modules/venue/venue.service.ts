import { VenueQuery, CreateVenue, UpdateVenue } from "./venue.validation.js"
import { Venue } from "./venue.schema.js"
import { OwnerProfile } from "../owner/owner.schema.js"


export const getAllVenues = async (data: VenueQuery) => {

    const {
        search, category, city, district,
        minCapacity, maxCapacity,
        minPrice, maxPrice,
        amenities, sort, limit, page
    } = data;


    const filter: Record<string, any> = {
        status: "approved",
        isActive: true,
    };

    if (search) {
        filter.$or = [
            { venueName: { $regex: search, $options: "i", }, },
            { description: { $regex: search, $options: "i", }, },
        ];
    }

    if (category) {
        filter.category = category;
    }

    if (city) {
        filter["location.address.city"] = { $regex: city, $options: "i", };
    }

    if (district) {
        filter["location.address.district"] = { $regex: district, $options: "i", };
    }

    if (minCapacity !== undefined || maxCapacity !== undefined) {
        filter.capacity = {};
        if (minCapacity !== undefined) filter.capacity.$gte = minCapacity;
        if (maxCapacity !== undefined) filter.capacity.$lte = maxCapacity;
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
        filter["pricing.pricePerDay"] = {};
        if (minPrice !== undefined) filter["pricing.pricePerDay"].$gte = minPrice;
        if (maxPrice !== undefined) filter["pricing.pricePerDay"].$lte = maxPrice;
    }

    if (amenities) {
        const amenitiesList = amenities.split(",").map(a => a.trim());
        if (amenitiesList.length > 0) {
            filter.amenities = { $all: amenitiesList };
        }
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort) {
        switch (sort) {
            case "price_asc":
                sortOption = { "pricing.pricePerDay": 1 };
                break;
            case "price_desc":
                sortOption = { "pricing.pricePerDay": -1 };
                break;
            case "rating":
                sortOption = { averageRating: -1 };
                break;
            case "newest":
                sortOption = { createdAt: -1 };
                break;
        }
    }
    const Page = Number(page);
    const Limit = Number(limit);
    const Skip = (Page - 1) * Limit
    const totalCount = await Venue.countDocuments(filter);
    const venues = await Venue.find(filter).sort(sortOption as any).skip(Skip).limit(Limit)


    return {
        venues,
        totalCount,
        pagination: {
            currentPage: Page,
            Limit,
            totalPages: Math.ceil(totalCount / Limit),
            hasNextPage: Page < Math.ceil(totalCount / Limit),
            hasPreviousPage: Page > 1,
        }
    };
};


export const getvenueById = async (venueId: string) => {

    const venue = await Venue.findById(venueId)

    if (!venue) throw new Error("venue not found")

    if (venue.status !== "approved" || !venue.isActive) {
        throw Error("Venue not found")

    }
    return venue
}
export const createVenue = async (ownerId: string, data: CreateVenue, photo: string[]) => {

    const ownerProfile = await OwnerProfile.findOne({ user: ownerId })
    if (!ownerProfile) throw new Error("Owner profile not found")
    const existing = await Venue.findOne({
        owner: ownerId,
        venueName: { $regex: `^${data.venueName.trim()}$`, }
    })

    if (existing) throw new Error("You already have a venue with this name")

    const venue = await Venue.create({
        ...data,
        photos: photo,
        owner: ownerId,
        status: "pending",
    })

    return venue
}

export const updateVenue = async (venueId: string, data: UpdateVenue, ownerId: string, photo: string[]) => {

    const existingVenue = await Venue.findById(venueId)
    if (!existingVenue) throw new Error("venue not found")

    const ownerCheck = String(existingVenue.owner) === ownerId
    if (!ownerCheck) throw new Error("You are not authorized to edit this venue ")
    const updateData: Record<string, any> = {
        ...data,
    }

    const finalPhotos: string[] = [];
    if (data.existingPhotos && data.existingPhotos.length > 0) {
        finalPhotos.push(...data.existingPhotos);
    }
    if (photo && photo.length > 0) {
        finalPhotos.push(...photo);
    }
    
    if (finalPhotos.length > 0) {
        updateData.photos = finalPhotos;
    } else {
        throw new Error("At least one photo is required");
    }

    const updatedVenue = await Venue.findByIdAndUpdate(venueId, updateData, {
        new: true,
        runValidators: true,
    })

    return updatedVenue
}

export const ownerVenue = async (venueId: string) => {
    const venue = await Venue.findById(venueId)
    if (!venue) throw new Error("venue not found")
    return venue
}

export const ownerVenueDelete = async (venueId: string, ownerId: string) => {
    const existing = await Venue.find({ _id: venueId, owner: ownerId })

    if (!existing) {
        throw new Error("venue not found ")
    }

    const venue = await Venue.findByIdAndUpdate(venueId, {
        isActive: false,
    }, {
        returnDocument : "after",
    })
    return { message: "delete done " }
}