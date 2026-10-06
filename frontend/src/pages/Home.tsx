import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {
  ArrowRight,
  HeartHandshake,
  Briefcase,
  Users2,
  Waves,
  Sparkles,
  UtensilsCrossed,
  PartyPopper,
  Palmtree,
  Landmark,
  Search,
  MapPin,
  type LucideIcon,
} from "lucide-react"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import HeroImageBackground from "../components/HeroImageBackground"
import { useGetVenueQuery } from "@/features/Venue/venueApi"
import VenueCard from "../features/Venue/components/VenueCard"

const CATEGORY_ICONS: Record<string, LucideIcon> = {
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
  const navigate = useNavigate()
  const [searchCity, setSearchCity] = useState("")

  const { data: featuredData, isLoading: featuredLoading, isError: featuredError } =
    useGetVenueQuery({ sort: "rating", limit: 6, page: 1 })

  const { data: sampleData, isLoading: sampleLoading } =
    useGetVenueQuery({ limit: SAMPLE_SIZE, page: 1 })

  const featuredVenues = featuredData?.venue ?? []
  const sampleVenues = sampleData?.venue ?? []

  const categoryCounts = sampleVenues.reduce<Record<string, number>>((acc, v) => {
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

  const cityMap = sampleVenues.reduce<Record<string, { count: number; image?: string }>>((acc, v: Record<string, any>) => {
    const city = v.location?.address?.city
    if (!city) return acc
    if (!acc[city]) acc[city] = { count: 0, image: v.photos?.[0] }
    acc[city].count += 1
    return acc
  }, {})
  const destinations = Object.entries(cityMap).sort((a, b) => b[1].count - a[1].count).slice(0, 6).map(([city, info]) => ({ city, ...info }))

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchCity) params.set("city", searchCity)
    navigate(`/venues?${params.toString()}`)
  }

  return (
    <>
      <Navbar />
      <div className="bg-background text-foreground overflow-x-hidden">

        <section className="relative pt-40 pb-24 overflow-hidden min-h-[640px] flex items-center">
          <HeroImageBackground />

          <div className="relative z-10 max-w-[900px] mx-auto px-6 text-center space-y-6">
            <span className="inline-block text-xs font-medium uppercase tracking-[0.2em] text-brand-accent">
              Kerala's venue marketplace
            </span>
            <h1 className="font-[Georgia,serif] text-5xl md:text-6xl leading-[1.15] text-foreground">
              Find the perfect venue.<br />Book it in minutes.
            </h1>
            <p className="text-base text-muted-foreground max-w-lg mx-auto leading-relaxed">
              From heritage mansions to modern glass halls, discover and book the finest event spaces across Kerala — no back-and-forth calls, no guesswork.
            </p>

            <div className="mt-8 max-w-2xl mx-auto bg-card border border-border rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-sm">
              <div className="flex-1 flex items-center gap-2 px-4 py-3 rounded-xl">
                <MapPin size={16} className="text-muted-foreground shrink-0" />
                <input
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  placeholder="City or location"
                  className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
                />
              </div>
              <button
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 bg-brand-accent text-brand-accent-foreground text-sm font-medium px-8 py-3 rounded-xl hover:opacity-90 transition-opacity"
              >
                <Search size={16} />
                Search
              </button>
            </div>
          </div>
        </section>

        <section className="py-20 px-6 max-w-[1280px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end gap-4 mb-8">
            <div className="space-y-1">
              <p className="text-brand-accent text-xs font-medium uppercase tracking-[0.2em]">Curated collections</p>
              <h2 className="text-3xl font-medium text-foreground">Explore venues by occasion</h2>
            </div>
            <Link to="/venues" className="text-foreground hover:text-brand-accent text-sm font-medium flex items-center gap-1.5 hover:gap-2.5 transition-all">
              View all categories <ArrowRight size={15} />
            </Link>
          </div>

          {sampleLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            <p className="text-sm text-muted-foreground">No categories available yet.</p>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map(({ icon: Icon, category, count }) => (
                <Link
                  key={category}
                  to={`/venues?category=${encodeURIComponent(category)}`}
                  className="group flex flex-col items-center gap-3 p-6 rounded-2xl bg-muted hover:bg-brand-accent/5 hover:shadow-md hover:-translate-y-1 transition-all duration-300 cursor-pointer text-center"
                >
                  <Icon size={28} className="text-foreground group-hover:text-brand-accent transition-colors" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{category}</p>
                    <p className="text-xs text-muted-foreground">{count} venues</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="bg-card py-20 border-y border-border">
          <div className="max-w-[1280px] mx-auto px-6">
            <div className="flex justify-between items-center mb-10">
              <div>
                <p className="text-brand-accent text-xs font-medium uppercase tracking-[0.2em]">Featured venues</p>
                <h2 className="text-3xl font-medium text-foreground">Popular venues</h2>
              </div>
            </div>

            {featuredLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-background rounded-3xl overflow-hidden border border-border animate-pulse p-3">
                    <div className="h-48 bg-muted rounded-2xl" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4" />
                      <div className="h-3 bg-muted rounded w-1/2" />
                      <div className="h-8 bg-muted rounded-xl" />
                    </div>
                  </div>
                ))}
              </div>
            ) : featuredError ? (
              <div className="text-center py-16 bg-muted rounded-3xl">
                <p className="text-foreground font-medium">Couldn't load venues right now.</p>
              </div>
            ) : featuredVenues.length === 0 ? (
              <div className="text-center py-16 bg-muted rounded-3xl">
                <p className="text-muted-foreground">No venues to show yet — check back soon.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {featuredVenues.map((venue: Record<string, any>) => (
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

        <section className="py-20 max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-medium text-foreground">Top destinations</h2>
            <p className="text-muted-foreground text-base mt-1">Find the perfect spot in your favourite city.</p>
          </div>

          {sampleLoading ? (
            <div className="flex flex-wrap justify-center gap-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-muted animate-pulse" />
              ))}
            </div>
          ) : destinations.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground">No destinations available yet.</p>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {destinations.map((d) => (
                <Link
                  key={d.city}
                  to={`/venues?city=${encodeURIComponent(d.city)}`}
                  className="flex flex-col items-center gap-3 group cursor-pointer"
                >
                  <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-transparent group-hover:border-brand-accent transition-all duration-500 bg-muted flex items-center justify-center">
                    {d.image ? (
                      <img
                        src={d.image}
                        alt={d.city}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <MapPin size={24} className="text-muted-foreground" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-foreground group-hover:text-brand-accent transition-colors">
                    {d.city}
                  </span>
                  <span className="text-xs text-muted-foreground -mt-2">{d.count} venues</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="mx-6 py-20">
          <div className="relative bg-foreground overflow-hidden rounded-[3rem] p-16 text-center">
            <div className="relative z-10 max-w-2xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-medium text-background tracking-tight">
                Own a venue?<br />Join our premier network.
              </h2>
              <p className="text-lg text-background/70 leading-relaxed">
                List your space and reach thousands of event planners looking for the perfect Kerala celebration spot.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/register" className="bg-brand-accent text-brand-accent-foreground font-medium text-sm px-10 py-4 rounded-full hover:opacity-90 transition-opacity">
                  Get started today
                </Link>
                <Link to="/about" className="border border-background/20 text-background font-medium text-sm px-10 py-4 rounded-full hover:bg-background/10 transition-colors">
                  Talk to an expert
                </Link>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </>
  )
}
