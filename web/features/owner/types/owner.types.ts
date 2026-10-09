export interface OwnerApplicationPayload {
  fullName: string;
  phoneNumber: string;
  businessName: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstNumber?: string;
}

export interface OwnerApplicationResponse {
  success: boolean;
  message: string;
}
