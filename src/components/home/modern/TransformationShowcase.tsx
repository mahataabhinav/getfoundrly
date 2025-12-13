
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Linkedin, Instagram, Check, X, Heart, MessageCircle, Share2, MoreHorizontal, Bookmark, Send, Music2, Globe } from 'lucide-react';

export default function TransformationShowcase() {
    const [sliderValue, setSliderValue] = useState(50);
    const [activeTab, setActiveTab] = useState<'linkedin' | 'instagram'>('linkedin');
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        setSliderValue(percentage);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.touches[0].clientX - rect.left, rect.width));
        const percentage = (x / rect.width) * 100;
        setSliderValue(percentage);
    };

    return (
        <section className="py-24 bg-[#0A0A0A] text-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-sm font-medium text-indigo-300 mb-6"
                    >
                        Before & After
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-4xl md:text-5xl font-bold mb-6"
                    >
                        The <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Foundrly Effect</span>
                    </motion.h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">
                        Witness the transformation from generic updates to authority-building thought leadership.
                    </p>

                    {/* Tab Switcher */}
                    <div className="flex justify-center gap-4 mb-10">
                        <button
                            onClick={() => setActiveTab('linkedin')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === 'linkedin'
                                ? 'bg-[#0077B5] text-white shadow-[0_0_20px_rgba(0,119,181,0.3)] scale-105'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <Linkedin className="w-4 h-4" /> LinkedIn
                        </button>
                        <button
                            onClick={() => setActiveTab('instagram')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-medium transition-all ${activeTab === 'instagram'
                                ? 'bg-gradient-to-tr from-[#FD1D1D] to-[#833AB4] text-white shadow-[0_0_20px_rgba(253,29,29,0.3)] scale-105'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            <Instagram className="w-4 h-4" /> Instagram
                        </button>
                    </div>
                </div>

                <div className="relative max-w-4xl mx-auto aspect-[4/5] md:aspect-[2/1] bg-gray-900 rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="absolute inset-0"
                        >
                            {/* AFTER Image (Background) */}
                            <div className="absolute inset-0 bg-[#0F1115] flex items-center justify-center p-4 md:p-8">
                                {activeTab === 'linkedin' ? <LinkedInPost variant="after" /> : <InstagramPost variant="after" />}
                                <div className="absolute top-6 right-6 bg-indigo-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10 hidden md:block">
                                    AFTER: AUTHORITY
                                </div>
                            </div>

                            {/* BEFORE Image (Foreground, clipped) */}
                            <div
                                className="absolute inset-0 bg-[#F3F4F6] flex items-center justify-center p-4 md:p-8 border-r border-white/20"
                                style={{ clipPath: `polygon(0 0, ${sliderValue}% 0, ${sliderValue}% 100%, 0 100%)` }}
                            >
                                {activeTab === 'linkedin' ? <LinkedInPost variant="before" /> : <InstagramPost variant="before" />}
                                <div className="absolute top-6 left-6 bg-gray-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10 hidden md:block">
                                    BEFORE: NOISE
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>

                    {/* Slider Handle */}
                    <div
                        ref={containerRef}
                        className="absolute inset-0 cursor-ew-resize z-20 touch-none"
                        onMouseMove={handleMouseMove}
                        onTouchMove={handleTouchMove}
                    >
                        <div
                            className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_20px_rgba(255,255,255,0.5)] z-30"
                            style={{ left: `${sliderValue}%` }}
                        >
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-indigo-600">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M18 8L22 12L18 16" />
                                    <path d="M6 8L2 12L6 16" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics */}
                <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <MetricCard label="Engagement Amplification" value="340%" delay={0.1} />
                    <MetricCard label="Brand Consistency" value="100%" delay={0.2} />
                    <MetricCard label="Time Saved / Wk" value="12h+" delay={0.3} />
                </div>
            </div>
        </section>
    );
}

