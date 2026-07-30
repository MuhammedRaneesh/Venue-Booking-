import { useState } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { useGetVenueDetailsQuery } from "@/api/venueApi";
import { useCreateBookingMutation } from "@/api/bookingApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { MapPin, CheckCircle2, ArrowLeft } from "lucide-react";

export default function BookingPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const bookingDate = searchParams.get("date") || "";
  const bookingType = (searchParams.get("type") as "hourly" | "full-day") || "hourly";
  const guestCount = parseInt(searchParams.get("guests") || "0", 10);
  const startTime = searchParams.get("start") || "";
  const endTime = searchParams.get("end") || "";
  const baseAmount = parseFloat(searchParams.get("amount") || "0");
  const platformFee = Math.round(baseAmount * 0.08);
  const totalAmount = baseAmount + platformFee;

  const { data: venueResponse, isLoading: isVenueLoading, isError } = useGetVenueDetailsQuery(id);
  const venue = venueResponse?.venue;

  const [createBooking, { isLoading: isBookingLoading }] = useCreateBookingMutation();
  const user = useSelector((state: RootState) => state.auth.user);

  const [eventType, setEventType] = useState<string>("");
  const [specialRequest, setSpecialRequest] = useState<string>("");

  const [phoneNumber, setPhoneNumber] = useState(
    user?.phoneNumber || ""
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  if (isVenueLoading) {
    return (
      <div className="min-h-screen bg-[#fcf9f8]">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <p className="text-[#2e0052] font-semibold">Loading booking details...</p>
        </div>
      </div>
    );
  }

  if (isError || !venue) {
    return (
      <div className="min-h-screen bg-[#fcf9f8]">
        <Navbar />
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <p className="text-red-500 font-semibold">Failed to load venue details.</p>
          <Button onClick={() => navigate(-1)} variant="outline">Go Back</Button>
        </div>
      </div>
    );
  }

  const handleBookingSubmit = async () => {
    if (!eventType) return toast.error("Please select an event type");
    if (!phoneNumber.trim()) {
      return toast.error("Phone number is required");
    }

    if (!/^[6-9]\d{9}$/.test(phoneNumber)) {
      return toast.error("Enter a valid phone number");
    }
    try {
      await createBooking({
        venueId: id as string,
        bookingDate,
        bookingType,
        startTime: bookingType === "hourly" ? startTime : undefined,
        endTime: bookingType === "hourly" ? endTime : undefined,
        guestCount,
        eventType: eventType as any,
        specialRequest,
        paymentType: "full",
        totalAmount,
        phoneNumber
      }).unwrap();

      setIsDialogOpen(true);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to submit booking request. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f8] text-[#1c1b1b] font-[Manrope,sans-serif] pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 md:px-16 py-6">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-[#2e0052] mb-6 group transition-colors"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back
        </button>

        <h1 className="font-[EB_Garamond,serif] text-3xl sm:text-4xl font-medium text-[#2e0052] tracking-tight mb-8">
          Confirm Booking
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-10">
          <div className="space-y-8">
            {/* Booking Details */}
            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#2e0052]">Booking Details</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-y-6 gap-x-4 text-sm">
                <div className="col-span-2">
                  <p className="text-slate-500 font-semibold mb-1">Venue Name</p>
                  <p className="font-medium text-slate-800">{venue.venueName}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-semibold mb-1">Booking Date</p>
                  <p className="font-medium text-slate-800">{bookingDate || "-"}</p>
                </div>
                <div>
                  <p className="text-slate-500 font-semibold mb-1">Booking Type</p>
                  <p className="font-medium text-slate-800 capitalize">{bookingType.replace("-", " ")}</p>
                </div>
                {bookingType === "hourly" && (
                  <>
                    <div>
                      <p className="text-slate-500 font-semibold mb-1">Start Time</p>
                      <p className="font-medium text-slate-800">{startTime || "-"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500 font-semibold mb-1">End Time</p>
                      <p className="font-medium text-slate-800">{endTime || "-"}</p>
                    </div>
                  </>
                )}
                <div>
                  <p className="text-slate-500 font-semibold mb-1">Guest Count</p>
                  <p className="font-medium text-slate-800">{guestCount}</p>
                </div>
              </CardContent>
            </Card>


            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#2e0052]">Customer Information</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <Input value={user?.userName || ""} className="bg-slate-50 text-slate-700 border-slate-200 h-11" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <Input value={user?.email || ""} className="bg-slate-50 text-slate-700 border-slate-200 h-11" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                  <Input value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    className="bg-slate-50 text-slate-700 border-slate-200 h-11" />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-slate-200 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#2e0052]">Event Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Event Type</label>
                  <Select value={eventType} onValueChange={setEventType}>
                    <SelectTrigger className="w-full h-11 rounded-xl">
                      <SelectValue placeholder="Select event type" />
                    </SelectTrigger>
                    <SelectContent>
                      {["Wedding", "Birthday", "Corporate", "Engagement", "Conference", "Other"].map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Special Requests (Optional)</label>
                  <Textarea
                    placeholder="Any specific requirements or arrangements..."
                    className="min-h-[120px] rounded-xl resize-none"
                    value={specialRequest}
                    onChange={(e) => setSpecialRequest(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>


          </div>

          <aside className="h-fit lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl shadow-purple-950/5 p-6 space-y-6">
              <div>
                <h3 className="font-[EB_Garamond,serif] text-2xl font-medium text-[#2e0052] mb-1">{venue.venueName}</h3>
                <p className="text-sm text-slate-500 font-semibold flex items-center gap-1.5">
                  <MapPin size={14} className="text-[#D4AF37]" /> {venue.location?.address?.city || "Kerala"}
                </p>
              </div>

              <div className="space-y-3 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex justify-between text-sm font-semibold text-slate-600">
                  <span>Date</span>
                  <span className="text-slate-800">{bookingDate || "-"}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-slate-600">
                  <span>Guests</span>
                  <span className="text-slate-800">{guestCount}</span>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm font-semibold text-slate-500">
                  <span>Venue Cost</span>
                  <span className="text-slate-800">₹{baseAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-sm font-semibold text-slate-500">
                  <span>Platform Fee (8%)</span>
                  <span className="text-slate-800">₹{platformFee.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-[#2e0052] pt-2 border-t border-slate-100">
                  <span>Total Amount</span>
                  <span>₹{totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                </div>
                <div className="mt-4 p-4 rounded-xl bg-purple-50/50 border border-purple-100/50">
                  <div className="flex justify-between text-sm font-bold text-[#2e0052]">
                    <span>Amount to Pay After Approval</span>
                    <span>₹{totalAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

              </div>

              <Button
                onClick={handleBookingSubmit}
                disabled={isBookingLoading}
                className="w-full h-14 bg-[#2e0052] hover:bg-[#400073] text-white text-[15px] font-bold rounded-xl shadow-lg transition-all active:scale-[0.99]"
              >
                {isBookingLoading ? "Sending Request..." : "Send Booking Request"}
              </Button>
            </div>
          </aside>
        </div>
      </div>
      <Footer />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl p-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 mb-4">
            <CheckCircle2 className="h-8 w-8 text-emerald-600" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-[EB_Garamond,serif] text-[#2e0052] mb-2">
              Booking Request Sent
            </DialogTitle>
            <DialogDescription className="text-base text-slate-600 mb-6">
              Your booking request has been sent to the venue owner for review.

              Once the owner approves your request, you'll receive a notification and can proceed with payment to confirm your booking.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="sm:justify-center flex-col sm:flex-row gap-3">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="rounded-xl border-slate-200 h-11 font-bold w-full sm:w-auto px-6">Close</Button>
            <Button onClick={() => { setIsDialogOpen(false); navigate("/booking"); }} className="rounded-xl bg-[#2e0052] hover:bg-[#400073] text-white h-11 font-bold w-full sm:w-auto px-6">
              View My Bookings
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
