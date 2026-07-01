import { Booking } from "./booking.schema.js";
import { Venue } from "../venue/venue.schema.js";
import { CreateBooking, VerifyPaymentSchema } from "./booking.validation.js";
import { User } from "../auth/user.schema.js";
import razorpay from "../../config/Razorpay.js";
import crypto from "crypto"
import { createNotification } from "../Notification/Notification.service.js";
export const getAvailability = async (venueId: string, date: string) => {
  const venue = await Venue.findById(venueId);
  if (!venue) {
    throw new Error("Venue not found");
  }

  const openTimeString = venue.availability?.openTime;
  const closeTimeString = venue.availability?.closeTime;

  if (!openTimeString || !closeTimeString) {
    throw new Error("Venue availability time not configured");
  }

  const openHour = parseInt(openTimeString.split(":")[0], 10);
  const closeHour = parseInt(closeTimeString.split(":")[0], 10);

  const allSlots: string[] = [];

  for (let hour = openHour; hour < closeHour; hour++) {
    allSlots.push(`${hour.toString().padStart(2, "0")}:00`);
  }

  const startOfDay = new Date(`${date}T00:00:00`);
  const endOfDay = new Date(`${date}T23:59:59`);

  const bookings = await Booking.find({
    venueId,
    bookingDate: {
      $gte: startOfDay,
      $lte: endOfDay,
    },
    bookingStatus: {
      $in: ["pending", "approved"],
    },
  });

  const bookedSlots = new Set<string>();

  bookings.forEach((booking) => {
    if (!booking.startDateTime || !booking.endDateTime) {
      return
    }
    const startHour = booking.startDateTime.getHours();
    const endHour = booking.endDateTime.getHours();

    for (let hour = startHour; hour < endHour; hour++) {
      bookedSlots.add(
        `${hour.toString().padStart(2, "0")}:00`
      );
    }
  });

  return {
    slots: allSlots.map((slot) => {
      const startHour = Number(slot.split(":")[0]);

      return {
        start: slot,
        end: `${String(startHour + 1).padStart(2, "0")}:00`,
        booked: bookedSlots.has(slot),
      };
    }),
  };
};

export const BookingVenue = async (userId: string, data: CreateBooking) => {

  const { venueId, bookingDate, startTime, endTime, bookingType, guestCount, eventType, specialRequest, paymentType, phoneNumber } = data;

  const venue = await Venue.findById(venueId);
  const user = await User.findByIdAndUpdate(userId, { phoneNumber: phoneNumber }, { returnDocument : "after" })
  if (!venue) {
    throw new Error("Venue not found");
  }

  if (venue.status !== "approved" || !venue.isActive) {
    throw new Error("Venue is unavailable");
  }

  if (guestCount > venue.capacity) {
    throw new Error(
      `Maximum venue capacity is ${venue.capacity}`
    );
  }

  let totalAmount = 0;
  let savedPlatformFee = 0;
  let savedOwnerPayout = 0;
  let startDateTime: Date | null = null;
  let endDateTime: Date | null = null;

  if (bookingType === "hourly") {
    if (!startTime || !endTime) {
      throw new Error(
        "Start time and end time are required"
      );
    }

    startDateTime = new Date(`${bookingDate}T${startTime}:00`);

    endDateTime = new Date(`${bookingDate}T${endTime}:00`);

    const existingBooking = await Booking.findOne({
      venueId,
      bookingStatus: { $in: ["pending", "approved"], },
      startDateTime: {
        $lt: endDateTime,
      },
      endDateTime: {
        $gt: startDateTime,
      },
    });

    if (existingBooking) {
      throw new Error("Selected slot is already booked");
    }

    const startHour = Number(startTime.split(":")[0]);
    const endHour = Number(endTime.split(":")[0]);
    const hours = endHour - startHour;
    if (hours < 1) { throw new Error("Minimum booking duration is 1 hour"); }
    const venueAmount = hours * (venue.pricing?.pricePerHour || 0);
    const platformFee = Math.round(venueAmount * 0.08);
    totalAmount = venueAmount + platformFee;
    savedPlatformFee = platformFee;
    savedOwnerPayout = venueAmount; 
  } else {
    const existingBooking = await Booking.findOne({
      venueId,
      bookingDate,
      bookingStatus: {
        $in: ["pending", "approved"],
      },
    });

    if (existingBooking) {
      throw new Error(
        "Venue is already booked for this date"
      );
    }
    const venueAmount = venue.pricing?.pricePerDay || 0;
    const platformFee = Math.round(venueAmount * 0.08);
    totalAmount = venueAmount + platformFee;
    savedPlatformFee = platformFee;
    savedOwnerPayout = venueAmount;
  }

  const newBooking = await Booking.create({
    userId,
    venueId,
    ownerId: venue.owner,
    bookingType,
    bookingDate,
    startDateTime,
    endDateTime,
    guestCount,
    eventType,
    specialRequest,
    totalAmount,
    platformFee: savedPlatformFee,
    ownerPayout: savedOwnerPayout,
    paymentType: "full",
    amountPaid: 0,
    paymentStatus: "unpaid",
  });

  await createNotification({
    userId: venue.owner.toString(),
    title: "New Booking Request",
    senderId: userId,
    message: `${user?.userName} submitted a booking request`,
    type : "new_booking_request" ,
    data : {
      bookingId: newBooking._id.toString(),
      venueId
    }
  })
  return { newBooking };
};

