import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Download,
    Share2,
    MapPin,
    Calendar,
    ChevronRight,
    Map as MapIcon,
    CheckCircle2,
    Clock,
    Sparkles,
    TrendingUp,
    Users,
    ArrowLeft,
    Navigation,
    Loader2
} from 'lucide-react';
import MapModal from '../components/MapModal';

// Reliable fallback image using picsum.photos (always works, no API key needed)
const FALLBACK_IMAGE = 'https://picsum.photos/seed/indiatravel/800/500';

const DashboardPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { plan, preferences } = location.state || {
        plan: {
            itinerary: [
                {
                    day: 1,
                    title: "Royal Forts & Palaces",
                    activities: [
                        { name: "Amber Fort (Amer Fort)", cost: 500, insight: "Experience the stunning blend of Hindu and Mughal architecture. Arrive by 9:00 AM to beat the crowd.", duration: "3 Hours", type: "Heritage", rating: 4.8, image: "https://images.unsplash.com/photo-1590050752117-23a9d7fc2030?auto=format&fit=crop&q=80&w=800" },
                        { name: "Hawa Mahal", cost: 50, insight: "The Palace of Winds is a unique 5-story structure with 953 windows. Best photographed from the street side in morning light.", duration: "1.5 Hours", type: "Heritage", rating: 4.7, image: "https://images.unsplash.com/photo-1599661046289-e318978b3941?auto=format&fit=crop&q=80&w=800" },
                        { name: "City Palace Jaipur", cost: 700, insight: "The royal residence turned museum houses an exquisite collection of royal costumes and armoury. Don't miss the Diwan-i-Khas.", duration: "2 Hours", type: "Heritage", rating: 4.6, image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800" }
                    ]
                }
            ],
            totalCost: 42500,
            totalPlaces: 18,
            entryFees: 8400,
            transport: 12000,
            foodMisc: 22100,
            explanation: "This plan is optimized for a heritage-focused journey through Jaipur."
        },
        preferences: { destination: "Jaipur", days: 3, interests: ["Heritage"] }
    };

    if (!plan || !plan.itinerary) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-[#F8FAFC] gap-4">
                <p className="text-xl font-bold text-[#64748B]">No itinerary data found.</p>
                <button onClick={() => navigate('/plan')} className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold">
                    Go Plan a Trip
                </button>
            </div>
        );
    }

    const numDays = preferences?.days || plan.itinerary.length;
    const destination = preferences?.destination || 'Your Destination';
    const interests = preferences?.interests || [];
    const [mapModal, setMapModal] = useState(null); // { placeName, city }

    return (
        <div className="bg-[#F8FAFC] min-h-screen px-8 py-8">
            {/* Embedded Map Modal */}
            {mapModal && (
                <MapModal
                    placeName={mapModal.placeName}
                    city={mapModal.city || destination}
                    onClose={() => setMapModal(null)}
                />
            )}
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-2 text-[13px] font-medium text-[#94A3B8] mb-6">
                <button onClick={() => navigate('/')} className="hover:text-blue-600 transition-colors">Home</button>
                <ChevronRight size={14} />
                <button onClick={() => navigate('/plan')} className="hover:text-blue-600 transition-colors">Plan</button>
                <ChevronRight size={14} />
                <span className="text-[#1E293B] font-semibold">{destination} Journey</span>
            </nav>

            {/* Header */}
            <div className="flex justify-between items-start mb-10 flex-wrap gap-4">
                <div>
                    <h1 className="text-[36px] font-extrabold text-[#0F172A] mb-3 leading-tight tracking-tight capitalize">
                        Your {destination} Adventure Journey
                    </h1>
                    <div className="flex items-center gap-6 text-[15px] font-semibold text-[#64748B] flex-wrap gap-y-2">
                        <div className="flex items-center gap-2">
                            <Calendar size={18} className="text-blue-500" />
                            <span>{numDays}-Day AI-Optimized Plan</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Users size={18} className="text-blue-500" />
                            <span>Personalized for You</span>
                        </div>
                        {interests.length > 0 && (
                            <div className="flex items-center gap-2">
                                <Sparkles size={18} className="text-orange-500" />
                                <span>{interests.join(' • ')}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => navigate('/plan')}
                        className="bg-white hover:bg-gray-50 text-[#0F172A] border border-[#E2E8F0] px-6 py-3 rounded-2xl flex items-center gap-2 font-bold transition-all"
                    >
                        <ArrowLeft size={18} />
                        New Trip
                    </button>
                    <button
                        onClick={() => setMapModal({ placeName: `${destination} - Tourist Attractions`, city: destination })}
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-4 rounded-2xl flex items-center gap-3 font-bold shadow-xl shadow-blue-500/20 transition-all transform active:scale-95"
                    >
                        <MapIcon size={20} />
                        View Map
                    </button>
                </div>
            </div>

            <div className="flex gap-10 items-start">
                {/* Main Content – All Days */}
                <div className="flex-1 space-y-12 pb-20">
                    {plan.itinerary.map((day, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className="flex gap-8 relative"
                        >
                            {/* Timeline Number */}
                            <div className="relative flex-shrink-0">
                                <div className="w-10 h-10 bg-[#2563EB] rounded-full flex items-center justify-center text-white font-bold text-lg sticky top-8 z-10 shadow-lg shadow-blue-500/20">
                                    {day.day || idx + 1}
                                </div>
                                {idx !== plan.itinerary.length - 1 && (
                                    <div className="absolute left-1/2 top-10 w-0.5 h-[calc(100%+48px)] bg-[#E2E8F0] -translate-x-1/2" />
                                )}
                            </div>

                            {/* Day Content */}
                            <div className="flex-1 space-y-6">
                                <div className="flex items-center gap-4 flex-wrap">
                                    <h2 className="text-2xl font-black text-[#0F172A]">
                                        Day {day.day || idx + 1}: {day.title || 'Exploring Wonders'}
                                    </h2>
                                    {idx === 0 && (
                                        <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-orange-100 italic">
                                            Start Here
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    {(day.activities || []).map((activity, aIdx) => {
                                        const act = typeof activity === 'string'
                                            ? { name: activity, cost: 0, insight: "A fantastic spot worth visiting.", duration: "2 Hours", type: "General", rating: 4.5 }
                                            : activity;
                                        return <ActivityCard key={aIdx} activity={act} destination={destination} onViewMap={(p, c) => setMapModal({ placeName: p, city: c })} />;
                                    })}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Sidebar */}
                <aside className="w-[360px] space-y-8 sticky top-8 h-fit flex-shrink-0">
                    {/* Trip Summary */}
                    <div className="bg-[#2563EB] rounded-[32px] p-8 text-white shadow-2xl shadow-blue-500/20 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-2xl font-black mb-1">Trip Summary</h3>
                            <p className="text-blue-100 text-sm font-medium mb-8">
                                Quick overview of your {numDays}-day journey
                            </p>

                            <div className="grid grid-cols-2 gap-4 mb-8">
                                <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                                    <p className="text-[10px] font-black text-blue-200 uppercase mb-1">TOTAL BUDGET</p>
                                    <p className="text-2xl font-black italic">₹{Number(plan.totalCost || 0).toLocaleString('en-IN')}</p>
                                </div>
                                <div className="bg-white/10 rounded-2xl p-4 border border-white/10">
                                    <p className="text-[10px] font-black text-blue-200 uppercase mb-1">TOTAL PLACES</p>
                                    <p className="text-2xl font-black italic">{plan.totalPlaces || plan.itinerary.reduce((acc, d) => acc + (d.activities?.length || 0), 0)}</p>
                                </div>
                            </div>

                            <div className="space-y-4 mb-10">
                                <SummaryRow label="Entry Fees" val={plan.entryFees} />
                                <SummaryRow label="Transport (Est.)" val={plan.transport} />
                                <SummaryRow label="Food & Misc" val={plan.foodMisc} />
                            </div>

                            {plan.explanation && (
                                <div className="bg-white/10 rounded-2xl p-4 border border-white/10 mb-6">
                                    <p className="text-[12px] text-blue-100 leading-relaxed italic">"{plan.explanation}"</p>
                                </div>
                            )}

                            <div className="space-y-3">
                                <button
                                    onClick={() => window.print()}
                                    className="w-full bg-[#0F172A] hover:bg-black py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-lg shadow-black/20 active:scale-95"
                                >
                                    <Download size={20} />
                                    Download PDF
                                </button>
                                <button
                                    onClick={() => {
                                        const text = `Check out my ${numDays}-day AI-planned itinerary for ${destination}! Planned with BharatTravel AI.`;
                                        if (navigator.share) {
                                            navigator.share({ title: `${destination} Itinerary`, text });
                                        } else {
                                            navigator.clipboard.writeText(text);
                                            alert('Itinerary link copied to clipboard!');
                                        }
                                    }}
                                    className="w-full bg-white hover:bg-blue-50 text-[#0F172A] py-4 rounded-2xl font-black flex items-center justify-center gap-3 transition-all active:scale-95"
                                >
                                    <Share2 size={20} />
                                    Share Itinerary
                                </button>
                            </div>
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
                    </div>

                    {/* AI Insights */}
                    <div className="bg-white rounded-[32px] p-8 border border-[#E2E8F0] shadow-sm relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
                                <Sparkles size={22} />
                            </div>
                            <h3 className="text-xl font-black text-[#0F172A]">AI Insights</h3>
                        </div>

                        <div className="space-y-6">
                            <InsightRow
                                icon={<CheckCircle2 size={18} className="text-[#3B82F6]" />}
                                title="Route Optimized"
                                desc={`Attractions are grouped geographically to minimize commute time across your ${numDays}-day trip.`}
                            />
                            <InsightRow
                                icon={<TrendingUp size={18} className="text-orange-500" />}
                                title="Interest Matched"
                                desc={`Your plan prioritizes ${interests.length > 0 ? interests.join(' & ') : 'top-rated'} experiences in ${destination}.`}
                            />
                            <InsightRow
                                icon={<Users size={18} className="text-green-500" />}
                                title="Budget Smart"
                                desc="We've balanced paid attractions with free spots to maximize your experience within budget."
                            />
                        </div>
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-12 -mt-12 blur-2xl" />
                    </div>

                    {/* Map Placeholder */}
                    <div className="relative rounded-[32px] overflow-hidden group h-48 border border-[#E2E8F0]">
                        <img
                            src={`https://picsum.photos/seed/${encodeURIComponent(destination).replace(/%/g, '').slice(0, 20)}map/600/400`}
                            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                            className="w-full h-full object-cover grayscale opacity-60 group-hover:scale-110 transition-all duration-700"
                            alt="Map preview"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/80 to-transparent flex items-center justify-center">
                            <button
                                onClick={() => {
                                    const q = encodeURIComponent(`${destination}, India tourist places`);
                                    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
                                }}
                                className="bg-white text-[#0F172A] px-6 py-3 rounded-xl font-black tracking-widest uppercase text-xs shadow-xl active:scale-95 transition-all hover:bg-blue-50"
                            >
                                Explore Map
                            </button>
                        </div>
                    </div>
                </aside>
            </div>

            <footer className="text-center mt-20 text-xs text-[#94A3B8] font-medium tracking-wide">
                © 2024 BharatTravel AI • Crafted with love for Indian Tourism
            </footer>
        </div>
    );
};

const ActivityCard = ({ activity, destination, onViewMap }) => {
    const [imgError, setImgError] = useState(false);
    const actSeed = String(activity.name || activity.type || 'travel').replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 20);
    const fallbackImg = `https://picsum.photos/seed/${actSeed || 'travel'}/800/500`;

    return (
        <motion.div
            whileHover={{ x: 6 }}
            className="bg-white rounded-[28px] p-5 border border-[#F1F5F9] shadow-sm flex gap-5 group hover:border-blue-200 hover:shadow-md transition-all duration-300"
        >
            <div className="w-44 h-36 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                <img
                    src={imgError ? fallbackImg : (activity.image || fallbackImg)}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-all duration-500"
                    alt={activity.name}
                    loading="lazy"
                />
            </div>
            <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start gap-2">
                    <h4 className="text-lg font-black text-[#0F172A] leading-tight">{activity.name}</h4>
                    <span className={`px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider whitespace-nowrap flex-shrink-0 ${activity.cost === 0 ? 'bg-green-50 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                        {activity.cost === 0 ? '🎟 Free Entry' : `₹${Number(activity.cost).toLocaleString('en-IN')}`}
                    </span>
                </div>
                <p className="text-[13px] text-[#64748B] leading-relaxed">
                    <span className="font-bold text-[#3B82F6]">AI Insight: </span>
                    {activity.insight || activity.description || "A must-visit spot in the region."}
                </p>
                <div className="flex items-center gap-5 pt-1 flex-wrap">
                    <div className="flex items-center gap-1.5 text-[#94A3B8] font-bold text-xs uppercase tracking-wide">
                        <Clock size={14} className="text-[#3B82F6]" />
                        <span>{activity.duration || '2 Hours'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#94A3B8] font-bold text-xs uppercase tracking-wide">
                        <MapPin size={14} className="text-[#3B82F6]" />
                        <span>{activity.type || 'Sightseeing'}</span>
                    </div>
                    {activity.rating && (
                        <div className="flex items-center gap-1.5 text-[#94A3B8] font-bold text-xs uppercase tracking-wide">
                            <Sparkles size={14} className="text-orange-500" />
                            <span>{activity.rating} ★</span>
                        </div>
                    )}
                    {/* Get Route Button — opens embedded MapModal */}
                    <button
                        onClick={() => onViewMap(activity.name, destination)}
                        className="ml-auto flex items-center gap-1.5 bg-[#EFF6FF] hover:bg-[#2563EB] text-[#2563EB] hover:text-white border border-blue-200 hover:border-transparent px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-200 active:scale-95 whitespace-nowrap"
                    >
                        <Navigation size={11} /> Get Route
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const SummaryRow = ({ label, val }) => {
    const display = val !== undefined && val !== null
        ? `₹${Number(val).toLocaleString('en-IN')}`
        : '—';
    return (
        <div className="flex justify-between items-center text-sm font-bold border-b border-white/10 pb-2">
            <span className="text-blue-200 font-medium">{label}</span>
            <span className="italic">{display}</span>
        </div>
    );
};

const InsightRow = ({ icon, title, desc }) => (
    <div className="space-y-1.5">
        <div className="flex items-center gap-2">
            {icon}
            <h5 className="font-black text-[#0F172A] text-sm uppercase tracking-tight">{title}:</h5>
        </div>
        <p className="text-[13px] text-[#64748B] leading-relaxed ml-7">{desc}</p>
    </div>
);

export default DashboardPage;
