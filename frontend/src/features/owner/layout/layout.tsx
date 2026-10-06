import { useEffect, useState } from "react"
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Building2,
  CalendarDays,
  Home,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  UserCircle2,
  UserRound,
} from "lucide-react"
import type { RootState } from "@/store"
import { logout } from "@/features/auth/slices/authSlice"
import { useUserLogoutMutation } from "@/features/auth/authApi"
import { api } from "@/api/baseApi"
import { socket } from "@/services/socket"
import { useGetOwnerVenuesQuery } from "@/features/owner/ownerApi"
import { Button } from "@/components/ui/button"
import OwnerNotificationDropdown from "@/features/owner/components/OwnerNotificationDropdown"

const navItems = [
  { title: "Dashboard", url: "/owner", icon: LayoutDashboard },
  { title: "Bookings", url: "/owner/booking", icon: CalendarDays },
  { title: "Venues", url: "/owner/venues", icon: Building2 },
  { title: "Profile", url: "/owner/profile", icon: UserRound },
]

function OwnerLayout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [collapsed, setCollapsed] = useState(false)
  const [selectedVenue, setSelectedVenue] = useState("all")

  const user = useSelector((state: RootState) => state.auth.user)
  const [userLogout] = useUserLogoutMutation()
  const { data: venueData } = useGetOwnerVenuesQuery({ page: 1, limit: 50 })

  const venues = venueData?.venue || []

  useEffect(() => {
    if (selectedVenue !== "all" && !venues.some((venue) => venue._id === selectedVenue)) {
      setSelectedVenue("all")
    }
  }, [selectedVenue, venues])

  const handleLogout = async () => {
    try {
      await userLogout().unwrap()
    } catch (error) {
      console.error("Logout request failed:", error)
    } finally {
      dispatch(logout())
      dispatch(api.util.resetApiState())
      socket.disconnect()
      navigate("/login")
    }
  }

  const initials = (user?.userName || "Owner")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A] [font-family:Inter,system-ui,sans-serif]">
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex flex-col border-r border-[#0F172A] bg-[#1E293B] transition-[width] duration-200 max-lg:w-[72px] ${
          collapsed ? "lg:w-[72px]" : "lg:w-[240px]"
        }`}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/10 px-4">
          <button
            type="button"
            onClick={() => navigate("/owner")}
            className="min-w-0 text-left text-white"
            aria-label="BookMyVenue dashboard"
          >
            <span className="block text-base font-semibold tracking-tight max-lg:hidden">
              {collapsed ? "BMV" : "BookMyVenue"}
            </span>
            <span className="hidden text-xs font-medium text-[#F8FAFC] max-lg:block">BMV</span>
            {!collapsed && (
              <span className="block text-xs font-medium text-[#F8FAFC] max-lg:hidden">
                Owner Portal
              </span>
            )}
          </button>

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="hidden rounded-[6px] text-white hover:bg-white/10 hover:text-white lg:inline-flex"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.url}
              end={item.url === "/owner"}
              className={({ isActive }) =>
                `flex h-10 items-center gap-3 rounded-[6px] border-l-[3px] px-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "border-l-[#0F766E] bg-white/10 text-white"
                    : "border-l-transparent text-white/70 hover:bg-white/5 hover:text-white/90"
                } ${collapsed ? "lg:justify-center lg:px-0" : ""} max-lg:justify-center max-lg:px-0`
              }
              title={item.title}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              <span className={`${collapsed ? "lg:hidden" : ""} max-lg:hidden`}>
                {item.title}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          <Button
            type="button"
            variant="ghost"
            className={`mb-2 h-10 w-full justify-start gap-3 rounded-[6px] px-3 text-white/70 hover:bg-white/10 hover:text-white/90 ${
              collapsed ? "lg:justify-center lg:px-0" : ""
            } max-lg:justify-center max-lg:px-0`}
            onClick={() => navigate("/")}
          >
            <Home className="h-5 w-5" />
            <span className={`${collapsed ? "lg:hidden" : ""} max-lg:hidden`}>Home</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            className={`h-10 w-full justify-start gap-3 rounded-[6px] px-3 text-white/70 hover:bg-white/10 hover:text-white/90 ${
              collapsed ? "lg:justify-center lg:px-0" : ""
            } max-lg:justify-center max-lg:px-0`}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className={`${collapsed ? "lg:hidden" : ""} max-lg:hidden`}>Logout</span>
          </Button>
        </div>
      </aside>

      <div
        className={`min-h-screen transition-[padding] duration-200 max-lg:pl-[72px] ${
          collapsed ? "lg:pl-[72px]" : "lg:pl-[240px]"
        }`}
      >
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between gap-4 border-b border-[#E2E8F0] bg-white/80 px-4 backdrop-blur-md md:px-8 transition-all">
          <div className="flex flex-1 items-center gap-6">
            <h1 className="hidden font-[EB_Garamond,serif] text-2xl font-semibold text-[#0F172A] lg:block">
              Welcome Back, {user?.userName?.split(" ")[0] || "Owner"} 👋
            </h1>
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#64748B]" />
              <input 
                type="text" 
                placeholder="Search venues or bookings..." 
                className="w-full rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] py-2.5 pl-10 pr-4 text-sm text-[#0F172A] outline-none transition-all focus:border-[#0F766E] focus:ring-1 focus:ring-[#0F766E]"
              />
            </div>
          </div>

          <div className="ml-auto flex min-w-0 items-center gap-4">

            <OwnerNotificationDropdown />

            <div className="flex items-center gap-3 pl-4 border-l border-[#E2E8F0]">
              <div className="hidden text-right md:block">
                <p className="text-sm font-bold text-[#0F172A]">{user?.userName || "Owner Profile"}</p>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#64748B]">Owner Account</p>
              </div>
              <button
                type="button"
                onClick={() => navigate("/owner/profile")}
                className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-[#0F766E] text-sm font-semibold text-white ring-2 ring-transparent transition-all hover:ring-[#0D9488]/50 hover:shadow-md"
                aria-label="Owner profile"
              >
                {user?.profileImage ? (
                  <img src={user.profileImage} alt={user.userName} className="h-full w-full object-cover" />
                ) : (
                  initials || <UserCircle2 className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="min-h-[calc(100vh-80px)] bg-[#F8FAFC] p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default OwnerLayout
