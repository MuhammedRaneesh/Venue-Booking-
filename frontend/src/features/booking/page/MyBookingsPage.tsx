import { useMyBookingQuery, useCreatePaymentOrderMutation, useVerifyPaymentMutation } from "@/api/bookingApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BookingHistory } from "../types/booking.type";
import { Calendar, TicketX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/ChatGPT Image Jun 26, 2026, 10_19_46 AM.png"
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { toast } from "sonner";
import { useCancelBookingMutation } from "@/api/bookingApi";
import { useState } from "react";
function MyBookingsPage() {

  const { data, isLoading, isError } = useMyBookingQuery({});

  const navigate = useNavigate();
  const bookings: BookingHistory[] = data?.booking || [];

  const [createPaymentOrder] = useCreatePaymentOrderMutation()
  const [verifyPayment] = useVerifyPaymentMutation()
  const [cancelBooking] = useCancelBookingMutation()
  const [cancellingId, setCancellingId] = useState<string | null>(null)
  const user = useSelector((state: RootState) => state.auth)

  const paynow = async (bookingId: string) => {
    try {
      const res = await createPaymentOrder({ bookingId }).unwrap();
      const options = {
        key: res.key,
        amount: res.data.order.amount,
        currency: "INR",
        name: "BookMyVenue",
        image: logo,
        description: "Venue Booking Payment",
        order_id: res.data.order.id,
        prefill: {
          name: user.user?.userName,
          email: user.user?.email,
          contact: user.user?.phoneNumber
        },
        theme: {
          color: "#2e0052",
        },

        handler: async (response: any) => {
          try {
            await verifyPayment({
              bookingId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }).unwrap()
            toast.success("Payment Successful")
          } catch (error) {
            toast.error("Payment Verification Failed");
          }
        }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()
    } catch (error) {
      console.log(error)
    }
  }

  const handleCancel = async (bookingId: string, bookingDate: string) => {
    const daysUntilEvent = (new Date(bookingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)

    if (daysUntilEvent < 5) {
      toast.error("Cannot cancel within 5 days of the event")
      return
    }

    const reason = window.prompt("Please provide a cancellation reason:")
    
    if (!reason) return
    try {
      setCancellingId(bookingId)
      await cancelBooking({ bookingId, cancellationReason: reason }).unwrap()
      toast.success("Booking cancelled successfully")
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to cancel booking")
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-[#2e0052]">
            My Bookings
          </h1>
          <p className="text-slate-500 mt-2">
            View and track your venue reservations
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="bg-white rounded-2xl overflow-hidden border"
              >
                <Skeleton className="h-52 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-8 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center justify-center py-20">
            <TicketX className="w-12 h-12 text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold">
              Failed to load bookings
            </h2>
            <Button
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Refresh
            </Button>
          </div>
        ) : bookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border">
            <Calendar className="w-14 h-14 text-slate-400 mb-4" />

            <h2 className="text-2xl font-semibold text-[#2e0052]">
              No bookings found
            </h2>

            <p className="text-slate-500 mt-2 mb-6">
              You haven't booked any venues yet.
            </p>

            <Button onClick={() => navigate("/venues")}>
              Browse Venues
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="bg-white border rounded-2xl p-4 flex flex-col md:flex-row gap-4 shadow-sm hover:shadow-md transition"
              >
                <div className="w-full md:w-48 h-32 overflow-hidden rounded-xl bg-slate-100 shrink-0">
                  <img
                    src={booking.venueId?.photos?.[0]}
                    alt={booking.venueId?.venueName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-[#2e0052]">
                      {booking.venueId?.venueName}
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                      📍 {booking.venueId?.location?.address?.city}
                    </p>

                    <p className="text-sm text-slate-600 mt-3">
                      Event Date :
                      {" "}
                      {new Date(booking.bookingDate).toLocaleDateString("en-IN")}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge variant="secondary" className="capitalize">
                        {booking.bookingStatus}
                      </Badge>

                      <Badge variant="secondary" className="capitalize">
                        {booking.paymentStatus}
                      </Badge>

                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div>
                      <p className="text-xs text-slate-500">
                        Total Amount
                      </p>

                      <p className="text-lg font-bold text-[#2e0052]">
                        ₹{booking.totalAmount.toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div>
                      {booking.bookingStatus === "approved" && booking.paymentStatus !== "fully_paid" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => paynow(booking._id)}
                        >
                          Pay Now
                        </Button>
                      )}
                    </div>
                    {(booking.bookingStatus === "pending" || booking.bookingStatus === "approved") && (
                      (() => {
                        const daysUntilEvent = (new Date(booking.bookingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                        const canCancel = daysUntilEvent >= 5

                        return (
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={!canCancel || cancellingId === booking._id}
                            onClick={() => handleCancel(booking._id, booking.bookingDate)}
                            title={!canCancel ? "Cannot cancel within 5 days of event" : ""}
                          >
                            {cancellingId === booking._id ? "Cancelling..." : canCancel ? "Cancel Booking" : "Cancel Unavailable"}
                          </Button>
                        )
                      })()
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default MyBookingsPage;
