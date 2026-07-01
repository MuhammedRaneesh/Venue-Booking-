import { useState, useRef, useEffect } from "react"
import {
  Search, Heart, Plus, Bell, ChevronDown,
  User, LayoutDashboard, Calendar, LogOut, X, Menu, Tag, LogIn
} from "lucide-react"
import { Link, NavLink, useNavigate } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { logout } from "@/features/auth/slices/authSlice"
import NotificationBell from "./Notification"
import { useUserLogoutMutation } from "@/api/authApi"
import { api } from "@/api/baseApi"
import { socket } from "@/services/socket"
function Navbar() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userLogout] = useUserLogoutMutation()
  const user = useSelector((state: RootState) => state.auth.user)
  const isOwner = user?.role === "venue_owner" && user?.ownerStatus === "APPROVED"
  const venueLink = isOwner ? "/owner" : user ? "/owner/application" : "/register"
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  const handleLogout = async () => {
    try {
      await userLogout().unwrap()
    } catch (error) {
      console.error("Logout request failed:", error)
    } finally {
      dispatch(logout())
      dispatch(api.util.resetApiState())
      socket.disconnect()
      setDropdownOpen(false)
      setMobileMenuOpen(false)
      navigate("/")
    }
  }

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `relative flex h-16 items-center whitespace-nowrap px-1 text-sm font-semibold transition-colors ${isActive ? "text-[#C9A84C]" : "text-[#1c1b1b] hover:text-[#C9A84C]"
    }`

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${isActive ? "text-[#C9A84C] bg-[#C9A84C]/10" : "text-[#1c1b1b] hover:bg-[#f6f3f2]"
    }`

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-[#e8e0d0]">
      <nav className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:px-12">
        <Link to="/" className="flex min-w-[220px] shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M16 2C10.477 2 6 6.477 6 12c0 7 10 18 10 18s10-11 10-18c0-5.523-4.477-10-10-10z" fill="#C9A84C" />
              <circle cx="16" cy="12" r="4" fill="white" />
            </svg>
          </div>
          <span className="whitespace-nowrap font-[EB_Garamond,serif] text-xl font-semibold text-[#1c1b1b]">
            BookMy<span className="text-[#C9A84C]">Venue</span>
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-6 xl:flex 2xl:gap-8">
          <NavLink to="/" end className={navLinkClass}>
            {({ isActive }) => (
              <>
                <span>Home</span>
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A84C] rounded-full" />}
              </>
            )}
          </NavLink>

          <NavLink to="/venues" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <span>Venues</span>
                {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A84C] rounded-full" />}
              </>
            )}
          </NavLink>

          {user && isOwner && (
            <NavLink to="/owner" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <span>Dashboard</span>
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A84C] rounded-full" />}
                </>
              )}
            </NavLink>
          )}

          {user && !isOwner && (
            <NavLink to="/booking" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <span>Bookings</span>
                  {isActive && <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#C9A84C] rounded-full" />}
                </>
              )}
            </NavLink>
          )}
        </div>

        <div className="hidden min-w-[300px] shrink-0 items-center justify-end gap-3 xl:flex">
          {user ? (
            <>
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="flex h-9 w-9 items-center justify-center rounded-full text-[#1c1b1b] hover:text-[#C9A84C] transition-colors"
              >
                <Heart size={18} strokeWidth={1.8} />
              </Link>
              <NotificationBell />
              <Link
                to={isOwner ? "/owner" : "/register"}
                className="flex min-h-10 items-center gap-2 rounded-lg border border-[#C9A84C] px-4 py-2 text-sm font-semibold leading-tight text-[#C9A84C] transition hover:bg-[#C9A84C] hover:text-white"
              >
                <Tag size={15} className="shrink-0" />
                <span className="whitespace-nowrap">List Your Venue</span>
              </Link>

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full transition"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.userName}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-[#C9A84C]/30"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9A84C]/20 text-sm font-semibold text-[#C9A84C]">
                      {user.userName?.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <ChevronDown
                    size={14}
                    className={`text-[#4c4451] transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-2xl border border-[#e8e0d0] bg-white shadow-lg shadow-[#C9A84C]/10">
                    <div className="border-b border-[#f0eded] px-4 py-3">
                      <p className="text-sm font-semibold text-[#1c1b1b]">{user.userName}</p>
                      <p className="truncate text-xs text-[#7d7483]">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-[#1c1b1b] transition hover:bg-[#f6f3f2]"
                      >
                        <User size={15} /> Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-red-600 transition hover:bg-red-50"
                      >
                        <LogOut size={15} /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-[#e8e0d0] bg-white px-4 py-2 text-sm font-semibold leading-tight text-[#2e0052] shadow-sm transition hover:border-[#C9A84C] hover:bg-[#fdf9f0] hover:text-[#735c00]"
              >
                <LogIn size={15} className="shrink-0" />
                <span className="whitespace-nowrap">Sign in</span>
              </Link>

              <Link
                to={venueLink}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-[#C9A84C] px-4 py-2 text-sm font-bold leading-tight text-[#241a00] shadow-[0_8px_18px_rgba(201,168,76,0.28)] transition hover:bg-[#b89535] hover:shadow-[0_10px_22px_rgba(201,168,76,0.34)]"
              >
                <Tag size={15} className="shrink-0" />
                <span className="whitespace-nowrap">List Your Venue</span>
              </Link>
            </>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#e8e0d0] text-[#1c1b1b] xl:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-[#e8e0d0] bg-white px-4 pb-4 pt-3 xl:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
              Home
            </NavLink>
            <NavLink to="/venues" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
              <Search size={18} /> Venues
            </NavLink>

            {user && (
              <>
                {isOwner ? (
                  <NavLink to="/owner" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                    <LayoutDashboard size={18} /> Dashboard
                  </NavLink>
                ) : (
                  <NavLink to="/booking" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                    <Calendar size={18} /> Bookings
                  </NavLink>
                )}
                <NavLink to="/wishlist" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                  <Heart size={18} /> Wishlist
                </NavLink>
              </>
            )}

            <NavLink to="/about" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
              About Us
            </NavLink>

            <div className="mt-2 border-t border-[#e8e0d0] pt-3">
              {user ? (
                <>
                  <div className="mb-3 flex items-center gap-3 px-3">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.userName} className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#C9A84C]/20 text-sm font-semibold text-[#C9A84C]">
                        {user.userName?.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-medium text-[#1c1b1b]">{user.userName}</p>
                      <p className="text-xs text-[#7d7483]">{user.email}</p>
                    </div>
                  </div>
                  <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                    <User size={18} /> Profile
                  </NavLink>

                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <Bell size={18} className="text-[#1c1b1b]" />
                    <span className="text-sm font-medium text-[#1c1b1b]">Notifications</span>
                    <NotificationBell />
                  </div>

                  <Link
                    to={isOwner ? "/owner/venues/new" : "/register"}
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-[#C9A84C] px-4 py-2.5 text-sm font-medium text-[#C9A84C]"
                  >
                    <Tag size={15} /> List Your Venue
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={18} /> Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-[#e8e0d0] bg-white px-4 py-2.5 text-sm font-semibold text-[#2e0052] shadow-sm"
                  >
                    <LogIn size={16} /> Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl bg-[#C9A84C] px-4 py-3 text-sm font-bold text-[#241a00] shadow-[0_8px_18px_rgba(201,168,76,0.26)]"
                  >
                    <Plus size={16} /> List Your Venue
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar
