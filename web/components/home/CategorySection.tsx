"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, LayoutGrid } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";
import { CategoryCard, CategoryCardSkeleton } from "./CategoryCard";

export function CategorySection() {
  const { data: categories, isLoading, isError, refetch } = useCategories();
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = sectionRef.current;
    if (!target) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      const timer = setTimeout(() => setIsVisible(true), 0);
      return () => clearTimeout(timer);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, []);

  const displayCategories = categories?.slice(0, 8) ?? [];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-background py-16 lg:py-24"
      aria-label="Browse by venue type"
    >
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <div className="mb-10 flex flex-col gap-6 sm:mb-12 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-[640px]">
            <span className="inline-block rounded-full border border-coral-200 bg-coral-50 px-3 py-1 text-xs font-medium text-coral-700">
              Categories
            </span>
            <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-foreground text-balance lg:text-4xl">
              Find the space that fits your event
            </h2>
            <p className="mt-2 max-w-[520px] text-sm text-muted-foreground sm:text-base">
              From grand wedding halls to intimate party spaces, explore by the kind of event you&apos;re planning.
            </p>
          </div>

          <div className="shrink-0">
            <Link
              href="/venues"
              className="group inline-flex items-center gap-1.5 font-medium text-coral-700 transition-colors hover:text-coral-800"
            >
              <span>View all venues</span>
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none"
              />
            </Link>
          </div>
        </div>

        {/* Content States */}
        {isLoading && (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:px-0 sm:pb-0 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <CategoryCardSkeleton key={index} />
            ))}
          </div>
        )}

        {isError && (
          <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl border border-coral-200 bg-coral-50 p-6 text-center sm:p-8">
            <p className="text-sm font-medium text-foreground">
              Couldn&apos;t load categories
            </p>
            <button
              type="button"
              onClick={() => refetch()}
              className="mt-2 text-sm font-semibold text-coral-700 underline underline-offset-4 transition-colors hover:text-coral-800 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-coral-500 rounded"
            >
              Try again
            </button>
          </div>
        )}

        {!isLoading && !isError && displayCategories.length === 0 && (
          <div className="mx-auto flex max-w-md flex-col items-center justify-center rounded-3xl border border-coral-200 bg-coral-50 p-8 text-center sm:p-12">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-coral-200 bg-white text-coral-600 shadow-xs">
              <LayoutGrid className="h-6 w-6" aria-hidden="true" />
            </div>
            <h3 className="font-serif text-lg font-semibold text-foreground">
              No categories yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Check back soon.
            </p>
          </div>
        )}

        {!isLoading && !isError && displayCategories.length > 0 && (
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory -mx-4 px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:grid sm:grid-cols-3 sm:gap-5 sm:px-0 sm:pb-0 lg:grid-cols-4">
            {displayCategories.map((category, index) => (
              <CategoryCard
                key={category._id}
                category={category}
                index={index}
                isVisible={isVisible}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