function MetricCard({ label, value, delay }: { label: string; value: string; delay: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay }}
            className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-colors"
        >
            <div className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white to-gray-400 mb-2">
                {value}
            </div>
            <div className="text-sm text-gray-400 font-medium uppercase tracking-wider">
                {label}
            </div>
        </motion.div>
    );
}

// --- SUB-COMPONENTS for POSTS ---

function LinkedInPost({ variant }: { variant: 'before' | 'after' }) {
    if (variant === 'after') {
        return (
            <div className="w-full max-w-sm md:max-w-md bg-white rounded-xl shadow-2xl overflow-hidden transform scale-95 md:scale-100 transition-transform origin-center">
                {/* Header */}
                <div className="p-4 flex items-start gap-3 border-b border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 p-[2px]">
                        <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-indigo-700 font-bold text-sm">AM</div>
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-gray-900 text-sm">Abhinav Mahata</h3>
                        <p className="text-xs text-gray-500">Founder @ Foundrly • 2h • <Globe className="w-3 h-3 inline ml-0.5" /></p>
                    </div>
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </div>
                {/* Content */}
                <div className="p-4 pb-2">
                    <p className="text-sm text-gray-800 leading-relaxed mb-3">
                        Building a startup isn't just about code.<br /><br />
                        It's about the <span className="font-semibold text-indigo-600">story you tell</span> and the problems you solve.
                        We realized our users struggled with brand voice. <br /><br />
                        So we built an AI BrandDNA extractor. The result? <span className="font-bold">3x engagement</span> in 48 hours. 🚀
                    </p>
                    <p className="text-xs text-indigo-600 font-medium">#BuildInPublic #StartupLife #AI #Growth</p>
                </div>
                {/* Carousel/Visual mock */}
                <div className="w-full h-48 bg-gradient-to-r from-indigo-50 to-purple-50 relative flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-90 hover:scale-105 transition-transform duration-700"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                        <span className="text-white font-bold text-lg">From Zero to Authority 📈</span>
                    </div>
                </div>
                {/* Stats */}
                <div className="px-4 py-2 border-b border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <span className="flex items-center gap-1">👍 ❤️ 👏 842</span>
                    <span>48 comments • 12 reposts</span>
                </div>
                {/* Actions */}
                <div className="px-2 py-1 flex justify-between">
                    <button className="flex items-center gap-2 px-3 py-3 rounded hover:bg-gray-100 text-gray-600 text-xs font-semibold"><Heart className="w-4 h-4" /> Like</button>
                    <button className="flex items-center gap-2 px-3 py-3 rounded hover:bg-gray-100 text-gray-600 text-xs font-semibold"><MessageCircle className="w-4 h-4" /> Comment</button>
                    <button className="flex items-center gap-2 px-3 py-3 rounded hover:bg-gray-100 text-gray-600 text-xs font-semibold"><Share2 className="w-4 h-4" /> Share</button>
                    <button className="flex items-center gap-2 px-3 py-3 rounded hover:bg-gray-100 text-gray-600 text-xs font-semibold"><Send className="w-4 h-4" /> Send</button>
                </div>
            </div>
        );
    }
    // Variant: Before
    return (
        <div className="w-full max-w-sm md:max-w-md bg-white rounded-xl shadow border border-gray-200 opacity-80 filter grayscale-[20%] transform scale-95 md:scale-100 transition-transform origin-center">
            <div className="p-4 flex items-start gap-3 border-b border-gray-100">
                <div className="w-10 h-10 rounded-full bg-gray-200"></div>
                <div className="flex-1">
                    <div className="w-24 h-4 bg-gray-200 rounded mb-1"></div>
                    <div className="w-16 h-3 bg-gray-100 rounded"></div>
                </div>
            </div>
            <div className="p-4">
                <div className="w-full h-3 bg-gray-200 rounded mb-2"></div>
                <div className="w-3/4 h-3 bg-gray-200 rounded mb-4"></div>
                <p className="text-sm text-gray-500 mb-4">Just launched a new feature. Check link in bio.</p>
                <div className="w-full h-40 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-sm border-2 border-dashed border-gray-200">
                    Image_placeholder.jpg
                </div>
            </div>
            <div className="px-4 py-3 border-t border-gray-100 flex gap-4 text-gray-400">
                <span className="flex items-center gap-1 text-xs"><Heart className="w-3 h-3" /> 2</span>
            </div>
        </div>
    );
}

