import React, { useEffect, useRef, useState } from 'react';
import { X, Navigation, MapPin, Loader2, AlertCircle, LocateFixed } from 'lucide-react';

// Leaflet CSS injected once
let leafletCssInjected = false;
const injectLeafletCSS = () => {
    if (leafletCssInjected) return;
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
    leafletCssInjected = true;
};

/**
 * Geocode a place name using Nominatim (OpenStreetMap, free, no API key)
 */
const geocode = async (query) => {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1&countrycodes=in`;
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } });
    const data = await res.json();
    if (data && data.length > 0) {
        return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon), display: data[0].display_name };
    }
    return null;
};

/**
 * Fetch road route from OSRM (free open-source routing, no API key)
 */
const getRoute = async (from, to) => {
    const url = `https://router.project-osrm.org/route/v1/driving/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.code === 'Ok' && data.routes.length > 0) {
        const coords = data.routes[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);
        const dist = (data.routes[0].distance / 1000).toFixed(1);
        const dur = Math.round(data.routes[0].duration / 60);
        return { coords, distance: dist, duration: dur };
    }
    return null;
};

/**
 * MapModal — renders an embedded interactive Leaflet map in a modal overlay.
 * Props:
 *   placeName  - name of the destination (e.g. "Gateway of India")
 *   city       - city name (e.g. "Mumbai")
 *   onClose    - callback to close the modal
 */
