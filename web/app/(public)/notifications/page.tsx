"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCircle2,
  Calendar,
  Sparkles,
  Check,
  ArrowRight,
} from "lucide-react";

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  category: "booking" | "system" | "promotion";
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "notif-1",
    title: "Welcome to Venuo!",
    description:
      "Explore verified wedding halls, banquets, and auditoriums across Kerala with transparent pricing.",
    time: "10 mins ago",
    category: "system",
    read: false,
  },
  {
    id: "notif-2",
    title: "New venue in Kochi added",
    description:
      "The Grand Malabar, Kochi is now accepting wedding bookings for upcoming auspicious dates.",
    time: "2 hours ago",
    category: "promotion",
    read: false,
  },
  {
    id: "notif-3",
    title: "Host Response Guarantee",
    description:
      "All verified hosts respond within 2 hours. Your celebration planning is safe with us.",
    time: "1 day ago",
    category: "booking",
    read: true,
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markItemAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const filtered = notifications.filter((n) =>
    filter === "unread" ? !n.read : true
  );

  return (
    <div className="w-full max-w-[900px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border/80 gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-100 text-coral-700 text-xs font-semibold mb-2">
            <Bell className="w-3.5 h-3.5 text-coral-600" />
            <span>Updates &amp; Alerts</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Notifications
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Stay updated with your venue requests, bookings, and host responses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={markAllAsRead}
            className="text-xs font-semibold text-coral-600 hover:text-coral-700 transition-colors cursor-pointer"
          >
            Mark all as read
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
            filter === "all"
              ? "bg-coral-500 text-white shadow-2xs"
              : "bg-muted text-foreground/80 hover:bg-muted/80"
          }`}
        >
          All ({notifications.length})
        </button>
        <button
          onClick={() => setFilter("unread")}
          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
            filter === "unread"
              ? "bg-coral-500 text-white shadow-2xs"
              : "bg-muted text-foreground/80 hover:bg-muted/80"
          }`}
        >
          Unread ({notifications.filter((n) => !n.read).length})
        </button>
      </div>

      {/* Notification List */}
      <div className="space-y-3">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => markItemAsRead(item.id)}
            className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
              !item.read
                ? "bg-card border-coral-200/80 shadow-2xs"
                : "bg-card/60 border-border/70 hover:bg-card"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                item.category === "booking"
                  ? "bg-emerald-50 text-emerald-600"
                  : item.category === "promotion"
                  ? "bg-amber-50 text-amber-600"
                  : "bg-coral-50 text-coral-600"
              }`}
            >
              {item.category === "booking" ? (
                <Calendar className="w-5 h-5 stroke-[2]" />
              ) : item.category === "promotion" ? (
                <Sparkles className="w-5 h-5 stroke-[2]" />
              ) : (
                <Bell className="w-5 h-5 stroke-[2]" />
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-foreground">
                  {item.title}
                </h3>
                <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                  {item.time}
                </span>
              </div>
              <p className="text-xs sm:text-[13px] text-muted-foreground mt-1 leading-relaxed">
                {item.description}
              </p>
            </div>

            {!item.read && (
              <span className="w-2 h-2 rounded-full bg-coral-500 shrink-0 mt-2" />
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-card border border-border rounded-3xl p-8">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <p className="font-serif text-lg font-bold text-foreground">
              You are all caught up!
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              No unread notifications at this time.
            </p>
          </div>
        )}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/venues"
          className="inline-flex items-center gap-2 text-xs font-semibold text-coral-600 hover:text-coral-700"
        >
          <span>Browse venues to plan your event</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

