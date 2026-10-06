import { Link } from "react-router-dom";
import { VenueCardProps } from "../types/venue.type";


function VenueCard({ id, venueName, image, location, capacity, pricePerDay }: VenueCardProps) {
  
  console.log(image)
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-lg hover:border-brand-accent/40 transition-all duration-300">
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={venueName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#1c1b1b] text-sm font-semibold px-3 py-1 rounded-full shadow-sm">
          ₹{pricePerDay}<span className="text-xs font-normal text-gray-500">/day</span>
        </div>
      </div>

      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold text-[#1c1b1b] truncate">
          {venueName}
        </h2>

        <p className="flex items-center gap-1.5 text-sm text-gray-500">
          <svg className="w-4 h-4 text-brand-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a2 2 0 01-2.828 0l-4.243-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="truncate">{location}</span>
        </p>

        <p className="flex items-center gap-1.5 text-sm text-gray-500">
          <svg className="w-4 h-4 text-brand-accent shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-1.13a4 4 0 100-8 4 4 0 000 8zm6 0a4 4 0 10-2.06-7.43" />
          </svg>
          Up to {capacity} guests
        </p>

        <Link
          to={`/venues/${id}`}
          className="mt-3 block text-center bg-foreground text-background text-sm font-medium py-2.5 rounded-full hover:opacity-90 transition-opacity"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

export default VenueCard;
