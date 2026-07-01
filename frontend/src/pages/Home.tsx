import { Link } from "react-router-dom"
import {
  ArrowRight,
  HeartHandshake,
  Briefcase,
  Users2,
  Waves,
  Sparkles,
  HeadphonesIcon,
  UtensilsCrossed,
  PartyPopper,
  Palmtree,
  Landmark,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import home from "@/assets/ChatGPT Image Jun 14, 2026, 11_52_07 PM.png"
import { useGetVenueQuery } from "../api/venueApi"
import VenueCard from "../features/Venue/components/VenueCard"

const CATEGORY_ICONS: Record<string, any> = {
  "Wedding Hall": HeartHandshake,
  "Convention Center": Users2,
  "Conference Hall": Briefcase,
  "Banquet Hall": UtensilsCrossed,
  "Party Hall": PartyPopper,
  "Outdoor Venue": Waves,
  "Resort": Palmtree,
  "Auditorium": Landmark,
}

const SAMPLE_SIZE = 50

export default function Home() {

  const { data: featuredData, isLoading: featuredLoading, isError: featuredError } =
    useGetVenueQuery({ sort: "rating", limit: 6, page: 1 })

  const { data: sampleData, isLoading: sampleLoading } =
    useGetVenueQuery({ limit: SAMPLE_SIZE, page: 1 })

  const featuredVenues = featuredData?.venue ?? []
  const sampleVenues = sampleData?.venue ?? []
  const totalVenueCount = sampleData?.totalCount


  const categoryCounts = sampleVenues.reduce<Record<string, number>>((acc, v: any) => {
    if (v.category) acc[v.category] = (acc[v.category] ?? 0) + 1
    return acc
  }, {})
  const categories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([category, count]) => ({
      category,
      count,
      icon: CATEGORY_ICONS[category] ?? Sparkles,
    }))
  const cityMap = sampleVenues.reduce<Record<string, { count: number; image?: string }>>((acc, v: any) => {
    const city = v.location?.address?.city
    if (!city) return acc
    if (!acc[city]) acc[city] = { count: 0, image: v.photos?.[0] }
    acc[city].count += 1
    return acc
  }, {})
  const destinations = Object.entries(cityMap).sort((a, b) => b[1].count - a[1].count).slice(0, 6).map(([city, info]) => ({ city, ...info }))


  const topRating = sampleVenues.length
    ? Math.max(...sampleVenues.map((v: any) => v.averageRating ?? 0))
    : undefined
  const distinctCityCount = Object.keys(cityMap).length
  const distinctCategoryCount = Object.keys(categoryCounts).length

  const stats = [
    { num: totalVenueCount !== undefined ? `${totalVenueCount}+` : "—", label: "Venues listed" },
    { num: distinctCityCount || "—", label: "Cities covered" },
    { num: topRating !== undefined ? `${topRating.toFixed(1)}★` : "—", label: "Top rated venue" },
    { num: distinctCategoryCount || "—", label: "Venue categories" },
  ]

  return (
    <>
      <Navbar />
      <div className="bg-[#fcf9f8] text-[#1c1b1b] font-[Manrope,sans-serif] overflow-x-hidden">

        <section className="relative min-h-[95vh] flex items-center pt-20">
          <div className="absolute inset-0 z-0">
            <img src={home} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-purple-950/70" />
          </div>

          <div className="relative z-10 w-full max-w-[1280px] mx-auto px-16 py-20 flex flex-col items-start gap-6">
            <div className="max-w-3xl space-y-3">
              <h1 className="font-[EB_Garamond,serif] text-5xl font-semibold text-white leading-tight tracking-tight">
                Find the Perfect Venue for{" "}
                <span className="text-[#D4AF37] italic">Every Celebration</span>
              </h1>
              <p className="text-lg text-white/90 max-w-xl leading-relaxed">
                From heritage mansions to modern glass halls, book the finest spaces in God's Own Country.
              </p>
            </div>

            <div className="flex gap-8 mt-2">
              {stats.map(s => (
                <div key={s.label} className="text-white">
                  <div className="text-xl font-semibold">{s.num}</div>
                  <div className="text-sm text-white/70 mt-0.5">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-20 px-16 max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
            <div className="space-y-1">
              <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.2em]">Curated Collections</p>
              <h2 className="font-[EB_Garamond,serif] text-3xl font-medium text-[#2e0052]">Explore Venues by Occasion</h2>
            </div>
            <Link to="/venues" className="text-[#2e0052] text-sm font-semibold flex items-center gap-1.5 hover:gap-2.5 transition-all">
              View all categories <ArrowRight size={15} />
            </Link>
          </div>

          {sampleLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-[#f6f3f2] animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="text-sm text-[#4c4451]">No categories available yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map(({ icon: Icon, category, count }) => (
                <Link
                  key={category}
                  to={`/venues?category=${encodeURIComponent(category)}`}
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-[#f6f3f2] hover:bg-[#4b0082] transition-all duration-500 cursor-pointer text-center shadow-sm"
                >
                  <Icon size={32} className="text-[#2e0052] group-hover:text-white transition-colors" />
                  <div>
                    <p className="text-sm font-semibold text-[#1c1b1b] group-hover:text-white transition-colors">{category}</p>
                    <p className="text-xs text-[#9b93a0] group-hover:text-white/70 transition-colors">{count} venues</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="bg-white py-20">
          <div className="max-w-[1280px] mx-auto px-16">
            <div className="flex justify-between items-center mb-10">
              <div>
                <p className="text-[#D4AF37] text-xs font-semibold uppercase tracking-[0.2em]">Featured Venues</p>
                <h2 className="font-[EB_Garamond,serif] text-3xl font-medium text-[#2e0052]">Popular Venues</h2>
              </div>
            </div>

            {featuredLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-white rounded-3xl overflow-hidden border border-slate-100 animate-pulse p-3">
                    <div className="h-48 bg-slate-100 rounded-2xl" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                      <div className="h-3 bg-slate-100 rounded w-1/2" />
                      <div className="h-8 bg-slate-100 rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredError ? (
              <div className="text-center py-16 bg-[#f6f3f2] rounded-3xl">
                <p className="text-[#2e0052] font-medium">Couldn't load venues right now.</p>
              </div>
            ) : featuredVenues.length === 0 ? (
              <div className="text-center py-16 bg-[#f6f3f2] rounded-3xl">
                <p className="text-[#4c4451]">No venues to show yet — check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredVenues.map((venue: any) => (
                  <VenueCard
                    key={venue._id}
                    id={venue._id}
                    venueName={venue.venueName}
                    image={venue.photos?.[0] ?? "/placeholder-venue.jpg"}
                    location={venue.location?.address?.city}
                    capacity={venue.capacity}
                    pricePerDay={venue.pricing?.pricePerDay}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-20 max-w-[1280px] mx-auto px-16">
          <div className="text-center mb-16">
            <h2 className="font-[EB_Garamond,serif] text-3xl font-medium text-[#2e0052]">Top Destinations</h2>
            <p className="text-[#4c4451] text-base mt-1">Find the perfect spot in your favourite city.</p>
          </div>

          {sampleLoading ? (
            <div className="flex flex-wrap justify-center gap-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-32 h-32 md:w-44 md:h-44 rounded-full bg-[#f6f3f2] animate-pulse" />
              ))}
            </div>
          ) : destinations.length === 0 ? (
            <p className="text-center text-sm text-[#4c4451]">No destinations available yet.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {destinations.map(d => (
                <Link
                  key={d.city}
                  to={`/venues?city=${encodeURIComponent(d.city)}`}
                  className="flex flex-col items-center gap-4 group cursor-pointer"
                >
                  <div className="w-32 h-32 md:w-44 md:h-44 rounded-full overflow-hidden border-4 border-transparent group-hover:border-[#D4AF37] transition-all duration-500 shadow-[0px_4px_20px_rgba(75,0,130,0.1)] bg-[#f6f3f2]">
                    {d.image ? (
                      <img
                        src={d.image}
                        alt={d.city}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : null}
                  </div>
                  <span className="text-base font-bold text-[#2e0052] group-hover:text-[#735c00] transition-colors">
                    {d.city}
                  </span>
                  <span className="text-xs text-[#9b93a0] -mt-3">{d.count} venues</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mx-16 py-20">
          <div className="relative bg-[#2e0052] overflow-hidden rounded-[3rem] p-16 text-center">
            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#D4AF37 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="font-[EB_Garamond,serif] text-5xl font-semibold text-white">
                Own a Venue?<br />Join Our Premier Network.
              </h2>
              <p className="text-lg text-white/80 leading-relaxed">
                List your space and reach thousands of high-end event planners looking for the perfect Kerala celebration spot.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link to="/register" className="bg-[#D4AF37] text-[#241a00] font-semibold text-sm px-10 py-4 rounded-full hover:scale-105 transition-transform">
                  Get Started Today
                </Link>
                <Link to="/about" className="border border-white/30 text-white font-semibold text-sm px-10 py-4 rounded-full hover:bg-white/10 transition-colors">
                  Talk to an Expert
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />

        <div className="fixed bottom-8 right-8 z-50">
          <button
            aria-label="Support"
            className="bg-[#D4AF37] text-[#241a00] w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-transform"
          >
            <HeadphonesIcon size={22} />
          </button>
        </div>
      </div>
    </>
  )
}
