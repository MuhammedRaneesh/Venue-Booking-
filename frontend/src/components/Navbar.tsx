import { useState, useRef, useEffect } from "react"
import {Search, Heart, Plus, Bell, ChevronDown,User, LayoutDashboard, Calendar, LogOut, X, Menu, Tag, LogIn} from "lucide-react"
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { logout } from "@/features/auth/slices/authSlice"
import NotificationBell from "./Notification"
import { useUserLogoutMutation } from "@/features/auth/authApi"
import { api } from "@/api/baseApi"
import { socket } from "@/services/socket"

function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const [userLogout] = useUserLogoutMutation()
  const user = useSelector((state: RootState) => state.auth.user)
  const isOwner = user?.role === "venue_owner" && user?.ownerStatus === "APPROVED"
  const venueLink = isOwner ? "/owner" : user ? "/owner/application" : "/register"

  const isHome = location.pathname === "/"

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    onScroll()
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

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

  const textColor = "text-foreground"
  const textColorMuted = "text-muted-foreground"

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `group relative flex h-16 items-center whitespace-nowrap px-1 text-sm font-medium transition-colors ${
      isActive ? "text-brand-accent" : `${textColor} hover:text-brand-accent`
    }`

  const mobileLinkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
      isActive ? "text-brand-accent bg-brand-accent/10" : "text-foreground hover:bg-muted"
    }`

  return (
    <header
      className={`z-50 transition-all duration-300 left-0 right-0 mx-auto ${
        isHome ? "fixed" : "sticky"
      } ${
        scrolled
          ? "top-4 w-[calc(100%-2rem)] max-w-7xl rounded-full bg-background/80 backdrop-blur-md shadow-md border border-border/50"
          : `top-0 w-full ${isHome ? "bg-transparent border-transparent" : "bg-background border-b border-border"}`
      }`}
    >
      <nav className="flex h-16 w-full items-center justify-between gap-4 px-4 sm:px-6 lg:px-8 xl:px-12">
        <Link to="/" className="flex min-w-[160px] shrink-0 items-center">
          <span className={`whitespace-nowrap text-xl font-medium ${textColor}`}>
            Venuo
          </span>
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-6 xl:flex 2xl:gap-8">
          <NavLink to="/" end className={navLinkClass}>
            {({ isActive }) => (
              <>
                <span>Home</span>
                <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-brand-accent rounded-full transition-transform duration-300 origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </>
            )}
          </NavLink>

          <NavLink to="/venues" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <span>Browse venues</span>
                <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-brand-accent rounded-full transition-transform duration-300 origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </>
            )}
          </NavLink>

          {user && isOwner && (
            <NavLink to="/owner" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <span>Dashboard</span>
                  <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-brand-accent rounded-full transition-transform duration-300 origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                </>
              )}
            </NavLink>
          )}

          {user && !isOwner && (
            <NavLink to="/booking" className={navLinkClass}>
              {({ isActive }) => (
                <>
                  <span>Bookings</span>
                  <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-brand-accent rounded-full transition-transform duration-300 origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
                </>
              )}
            </NavLink>
          )}

          <NavLink to="/about" className={navLinkClass}>
            {({ isActive }) => (
              <>
                <span>About</span>
                <span className={`absolute bottom-0 left-0 right-0 h-[2px] bg-brand-accent rounded-full transition-transform duration-300 origin-left ${isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"}`} />
              </>
            )}
          </NavLink>
        </div>

        <div className="hidden min-w-[260px] shrink-0 items-center justify-end gap-3 xl:flex">
          {user ? (
            <>
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className={`flex h-9 w-9 items-center justify-center rounded-full ${textColor} hover:text-brand-accent hover:bg-brand-accent/10 transition-all`}
              >
                <Heart size={18} strokeWidth={1.8} />
              </Link>
              <NotificationBell />
              {!isOwner && (
                <Link
                  to="/register"
                  className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:-translate-y-0.5 hover:shadow-md hover:opacity-90 active:translate-y-0 active:shadow-sm"
                >
                  List your venue
                </Link>
              )}

              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 rounded-full transition-all hover:opacity-80"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.userName}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-brand-accent/30"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-accent/15 text-sm font-medium text-brand-accent">
                      {user.userName?.slice(0, 2).toUpperCase()}
                    </span>
                  )}
                  <ChevronDown
                    size={14}
                    className={`${textColorMuted} transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-12 z-50 w-52 overflow-hidden rounded-2xl border border-border bg-background shadow-lg">
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-sm font-medium text-foreground">{user.userName}</p>
                      <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                    </div>
                    <div className="p-1.5">
                      <Link
                        to="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-foreground transition hover:bg-muted"
                      >
                        <User size={15} /> Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-sm text-destructive transition hover:bg-destructive/10"
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
                className={`relative group flex h-16 items-center whitespace-nowrap px-1 text-sm font-medium ${textColor} hover:text-brand-accent transition-colors`}
              >
                <span>Sign in</span>
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-brand-accent rounded-full transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
              </Link>

              <Link
                to={venueLink}
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all hover:-translate-y-0.5 hover:shadow-md hover:opacity-90 active:translate-y-0 active:shadow-sm"
              >
                List your venue
              </Link>
            </>
          )}
        </div>

        <button
          aria-label="Toggle menu"
          className={`flex h-9 w-9 items-center justify-center rounded-xl border border-border ${textColor} xl:hidden`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {mobileMenuOpen && (
        <div className="border-t border-border bg-background px-4 pb-4 pt-3 xl:hidden">
          <div className="flex flex-col gap-1">
            <NavLink to="/" end onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
              Home
            </NavLink>
            <NavLink to="/venues" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
              <Search size={18} /> Browse venues
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
              About us
            </NavLink>

            <div className="mt-2 border-t border-border pt-3">
              {user ? (
                <>
                  <div className="mb-3 flex items-center gap-3 px-3">
                    {user.profileImage ? (
                      <img src={user.profileImage} alt={user.userName} className="h-9 w-9 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-accent/15 text-sm font-medium text-brand-accent">
                        {user.userName?.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.userName}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <NavLink to="/profile" onClick={() => setMobileMenuOpen(false)} className={mobileLinkClass}>
                    <User size={18} /> Profile
                  </NavLink>

                  <div className="flex items-center gap-3 px-3 py-2.5">
                    <Bell size={18} className="text-foreground" />
                    <span className="text-sm font-medium text-foreground">Notifications</span>
                    <NotificationBell />
                  </div>

                  {!isOwner && (
                    <Link
                      to="/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="mt-2 flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-sm font-medium text-background"
                    >
                      <Tag size={15} /> List your venue
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10"
                  >
                    <LogOut size={18} /> Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground"
                  >
                    <LogIn size={16} /> Sign in
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-3 text-sm font-medium text-background"
                  >
                    <Plus size={16} /> List your venue
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
