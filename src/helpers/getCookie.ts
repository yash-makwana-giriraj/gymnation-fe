import { APILocationsResponse } from "@/interfaces/content";

export const getCookieValue = (name: string) => {
    const cookies: false | string[] = typeof window !== "undefined" ? document.cookie.split(';') : false;

    if (Array.isArray(cookies)) {
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith(`${name}=`)) {
                return cookie.substring(name.length + 1);
            }
        }
    }

    return null;
};

export function debounce<T extends (...args: string[]) => void>(
    fn: T,
    delay = 300
): T & { cancel: () => void } {
    let timer: ReturnType<typeof setTimeout>;

    const debouncedFn = ((...args: Parameters<T>) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn(...args);
        }, delay);
    }) as T & { cancel: () => void };

    debouncedFn.cancel = () => {
        clearTimeout(timer);
    };

    return debouncedFn;
}

interface LocationData {
    name: string;
    properties: {
        locationLatitude: string;
        locationLongitude: string;
    };
}

interface Coordinates {
    lat: number;
    lng: number;
}

interface CityLocationData {
    aPILocations: LocationData[];
}

function calculateDistance(coord1: Coordinates, coord2: Coordinates): number {
    const R = 6371;
    const dLat = (coord2.lat - coord1.lat) * Math.PI / 180;
    const dLng = (coord2.lng - coord1.lng) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(coord1.lat * Math.PI / 180) * Math.cos(coord2.lat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
}

export function findNearestLocation(
    selectedCordinates: Coordinates | null,
    cityLocationData: CityLocationData
): APILocationsResponse | null {
    if (!selectedCordinates || !cityLocationData?.aPILocations?.length) return null;

    let nearestLocation: LocationData | null = null;
    let minDistance = Infinity;

    cityLocationData.aPILocations.forEach(location => {
        const coords = {
            lat: parseFloat(location.properties.locationLatitude),
            lng: parseFloat(location.properties.locationLongitude)
        };

        const distance = calculateDistance(selectedCordinates, coords);
        if (distance < minDistance) {
            minDistance = distance;
            nearestLocation = location;
        }
    });

    return nearestLocation ? nearestLocation : null;
}