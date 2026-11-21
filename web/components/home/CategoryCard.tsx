"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/category";

interface CategoryCardProps {
  category: Category;
  index?: number;
  isVisible?: boolean;
}

export function CategoryCard({
  category,
  index = 0,
  isVisible = true,
}: CategoryCardProps) {
  const [imageError, setImageError] = useState(false);
  const hasImage = Boolean(category.image && !imageError);
  const initial = category.name?.trim().charAt(0).toUpperCase() || "V";

  return (
    <Link
      href={`/venues?category=${encodeURIComponent(category.slug)}`}
      aria-label={`Browse ${category.name} venues`}
      style={{
        transitionDelay: isVisible ? `${index * 50}ms` : "0ms",
      }}
      className={cn(
        "group relative block aspect-[4/5] w-[70%] sm:w-auto shrink-0 snap-start overflow-hidden rounded-3xl bg-muted",
        "transition-all duration-500 ease-out",
        "hover:-translate-y-1 hover:ring-2 hover:ring-coral-500 hover:ring-offset-2 hover:ring-offset-background hover:shadow-[0_20px_40px_-15px_rgba(43,37,35,0.35)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        "motion-reduce:opacity-100 motion-reduce:translate-y-0 motion-reduce:transition-none motion-reduce:transform-none"
      )}
    >
      {/* Background Photo or Fallback */}
      {hasImage ? (
        <Image
          src={category.image}
          alt={`${category.name} venues`}
          fill
          sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 70vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105 motion-reduce:transform-none motion-reduce:transition-none"
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center bg-coral-100"
          aria-hidden="true"
        >
          <span className="font-serif text-6xl font-bold text-coral-500 select-none">
            {initial}
          </span>
        </div>
      )}

      {/* Legibility Gradient Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent pointer-events-none"
        aria-hidden="true"
      />

      {/* Top-left Optional Venue Count Pill */}
      {typeof category.venueCount === "number" && (
        <div className="absolute top-4 left-4 z-10 pointer-events-none">
          <span className="inline-flex items-center rounded-full bg-white/20 px-2.5 py-1 text-xs font-medium text-white backdrop-blur-md">
            {category.venueCount} {category.venueCount === 1 ? "venue" : "venues"}
          </span>
        </div>
      )}

      {/* Bottom Content Row */}
      <div className="absolute bottom-0 inset-x-0 z-10 flex items-end justify-between gap-3 p-5 pointer-events-none">
        <div className="min-w-0 flex-1">
          <h3 className="font-serif text-xl font-semibold text-white line-clamp-2 leading-snug lg:text-[22px]">
            {category.name}
          </h3>
          {category.description && category.description.trim().length > 0 && (
            <p className="mt-1 text-sm text-white/80 line-clamp-1">
              {category.description}
            </p>
          )}
        </div>

        {/* 40px Circular Indicator Button */}
        <div
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-foreground shadow-sm transition-all duration-300 group-hover:bg-coral-600 group-hover:text-white"
        >
          <ArrowUpRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
        </div>
      </div>
    </Link>
  );
}

export function CategoryCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="relative flex aspect-[4/5] w-[70%] sm:w-auto shrink-0 snap-start flex-col justify-between overflow-hidden rounded-3xl bg-muted p-5 animate-pulse"
    >
      <div className="h-6 w-20 rounded-full bg-stone-300/40" />
      <div className="flex w-full items-end justify-between gap-3">
        <div className="flex-1 space-y-2">
          <div className="h-6 w-3/4 rounded-md bg-stone-300/40" />
          <div className="h-4 w-1/2 rounded-md bg-stone-300/30" />
        </div>
        <div className="h-10 w-10 shrink-0 rounded-full bg-stone-300/40" />
      </div>
    </div>
  );
}