const MapModal = ({ placeName, city, onClose }) => {
    const mapContainerRef = useRef(null);
    const mapRef = useRef(null);
    const [status, setStatus] = useState('loading'); // loading | ready | error
    const [info, setInfo] = useState(null); // { distance, duration }
    const [locating, setLocating] = useState(true);

    useEffect(() => {
        injectLeafletCSS();

        let L;
        let isMounted = true;

        const initMap = async () => {
            // Dynamically import leaflet to avoid SSR issues
            L = (await import('leaflet')).default;

            // Fix default icon paths
            delete L.Icon.Default.prototype._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
                iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
                shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
            });

            if (!mapContainerRef.current || !isMounted) return;

            // Initialise map centred on India
            const map = L.map(mapContainerRef.current, { zoomControl: true }).setView([20.5937, 78.9629], 5);
            mapRef.current = map;

            // OpenStreetMap tiles — free, no API key
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(map);

            // Custom icons
            const destIcon = L.divIcon({
                html: `<div style="background:#2563EB;width:36px;height:36px;border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 4px 14px rgba(37,99,235,0.5)"></div>`,
                iconSize: [36, 36],
                iconAnchor: [18, 36],
                className: '',
            });
            const userIcon = L.divIcon({
                html: `<div style="background:#16a34a;width:22px;height:22px;border-radius:50%;border:3px solid #fff;box-shadow:0 4px 14px rgba(22,163,74,0.5);animation:pulse 2s infinite"></div>`,
                iconSize: [22, 22],
                iconAnchor: [11, 11],
                className: '',
            });

            // Geocode the destination
            const query = `${placeName}, ${city}, India`;
            setStatus('loading');
            const destCoords = await geocode(query);

            if (!destCoords || !isMounted) {
                setStatus('error');
                return;
            }

            // Add destination marker
            const destMarker = L.marker([destCoords.lat, destCoords.lng], { icon: destIcon })
                .addTo(map)
                .bindPopup(`
          <div style="font-family:system-ui;padding:6px">
            <strong style="color:#1e40af;font-size:14px">📍 ${placeName}</strong><br/>
            <span style="color:#64748b;font-size:12px">${city}, India</span>
          </div>
        `, { maxWidth: 200 });

            map.setView([destCoords.lat, destCoords.lng], 14);
            destMarker.openPopup();
            setStatus('ready');

            // Try to get user location and draw route
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        if (!isMounted) return;
                        const userCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };

                        // Add user location marker
                        L.marker([userCoords.lat, userCoords.lng], { icon: userIcon })
                            .addTo(map)
                            .bindPopup(`<div style="font-family:system-ui;padding:4px"><strong style="color:#15803d">🟢 Your Location</strong></div>`)
                            .openPopup();

                        // Try to draw route via OSRM
                        try {
                            const route = await getRoute(userCoords, destCoords);
                            if (route && isMounted) {
                                // Draw route polyline
                                L.polyline(route.coords, {
                                    color: '#2563EB',
                                    weight: 5,
                                    opacity: 0.85,
                                    dashArray: null,
                                    lineCap: 'round',
                                    lineJoin: 'round',
                                }).addTo(map);

                                // Fit map to show both locations
                                const bounds = L.latLngBounds(
                                    [userCoords.lat, userCoords.lng],
                                    [destCoords.lat, destCoords.lng]
                                );
                                map.fitBounds(bounds, { padding: [60, 60] });

                                setInfo({ distance: route.distance, duration: route.duration });
                            } else {
                                // No route — just fit bounds
                                map.fitBounds(
                                    L.latLngBounds([userCoords.lat, userCoords.lng], [destCoords.lat, destCoords.lng]),
                                    { padding: [60, 60] }
                                );
                            }
                        } catch (e) {
                            console.warn('Routing failed:', e);
                        }

                        setLocating(false);
                    },
                    () => {
                        // Geolocation denied or failed — just show destination
                        if (isMounted) setLocating(false);
                    },
                    { timeout: 8000 }
                );
            } else {
                setLocating(false);
            }
        };

        initMap().catch((e) => {
            console.error('Map init error:', e);
            if (isMounted) setStatus('error');
        });

        return () => {
            isMounted = false;
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, [placeName, city]);

    // Close on Escape key
    useEffect(() => {
        const onKey = (e) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onClose]);

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(6px)' }}
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div
                className="bg-white rounded-3xl overflow-hidden flex flex-col"
                style={{ width: '90vw', maxWidth: 900, height: '82vh', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-white shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center">
                            <Navigation size={18} className="text-white" />
                        </div>
                        <div>
                            <h3 className="font-black text-[#0F172A] text-base leading-tight">{placeName}</h3>
                            <p className="text-[12px] text-gray-400 font-medium">{city}, India</p>
                        </div>
                    </div>

                    {/* Route info badge */}
                    {info && (
                        <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2">
                            <div className="text-center">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Distance</p>
                                <p className="text-sm font-black text-blue-600">{info.distance} km</p>
                            </div>
                            <div className="w-px h-8 bg-blue-200" />
                            <div className="text-center">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Est. Time</p>
                                <p className="text-sm font-black text-blue-600">
                                    {info.duration >= 60 ? `${Math.floor(info.duration / 60)}h ${info.duration % 60}m` : `${info.duration} min`}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Status indicators */}
                    <div className="flex items-center gap-3">
                        {locating && status === 'ready' && (
                            <div className="flex items-center gap-2 text-xs text-gray-400 font-medium">
                                <Loader2 size={13} className="animate-spin text-blue-500" />
                                <span>Getting your location...</span>
                            </div>
                        )}
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-6 px-6 py-2 bg-gray-50 border-b border-gray-100 shrink-0">
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-semibold">
                        <div className="w-3 h-3 rounded-full bg-blue-600" />
                        Destination
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-semibold">
                        <div className="w-3 h-3 rounded-full bg-green-600" />
                        Your Location
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-gray-500 font-semibold">
                        <div className="w-8 h-1 rounded-full bg-blue-600" />
                        Route
                    </div>
                    <div className="ml-auto text-[11px] text-gray-400">
                        Powered by OpenStreetMap • Free & open source
                    </div>
                </div>

                {/* Map Container */}
                <div className="relative flex-1">
                    {status === 'loading' && (
                        <div className="absolute inset-0 z-10 bg-white flex flex-col items-center justify-center gap-3">
                            <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center">
                                <Loader2 size={28} className="animate-spin text-blue-500" />
                            </div>
                            <p className="text-sm font-semibold text-gray-500">Finding {placeName}...</p>
                        </div>
                    )}
                    {status === 'error' && (
                        <div className="absolute inset-0 z-10 bg-white flex flex-col items-center justify-center gap-3 p-8">
                            <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
                                <AlertCircle size={28} className="text-red-400" />
                            </div>
                            <p className="text-base font-black text-gray-700">Location not found</p>
                            <p className="text-sm text-gray-400 text-center">
                                Could not find "{placeName}" on the map. Try searching for it manually.
                            </p>
                            <a
                                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(placeName + ', ' + city + ', India')}`}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-colors"
                            >
                                Open in Google Maps
                            </a>
                        </div>
                    )}
                    <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />
                </div>
            </div>

            {/* Pulse animation for user dot */}
            <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
        }
      `}</style>
        </div>
    );
};

export default MapModal;
