import { useEffect, useState, useCallback } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useGetVenueByIdQuery, useUpdateVenueMutation } from "@/features/owner/ownerApi";
import { useVenueImages } from "@/hooks/useVenueImages";
import { createVenueFormSchema } from "../validators/ownerValidation";
import { Clock, Trash2, Upload, Users, X, Plus, Edit2 } from "lucide-react";
import {
  categoryOptions, dayOptions,
  inputStyle, labelStyle, errorStyle, sectionCardStyle, stepBadgeStyle,
  type WorkingDay,
} from "../constants/venueConstants";
import { z } from "zod";

const editVenueSchema = createVenueFormSchema.extend({
  photos: z.array(z.instanceof(File)).max(10, "Maximum 10 images allowed").optional().default([]),
});
type EditVenueFormValuesIn = z.input<typeof editVenueSchema>;
type EditVenueFormValuesOut = z.infer<typeof editVenueSchema>;

function EditVenue({ venueId }: { venueId: string }) {

  const [open, setOpen] = useState(false);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const { data: venueData, isLoading: isFetching, isError: fetchError } = useGetVenueByIdQuery(venueId, { skip: !open });
  const [updateVenue, { isLoading: isUpdating }] = useUpdateVenueMutation();

  const [loadedPhotos, setLoadedPhotos] = useState<string[]>([]);
  const img = useVenueImages(loadedPhotos);

  const [amenityInput, setAmenityInput] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);

  const {
    register, handleSubmit, setValue, watch, reset,
    formState: { errors },
  } = useForm<EditVenueFormValuesIn, undefined, EditVenueFormValuesOut>({
    resolver: zodResolver(editVenueSchema),
    mode: "onBlur",
  });


  const workingDays = watch("availability.workingDays") || [];


  useEffect(() => {
    if (!venueData?.venue) return;
    const v = venueData.venue as any;

    if (v.photos?.length) {
      setLoadedPhotos(v.photos);
    }


    reset({
      venueName: v.venueName ?? "",
      description: v.description ?? "",
      category: v.category,
      capacity: v.capacity,
      pricing: { pricePerHour: v.pricing?.pricePerHour ?? 0, pricePerDay: v.pricing?.pricePerDay ?? 0 },
      location: {
        address: {
          place: v.location?.address?.place ?? "",
          city: v.location?.address?.city ?? "",
          district: v.location?.address?.district ?? "",
          state: v.location?.address?.state ?? "",
          pincode: v.location?.address?.pincode ?? "",
        },
      },
      availability: {
        workingDays: v.availability?.workingDays ?? [],
        openTime: v.availability?.openTime ?? "",
        closeTime: v.availability?.closeTime ?? "",
      },
      amenities: v.amenities ?? [],
      paymentPolicy: {

        acceptsFullPayment: v.paymentPolicy?.acceptsFullPayment ?? true,
      },
      photos: [],
    });
    setAmenities(v.amenities ?? []);
  }, [venueData, reset]); 



  const handleDayToggle = (day: WorkingDay) => {
    const next = workingDays.includes(day)
      ? workingDays.filter((d) => d !== day)
      : [...workingDays, day];
    setValue("availability.workingDays", next, { shouldDirty: true, shouldValidate: true });
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

  const onSubmit: SubmitHandler<EditVenueFormValuesOut> = useCallback(async (data) => {
    try {

      const payload: any = {
        venueName: data.venueName.trim(),
        description: data.description.trim(),
        category: data.category,
        capacity: data.capacity,
        pricing: { pricePerHour: data.pricing?.pricePerHour || 0, pricePerDay: data.pricing?.pricePerDay || 0 },
        location: {
          type: (venueData?.venue as any)?.location?.type || "Point",
          coordinates: (venueData?.venue as any)?.location?.coordinates || [0, 0],
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
        amenities: data.amenities || [],
        paymentPolicy: {

          acceptsFullPayment: !!data.paymentPolicy?.acceptsFullPayment,
        },
        existingPhotos: img.existingPhotos,
      };

      const formData = new FormData();
      formData.append("data", JSON.stringify(payload));
      
      if (data.photos && data.photos.length > 0) {
        Array.from(data.photos).forEach((file) => {
          formData.append("photos", file);
        });
      }

      const response = await updateVenue({ venueId, data: formData }).unwrap();
      toast.success(response.message || "Venue updated successfully");
      setOpen(false);
    } catch (error : any) {
      toast.error(typeof error === "object" && error !== null && "data" in error ? (error as any).data?.message || "Unable to update venue" : "Unable to update venue");
    }
  }, [updateVenue, venueId, img.existingPhotos]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="p-1.5 text-stone-500 hover:bg-[#F5EFE4] hover:text-[#C29F47] border border-stone-200/60 rounded-xl transition shadow-2xs"
        title="Edit Venue Details"
      >
        <Edit2 size={13} />
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4 py-6 text-left" onClick={() => setOpen(false)}>
          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between px-8 py-5 border-b border-gray-100 shrink-0">
              <div>
                <h1 className="text-xl font-bold text-slate-900">Edit Venue</h1>
                <p className="text-xs text-slate-500 mt-0.5">Update the details below to modify your venue listing.</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1 px-8 py-6">
              {isFetching ? (
                <div className="w-full flex items-center justify-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-8 w-8 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
                    <p className="text-sm font-semibold text-slate-500">Loading venue details...</p>
                  </div>
                </div>
              ) : fetchError ? (
                <div className="w-full flex items-center justify-center py-20">
                  <div className="text-center space-y-3">
                    <p className="text-lg font-bold text-slate-800">Failed to load venue</p>
                    <button onClick={() => setOpen(false)} className="rounded-lg bg-amber-500 px-5 py-2 text-sm font-bold text-white hover:bg-amber-600 transition">Close</button>
                  </div>
                </div>
              ) : (
                <form id={`edit-venue-form-${venueId}`} onSubmit={handleSubmit(onSubmit, (err) => {
                  console.error("Form Validation Errors:", err);
                  toast.error("Please fix the validation errors before saving.");
                })} className="space-y-6">


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
                <select {...register("category")} className={`${inputStyle} h-[46px] appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%3E%3Cpath%20d%3D%22M7%209l3%203%203-3%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat`}>
                  {categoryOptions.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
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
            <div>
              <label className={labelStyle}>Pincode <span className="text-red-500">*</span></label>
              <input type="text" maxLength={6} {...register("location.address.pincode")} className={inputStyle} placeholder="000000" />
              {errors.location?.address?.pincode && <p className={errorStyle}>{errors.location.address.pincode.message}</p>}
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
            
            {/* Input */}
            <div>
              <label className={labelStyle}>Add Amenity <span className="text-red-500">*</span></label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={amenityInput}
                  onChange={(e) => setAmenityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addAmenity();
                    }
                  }}
                  className={inputStyle}
                  placeholder="e.g. Parking, WiFi, Stage..."
                />
                <button
                  type="button"
                  onClick={addAmenity}
                  className="flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 px-4 py-2.5 text-xs font-bold text-white whitespace-nowrap transition-colors"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              <p className="text-[11px] text-gray-400 mt-1.5">Press Enter or click Add to add an amenity</p>
              {errors.amenities && <p className={errorStyle}>{errors.amenities.message}</p>}
            </div>

            {/* Tags */}
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-1">
                {amenities.map((item) => (
                  <span
                    key={item}
                    className="flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-semibold text-amber-800"
                  >
                    {item}
                    <button
                      type="button"
                      onClick={() => removeAmenity(item)}
                      className="text-amber-500 hover:text-red-400 transition-colors"
                    >
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
              <input
                ref={img.inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                onChange={(e) => img.onFileChange(e, (files) => setValue("photos", files, { shouldDirty: true, shouldValidate: true }))}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <Upload className="mb-2.5 h-7 w-7 text-amber-600" />
              <p className="text-sm font-bold text-amber-900">Upload New Photos</p>
              <p className="mt-1 text-xs text-gray-400 font-medium">Click or drag photos here</p>
              <p className="text-[10px] font-bold text-slate-500 mt-2 bg-slate-100 px-2 py-0.5 rounded-md">{img.totalCount} photos</p>
            </div>

            {img.existingPhotos.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">Current Photos</p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
                  {img.existingPhotos.map((src, idx) => (
                    <div key={src} className="group relative aspect-video overflow-hidden rounded-lg border border-gray-200 bg-gray-50 shadow-sm">
                      <img src={src} alt={`Photo ${idx + 1}`} className="h-full w-full object-cover" />
                      <button type="button" onClick={() => img.removeExistingPhoto(idx)} className="absolute right-2 top-2 flex h-7 w-8 items-center justify-center rounded-full bg-white text-red-600 opacity-0 shadow transition hover:bg-red-50 group-hover:opacity-100">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {img.previewUrls.length > 0 && (
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">New Photos</p>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5">
                  {img.previewUrls.map((src, idx) => (
                    <div key={src} className="group relative aspect-video overflow-hidden rounded-lg border border-amber-200 bg-gray-50 shadow-sm">
                      <img src={src} alt={`New ${idx + 1}`} className="h-full w-full object-cover" />
                      <button type="button" onClick={() => img.removeNewFile(idx, (files) => setValue("photos", files, { shouldDirty: true, shouldValidate: true }))} className="absolute right-2 top-2 flex h-7 w-8 items-center justify-center rounded-full bg-white text-red-600 opacity-0 shadow transition hover:bg-red-50 group-hover:opacity-100">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>




                </form>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 px-8 py-4 border-t border-gray-100 bg-white shrink-0">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                form={`edit-venue-form-${venueId}`}
                disabled={isUpdating || isFetching}
                className="rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-amber-300 px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-all flex items-center justify-center min-w-[140px]"
              >
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default EditVenue;
