import { lazy, Suspense } from "react"
import { Route, Routes } from "react-router-dom"
import { Toaster } from "sonner"
import ProtectedRoute from "./components/ProtectedRoute"
import PageLoader from "./components/PageLoader"

import Home from "./pages/Home"
import VenueListPage from "./features/Venue/pages/VenuePage"
import VenueDetailPage from "./features/Venue/pages/VenueDetailPage"
// auth
const Register = lazy(() => import("./features/auth/components/Register"))
const Login = lazy(() => import("./features/auth/components/login"))
const OtpVerify = lazy(() => import("./features/auth/components/otpVerify"))
const GoogleSuccess = lazy(() => import("./features/auth/components/Google"))
const ForgotPassword = lazy(() => import("./features/auth/components/ForgotPassword"))
const OtpVerifyPassword = lazy(() => import("./features/auth/components/Forgot.Otpverify"))
const ResetPassword = lazy(() => import("./features/auth/components/ResetPassword"))
const UserProfilePage = lazy(() => import("./features/auth/components/UserProfilePage"))

// booking
const BookingPage = lazy(() => import("./features/booking/components/BookingPage"))
const MyBookingsPage = lazy(() => import("./features/booking/components/MyBookingsPage"))

const WishlistPage = lazy(() => import("./features/Venue/pages/WishlistPage"))

// owner
const OwnerVerificationForm = lazy(() => import("./features/owner/components/ownerApplicationForm"))
const SidebarLayout = lazy(() => import("./features/owner/layout/layout"))
const OwnerVenues = lazy(() => import("./features/owner/components/venuePage"))
const OwnerBooking = lazy(() => import("./features/owner/components/OwnerBooking"))
const OwnerDashboard = lazy(() => import("./features/owner/components/dashboard"))
const OwnerProfilePage = lazy(() => import("./features/owner/components/OwnerProfilePage"))
const AddVenue = lazy(() => import("./features/owner/components/AddVenue"))

// admin
const AdminLayout = lazy(() => import("./features/admin/components/AdminLayout"))
const DashboardOverview = lazy(() => import("./features/admin/pages/DashboardOverview"))
const VenueManagement = lazy(() => import("./features/admin/pages/VenueManagement"))
const Application = lazy(() => import("./features/admin/pages/Application"))
const BookingManagement = lazy(() => import("./features/admin/pages/BookingManagement"))
const UserManagement = lazy(() => import("./features/admin/pages/UserManagement"))
const AdminCategoriesPage = lazy(() => import("./features/admin/pages/AdminCategoriesPage"))

function App() {
  return (
    <div>
      <Toaster position="top-right" richColors closeButton duration={2000} />

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/venues" element={<VenueListPage />} />
          <Route path="/venues/:id" element={<VenueDetailPage />} />

          <Route element={<ProtectedRoute Roles={["user", "venue_owner", "admin"]} />}>
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>

          <Route element={<ProtectedRoute Roles={["user", "venue_owner", "admin"]} />}>
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
              <Route path="venues/create" element={<AddVenue />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute Roles={["admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="categories" element={<AdminCategoriesPage />} />
              <Route path="venues" element={<VenueManagement />} />
              <Route path="applications" element={<Application />} />
              <Route path="bookings" element={<BookingManagement />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </div>
  )
}

export default App
