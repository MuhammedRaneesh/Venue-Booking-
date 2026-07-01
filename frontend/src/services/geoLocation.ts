import { GeoapifyFeature, GeoapifyResponse, LatLngTuple, LocationSuggestion } from "@/features/owner/types/owner.type";
const geoapifyApiKey = import.meta.env.VITE_GEOAPIFY_API_KEY || import.meta.env.GEOAPIFY_API_KEY;

if (!geoapifyApiKey) {
    throw new Error("Geoapify API key is missing. Add VITE_GEOAPIFY_API_KEY to your .env file.");
}

function getGeoapifyUrl(path: string, params: Record<string, string | number>): string {
    const url = new URL(`https://api.geoapify.com/v1/${path}`);
    Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, String(value));
    });
    url.searchParams.set("apiKey", geoapifyApiKey);
    return url.toString();
}

function buildSuggestion(feature: GeoapifyFeature, index: number): LocationSuggestion {
    const properties = feature.properties;
    const city = properties.city || properties.town || properties.village || "";
    const district = properties.district || properties.county || city;
    const place = properties.formatted || [properties.address_line1, properties.address_line2].filter(Boolean).join(", ");

    return {
        id: `${properties.lat}-${properties.lon}-${index}`,
        label: properties.formatted || place || "Selected location",
        position: [properties.lat, properties.lon],
        address: {
            place,
            city,
            district,
            state: properties.state || "",
            pincode: properties.postcode || "",
        },
    };
}

export const fetchGeoapifySuggestions = async (query: string): Promise<LocationSuggestion[]> => {
    const response = await fetch(getGeoapifyUrl("geocode/autocomplete", {
        text: query,
        limit: 6,
        filter: "countrycode:in",
    }));

    if (!response.ok) {
        throw new Error("Location search failed. Please try again.");
    }

    const data = await response.json() as GeoapifyResponse;
    return data.features.map(buildSuggestion);
};

export const reverseGeocode = async (position: LatLngTuple): Promise<LocationSuggestion> => {

    const [lat, lon] = position;
    const response = await fetch(getGeoapifyUrl("geocode/reverse", { lat, lon }));

    if (!response.ok) {
        throw new Error("Unable to fetch address for this location.");
    }

    const data = await response.json() as GeoapifyResponse;
    const feature = data.features[0];

    if (!feature) {
        throw new Error("No address found for this location.");
    }

    return buildSuggestion(feature, 0);
};