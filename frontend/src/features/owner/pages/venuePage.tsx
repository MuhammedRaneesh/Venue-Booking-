import { useState, useEffect } from "react";
import { useGetOwnerVenuesQuery } from "../../../api/ownerApi";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  MapPin,
  Users,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Building2,
  SlidersHorizontal
} from "lucide-react";
import type { Venue, Pagination } from "../types/owner.type";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import EditVenue from "./EditVenue";

const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

const OwnerVenues = () => {
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(5);
  const [searchInput, setSearchInput] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("newest");
  const navigate = useNavigate()
  // Debounce search string by 400ms to avoid constant API flooding
  const debouncedSearch = useDebounce(searchInput, 400);

  // Construct query parameter schema matching your backend validation setup
  const queryParams = {
    page,
    limit,
    sort: sortOption,
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  };

  const { data, isLoading, isError, error } = useGetOwnerVenuesQuery(queryParams);

  const venues: Venue[] = data?.venue || [];
  const pagination: Pagination = data?.pagination || ({} as Pagination);

  // Reset pagination indexes on parameter mutation to catch early results
  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortOption]);

  const getStatusBadgeColor = (status: string, isActive: boolean) => {
    if (!isActive) return "bg-stone-100 text-stone-600 border-stone-200";
    switch (status?.toLowerCase()) {
      case "approved": return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
      case "pending": return "bg-amber-50 text-amber-700 border-amber-200/60";
      default: return "bg-stone-50 text-stone-600 border-stone-200";
    }
  };

  if (isError) {
    return (
      <div className="p-6 text-center bg-rose-50 rounded-xl border border-rose-100 text-rose-600 font-medium max-w-2xl mx-auto">
        Error: {(error as any)?.data?.message || "Failed to load managed properties."}
      </div>
    );
  }

  return (
    <div className="w-full font-sans">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-[#2B1343] tracking-tight">Venues</h1>
          <p className="text-sm text-[#5F5665] mt-1">Manage all your properties in one place.</p>
        </div>
        <button
          onClick={() => navigate("/owner/venues/create")}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#C29F47] hover:bg-[#b08f3d] text-white font-semibold text-xs rounded-xl shadow-xs transition"
        >
          <Plus size={16} /> Add New Venue
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <div className="bg-white border border-[#F3EFE9] p-5 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#F5EFE4] flex items-center justify-center text-[#C29F47] shrink-0">
            <Building2 size={20} />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">Total Tracked Properties</span>
            <span className="text-2xl font-bold text-[#2B1343]">{data?.totalCount || venues.length}</span>
          </div>
        </div>
      </div>


      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">


        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search venues..."
            className="w-full pl-10 pr-4 py-2 bg-[#FCFBF9] border border-[#F3EFE9] rounded-xl text-sm text-[#2B1343] focus:outline-none focus:border-[#C29F47] transition placeholder-stone-400"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <div className="flex items-center gap-1.5">
            <SlidersHorizontal size={14} className="text-stone-400" />
            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[150px] h-9 text-xs font-medium rounded-xl border-[#F3EFE9] bg-[#FCFBF9]">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-[#F3EFE9]">
                <SelectItem value="newest" className="text-xs font-medium">Newest Added</SelectItem>
                <SelectItem value="price_asc" className="text-xs font-medium">Price: Low to High</SelectItem>
                <SelectItem value="price_desc" className="text-xs font-medium">Price: High to Low</SelectItem>
                <SelectItem value="rating" className="text-xs font-medium">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#F3EFE9] overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-[#FCFBF9] border-b border-[#F3EFE9] text-[11px] font-bold text-[#5F5665] uppercase tracking-wider">
                <th className="p-4.5 font-semibold">Venue Details</th>
                <th className="p-4.5 font-semibold">Location</th>
                <th className="p-4.5 font-semibold">Status</th>
                <th className="p-4.5 font-semibold">Capacity</th>
                <th className="p-4.5 font-semibold">Pricing Rates</th>
                <th className="p-4.5 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F3EFE9] text-[14px] text-[#5F5665]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C29F47] mx-auto"></div>
                    <p className="text-xs text-stone-400 mt-2.5">Syncing properties inventory list...</p>
                  </td>
                </tr>
              ) : venues.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
                    <Building2 className="w-12 h-12 mx-auto text-stone-200 mb-3" />
                    <p className="text-sm font-semibold text-[#2B1343]">No venues matching filter requirements</p>
                    <p className="text-xs text-stone-400 mt-0.5">Try altering search characters or filter metrics selection tags.</p>
                  </td>
                </tr>
              ) : (
                venues.map((venue) => (
                  <tr key={venue._id} className="hover:bg-[#FCFBF9]/40 transition-colors group">

                    <td className="p-4.5">
                      <div className="flex items-center gap-3.5">
                        <div className="w-16 h-11 bg-stone-100 rounded-lg border border-stone-200 overflow-hidden shrink-0 flex items-center justify-center">
                          {venue.photos && venue.photos[0] ? (
                            <img
                              src={venue.photos[0]}
                              alt={venue.venueName}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                            />
                          ) : (
                            <Building2 className="text-stone-300 w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-[#2B1343]">{venue.venueName}</div>
                          <div className="text-[12px] text-stone-400 font-normal capitalize mt-0.5">{venue.category}</div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4.5">
                      <div className="flex items-center gap-1.5 text-stone-700 font-medium">
                        <MapPin size={13} className="text-[#C29F47] shrink-0" />
                        <span>{venue.location?.address?.city || venue.location?.address?.place || 'Kerala, IN'}</span>
                      </div>
                      <div className="text-[11px] text-stone-400 pl-4.5 font-normal tracking-wide mt-0.5">
                        {venue.location?.address?.district || 'District Base'}
                      </div>
                    </td>


                    <td className="p-4.5">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-lg border inline-block tracking-wide capitalize ${getStatusBadgeColor(venue.status, venue.isActive)}`}>
                        {!venue.isActive ? "Inactive" : venue.status}
                      </span>
                    </td>

                    <td className="p-4.5">
                      <div className="flex items-center gap-1.5 font-medium text-stone-800">
                        <Users size={14} className="text-stone-400" />
                        <span>{venue.capacity?.toLocaleString('en-IN') || '0'} Pax</span>
                      </div>
                    </td>


                    <td className="p-4.5">
                      <div className="font-bold text-[#2B1343]">
                        ₹{(venue.pricing?.pricePerDay || 0).toLocaleString('en-IN')}
                        <span className="text-[11px] text-stone-400 font-medium font-sans"> /day</span>
                      </div>
                      {venue.pricing?.pricePerHour && (
                        <div className="text-[11px] text-stone-400 font-medium mt-0.5">
                          ₹{venue.pricing.pricePerHour.toLocaleString('en-IN')} /hour
                        </div>
                      )}
                    </td>


                    <td className="p-4.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <EditVenue venueId={venue._id} />
                        <button
                          className="p-1.5 text-stone-400 hover:bg-stone-50 hover:text-stone-700 border border-stone-200/20 rounded-xl transition"
                          title="More Operations"
                        >
                          <MoreVertical size={13} />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {pagination.totalPages > 1 && (
          <div className="p-4 bg-[#FCFBF9] border-t border-[#F3EFE9] flex items-center justify-between text-xs font-medium text-[#5F5665]">
            <span>Showing page {page} of {pagination.totalPages}</span>
            <div className="flex gap-1.5">
              <button
                disabled={!pagination.hasPreviousPage}
                onClick={() => setPage((prev) => prev - 1)}
                className="p-1.5 border border-[#F3EFE9] rounded-xl bg-white text-[#5F5665] hover:bg-stone-50 disabled:opacity-40 transition shadow-xs"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                disabled={!pagination.hasNextPage}
                onClick={() => setPage((prev) => prev + 1)}
                className="p-1.5 border border-[#F3EFE9] rounded-xl bg-white text-[#5F5665] hover:bg-stone-50 disabled:opacity-40 transition shadow-xs"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default OwnerVenues;