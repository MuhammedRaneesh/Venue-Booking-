import { useCallback, useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useAddVenueApiMutation } from "@/features/owner/ownerApi";
import { useLocationSearch } from "@/hooks/useLocationSearch";
import type { ApiErrorResponse, LatLngTuple, LocationSuggestion, VenueFormValues } from "../types/owner.type";
import { createVenueFormSchema, type VenueAddSchema } from "../validators/ownerValidation";
import { Clock, Navigation, Search, Trash2, Upload, Users, X, Plus } from "lucide-react";
import { categoryOptions, dayOptions, DEFAULT_POSITION, inputStyle, labelStyle, errorStyle, sectionCardStyle, stepBadgeStyle, type WorkingDay } from "../constants/venueConstants";
import { useVenueImages } from "@/hooks/useVenueImages";

function getApiErrorMessage(error: unknown): string {
    if (typeof error === "object" && error !== null) {
        const apiError = error as ApiErrorResponse;
        return apiError.data?.message || apiError.error || "Unable to create venue";
    }
    return "Unable to create venue";
}

function AddVenue() {
    const [addVenue, { isLoading }] = useAddVenueApiMutation();
    const [position, setPosition] = useState<LatLngTuple>(DEFAULT_POSITION);
    const [amenityInput, setAmenityInput] = useState("");
    const [amenities, setAmenities] = useState<string[]>([]);
    const img = useVenueImages();

    const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<VenueFormValues, undefined, VenueAddSchema>({
        resolver: zodResolver(createVenueFormSchema),
        mode: "onBlur",
    });

    const workingDays = watch("availability.workingDays") || [];

    const setAddressValues = useCallback((suggestion: LocationSuggestion) => {
        setValue("location.address.place", suggestion.address.place, { shouldDirty: true, shouldValidate: true });
        setValue("location.address.city", suggestion.address.city, { shouldDirty: true, shouldValidate: true });
        setValue("location.address.district", suggestion.address.district, { shouldDirty: true, shouldValidate: true });
        setValue("location.address.state", suggestion.address.state, { shouldDirty: true, shouldValidate: true });
        setValue("location.address.pincode", suggestion.address.pincode, { shouldDirty: true, shouldValidate: true });
    }, [setValue]);

    const onLocationResolved = useCallback((suggestion: LocationSuggestion, coordinates: LatLngTuple) => {
        setPosition(coordinates);
        setAddressValues(suggestion);
    }, [setAddressValues]);

    const { locationQuery, setLocationQuery, suggestions, isSearching, isLocating, searchError, clearSuggestions, handleUseCurrentLocation } = useLocationSearch(onLocationResolved);

    const selectLocation = (suggestion: LocationSuggestion) => {
        setPosition(suggestion.position);
        setAddressValues(suggestion);
        setLocationQuery(suggestion.label);
        clearSuggestions();
        toast.success("Location selected");
    };

    const handleDayToggle = (day: WorkingDay) => {
        const nextDays = workingDays.includes(day)
            ? workingDays.filter((d) => d !== day)
            : [...workingDays, day];
        setValue("availability.workingDays", nextDays, { shouldDirty: true, shouldValidate: true });
    };

    const addAmenity = () => {
        const trimmed = amenityInput.trim();
        if (!trimmed) return;
        if (amenities.includes(trimmed)) {
            toast.error("Amenity already added");
            return;
        }
        const updated = [...amenities, trimmed];
        setAmenities(updated);
        setValue("amenities", updated, { shouldDirty: true, shouldValidate: true });
        setAmenityInput("");
    };

    const removeAmenity = (item: string) => {
        const updated = amenities.filter(a => a !== item);
        setAmenities(updated);
        setValue("amenities", updated, { shouldDirty: true, shouldValidate: true });
    };

    const onSubmit: SubmitHandler<VenueAddSchema> = useCallback(async (data) => {
        try {
            const formData = new FormData();
            formData.append("data", JSON.stringify({
                venueName: data.venueName.trim(),
                description: data.description.trim(),
                category: data.category,
                capacity: data.capacity,
                pricing: {
                    pricePerHour: data.pricing?.pricePerHour || 0,
                    pricePerDay: data.pricing?.pricePerDay || 0,
                },
                location: {
                    type: "Point",
                    coordinates: [position[1], position[0]],
                    address: {
                        place: data.location.address.place.trim(),
                        city: data.location.address.city.trim(),
                        district: data.location.address.district.trim(),
                        state: data.location.address.state.trim(),
                        pincode: data.location.address.pincode.trim(),
                    },
                },
                availability: {
                    workingDays: data.availability.workingDays,
                    openTime: data.availability.openTime,
                    closeTime: data.availability.closeTime,
                },
                amenities,
                paymentPolicy: {
                    acceptsFullPayment: !!data.paymentPolicy?.acceptsFullPayment,
                }
            }));

            img.files.forEach((file) => formData.append("photos", file));

            const response = await addVenue(formData).unwrap();
            toast.success(response.message || "Venue created successfully");
            setPosition(DEFAULT_POSITION);
            setLocationQuery("");
            setAmenities([]);
            img.reset();
            setValue("photos", []);
        } catch (error) {
            toast.error(getApiErrorMessage(error));
        }
    }, [addVenue, position, amenities, img, setLocationQuery, setValue]);

    return (
        <div className="w-full min-h-screen bg-slate-50/50 p-6 lg:p-10 antialiased">
            <div className="max-w-5xl mx-auto space-y-6">

                <div className="flex flex-col gap-2">
                    <button type="button" className="flex items-center gap-1 text-xs font-semibold text-amber-600 hover:text-amber-700 transition w-fit">
                        ← Back to Venues
                    </button>
                    <div className="flex items-center justify-between mt-2">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Add New Venue</h1>
                            <p className="text-sm text-slate-500 mt-0.5">Fill in the details below to list your venue on BookMyVenue.</p>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className={sectionCardStyle}>
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                            <span className={stepBadgeStyle}>1</span>
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Basic Information</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className={labelStyle}>Venue Name <span className="text-red-500">*</span></label>
                                <input type="text" {...register("venueName")} className={inputStyle} placeholder="Enter venue name" />
                                {errors.venueName && <p className={errorStyle}>{errors.venueName.message}</p>}
                            </div>
                            <div>
                                <label className={labelStyle}>Category <span className="text-red-500">*</span></label>
                                <select {...register("category")} className={`${inputStyle} h-[46px]`}>
                                    {categoryOptions.map((category) => (
                                        <option key={category} value={category}>{category}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
                            <div className="md:col-span-8">
                                <label className={labelStyle}>Description <span className="text-red-500">*</span></label>
                                <textarea rows={4} {...register("description")} className={`${inputStyle} resize-none`} placeholder="Describe your venue..." maxLength={500} />
                                {errors.description && <p className={errorStyle}>{errors.description.message}</p>}
                            </div>
                            <div className="md:col-span-4">
                                <label className={labelStyle}>Capacity <span className="text-red-500">*</span></label>
                                <div className="relative flex items-center">
                                    <Users className="absolute left-3 h-4 w-4 text-gray-400" />
                                    <input type="number" min={1} {...register("capacity")} className={`${inputStyle} pl-10 pr-16`} placeholder="Max guests" />
                                    <span className="absolute right-3 text-xs font-semibold text-gray-400">Guests</span>
                                </div>
                                {errors.capacity && <p className={errorStyle}>{errors.capacity.message}</p>}
                            </div>
                        </div>
                    </div>

                    <div className={sectionCardStyle}>
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                            <span className={stepBadgeStyle}>2</span>
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Pricing Information</h2>
                        </div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className={labelStyle}>Price Per Hour <span className="text-red-500">*</span></label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-sm font-medium text-gray-500">₹</span>
                                    <input type="number" min={0} {...register("pricing.pricePerHour")} className={`${inputStyle} pl-8`} placeholder="0" />
                                </div>
                                {errors.pricing?.pricePerHour && <p className={errorStyle}>{errors.pricing.pricePerHour.message}</p>}
                            </div>
                            <div>
                                <label className={labelStyle}>Price Per Day <span className="text-red-500">*</span></label>
                                <div className="relative flex items-center">
                                    <span className="absolute left-3 text-sm font-medium text-gray-500">₹</span>
                                    <input type="number" min={0} {...register("pricing.pricePerDay")} className={`${inputStyle} pl-8`} placeholder="0" />
                                </div>
                                {errors.pricing?.pricePerDay && <p className={errorStyle}>{errors.pricing.pricePerDay.message}</p>}
                            </div>
                        </div>
                    </div>
                    <div className={sectionCardStyle}>
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                            <span className={stepBadgeStyle}>3</span>
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Location Information</h2>
                        </div>
                        <div className="flex flex-col gap-3 sm:flex-row items-end">
                            <div className="relative flex-1 w-full">
                                <label className={labelStyle}>Search Location <span className="text-red-500">*</span></label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                                    <input type="text" value={locationQuery} onChange={(e) => setLocationQuery(e.target.value)} placeholder="Search for address, area, city..." className={`${inputStyle} pl-10`} />
                                </div>
                                {(suggestions.length > 0 || isSearching || searchError) && (
                                    <div className="absolute z-30 mt-1 max-h-60 w-full overflow-auto rounded-lg border border-gray-100 bg-white shadow-lg">
                                        {isSearching && <p className="px-4 py-2.5 text-xs text-gray-500">Searching locations...</p>}
                                        {!isSearching && searchError && <p className="px-4 py-2.5 text-xs text-red-600">{searchError}</p>}
                                        {!isSearching && suggestions.map((s) => (
                                            <button key={s.id} type="button" onClick={() => selectLocation(s)} className="block w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-slate-50">
                                                {s.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button type="button" onClick={handleUseCurrentLocation} disabled={isLocating} className="flex h-[46px] items-center gap-2 rounded-lg border border-amber-200 bg-amber-50/40 hover:bg-amber-50 px-4 text-xs font-bold text-amber-700 transition-colors disabled:opacity-60 whitespace-nowrap w-full sm:w-auto justify-center">
                                <Navigation className="h-3.5 w-3.5 fill-amber-700" /> {isLocating ? "Locating..." : "Locate Me"}
                            </button>
                        </div>
                        <div>
                            <label className={labelStyle}>Full Address <span className="text-red-500">*</span></label>
                            <input type="text" {...register("location.address.place")} className={inputStyle} placeholder="Enter full address" />
                            {errors.location?.address?.place && <p className={errorStyle}>{errors.location.address.place.message}</p>}
                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                            <div>
                                <label className={labelStyle}>City <span className="text-red-500">*</span></label>
                                <input type="text" {...register("location.address.city")} className={inputStyle} placeholder="City" />
                                {errors.location?.address?.city && <p className={errorStyle}>{errors.location.address.city.message}</p>}
                            </div>
                            <div>
                                <label className={labelStyle}>District <span className="text-red-500">*</span></label>
                                <input type="text" {...register("location.address.district")} className={inputStyle} placeholder="District" />
                                {errors.location?.address?.district && <p className={errorStyle}>{errors.location.address.district.message}</p>}
                            </div>
                            <div>
                                <label className={labelStyle}>State <span className="text-red-500">*</span></label>
                                <input type="text" {...register("location.address.state")} className={inputStyle} placeholder="State" />
                                {errors.location?.address?.state && <p className={errorStyle}>{errors.location.address.state.message}</p>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 items-start">
                            <div>
                                <label className={labelStyle}>Pincode <span className="text-red-500">*</span></label>
                                <input type="text" maxLength={6} {...register("location.address.pincode")} className={inputStyle} placeholder="Pincode" />
                                {errors.location?.address?.pincode && <p className={errorStyle}>{errors.location.address.pincode.message}</p>}
                            </div>
                            <div className="rounded-lg border border-amber-100 bg-amber-50/20 p-3 flex items-start gap-2.5 mt-6">
                                <div className="h-2 w-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                                <p className="text-[11px] text-amber-800 font-medium">
                                    <span className="font-bold block text-amber-900 uppercase tracking-wider text-[9px] mb-0.5">Location will be saved as:</span>
                                    Longitude: {position[1].toFixed(4)}, Latitude: {position[0].toFixed(4)}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className={sectionCardStyle}>
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                            <span className={stepBadgeStyle}>4</span>
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Availability</h2>
                        </div>
                        <div>
                            <label className={labelStyle}>Working Days <span className="text-red-500">*</span></label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {dayOptions.map((day) => {
                                    const isSelected = workingDays.includes(day.value);
                                    return (
                                        <button key={day.value} type="button" onClick={() => handleDayToggle(day.value)}
                                            className={`h-9 w-12 text-xs font-semibold rounded-lg border transition-all ${isSelected ? "bg-amber-500 border-amber-500 text-white shadow-sm" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
                                            {day.label}
                                        </button>
                                    );
                                })}
                            </div>
                            <p className="text-[11px] text-gray-400 font-medium mt-2">Select all days when your venue is available</p>
                            {errors.availability?.workingDays && <p className={errorStyle}>{errors.availability.workingDays.message}</p>}
                        </div>
                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                            <div>
                                <label className={labelStyle}>Opening Time <span className="text-red-500">*</span></label>
                                <div className="relative flex items-center">
                                    <Clock className="absolute left-3 h-4 w-4 text-gray-400" />
                                    <input type="time" {...register("availability.openTime")} className={`${inputStyle} pl-10`} />
                                </div>
                                {errors.availability?.openTime && <p className={errorStyle}>{errors.availability.openTime.message}</p>}
                            </div>
                            <div>
                                <label className={labelStyle}>Closing Time <span className="text-red-500">*</span></label>
                                <div className="relative flex items-center">
                                    <Clock className="absolute left-3 h-4 w-4 text-gray-400" />
                                    <input type="time" {...register("availability.closeTime")} className={`${inputStyle} pl-10`} />
                                </div>
                                {errors.availability?.closeTime && <p className={errorStyle}>{errors.availability.closeTime.message}</p>}
                            </div>
                        </div>
                    </div>
                    <div className={sectionCardStyle}>
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                            <span className={stepBadgeStyle}>5</span>
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Amenities</h2>
                        </div>
                        <div>
                            <label className={labelStyle}>Add Amenity <span className="text-red-500">*</span></label>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={amenityInput}
                                    onChange={(e) => setAmenityInput(e.target.value)}
                                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addAmenity(); } }}
                                    className={inputStyle}
                                    placeholder="e.g. Parking, WiFi, Stage..."
                                />
                                <button type="button" onClick={addAmenity} className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-white whitespace-nowrap transition-colors">
                                    <Plus size={14} /> Add
                                </button>
                            </div>
                            <p className="text-[11px] text-gray-400 mt-1.5">Press Enter or click Add</p>
                            {errors.amenities && <p className={errorStyle}>{errors.amenities.message}</p>}
                        </div>
                        {amenities.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-1">
                                {amenities.map((item) => (
                                    <span key={item} className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-800">
                                        {item}
                                        <button type="button" onClick={() => removeAmenity(item)} className="text-amber-500 hover:text-red-400 transition-colors">
                                            <X size={12} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className={sectionCardStyle}>
                        <div className="flex items-center gap-3 border-b border-gray-100 pb-3">
                            <span className={stepBadgeStyle}>6</span>
                            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Venue Photos</h2>
                        </div>
                        <div className="group relative flex flex-col items-center justify-center rounded-xl border border-dashed border-amber-300 bg-amber-50/5 p-8 transition-colors hover:bg-amber-50/20 text-center">
                            <input ref={img.inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={(e) => img.onFileChange(e, (files) => setValue("photos", files, { shouldDirty: true, shouldValidate: true }))} className="absolute inset-0 cursor-pointer opacity-0" />
                            <Upload className="mb-2.5 h-7 w-7 text-amber-600" />
                            <p className="text-sm font-bold text-amber-900">Upload Photos</p>
                            <p className="mt-1 text-xs text-gray-400 font-medium">Click or drag photos here</p>
                            <p className="text-[10px] font-bold text-slate-500 mt-2 bg-slate-100 px-2 py-0.5 rounded-md">{img.totalCount} photos selected</p>
                        </div>
                        {img.previewUrls.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 mt-2">
                                {img.previewUrls.map((src, index) => (
                                    <div key={src} className="group relative aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
                                        <img src={src} alt={`Preview ${index + 1}`} className="h-full w-full object-cover" />
                                        <button type="button" onClick={() => img.removeNewFile(index, (files) => setValue("photos", files, { shouldDirty: true, shouldValidate: true }))} className="absolute right-2 top-2 flex h-7 w-8 items-center justify-center rounded-full bg-white text-red-600 opacity-0 shadow transition hover:bg-red-50 group-hover:opacity-100">
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200/60">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all flex items-center justify-center min-w-[140px]"
                        >
                            {isLoading ? "Publishing..." : "Publish Venue"}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}

export default AddVenue;
