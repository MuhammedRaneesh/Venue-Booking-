"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  Users,
  Star,
  Check,
  Heart,
  SlidersHorizontal,
  ArrowRight,
} from "lucide-react";

interface VenueCardData {
  id: string;
  name: string;
  city: string;
  district: string;
  category: string;
  pricePerDay: number;
  capacity: number;
  rating: number;
  reviewsCount: number;
  image: string;
  verified: boolean;
  featured?: boolean;
}

const SAMPLE_VENUES: VenueCardData[] = [
  {
    id: "venue-1",
    name: "The Grand Malabar",
    city: "Kochi",
    district: "Ernakulam",
    category: "Wedding Halls",
    pricePerDay: 45000,
    capacity: 1200,
    rating: 4.9,
    reviewsCount: 128,
    image: "/images/kerala-grand-venue.jpg",
    verified: true,
    featured: true,
  },
  {
    id: "venue-2",
    name: "Malabar Heritage Palace",
    city: "Kozhikode",
    district: "Kozhikode",
    category: "Heritage Manors",
    pricePerDay: 55000,
    capacity: 800,
    rating: 4.8,
    reviewsCount: 94,
    image: "/images/venues/venue-1.jpg",
    verified: true,
  },
  {
    id: "venue-3",
    name: "Backwater Waterfront Lawn",
    city: "Alappuzha",
    district: "Alappuzha",
    category: "Open-Air Lawns",
    pricePerDay: 38000,
    capacity: 650,
    rating: 4.9,
    reviewsCount: 112,
    image: "/images/Sunset Dining Terrace Overlooking the Bay.png",
    verified: true,
    featured: true,
  },
  {
    id: "venue-4",
    name: "Travancore Royal Auditorium",
    city: "Thiruvananthapuram",
    district: "Thiruvananthapuram",
    category: "Banquet Halls",
    pricePerDay: 60000,
    capacity: 1500,
    rating: 4.7,
    reviewsCount: 86,
    image: "/images/venues/venue-2.jpg",
    verified: true,
  },
  {
    id: "venue-5",
    name: "Thrissur Cultural Convention Center",
    city: "Thrissur",
    district: "Thrissur",
    category: "Convention Centers",
    pricePerDay: 50000,
    capacity: 2000,
    rating: 4.8,
    reviewsCount: 140,
    image: "/images/venues/venue-3.jpg",
    verified: true,
  },
  {
    id: "venue-6",
    name: "Wayanad Valley Pavilion",
    city: "Kalpetta",
    district: "Wayanad",
    category: "Open-Air Lawns",
    pricePerDay: 42000,
    capacity: 500,
    rating: 4.9,
    reviewsCount: 75,
    image: "/images/venues/venue-4.png",
    verified: true,
  },
];

const CATEGORIES = [
  "All",
  "Wedding Halls",
  "Banquet Halls",
  "Open-Air Lawns",
  "Heritage Manors",
  "Convention Centers",
];

const CITIES = [
  "All Cities",
  "Kochi",
  "Kozhikode",
  "Thiruvananthapuram",
  "Thrissur",
  "Alappuzha",
];

export default function VenuesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [savedIds, setSavedIds] = useState<string[]>([]);

  const toggleWishlist = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    setSavedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredVenues = SAMPLE_VENUES.filter((venue) => {
    const matchesSearch =
      venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venue.district.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || venue.category === selectedCategory;

    const matchesCity =
      selectedCity === "All Cities" || venue.city === selectedCity;

    return matchesSearch && matchesCategory && matchesCity;
  });

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Header */}
      <div className="max-w-3xl mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-coral-100 text-coral-700 text-xs font-semibold mb-3">
          <span>Kerala Verified Venues</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground tracking-tight">
          Explore premier venues for your celebration
        </h1>
        <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
          Browse verified auditoriums, wedding halls, and event spaces across Kerala with transparent daily pricing and direct host approval.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-card border border-border rounded-2xl p-4 mb-8 shadow-2xs space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by venue name, city, or district..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-xl bg-muted/60 border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500 transition-all"
            />
          </div>

          {/* City select */}
          <div className="w-full md:w-56">
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full h-11 px-3 rounded-xl bg-muted/60 border border-border text-sm text-foreground focus:outline-hidden focus:ring-2 focus:ring-coral-500/20 focus:border-coral-500"
            >
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground shrink-0 mr-1" />
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? "bg-coral-500 text-white shadow-2xs"
                  : "bg-muted text-foreground/80 hover:bg-muted/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Venues Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
        {filteredVenues.map((venue) => {
          const isSaved = savedIds.includes(venue.id);

          return (
            <div
              key={venue.id}
              className="group bg-card border border-border rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image Container */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {/* Wishlist button */}
                <button
                  type="button"
                  onClick={(e) => toggleWishlist(venue.id, e)}
                  className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-foreground hover:text-coral-500 shadow-xs transition-colors z-10 cursor-pointer"
                  aria-label="Save to wishlist"
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isSaved ? "fill-coral-500 text-coral-500" : ""
                    }`}
                  />
                </button>

                {/* Verified badge */}
                {venue.verified && (
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-semibold text-emerald-700 flex items-center gap-1 shadow-2xs">
                    <Check className="w-3 h-3 stroke-[3]" />
                    <span>Verified</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span className="font-medium text-coral-600 bg-coral-50 px-2 py-0.5 rounded-md">
                      {venue.category}
                    </span>
                    <div className="flex items-center gap-1 text-foreground font-semibold">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                      <span>{venue.rating}</span>
                      <span className="text-muted-foreground font-normal">
                        ({venue.reviewsCount})
                      </span>
                    </div>
                  </div>

                  <h3 className="font-serif text-xl font-bold text-foreground group-hover:text-coral-600 transition-colors">
                    {venue.name}
                  </h3>

                  <div className="flex items-center gap-3 text-xs text-muted-foreground mt-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-coral-500" />
                      <span>
                        {venue.city}, {venue.district}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      <span>Up to {venue.capacity} guests</span>
                    </div>
                  </div>
                </div>

                {/* Footer / Price & Action */}
                <div className="mt-5 pt-4 border-t border-border/80 flex items-center justify-between">
                  <div>
                    <span className="text-xs text-muted-foreground block">
                      Daily rate
                    </span>
                    <span className="text-lg font-bold text-coral-600">
                      ₹{venue.pricePerDay.toLocaleString()}
                    </span>
                    <span className="text-xs text-muted-foreground ml-0.5">
                      /day
                    </span>
                  </div>

                  <Link
                    href={`/onboarding/application?venue=${venue.id}`}
                    className="h-9 px-4 rounded-full bg-coral-500 hover:bg-coral-600 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <span>Request Date</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredVenues.length === 0 && (
        <div className="text-center py-16 bg-card border border-border rounded-3xl p-8">
          <p className="font-serif text-xl font-bold text-foreground">
            No venues found
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Try adjusting your search query or removing filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("All");
              setSelectedCity("All Cities");
            }}
            className="mt-4 px-5 py-2 rounded-full bg-coral-500 text-white text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}

