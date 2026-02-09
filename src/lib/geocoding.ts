/**
 * Geocode address to coordinates using Google Maps Geocoding API
 */
export async function geocodeAddress(address: string): Promise<{
    lat: number;
    lng: number;
    formattedAddress: string;
} | null> {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.warn("Google Maps API key not configured");
        return null;
    }

    try {
        const encodedAddress = encodeURIComponent(address);
        const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
            const result = data.results[0];
            return {
                lat: result.geometry.location.lat,
                lng: result.geometry.location.lng,
                formattedAddress: result.formatted_address,
            };
        }

        return null;
    } catch (error) {
        console.error("Geocoding error:", error);
        return null;
    }
}

/**
 * Reverse geocode coordinates to address
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        console.warn("Google Maps API key not configured");
        return null;
    }

    try {
        const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;

        const response = await fetch(url);
        const data = await response.json();

        if (data.status === "OK" && data.results.length > 0) {
            return data.results[0].formatted_address;
        }

        return null;
    } catch (error) {
        console.error("Reverse geocoding error:", error);
        return null;
    }
}
