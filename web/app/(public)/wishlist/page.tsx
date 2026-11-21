"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Heart, MapPin, Star, Trash2, ArrowRight } from "lucide-react";

interface SavedVenue {
  id: string;
  name: string;
  city: string;
  category: string;
  pricePerDay: number;
  rating: number;
  image: string;
}

const INITIAL_SAVED: SavedVenue[] = [
  {
    id: "venue-1",
    name: "The Grand Malabar",
    city: "Kochi, Ernakulam",
    category: "Wedding Halls",
    pricePerDay: 45000,
    rating: 4.9,
    image: "/images/kerala-grand-venue.jpg",
  },
  {
    id: "venue-3",
    name: "Backwater Waterfront Lawn",
    city: "Alappuzha",
    category: "Open-Air Lawns",
    pricePerDay: 38000,
    rating: 4.9,
    image: "/images/Sunset Dining Terrace Overlooking the Bay.png",
  },
];

export default function WishlistPage() {
  const [items, setItems] = useState<SavedVenue[]>(INITIAL_SAVED);

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border/80 gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-coral-100 text-coral-700 text-xs font-semibold mb-2">
            <Heart className="w-3.5 h-3.5 fill-coral-500 text-coral-500" />
            <span>Saved Spaces</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-foreground">
            Your Wishlist
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Keep track of venues you love for your upcoming celebration.
          </p>
        </div>

        {items.length > 0 && (
          <Link
            href="/venues"
            className="h-10 px-5 rounded-full border border-border bg-card hover:bg-muted text-foreground text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <span>Explore more venues</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
      </div>

      {items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((venue) => (
            <div
              key={venue.id}
              className="bg-card border border-border rounded-3xl overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-[16/10] w-full bg-muted">
                <Image
                  src={venue.image}
                  alt={venue.name}
                  fill
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeItem(venue.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-destructive hover:bg-destructive-soft transition-colors cursor-pointer shadow-xs"
                  title="Remove from saved"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                    <span>{venue.category}</span>
                    <span className="flex items-center gap-1 font-semibold text-foreground">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      {venue.rating}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-foreground">
                    {venue.name}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <MapPin className="w-3 h-3 text-coral-500" />
                    <span>{venue.city}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                  <span className="font-bold text-coral-600 text-sm">
                    ₹{venue.pricePerDay.toLocaleString()}
                    <span className="text-xs text-muted-foreground font-normal">
                      /day
                    </span>
                  </span>

                  <Link
                    href={`/onboarding/application?venue=${venue.id}`}
                    className="h-8 px-3.5 rounded-full bg-coral-500 hover:bg-coral-600 text-white text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <span>Request</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-card border border-border rounded-3xl p-8 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-full bg-coral-50 border border-coral-200/60 flex items-center justify-center text-coral-500 mx-auto mb-4">
            <Heart className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-foreground mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-sm text-muted-foreground mb-6">
            Click the heart icon on any wedding hall or venue to save it here for easy comparison.
          </p>
          <Link
            href="/venues"
            className="inline-flex items-center gap-2 h-11 px-6 rounded-full bg-coral-500 hover:bg-coral-600 text-white text-sm font-medium transition-colors shadow-xs"
          >
            <span>Browse venues</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
    </div>
  );
}