export const userBooking = async (userId: string) => {

  const Bookings = await Booking.find({ userId }).populate("venueId", "venueName photos location pricing").sort({ createdAt: -1 })


  return { Bookings }
}

export const createPaymentBooking = async (bookingId: string) => {
  const booking = await Booking.findById(bookingId)

  if (!booking) throw new Error("Booking not found")

  const venue = await Venue.findById(booking.venueId)

  if (!venue) throw new Error("Venue not found")

  if (booking.bookingStatus !== "approved") {
    throw new Error(
      "Only approved bookings can be paid."
    );
  }

  if (booking.paymentStatus === "fully_paid") throw new Error("Booking already fully paid")

  let amountToPay = booking.totalAmount



  const order = await razorpay.orders.create({
    amount: amountToPay * 100,
    currency: "INR",
    receipt: `booking_${bookingId}`,
  })
  booking.razorpayOrderId = order.id;
  await booking.save()
  if (!order) throw new Error("Razorpay order creation failed")

  return { order, amountToPay, paymentType: booking.paymentType, key: process.env.RAZORPAY_KEY_ID }
}

export const verifyPaymentRazorpay = async (data: VerifyPaymentSchema) => {

  const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = data

  const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(`${razorpay_order_id}|${razorpay_payment_id}`).digest("hex")

  if (expectedSignature !== razorpay_signature) {
    throw new Error("Invalid payment signature")
  }
  const booking = await Booking.findById(bookingId)
  if (!booking) throw new Error("booking not found")

  if (booking.razorpayOrderId !== razorpay_order_id) {
    throw new Error("Order ID mismatch. Potential fraud detected.");
  }

  if (booking.paymentStatus === "fully_paid") {
    throw new Error("Payment already completed");
  }

  const amountPaid = booking.totalAmount;
  const newPaymentStatus = "fully_paid";
  const amountDue = 0;
  await Booking.findByIdAndUpdate(bookingId, {
    razorpayOrderId: razorpay_order_id,
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
    paymentStatus: newPaymentStatus,
    amountPaid,
    amountDue,
    paidAt: new Date(),
  })

  await createNotification({
    userId: booking.userId.toString(),
    type: "payment_success",
    title: "Payment Successful",
    message: "Your booking payment was completed successfully",
    data: {
      bookingId,
      amountPaid,
      paymentId: razorpay_payment_id,
    },
  })

  await createNotification({
    userId: booking.ownerId.toString(),
    senderId: booking.userId.toString(),
    type: "payment_received",
    title: "Payment Received",
    message: "A customer completed payment for an approved booking",
    data: {
      bookingId,
      amountPaid,
      paymentId: razorpay_payment_id,
    },
  })

  return {
    success: true,
    message: "Full payment verified. Booking confirmed.",
  }
}

export const CancelBooking = async (userId: string, bookingId: string, cancellationReason: string) => {

  const booking = await Booking.findById(bookingId)
  
  if (!booking) throw new Error("booking not found")

  if (booking.userId.toString() !== userId) throw new Error("Unauthorized")

  const currentDate = new Date()

  const eventDate = new Date(booking.bookingDate);
  const miilisecondsUntilEvent = eventDate.getTime() - currentDate.getTime();

  const daysUntilEvent = miilisecondsUntilEvent / (1000 * 60 * 60 * 24)


  if (daysUntilEvent < 5) {
    throw new Error(
      "Booking cannot be cancelled within 5 days of the event date"
    );
  }
  booking.bookingStatus = "cancelled"
  booking.cancellationReason = cancellationReason
  booking.cancelledAt = new Date()

  await booking.save()

  await createNotification({
    userId: booking.ownerId.toString(),
    senderId: userId,
    type: "booking_cancelled",
    title: "Booking Cancelled",
    message: "A customer cancelled their booking",
    data: {
      bookingId,
      cancellationReason,
    },
  })

  return {
    message: "Booking cancelled successfully",
  };
}
