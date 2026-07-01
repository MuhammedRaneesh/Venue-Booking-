import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchGeoapifySuggestions , reverseGeocode } from "@/services/geoLocation";
import type { LatLngTuple , LocationSuggestion } from "@/features/owner/types/owner.type";

interface UseLocationSearchReturn {
  locationQuery: string;
  setLocationQuery: React.Dispatch<React.SetStateAction<string>>;
  suggestions: LocationSuggestion[];
  isSearching: boolean;
  isLocating: boolean;
  searchError: string;
  clearSuggestions: () => void;
  handleUseCurrentLocation: () => void;
}

export const useLocationSearch = (onLocationResolved: (suggestion: LocationSuggestion,coordinates: LatLngTuple) => void): UseLocationSearchReturn => {
  const [locationQuery, setLocationQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [searchError, setSearchError] = useState("");

  const searchLocations = useCallback(async (query: string) => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 3) {
      setSuggestions([]);
      setSearchError("");
      return;
    }

    setIsSearching(true);
    setSearchError("");

    try {
      const results = await fetchGeoapifySuggestions(trimmedQuery);

      setSuggestions(results);

      if (results.length === 0) {
        setSearchError("No matching locations found.");
      }
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Location search failed.";

      setSearchError(message);
      setSuggestions([]);
    } finally {
      setIsSearching(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void searchLocations(locationQuery);
    }, 450);

    return () => window.clearTimeout(timeoutId);
  }, [locationQuery, searchLocations]);

  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error(
        "Geolocation is not supported by this browser."
      );
      return;
    }

    setIsLocating(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coordinates: LatLngTuple = [
          position.coords.latitude,
          position.coords.longitude,
        ];

        try {
          const suggestion = await reverseGeocode(coordinates);

          setLocationQuery(suggestion.label);

          onLocationResolved(
            suggestion,
            coordinates
          );

          toast.success("Location detected");
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to fetch address."
          );
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        toast.error(
          error.message ||
            "Unable to get current location."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, [onLocationResolved]);

  return {locationQuery,setLocationQuery,suggestions,isSearching,isLocating,searchError,
    clearSuggestions: () => {
      setSuggestions([]);
      setSearchError("");
    },
    handleUseCurrentLocation,
  };
};