function InstagramPost({ variant }: { variant: 'before' | 'after' }) {
    if (variant === 'after') {
        return (
            <div className="w-[300px] bg-black rounded-3xl overflow-hidden shadow-2xl border border-gray-800 text-white transform scale-95 md:scale-100 origin-center relative">
                {/* Reel Video BG Simulation */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=600')] bg-cover bg-center opacity-80"></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90"></div>
                </div>

                {/* UI Overlay */}
                <div className="relative h-[500px] flex flex-col justify-between p-4 z-10">
                    <div className="flex items-center justify-between">
                        <div className="text-sm font-bold drop-shadow-md">Reels</div>
                        <div className="bg-black/20 backdrop-blur-md px-2 py-1 rounded text-xs font-medium flex items-center gap-1"><Music2 className="w-3 h-3" /> Trending Audio</div>
                    </div>

                    <div className="flex flex-col gap-3">
                        {/* Side Actions */}
                        <div className="absolute bottom-20 right-2 flex flex-col items-center gap-4">
                            <div className="flex flex-col items-center gap-1">
                                <Heart className="w-6 h-6 fill-red-500 text-red-500" />
                                <span className="text-xs font-bold">12.4K</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <MessageCircle className="w-6 h-6" />
                                <span className="text-xs font-bold">482</span>
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <Send className="w-6 h-6" />
                            </div>
                            <div className="flex flex-col items-center gap-1">
                                <MoreHorizontal className="w-6 h-6" />
                            </div>
                        </div>

                        {/* Caption */}
                        <div className="pr-12">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 to-purple-600 p-[1.5px]">
                                    <div className="w-full h-full rounded-full border border-black bg-gray-800"></div>
                                </div>
                                <span className="font-semibold text-sm">foundrly_ai</span>
                                <button className="px-2 py-0.5 border border-white/30 rounded text-[10px] font-medium backdrop-blur-sm">Follow</button>
                            </div>
                            <p className="text-sm text-white/90 line-clamp-2 leading-snug">
                                Stop guessing your content strategy. 💡 Use AI to extract your BrandDNA and scale instantly. <span className="text-gray-400">#growth #marketing</span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    // Variant Before
    return (
        <div className="w-[300px] bg-white rounded-3xl overflow-hidden shadow border border-gray-200 text-black transform scale-95 md:scale-100 origin-center h-[500px] flex flex-col">
            <div className="p-3 border-b border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200"></div>
                    <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
                <MoreHorizontal className="w-5 h-5 text-gray-400" />
            </div>

            <div className="flex-1 bg-gray-100 flex items-center justify-center relative overflow-hidden">
                {/* Dull mock image */}
                <img
                    src="https://images.unsplash.com/photo-1526726538690-5cbf956ae2fd?q=80&w=600&auto=format&fit=crop"
                    alt="Generic Lifestyle"
                    className="w-full h-full object-cover opacity-70 grayscale-[50%]"
                />
                <div className="absolute inset-0 bg-yellow-900/10 mix-blend-multiply pointer-events-none"></div>
            </div>

            <div className="p-3">
                <div className="flex gap-4 mb-2">
                    <Heart className="w-6 h-6 text-gray-400" />
                    <MessageCircle className="w-6 h-6 text-gray-400" />
                    <Send className="w-6 h-6 text-gray-400" />
                </div>
                <div className="text-xs font-bold text-gray-900 mb-1">3 likes</div>
                <p className="text-xs text-gray-500">
                    <span className="font-bold text-gray-900 mr-1">user123</span>
                    Check out my link.
                </p>
                <div className="text-[10px] text-gray-400 mt-1 uppercase">2 DAYS AGO</div>
            </div>
        </div>
    );
}
