export type NotificationType =
  | "booking_submitted"
  | "booking_approved"
  | "booking_rejected"
  | "booking_cancelled"
  | "booking_completed"
  | "payment_success"
  | "payment_received"
  | "new_booking_request"
  | "new_owner_application"
  | "venue_approved"
  | "venue_rejected"
  | "owner_application_approved"
  | "owner_application_rejected";

export interface createNotificationType {
    userId : string  ,
    type : NotificationType ,
    title : string ,
    message : string ,
    data? : Record<string , any> ,
    senderId? : string | null
}
