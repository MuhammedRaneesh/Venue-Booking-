import { useState, useEffect, useMemo } from "react";
import VenueCard from "../components/VenueCard";
import { useGetVenueQuery } from "@/features/Venue/venueApi";
import { VenueQueryParams } from "../../owner/types/owner.type";
import { VenueCardProps } from "../types/venue.type";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CATEGORIES = [
  "Wedding Hall", "Convention Center", "Conference Hall", "Banquet Hall",
  "Party Hall", "Outdoor Venue", "Resort", "Auditorium",
];

const DISTRICTS = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
  "Kozhikode", "Wayanad", "Kannur", "Kasaragod",
];

const AMENITIES = ["Parking", "Air Conditioning", "Catering", "Sound System", "Stage", "Dining Area", "Decoration", "Generator", "WiFi"];

const SORT_OPTIONS = [
  { value: "newest", label: "Newest First" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
];

const PAGE_SIZE = 6;

function useDebounce<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

function toCardProps(venue: any): VenueCardProps {
  return {
    id: venue._id,
    venueName: venue.venueName,
    image: venue.photos?.[0] ?? "/placeholder-venue.jpg",
    location: [venue.location?.address?.city, venue.location?.address?.district]
      .filter(Boolean)
      .join(", "),
    capacity: venue.capacity,
    pricePerDay: venue.pricing?.pricePerDay,
  };
}

const DEFAULT_FILTERS = {
  category: undefined as string | undefined,
  district: undefined as string | undefined,
  minCapacity: undefined as number | undefined,
  maxCapacity: undefined as number | undefined,
  minPrice: undefined as number | undefined,
  maxPrice: undefined as number | undefined,
  sort: "newest" as string,
};

function VenueListPage() {
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debouncedSearch = useDebounce(searchInput);

  const queryParams: VenueQueryParams = useMemo(
    () => ({
      ...filters,
      page,
      limit: PAGE_SIZE,
      search: debouncedSearch || undefined,
      amenities:
        selectedAmenities.length > 0
          ? selectedAmenities.join(",")
          : undefined,
    }),
    [filters, debouncedSearch, selectedAmenities, page]
  );

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useGetVenueQuery(queryParams);

  const venueList = data?.venue ?? [];
  const totalCount = data?.totalCount ?? 0;
  const totalPages = data?.pagination?.totalPages ?? 1;

  useEffect(() => {
    setPage(1);
  }, [filters, debouncedSearch, selectedAmenities]);

  const updateFilter = <K extends keyof typeof DEFAULT_FILTERS>(
    key: K,
    value: (typeof DEFAULT_FILTERS)[K]
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const clearFilters = () => {
    setSearchInput("");
    setFilters(DEFAULT_FILTERS);
    setSelectedAmenities([]);
    setPage(1);
  };

  const hasActiveFilters =
    searchInput ||
    selectedAmenities.length > 0 ||
    Object.entries(filters).some(
      ([k, v]) => k !== "sort" && v !== undefined
    );


  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <Navbar />

      <div className="bg-[#2e0052] px-4 sm:px-8 py-8 md:py-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-[EB_Garamond,serif] text-3xl sm:text-4xl font-medium text-white tracking-tight">Find Your Venue</h1>
          <p className="text-[#D4AF37] text-sm font-medium mt-1 tracking-wide">Browse approved luxury spaces across Kerala</p>

          <div className="mt-6 flex gap-3 max-w-3xl">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by venue name or description..."
              className="flex-1 rounded-xl px-4 py-3 text-sm bg-white/95 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] text-[#1c1b1b] shadow-inner font-medium"
            />
            <button
              onClick={() => setFiltersOpen((prev) => !prev)}
              className="lg:hidden flex items-center gap-1.5 px-5 py-3 rounded-xl bg-[#D4AF37] hover:bg-[#c4a030] text-[#241a00] text-sm font-bold shadow transition-all active:scale-95"
            >
              Filters
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto gap-8 px-4 sm:px-8 py-8">
        <aside
          className={`${filtersOpen ? "block" : "hidden"} lg:block w-full lg:w-72 shrink-0 bg-white rounded-2xl border border-[#cec3d3]/40 p-6 h-fit lg:sticky lg:top-24 space-y-6 shadow-sm`}
        >
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="font-semibold text-[#2e0052] tracking-tight">Filters</h3>
            {hasActiveFilters && (
              <button onClick={clearFilters} className="text-xs text-[#D4AF37] font-semibold hover:text-[#b3922e] hover:underline transition-colors">
                Clear all
              </button>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#7d7483] uppercase tracking-wider block">Category</label>
            <select
              value={filters.category ?? ""}
              onChange={(e) => updateFilter("category", e.target.value || undefined)}
              className="w-full rounded-xl border border-gray-200 bg-[#fbf9f8] px-3 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-900 focus:bg-white cursor-pointer transition-all"
            >
              <option value="">All categories</option>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#7d7483] uppercase tracking-wider block">District</label>
            <select
              value={filters.district ?? ""}
              onChange={(e) => updateFilter("district", e.target.value || undefined)}
              className="w-full rounded-xl border border-gray-200 bg-[#fbf9f8] px-3 py-2.5 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-purple-900 focus:bg-white cursor-pointer transition-all"
            >
              <option value="">All districts</option>
              {DISTRICTS.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#7d7483] uppercase tracking-wider block">Capacity (Guests)</label>
            <div className="flex gap-2">
              <input
                type="number" min={1} placeholder="Min"
                value={filters.minCapacity ?? ""}
                onChange={(e) => updateFilter("minCapacity", e.target.value ? Number(e.target.value) : undefined)}
                className="w-1/2 rounded-xl border border-gray-200 bg-[#fbf9f8] px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-900 focus:bg-white transition-all"
              />
              <input
                type="number" min={1} placeholder="Max"
                value={filters.maxCapacity ?? ""}
                onChange={(e) => updateFilter("maxCapacity", e.target.value ? Number(e.target.value) : undefined)}
                className="w-1/2 rounded-xl border border-gray-200 bg-[#fbf9f8] px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#7d7483] uppercase tracking-wider block">Price per day (₹)</label>
            <div className="flex gap-2">
              <input
                type="number" min={0} placeholder="Min"
                value={filters.minPrice ?? ""}
                onChange={(e) => updateFilter("minPrice", e.target.value ? Number(e.target.value) : undefined)}
                className="w-1/2 rounded-xl border border-gray-200 bg-[#fbf9f8] px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-900 focus:bg-white transition-all"
              />
              <input
                type="number" min={0} placeholder="Max"
                value={filters.maxPrice ?? ""}
                onChange={(e) => updateFilter("maxPrice", e.target.value ? Number(e.target.value) : undefined)}
                className="w-1/2 rounded-xl border border-gray-200 bg-[#fbf9f8] px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-purple-900 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-[#7d7483] uppercase tracking-wider block">Amenities</label>
            <div className="space-y-2 max-h-44 overflow-y-auto pr-1 scrollbar-thin">
              {AMENITIES.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2.5 text-sm font-medium text-slate-700 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={selectedAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="w-4 h-4 rounded border-gray-300 accent-[#2e0052] cursor-pointer"
                  />
                  <span className="group-hover:text-[#2e0052] transition-colors">{amenity}</span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-6">
            <p className="text-sm font-medium text-slate-500">
              {isLoading ? "Loading spaces..." : `${totalCount} premium venues found`}
            </p>
            <select
              value={filters.sort}
              onChange={(e) => updateFilter("sort", e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-semibold text-[#2e0052] focus:outline-none focus:ring-2 focus:ring-purple-900 shadow-sm cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          {isLoading && page === 1 ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
          ) : isError ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-red-200 p-6">
              <p className="text-[#2e0052] font-semibold text-base">Something went wrong loading venues.</p>
              <button
                onClick={() => refetch()}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#2e0052] text-white text-sm font-bold hover:bg-[#400073] shadow transition-all active:scale-95"
              >
                Try again
              </button>
            </div>
          ) : venueList.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 p-6">
              <p className="text-slate-500 font-medium text-base">No premium venues match your selected filters.</p>
              <button
                onClick={clearFilters}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#D4AF37] text-[#241a00] text-sm font-bold hover:bg-[#c4a030] shadow transition-all active:scale-95"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {venueList.map((venue: any) => (
                  <VenueCard key={venue._id} {...toCardProps(venue)} />
                ))}
              </div>
              <div className="mt-10 flex justify-center gap-2 flex-wrap">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    onClick={() => setPage(index + 1)}
                    className={`px-4 py-2 rounded-lg border ${page === index + 1
                        ? "bg-[#2e0052] text-white"
                        : "bg-white text-[#2e0052]"
                      }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>

            </>
          )}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default VenueListPage; 
