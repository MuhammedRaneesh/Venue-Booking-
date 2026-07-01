import { Route, Routes } from "react-router-dom"
import Register from "./features/auth/pages/Register"
import OtpVerify from "./features/auth/pages/otpVerify"
import Login from "./features/auth/pages/login"
import GoogleSuccess from "./features/auth/pages/Google"
import ForgotPassword from "./features/auth/pages/ForgotPassword"
import Home from "./pages/Home"
import OwnerVerificationForm from "./features/owner/pages/owner.Form"
import { Toaster } from "sonner"
import OtpVerifyPassword from "./features/auth/pages/Forgot.Otpverify"
import ResetPassword from "./features/auth/pages/ResetPassword"
import SidebarLayout from "./features/owner/pages/layout"
import OwnerVenues from "./features/owner/pages/venuePage"
import ProtectedRoute from "./components/ProtectedRoute"
import VenueListPage from "./features/Venue/pages/VenuePage"
import VenueDetailPage from "./features/Venue/pages/VenueDetailPage"
import BookingPage from "./features/booking/page/BookingPage"
import MyBookingsPage from "./features/booking/page/MyBookingsPage"
import OwnerBooking from "./features/owner/pages/OwnerBooking"
import UserProfilePage from "./features/auth/pages/UserProfilePage"
import OwnerDashboard from "./features/owner/pages/dashboard"
import WishlistPage from "./features/Venue/pages/WishlistPage"
import OwnerProfilePage from "./features/owner/pages/OwnerProfilePage"
import AdminLayout from "./features/admin/components/AdminLayout"
import DashboardOverview from "./features/admin/pages/DashboardOverview"
import VenueManagement from "./features/admin/pages/VenueManagement"
import Application from "./features/admin/pages/Application"
import BookingManagement from "./features/admin/pages/BookingManagement"
import UserManagement from "./features/admin/pages/UserManagement"
import AddVenue from "./features/owner/pages/AddVenue"
function App() {
  return (
    <div>
      <Toaster position="top-right" richColors closeButton duration={2000} />
      <div>
      </div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/venues" element={<VenueListPage />} />
        <Route path="/venues/:id" element={<VenueDetailPage />} />

        <Route element={<ProtectedRoute Roles={["user", "venue_owner" , "admin"]} />}>
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Route>

        <Route element={<ProtectedRoute Roles={["user", "venue_owner" , "admin"]} />}>
          <Route path="/venues/:id/book" element={<BookingPage />} />
          <Route path="/booking" element={<MyBookingsPage />} />
        </Route>

        <Route path="/register" element={<Register />} />
        <Route path="/otp-verify" element={<OtpVerify />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/google/success" element={<GoogleSuccess />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-forgot-otp" element={<OtpVerifyPassword />} />
        <Route path="/owner/onboarding" element={<OwnerVerificationForm />} />

        <Route element={<ProtectedRoute Roles={["venue_owner"]} />}>
          <Route path="/owner" element={<SidebarLayout />}>
            <Route index element={<OwnerDashboard />} />
            <Route path="venues" element={<OwnerVenues />} />
            <Route path="booking" element={<OwnerBooking />} />
            <Route path="profile" element={<OwnerProfilePage />} />
            <Route path="venues/create" element = {<AddVenue/>} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute Roles={["admin"]} />}>
          <Route path="/admin" element={<AdminLayout />} >
            <Route index element={<DashboardOverview />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="venues" element={<VenueManagement />} />
            <Route path="applications" element={< Application />} />
            <Route path="bookings" element={<BookingManagement />} />
          </Route>
        </Route>
      </Routes>
    </div >

  )
}

export default App
