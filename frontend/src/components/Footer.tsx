import { Link } from "react-router-dom"
import {
  Globe,
  Heart,
  MapPin,
  Tag,
} from "lucide-react"

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Home", to: "/" },
      { label: "Venues", to: "/venues" },
      { label: "My Bookings", to: "/booking" },
      { label: "Wishlist", to: "/wishlist" },
    ],
  },
  {
    title: "For Owners",
    links: [
      { label: "List Your Venue", to: "/register" },
      { label: "Owner Dashboard", to: "/owner" },
      { label: "Venue Bookings", to: "/owner/booking" },
      { label: "Owner Profile", to: "/owner/profile" },
    ],
  },
]

function Footer() {
  return (
    <footer className="bg-[#fcf9f8] text-[#1c1b1b] font-[Manrope,sans-serif] border-t border-[#e8e0d0]">
      <div className="max-w-[1280px] mx-auto px-6 py-7 sm:px-8 lg:px-16">
        <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_0.9fr_1fr]">
          <div className="space-y-3">
            <Link to="/" className="inline-flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C9A84C]/15">
                <MapPin size={20} className="text-[#C9A84C]" fill="#C9A84C" />
              </span>
              <span className="font-[EB_Garamond,serif] text-xl font-semibold text-[#1c1b1b]">
                BookMy<span className="text-[#C9A84C]">Venue</span>
              </span>
            </Link>

            <p className="max-w-sm text-sm leading-5 text-[#4c4451]">
              Discover elegant venues for weddings, parties, meetings, and celebrations across Kerala.
            </p>
          </div>

          {footerLinks.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-bold uppercase tracking-[0.16em] text-[#2e0052]">
                {group.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm font-medium leading-5 text-[#4c4451] transition-colors hover:text-[#C9A84C]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <div className="mt-4 flex gap-2.5">
              <a
                href="https://www.instagram.com"
                aria-label="Website"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8e0d0] bg-white text-[#2e0052] transition hover:border-[#C9A84C] hover:text-[#C9A84C]"
              >
                <Globe size={17} />
              </a>
              <Link
                to="/wishlist"
                aria-label="Wishlist"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8e0d0] bg-white text-[#2e0052] transition hover:border-[#C9A84C] hover:text-[#C9A84C]"
              >
                <Heart size={17} />
              </Link>
              <Link
                to="/register"
                aria-label="List your venue"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[#e8e0d0] bg-white text-[#2e0052] transition hover:border-[#C9A84C] hover:text-[#C9A84C]"
              >
                <Tag size={17} />
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-[#e8e0d0] pt-4 text-xs font-medium text-[#7d7483] sm:flex-row sm:items-center sm:justify-between">
          <p>Copyright 2026 BookMyVenue. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link to="/venues" className="hover:text-[#C9A84C]">
              Find Venues
            </Link>
            <Link to="/login" className="hover:text-[#C9A84C]">
              Sign In
            </Link>
            <Link to="/register" className="hover:text-[#C9A84C]">
              Become an Owner
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
