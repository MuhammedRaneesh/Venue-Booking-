import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom"
import { useSelector, useDispatch } from "react-redux"
import type { RootState } from "@/store"
import { logout } from "@/features/auth/slices/authSlice"
import NotificationBell from "@/components/Notification"
import { useUserLogoutMutation } from "@/features/auth/authApi"
import { api } from "@/api/baseApi"
import { socket } from "@/services/socket"
import {
    LayoutDashboard,
    Users,
    Building2,
    FileText,
    CalendarCheck,
    LogOut,
    Home,
    UserCircle2,
    ShieldCheck,
    UserRound,
    Tags,
} from "lucide-react"

const navItems = [
    { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
    { to: "/admin/users", label: "Users", icon: Users },
    { to: "/admin/categories", label: "Categories", icon: Tags },
    { to: "/admin/venues", label: "Venues", icon: Building2 },
    { to: "/admin/applications", label: "Applications", icon: FileText },
    { to: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
]

export default function AdminLayout() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const location = useLocation()
    const user = useSelector((state: RootState) => state.auth.user)
    const [userLogout] = useUserLogoutMutation()

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

    const currentTitle =
        navItems.find(item =>
            item.end
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to)
        )?.label ?? "Admin Console"

    return (
        <div className="flex h-screen w-screen bg-[#FDFDFD] overflow-hidden antialiased">

            <aside className="w-[260px] h-full border-r border-[#F3EFE9] bg-[#FCFBF9] flex flex-col shrink-0 select-none">


                <div className="flex items-center gap-3 px-6 py-5 border-b border-[#F3EFE9]/40">
                    <div className="w-8 h-8 rounded-xl bg-[#C29F47] flex items-center justify-center shadow-xs shrink-0">
                        <ShieldCheck className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <h1 className="text-[15px] font-bold text-[#2B1343] leading-tight tracking-tight">
                            BookMyVenue
                        </h1>
                        <p className="text-[11px] text-[#5F5665] font-semibold tracking-wider uppercase mt-0.5 opacity-80">
                            Admin Console
                        </p>
                    </div>
                </div>

                {/* Nav */}
                <div className="flex-1 overflow-y-auto py-4">
                    <p className="px-6 text-[10px] font-bold uppercase tracking-widest text-[#5F5665]/70 mb-2">
                        Management
                    </p>

                    <nav className="flex flex-col gap-1 px-3">
                        {navItems.map(({ to, label, icon: Icon, end }) => (
                            <NavLink
                                key={to}
                                to={to}
                                end={end}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-xl py-3 px-4 text-[14px] font-medium transition-all duration-200 group ${isActive
                                        ? "bg-[#F5EFE4] text-[#C29F47] font-bold shadow-2xs"
                                        : "text-[#5F5665] hover:bg-[#F9F6F0] hover:text-[#2B1343]"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon
                                            className={`w-[18px] h-[18px] shrink-0 transition-transform duration-200 group-hover:scale-105 ${isActive
                                                ? "text-[#C29F47]"
                                                : "text-[#5F5665] group-hover:text-[#2B1343]"
                                                }`}
                                        />
                                        <span>{label}</span>
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Bottom section */}
                <div className="mt-auto border-t border-[#F3EFE9] bg-[#FCFBF9] p-4">
                    {/* Admin profile card */}
                    <div
                        className="flex items-center gap-3 bg-white border border-[#F3EFE9]/60 p-3 rounded-xl mb-3 shadow-2xs cursor-pointer hover:border-[#C29F47]/40 hover:shadow-md transition-all duration-200 group"
                        title="Admin profile"
                    >
                        {user?.profileImage ? (
                            <img
                                src={user.profileImage}
                                alt={user.userName}
                                className="w-9 h-9 rounded-xl object-cover shrink-0"
                            />
                        ) : (
                            <div className="w-9 h-9 rounded-xl bg-[#F5EFE4] flex items-center justify-center shrink-0 group-hover:bg-[#C29F47]/20 transition-colors">
                                <UserCircle2 className="w-5 h-5 text-[#C29F47]" />
                            </div>
                        )}
                        <div className="min-w-0 overflow-hidden flex-1">
                            <p className="text-xs font-bold text-[#2B1343] truncate">
                                {user?.userName || "Admin"}
                            </p>
                            <p className="text-[11px] text-[#5F5665] font-medium truncate mt-0.5">
                                {user?.email || "admin@bookmyvenue.com"}
                            </p>
                        </div>
                        <UserRound className="w-3.5 h-3.5 text-[#C29F47]/60 shrink-0 group-hover:text-[#C29F47] transition-colors" />
                    </div>

                    {/* Go to Home */}
                    <button
                        type="button"
                        onClick={() => navigate("/")}
                        className="w-full flex items-center gap-3 rounded-xl py-2.5 px-4 text-xs font-bold text-[#5F5665] hover:bg-[#F9F6F0] hover:text-[#2B1343] border border-transparent transition-all duration-150 mb-1"
                    >
                        <Home className="w-4 h-4 shrink-0" />
                        <span>Go to Home</span>
                    </button>

                    {/* Logout */}
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 rounded-xl py-2.5 px-4 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-100 transition-all duration-150"
                    >
                        <LogOut className="w-4 h-4 shrink-0" />
                        <span>Logout Account</span>
                    </button>
                </div>
            </aside>

            {/* ── MAIN AREA ── */}
            <main className="flex-1 h-full overflow-hidden flex flex-col bg-[#FDFDFD]">


                <header className="h-16 border-b border-[#F3EFE9] bg-white flex items-center justify-between px-8 shrink-0 shadow-2xs">
                    <h2 className="text-base font-bold text-[#2B1343] tracking-tight transition-all">
                        {currentTitle}
                    </h2>

                    {/* add NotificationBell here */}
                    <div className="flex items-center gap-3">
                        <NotificationBell />

                        <div className="flex items-center gap-2.5 rounded-2xl px-3 py-1.5 hover:bg-[#F5EFE4] border border-transparent hover:border-[#EADFCB] transition-all duration-200 cursor-default group">
                            <div className="text-right hidden sm:block">
                                <p className="text-xs font-bold text-[#2B1343] leading-tight">{user?.userName || "Admin"}</p>
                                <p className="text-[10px] text-[#5F5665] font-medium">Super Admin</p>
                            </div>
                            {user?.profileImage ? (
                                <img src={user.profileImage} alt={user.userName} className="w-9 h-9 rounded-xl object-cover ring-2 ring-[#F3EFE9] group-hover:ring-[#C29F47]/40 transition-all duration-200 shrink-0" />
                            ) : (
                                <div className="w-9 h-9 rounded-xl bg-[#F5EFE4] border border-[#EADFCB] flex items-center justify-center shrink-0 group-hover:bg-[#C29F47]/20 group-hover:border-[#C29F47]/40 transition-all duration-200">
                                    <UserCircle2 className="w-5 h-5 text-[#C29F47]" />
                                </div>
                            )}
                        </div>
                    </div>
                </header>


                {/* Page content */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-8 max-w-7xl mx-auto w-full min-h-full flex flex-col">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    )
}
