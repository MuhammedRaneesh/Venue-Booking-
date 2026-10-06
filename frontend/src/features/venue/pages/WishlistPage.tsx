import { useGetWishlistQuery, useRemoveWishlistMutation } from "@/features/Venue/wishlistApi";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";
import { Heart, MapPin, Users, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function WishlistPage() {
  
  const { data: wishlistResponse, isLoading, isError } = useGetWishlistQuery({});
  const [removeWishlist] = useRemoveWishlistMutation();

  const handleRemove = async (venueId: string) => {
    try {
      await removeWishlist(venueId).unwrap();
      toast.success("Removed from wishlist");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to remove from wishlist");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fcf9f8]">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="w-8 h-8 animate-spin text-[#2e0052]" />
        </div>
      </div>
    );
  }

  const wishlists = wishlistResponse?.data || [];

  return (
    <div className="min-h-screen bg-[#fcf9f8]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-6 md:px-16 py-12">
        <div className="mb-8 border-b border-slate-200/60 pb-6 flex items-center justify-between">
          <div>
            <h1 className="font-[EB_Garamond,serif] text-3xl sm:text-4xl font-medium text-[#2e0052] tracking-tight">
              Your Wishlist
            </h1>
            <p className="text-slate-500 mt-2 font-medium">
              You have {wishlists.length} saved {wishlists.length === 1 ? 'venue' : 'venues'}
            </p>
          </div>
          <Heart size={32} className="text-[#C9A84C]" strokeWidth={1.5} />
        </div>

        {isError || wishlists.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[2rem] border border-slate-100 shadow-sm">
            <Heart size={48} className="mx-auto text-slate-200 mb-4" strokeWidth={1} />
            <h2 className="text-xl font-bold text-[#2e0052] mb-2">Your wishlist is empty</h2>
            <p className="text-slate-500 mb-6">Looks like you haven't saved any venues yet.</p>
            <Link
              to="/venues"
              className="inline-flex items-center justify-center bg-[#2e0052] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#400073] transition-colors"
            >
              Explore Venues
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlists.map((item: any) => {
              const venue = item.venueId;
              if (!venue) return null;
              const photo = venue.photos?.[0] || "/placeholder-venue.jpg";
              const city = venue.location?.city || "";
              
              return (
                <div key={item._id} className="group flex flex-col bg-white rounded-3xl overflow-hidden border border-slate-200/60 shadow-sm hover:shadow-xl transition-all duration-300">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img 
                      src={photo} 
                      alt={venue.venueName} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemove(venue._id);
                      }}
                      className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-sm hover:bg-white transition-colors"
                      aria-label="Remove from wishlist"
                    >
                      <Heart size={16} className="fill-[#ff385c] text-[#ff385c]" />
                    </button>
                    <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                      <span className="bg-white/90 backdrop-blur px-2.5 py-1 rounded-lg text-xs font-bold text-[#2e0052]">
                        {venue.category}
                      </span>
                      <span className="text-white font-bold text-sm tracking-wide bg-black/40 backdrop-blur px-2 py-1 rounded-lg">
                        ₹{venue.pricing?.pricePerHour?.toLocaleString("en-IN")}/hr
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <Link to={`/venues/${venue._id}`} className="hover:text-[#C9A84C] transition-colors">
                      <h3 className="font-[EB_Garamond,serif] text-xl font-bold text-[#2e0052] mb-2 line-clamp-1">
                        {venue.venueName}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-4 text-xs font-semibold text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <MapPin size={14} className="text-[#C9A84C]" /> {city}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={14} className="text-[#C9A84C]" /> {venue.capacity}
                      </span>
                    </div>
                    
                    <div className="mt-auto pt-4 border-t border-slate-100">
                      <Link
                        to={`/venues/${venue._id}`}
                        className="block w-full py-2.5 text-center rounded-xl bg-purple-50 text-[#2e0052] font-bold text-sm hover:bg-[#2e0052] hover:text-white transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
