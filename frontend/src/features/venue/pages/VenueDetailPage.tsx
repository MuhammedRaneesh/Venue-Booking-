import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { useState } from "react";
import { useGetVenueDetailsQuery } from "@/features/Venue/venueApi";
import { useGetAvailabilityQuery } from "@/features/booking/bookingApi";
import { useGetWishlistQuery, useAddWishlistMutation, useRemoveWishlistMutation } from "@/features/Venue/wishlistApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  Heart, MapPin, Users, Check,
  CalendarIcon, ShieldCheck, ArrowLeft, Clock
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { toast } from "sonner";

function formatTimeLabel(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}

function VenueDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetVenueDetailsQuery(id);

  const { data: wishlistData } = useGetWishlistQuery(undefined);
  const [addWishlist] = useAddWishlistMutation();
  const [removeWishlist] = useRemoveWishlistMutation();

  const isWishlisted = wishlistData?.data?.some((item: any) => item.venueId?._id === id);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [guestCount, setGuestCount] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [formError, setFormError] = useState("");
  const [bookingType, setBookingType] = useState<"hourly" | "full-day">("hourly");
  const user = useSelector((state: RootState) => state.auth.user);

  const { data: availabilityData, isLoading: isChecking } = useGetAvailabilityQuery(
    { venueId: id as string, date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "" },
    { skip: !selectedDate }
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcf9f8]">
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 md:px-16 py-8 animate-pulse space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[400px]">
            <div className="lg:col-span-2 bg-slate-200 rounded-3xl h-full" />
            <div className="hidden lg:grid grid-rows-2 gap-4 h-full">
              <div className="bg-slate-200 rounded-3xl" />
              <div className="bg-slate-200 rounded-3xl" />
            </div>
          </div>
          <div className="h-8 bg-slate-200 rounded w-1/3" />
        </div>
      </div>
    );
  }

  if (isError || !data?.venue) {
    return (
      <div className="min-h-screen bg-[#fcf9f8]">
        <Navbar />
        <div className="max-w-xl mx-auto px-6 py-20 text-center">
          <p className="text-[#2e0052] font-semibold text-lg">We couldn't track down this venue configuration.</p>
          <div className="mt-6 flex gap-4 justify-center">
            <button onClick={() => refetch()} className="px-6 py-2.5 rounded-xl bg-[#2e0052] text-white text-sm font-bold shadow hover:bg-[#400073]">
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const venue = data.venue;
  const photos = venue.photos ?? [];
  const totalPhotosCount = photos.length;

  const address = venue.location?.address ?? {};
  const microAddress = [address.place, address.city].filter(Boolean).join(", ");
  const fullDistrictAddress = [address.city, address.district, "Kerala"].filter(Boolean).join(", ");
  const amenities = venue.amenities ?? [];

  const slots = availabilityData?.slots || [];
  const isFullDayAvailable = selectedDate ? (slots.length > 0 && !slots.some(s => s.booked)) : true;

  const availableStartSlots = slots.filter(s => !s.booked);
  let availableEndTimes: string[] = [];

  if (startTime) {
    const startIndex = slots.findIndex(s => s.start === startTime);
    if (startIndex !== -1) {
      for (let i = startIndex; i < slots.length; i++) {
        if (slots[i].booked) break;
        availableEndTimes.push(slots[i].end);
      }
    }
  }

  const pricePerHour = venue.pricing?.pricePerHour || 0;
  const pricePerDay = venue.pricing?.pricePerDay || 0;

  let hours = 0;
  if (bookingType === "hourly" && startTime && endTime) {
    const startHour = Number(startTime.split(":")[0]);
    const endHour = Number(endTime.split(":")[0]);
    hours = endHour - startHour;
  }

  const totalAmount = bookingType === "hourly" ? hours * pricePerHour : pricePerDay;

  function validateSelection() {
    if (!selectedDate) return "Please pick an event date.";
    if (!guestCount || Number(guestCount) <= 0) return "Please enter the number of guests.";
    if (Number(guestCount) > venue.capacity) return `This venue's max capacity is ${venue.capacity} guests.`;
    if (bookingType === "hourly" && (!startTime || !endTime)) return "Please select a start and end time.";
    if (bookingType === "full-day" && !isFullDayAvailable) return "This venue is not available for a full day booking on the selected date.";
    return "";
  }

  async function handleCheckAvailability() {
    const error = validateSelection();
    if (error) {
      setFormError(error);
      return;
    }
    if (!user) {
      toast.error("login first");
      return;
    }
    setFormError("");

    const payload: Record<string, any> = { venueId: id, date: format(selectedDate as Date, "yyyy-MM-dd"), guestCount: Number(guestCount), bookingType };
    if (bookingType === "hourly") {
      payload.startTime = startTime;
      payload.endTime = endTime;
    }

    const query = new URLSearchParams({
      date: payload.date,
      guests: String(payload.guestCount),
      type: bookingType,
      amount: String(totalAmount),
      ...(bookingType === "hourly" ? { start: startTime, end: endTime } : {}),
    });
    navigate(`/venues/${id}/book?${query.toString()}`);
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-[Manrope,sans-serif] pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#2e0052] mb-6 group transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Venues
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 relative">
          <div className="lg:col-span-2 relative h-[300px] sm:h-[460px] rounded-[2rem] overflow-hidden group shadow-sm bg-slate-100 border border-slate-200/50">
            <img src={photos[0] ?? "/placeholder-venue.jpg"} alt={venue.venueName} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-700" />
            <button
              onClick={async () => {
                if (!user) {
                  toast.error("Please login to manage wishlist");
                  return;
                }
                try {
                  if (isWishlisted) {
                    await removeWishlist(id).unwrap();
                    toast.success("Removed from wishlist");
                  } else {
                    await addWishlist(id).unwrap();
                    toast.success("Added to wishlist");
                  }
                } catch (error: any) {
                  toast.error(error?.data?.message || "Something went wrong");
                }
              }}
              className="absolute top-6 left-6 w-11 h-11 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-md hover:bg-white hover:scale-105 transition-all"
            >
              <Heart size={18} className={isWishlisted ? "fill-[#ff385c] text-[#ff385c]" : "text-slate-700"} />
            </button>
          </div>

          <div className="hidden lg:grid grid-rows-2 gap-4 h-[460px]">
            <div className="relative rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-200/50">
              <img src={photos[1] ?? photos[0] ?? "/placeholder-venue.jpg"} alt="Secondary view" className="w-full h-full object-cover" />
            </div>
            <div className="relative rounded-[2rem] overflow-hidden bg-slate-100 border border-slate-200/50">
              <img src={photos[2] ?? photos[0] ?? "/placeholder-venue.jpg"} alt="Tertiary view" className="w-full h-full object-cover" />
              <button className="absolute bottom-6 right-6 bg-white/95 backdrop-blur-sm border border-slate-200 text-slate-800 text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5">
                View All Photos ({totalPhotosCount})
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
          <div className="space-y-10">
            <div className="border-b border-slate-200/60 pb-6">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h1 className="font-[EB_Garamond,serif] text-3xl sm:text-4xl font-medium text-[#2e0052] tracking-tight">{venue.venueName}</h1>
                <Check size={16} className="text-emerald-600 bg-emerald-50 rounded-full p-0.5 w-5 h-5 shrink-0" />
              </div>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm font-semibold text-slate-500">
                <span className="flex items-center gap-1.5"><MapPin size={16} className="text-[#D4AF37]" /> {microAddress}, {fullDistrictAddress}</span>
                <span className="flex items-center gap-1.5"><Users size={16} className="text-[#D4AF37]" /> {venue.capacity} Guests</span>
                <span className="flex items-center gap-1.5 bg-purple-50 text-[#2e0052] px-3 py-1 rounded-full text-xs font-bold">{venue.category}</span>
              </div>
            </div>

            {venue.description && (
              <div className="space-y-3">
                <h2 className="font-[EB_Garamond,serif] text-2xl font-medium text-[#2e0052]">About The Venue</h2>
                <p className="text-sm md:text-base text-slate-600 leading-relaxed whitespace-pre-line font-light">{venue.description}</p>
              </div>
            )}

            {amenities.length > 0 && (
              <div className="space-y-4 border-t border-slate-200/60 pt-8">
                <h2 className="font-[EB_Garamond,serif] text-2xl font-medium text-[#2e0052]">Amenities & Facilities</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {amenities.map((amenity: any) => (
                    <div key={amenity} className="flex items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 flex items-center justify-center text-[#2e0052]">
                        <Check size={16} strokeWidth={3} />
                      </div>
                      <span className="text-sm font-semibold text-slate-700">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-purple-950/5 p-6 space-y-6">
              <Tabs value={bookingType} onValueChange={(val) => {
                setBookingType(val as any);
                setStartTime("");
                setEndTime("");
                setFormError("");
              }} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4 bg-slate-100/50 p-1 rounded-xl">
                  <TabsTrigger value="hourly" className="rounded-lg text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-[#2e0052] data-[state=active]:shadow-sm">Hourly</TabsTrigger>
                  <TabsTrigger value="full-day" className="rounded-lg text-sm font-bold data-[state=active]:bg-white data-[state=active]:text-[#2e0052] data-[state=active]:shadow-sm">Full Day</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-[#2e0052] tracking-tight">
                  Rs.{(bookingType === "hourly" ? pricePerHour : pricePerDay).toLocaleString("en-IN")}
                </span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  / {bookingType === "hourly" ? "Hour" : "Event Day"}
                </span>
              </div>

              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="space-y-2 flex flex-col">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Event Date</label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-medium h-12 rounded-xl border-slate-200 bg-slate-50/50 px-4 hover:bg-slate-50 hover:border-purple-900/40 focus:ring-2 focus:ring-purple-900/20",
                          !selectedDate && "text-slate-400"
                        )}
                      >
                        <CalendarIcon className="mr-3 h-4 w-4 text-slate-400" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>Pick an event date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 rounded-2xl border border-slate-150 shadow-xl bg-white" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(date) => {
                          setSelectedDate(date);
                          setStartTime("");
                          setEndTime("");
                        }}
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        className="p-3 font-[Manrope]"
                      />
                    </PopoverContent>
                  </Popover>
                  {isChecking && <span className="text-xs text-slate-400">Checking availability...</span>}
                </div>

                {bookingType === "hourly" && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Start Time</label>
                      <div className="relative bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 px-3 hover:border-purple-900/40 transition-colors focus-within:ring-2 focus-within:ring-purple-900/20">
                        <Clock size={16} className="text-slate-400 shrink-0" />
                        <select
                          value={startTime}
                          onChange={(e) => {
                            setStartTime(e.target.value);
                            setEndTime("");
                          }}
                          disabled={!selectedDate || availableStartSlots.length === 0}
                          className="w-full bg-transparent text-sm outline-none text-slate-800 font-medium py-3 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Select</option>
                          {availableStartSlots.map((s) => (
                            <option key={s.start} value={s.start}>{formatTimeLabel(s.start)}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">End Time</label>
                      <div className="relative bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2 px-3 hover:border-purple-900/40 transition-colors focus-within:ring-2 focus-within:ring-purple-900/20">
                        <Clock size={16} className="text-slate-400 shrink-0" />
                        <select
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          disabled={!startTime || availableEndTimes.length === 0}
                          className="w-full bg-transparent text-sm outline-none text-slate-800 font-medium py-3 appearance-none disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <option value="">Select</option>
                          {availableEndTimes.map((t) => (
                            <option key={t} value={t}>{formatTimeLabel(t)}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Estimated Guests</label>
                  <div className="relative bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center gap-3 hover:border-purple-900/40 transition-colors focus-within:ring-2 focus-within:ring-purple-900/20">
                    <Users size={18} className="text-slate-400" />
                    <input
                      type="number"
                      placeholder="Select Guests quantity"
                      value={guestCount}
                      onChange={e => setGuestCount(e.target.value)}
                      max={venue.capacity}
                      min={1}
                      className="w-full bg-transparent text-sm outline-none text-slate-800 font-medium placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {formError && (
                <p className="text-xs font-semibold text-red-600 bg-red-50 border border-red-100 rounded-xl px-3 py-2">
                  {formError}
                </p>
              )}

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-3 mt-4 shadow-sm">
                <h3 className="font-bold text-[#2e0052] text-sm mb-2 border-b border-slate-200 pb-2">Booking Summary</h3>
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Type</span>
                  <span className="text-slate-800">{bookingType === "hourly" ? "Hourly Booking" : "Full Day Booking"}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Date</span>
                  <span className="text-slate-800">{selectedDate ? format(selectedDate, "PPP") : "Not selected"}</span>
                </div>
                {bookingType === "hourly" && (
                  <div className="flex justify-between text-xs font-semibold text-slate-600">
                    <span>Time</span>
                    <span className="text-slate-800">
                      {startTime && endTime ? `${formatTimeLabel(startTime)} - ${formatTimeLabel(endTime)}` : "Not selected"}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-xs font-semibold text-slate-600">
                  <span>Guests</span>
                  <span className="text-slate-800">{guestCount || "Not specified"}</span>
                </div>

                <div className="border-t border-slate-200 pt-3 mt-3 space-y-2">
                  {bookingType === "hourly" ? (
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>{hours} Hours x Rs.{pricePerHour.toLocaleString("en-IN")}</span>
                      <span>Rs.{totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  ) : (
                    <div className="flex justify-between text-xs font-semibold text-slate-600">
                      <span>1 Day x Rs.{pricePerDay.toLocaleString("en-IN")}</span>
                      <span>Rs.{totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm font-bold text-[#2e0052] pt-2">
                    <span>Total Amount</span>
                    <span>Rs.{totalAmount.toLocaleString("en-IN")}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 bg-purple-50/50 rounded-2xl p-4 border border-purple-100 mt-2">
                <div className="flex gap-2 text-xs text-purple-950 font-semibold">
                  <ShieldCheck size={16} className="text-[#2e0052] shrink-0 mt-0.5" />
                  <div>
                    <p>Instant Protection Guarantee</p>
                    <p className="font-normal text-slate-500 mt-0.5">Secure escrow system managed via BookMyVenue verification network.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckAvailability}
                className="w-full bg-[#2e0052] hover:bg-[#400073] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold py-4 rounded-xl shadow-lg transition-all active:scale-[0.99] tracking-wide uppercase mt-4"
              >
                Proceed to Book
              </button>
            </div>
          </aside>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default VenueDetailPage;
