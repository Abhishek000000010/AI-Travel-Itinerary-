import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Globe, Navigation } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl -mr-64 -mt-64" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl -ml-64 -mb-64" />

            <div className="max-w-7xl mx-auto px-8 pt-20 pb-16 flex flex-col items-center text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest mb-10 border border-blue-100"
                >
                    <Sparkles size={14} />
                    The Future of Travel Planning
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-[80px] font-black text-[#0F172A] leading-[0.9] tracking-tighter mb-10"
                >
                    Don't just travel.<br />
                    Travel <span className="text-blue-600 italic">Smarter.</span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="max-w-xl text-[#64748B] text-xl font-medium leading-relaxed mb-12"
                >
                    The #1 AI-powered travel assistant that curates the most authentic,
                    efficient, and personalized itineraries for your Indian adventures.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-4"
                >
                    <button
                        onClick={() => navigate('/plan')}
                        className="bg-[#0F172A] hover:bg-black text-white px-10 py-5 rounded-[24px] font-black flex items-center gap-3 transition-all shadow-2xl shadow-black/20 group text-lg"
                    >
                        Plan My Adventure
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                        onClick={() => navigate('/plan')}
                        className="bg-white hover:bg-gray-50 text-[#0F172A] px-10 py-5 rounded-[24px] font-black flex items-center gap-3 transition-all border border-[#E2E8F0] text-lg"
                    >
                        View Demo
                    </button>
                </motion.div>

                {/* Hero App Mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-24 w-full max-w-5xl rounded-[40px] border border-[#E2E8F0] shadow-2xl shadow-blue-500/10 overflow-hidden bg-[#F8FAFC] p-4"
                >
                    <div className="bg-white rounded-[32px] w-full h-[500px] overflow-hidden flex shadow-inner">
                        <div className="w-16 bg-gray-50 border-r border-[#F1F5F9] flex flex-col items-center py-6 gap-6">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg" />
                            <div className="space-y-4">
                                <div className="w-6 h-6 bg-gray-200 rounded" />
                                <div className="w-6 h-6 bg-gray-200 rounded" />
                                <div className="w-6 h-6 bg-gray-200 rounded" />
                            </div>
                        </div>
                        <div className="flex-1 p-8 text-left">
                            <div className="w-48 h-8 bg-gray-100 rounded-lg mb-8" />
                            <div className="grid grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="w-full h-40 bg-gray-50 rounded-2xl" />
                                    <div className="w-full h-40 bg-gray-50 rounded-2xl" />
                                </div>
                                <div className="w-full h-full bg-blue-50 rounded-[32px] p-6">
                                    <div className="w-24 h-6 bg-blue-100 rounded mb-4" />
                                    <div className="space-y-2">
                                        <div className="w-full h-3 bg-blue-100 rounded" />
                                        <div className="w-4/5 h-3 bg-blue-100 rounded" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Features */}
                <div className="mt-32 grid grid-cols-1 md:grid-cols-4 gap-12 w-full max-w-5xl">
                    <LandingFeature icon={<Zap size={24} />} title="Lightning Fast" />
                    <LandingFeature icon={<ShieldCheck size={24} />} title="Verified Data" />
                    <LandingFeature icon={<Globe size={24} />} title="Pan-India Coverage" />
                    <LandingFeature icon={<Navigation size={24} />} title="Smart Route" />
                </div>
            </div>

            <footer className="text-center py-20 border-t border-[#F1F5F9] text-xs font-bold text-[#94A3B8] uppercase tracking-widest">
                Trusted by 50,000+ travelers exploring incredible india
            </footer>
        </div>
    );
};

const LandingFeature = ({ icon, title }) => (
    <div className="flex flex-col items-center gap-4 group">
        <div className="w-16 h-16 rounded-2xl bg-white border border-[#F1F5F9] shadow-sm flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform duration-300">
            {icon}
        </div>
        <span className="font-black text-[#0F172A] uppercase tracking-tight text-xs">{title}</span>
    </div>
);

export default LandingPage;
