import { Bell, CheckCheck, Trash2, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNotifications } from "@/hooks/useNotificationHook"

function OwnerNotificationDropdown() {
    const {
        notifications,
        unreadCount,
        handleMarkAsRead,
        markAllAsRead,
        deleteNotification,
        clearAll,
    } = useNotifications()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9 rounded-[6px] text-[#4c4451] hover:bg-[#fcf9f8] hover:text-[#1c1b1b]"
                    aria-label="Notifications"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#C9A84C]" />
                    )}
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
                align="end"
                className="w-85 rounded-[8px] border border-[#e8e0d0] bg-white p-0 text-[#1c1b1b] shadow-lg"
            >3
                <div className="flex items-center justify-between border-b border-[#e8e0d0] px-4 py-3">
                    <div>
                        <p className="text-sm font-semibold text-[#1c1b1b]">Notifications</p>
                        <p className="text-xs text-[#4c4451]">{unreadCount} unread</p>
                    </div>
                    <div className="flex items-center gap-1">
                        {unreadCount > 0 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="rounded-[6px] text-[#4c4451] hover:bg-[#fcf9f8] hover:text-[#1c1b1b]"
                                onClick={() => markAllAsRead()}
                                title="Mark all read"
                            >
                                <CheckCheck className="h-4 w-4" />
                            </Button>
                        )}
                        {notifications.length > 0 && (
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-sm"
                                className="rounded-[6px] text-[#4c4451] hover:bg-[#fcf9f8] hover:text-[#1c1b1b]"
                                onClick={() => clearAll()}
                                title="Clear all"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </div>

                <div className="max-h-90 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <div className="px-4 py-10 text-center">
                            <p className="text-sm font-semibold text-[#1c1b1b]">All caught up</p>
                            <p className="mt-1 text-xs text-[#4c4451]">No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map((notification: any) => {
                            const unread = !notification.isRead

                            return (
                                <DropdownMenuItem
                                    key={notification._id}
                                    onSelect={(event) => {
                                        event.preventDefault()
                                        handleMarkAsRead(notification._id, notification.isRead)
                                    }}
                                    className={`relative cursor-pointer rounded-none border-b border-[#e8e0d0] px-4 py-3 focus:bg-[#f6f3f2] ${
                                        unread ? "bg-[#fcf9f8]" : "bg-white"
                                    }`}
                                >
                                    {unread && <span className="absolute left-2 top-5 h-2 w-2 rounded-full bg-[#C9A84C]" />}
                                    <div className="min-w-0 flex-1 pl-3">
                                        <p className="truncate text-sm font-semibold text-[#1c1b1b]">{notification.title}</p>
                                        <p className="mt-1 line-clamp-2 text-xs text-[#4c4451]">{notification.message}</p>
                                        <p className="mt-1 text-xs text-[#4c4451]">
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        className="rounded-[6px] p-1 text-[#4c4451] hover:bg-[#f6f3f2] hover:text-[#1c1b1b]"
                                        onClick={(event) => {
                                            event.stopPropagation()
                                            deleteNotification(notification._id)
                                        }}
                                        aria-label="Delete notification"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </DropdownMenuItem>
                            )
                        })
                    )}
                </div>

                {notifications.length > 0 && (
                    <>
                        <DropdownMenuSeparator className="m-0 bg-[#e8e0d0]" />
                        <div className="px-4 py-3 text-right text-xs text-[#4c4451]">
                            {notifications.length} total
                        </div>
                    </>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default OwnerNotificationDropdown
