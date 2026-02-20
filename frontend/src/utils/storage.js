const TRIPS_KEY = 'smart_travel_trips_v1';
const FAVORITES_KEY = 'smart_travel_favorites_v1';

const safeParse = (raw, fallback) => {
    try {
        return raw ? JSON.parse(raw) : fallback;
    } catch {
        return fallback;
    }
};

const slugify = (value) => String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const getStoredTrips = () => {
    if (typeof window === 'undefined') return [];
    const items = safeParse(localStorage.getItem(TRIPS_KEY), []);
    return Array.isArray(items) ? items : [];
};

export const saveTrip = ({ plan, preferences }) => {
    if (!plan || !preferences || typeof window === 'undefined') return null;

    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const destination = preferences.destination || 'Destination';
    const days = Number(preferences.days) || (Array.isArray(plan.itinerary) ? plan.itinerary.length : 1);
    const totalCost = Number(plan.totalCost) || 0;
    const totalPlaces = Number(plan.totalPlaces) || 0;

    const newTrip = {
        id,
        createdAt: new Date().toISOString(),
        destination,
        days,
        totalCost,
        totalPlaces,
        plan,
        preferences,
    };

    const previous = getStoredTrips();
    const next = [newTrip, ...previous].slice(0, 30);
    localStorage.setItem(TRIPS_KEY, JSON.stringify(next));
    return newTrip;
};

export const removeTrip = (tripId) => {
    if (typeof window === 'undefined') return;
    const next = getStoredTrips().filter((trip) => trip.id !== tripId);
    localStorage.setItem(TRIPS_KEY, JSON.stringify(next));
};

export const getLatestTrip = () => getStoredTrips()[0] || null;

const normalizeFavorite = (place) => {
    const name = place?.name || 'Place';
    const city = place?.city || 'India';
    return {
        id: place?.id || `${slugify(name)}__${slugify(city)}`,
        name,
        city,
        image: place?.image || '',
        type: place?.type || 'Attraction',
        rating: place?.rating ?? null,
        description: place?.description || '',
        createdAt: place?.createdAt || new Date().toISOString(),
    };
};

export const getStoredFavorites = () => {
    if (typeof window === 'undefined') return [];
    const items = safeParse(localStorage.getItem(FAVORITES_KEY), []);
    return Array.isArray(items) ? items : [];
};

export const isFavoritePlace = (place) => {
    const normalized = normalizeFavorite(place);
    return getStoredFavorites().some((item) => item.id === normalized.id);
};

export const toggleFavoritePlace = (place) => {
    if (typeof window === 'undefined') return false;
    const normalized = normalizeFavorite(place);
    const favorites = getStoredFavorites();
    const exists = favorites.some((item) => item.id === normalized.id);

    const next = exists
        ? favorites.filter((item) => item.id !== normalized.id)
        : [normalized, ...favorites].slice(0, 200);

    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
    return !exists;
};

export const removeFavoritePlace = (favoriteId) => {
    if (typeof window === 'undefined') return;
    const next = getStoredFavorites().filter((item) => item.id !== favoriteId);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(next));
};
