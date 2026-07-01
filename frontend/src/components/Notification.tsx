import { useNotifications } from "@/hooks/useNotificationHook"
import { useState, useEffect } from "react"
import { Bell, CheckCheck, Trash2, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

function NotificationBell() {
    const [open, setOpen] = useState(false)

    const { notifications, unreadCount, handleMarkAsRead, markAllAsRead, deleteNotification, clearAll } = useNotifications()
    useEffect(() => {
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") setOpen(false)
        }
        document.addEventListener("keydown", handler)
        return () => document.removeEventListener("keydown", handler)
    }, [])

    useEffect(() => {
        if (open) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => { document.body.style.overflow = "" }
    }, [open])

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                aria-label="Notifications"
                className="relative flex h-9 w-9 items-center justify-center rounded-full text-[#1c1b1b] hover:text-[#C9A84C] transition-colors"
            >
                <Bell size={18} strokeWidth={1.8} />
                {unreadCount > 0 && (
                    <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                        {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                )}
            </button>

            {open && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
                    onClick={() => setOpen(false)}
                >
                    <div
                        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e0d0]">
                            <div className="flex items-center gap-2.5">
                                <Bell size={20} className="text-[#C9A84C]" />
                                <h2 className="text-lg font-semibold text-[#1c1b1b]">Notifications</h2>
                                {unreadCount > 0 && (
                                    <span className="flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                                        {unreadCount}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center gap-3">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={() => markAllAsRead()}
                                        className="flex items-center gap-1.5 text-xs font-medium text-[#C9A84C] hover:underline"
                                    >
                                        <CheckCheck size={14} /> Mark all read
                                    </button>
                                )}
                                {notifications.length > 0 && (
                                    <button
                                        onClick={() => clearAll()}
                                        className="flex items-center gap-1.5 text-xs font-medium text-red-400 hover:underline"
                                    >
                                        <Trash2 size={14} /> Clear all
                                    </button>
                                )}
                                <button
                                    onClick={() => setOpen(false)}
                                    className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f6f3f2] text-[#7d7483] hover:bg-[#e8e0d0] transition-colors ml-1"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto divide-y divide-[#f0eded]">
                            {notifications.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-[#7d7483]">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f6f3f2] mb-4">
                                        <Bell size={28} strokeWidth={1.2} />
                                    </div>
                                    <p className="text-base font-medium text-[#1c1b1b]">All caught up!</p>
                                    <p className="text-sm mt-1">No notifications yet</p>
                                </div>
                            ) : (
                                notifications.map((n: any) => (
                                    <div
                                        key={n._id}
                                        onClick={() => handleMarkAsRead(n._id, n.isRead)}
                                        className={`flex cursor-pointer items-start gap-4 px-6 py-4 transition-colors hover:bg-[#f6f3f2] ${
                                            !n.isRead ? "bg-[#fdf9f0] border-l-4 border-l-[#C9A84C]" : ""
                                        }`}
                                    >
                                        <div className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                                            !n.isRead ? "bg-[#C9A84C]/15" : "bg-[#f0eded]"
                                        }`}>
                                            <Bell size={15} className={!n.isRead ? "text-[#C9A84C]" : "text-[#7d7483]"} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-snug ${
                                                !n.isRead ? "font-semibold text-[#1c1b1b]" : "font-normal text-[#4c4451]"
                                            }`}>
                                                {n.title}
                                            </p>
                                            <p className="mt-1 text-sm text-[#7d7483] line-clamp-2">
                                                {n.message}
                                            </p>
                                            <p className="mt-1.5 text-[11px] text-[#7d7483]">
                                                {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                            </p>
                                        </div>
                                        <div className="flex flex-col items-center gap-2 shrink-0">
                                            {!n.isRead && (
                                                <div className="h-2 w-2 rounded-full bg-[#C9A84C]" />
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    deleteNotification(n._id)
                                                }}
                                                className="text-[#c4b8b8] hover:text-red-400 transition-colors"
                                            >
                                                <X size={15} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                        {notifications.length > 0 && (
                            <div className="px-6 py-3 border-t border-[#e8e0d0] bg-[#fdfcfb]">
                                <p className="text-xs text-center text-[#7d7483]">
                                    {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? "s" : ""}` : "All notifications read"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

export default NotificationBell