
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Linkedin, Instagram, FileText, Check, Sparkles, Wand2, BarChart3, TrendingUp, Clock, Sliders, Send, MessageSquare, LayoutDashboard, Globe } from 'lucide-react';
import Logo from '../../Logo';

export default function ProductDemoAnimation() {
    const [step, setStep] = useState(0);
    const [urlText, setUrlText] = useState('');
    const [scanProgress, setScanProgress] = useState(0);

    // Script Timing Constants
    const STEP_1_IMPORT = 0;        // 0-2s
    const STEP_2_EXTRACT = 1;       // 2-5s
    const STEP_3_CREATE = 2;        // 5-9s
    const STEP_4_EDIT = 3;          // 9-11s
    const STEP_5_PUBLISH = 4;       // 11-13s
    const STEP_6_ANALYTICS = 5;     // 13-15s

    useEffect(() => {
        let mounted = true;
        const mainSequence = async () => {
            while (mounted) {
                // RESET
                setStep(0);
                setUrlText('');
                setScanProgress(0);

                // --- 0:00 - 0:02 : Step 1: Type & Enter ---
                const url = "https://stripe.com";
                for (let i = 0; i <= url.length; i++) {
                    if (!mounted) return;
                    setUrlText(url.slice(0, i));
                    await new Promise(r => setTimeout(r, 50));
                }
                await new Promise(r => setTimeout(r, 800)); // Wait a bit after typing

                if (!mounted) return;
                setStep(STEP_2_EXTRACT);

                // --- 0:02 - 0:05 : Step 2: Extract BrandDNA ---
                // Simulate scanning progress
                const scanInterval = setInterval(() => {
                    setScanProgress(prev => Math.min(prev + 2, 100));
                }, 30);
                await new Promise(r => setTimeout(r, 3000));
                clearInterval(scanInterval);

                if (!mounted) return;
                setStep(STEP_3_CREATE);

                // --- 0:05 - 0:09 : Step 3: Create (Montage) ---
                await new Promise(r => setTimeout(r, 4000));

                if (!mounted) return;
                setStep(STEP_4_EDIT);

                // --- 0:09 - 0:11 : Step 4: Edit & Optimize ---
                await new Promise(r => setTimeout(r, 2000));

                if (!mounted) return;
                setStep(STEP_5_PUBLISH);

                // --- 0:11 - 0:13 : Step 5: Publish / Schedule ---
                await new Promise(r => setTimeout(r, 2000));

                if (!mounted) return;
                setStep(STEP_6_ANALYTICS);

                // --- 0:13 - 0:15 : Step 6: Analyze & Grow ---
                await new Promise(r => setTimeout(r, 4000)); // Hold end card a bit longer for readability
            }
        };

        mainSequence();
        return () => { mounted = false; };
    }, []);

    return (
        <div className="relative w-full aspect-video bg-[#0F0F0F] rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col font-sans select-none">
            {/* Browser Bar - Hidden in Step 1 for "Zoomed" effect, or adapted */}
            <motion.div
                animate={{ y: step === STEP_1_IMPORT ? -50 : 0 }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                className="h-10 bg-[#1a1a1a] border-b border-white/5 flex items-center px-4 gap-2 z-20 shrink-0 absolute top-0 left-0 right-0"
            >
                <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                    <div className="w-3 h-3 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 ml-4 h-7 bg-black/40 rounded-md flex items-center px-3 text-xs text-gray-400 font-mono relative overflow-hidden">
                    {step >= STEP_2_EXTRACT && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-white flex items-center gap-2"
                        >
                            <Globe className="w-3 h-3 text-indigo-400" />
                            https://getfoundrly.com/
                        </motion.span>
                    )}
                </div>
            </motion.div>

            {/* On-screen Label - Always visible, adapts position */}
            <div className="absolute top-14 left-0 right-0 z-30 flex justify-center pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="px-4 py-1.5 bg-black/80 backdrop-blur-md rounded-full border border-white/10 text-xs font-medium text-white shadow-2xl flex items-center gap-2"
                    >
                        {step === STEP_1_IMPORT && <><Search className="w-3 h-3 text-indigo-400" /> Step 1 • Enter Brand URL</>}
                        {step === STEP_2_EXTRACT && <><Wand2 className="w-3 h-3 text-indigo-400" /> Step 2 • Extract BrandDNA</>}
                        {step === STEP_3_CREATE && <><Sparkles className="w-3 h-3 text-indigo-400" /> Step 3 • Create Content</>}
                        {step === STEP_4_EDIT && <><Sliders className="w-3 h-3 text-indigo-400" /> Step 4 • Fine Tune</>}
                        {step === STEP_5_PUBLISH && <><Send className="w-3 h-3 text-indigo-400" /> Step 5 • Publish</>}
                        {step === STEP_6_ANALYTICS && <><TrendingUp className="w-3 h-3 text-green-400" /> Step 6 • Watch it Grow</>}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Main Canvas */}
            <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-[#0F0F0F] via-[#111] to-[#0a0a0a] mt-10">
                {/* Subtle Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>

                <AnimatePresence mode="wait">
                    {/* STEP 1: ZOOMED INPUT */}
                    {step === STEP_1_IMPORT && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                            className="absolute inset-0 flex items-center justify-center p-12 z-40 bg-[#0F0F0F]"
                        >
                            {/* Logo in top-left corner during Step 1 */}
                            <div className="absolute top-8 left-8 z-50 opacity-80">
                                <Logo variant="light" iconSize={28} showWordmark={true} />
                            </div>

                            <div className="w-full max-w-xl">
                                <motion.div
                                    className="text-center mb-8"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.2 }}
                                >
                                    <h2 className="text-3xl font-bold text-white mb-2">Import your brand.</h2>
                                    <p className="text-gray-400">Paste your URL to get started.</p>
                                </motion.div>

                                <div className="relative">
                                    <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                                        <Globe className="w-6 h-6 text-gray-400" />
                                    </div>
                                    <div className="w-full bg-[#1A1A1A] border border-white/20 rounded-2xl h-16 flex items-center px-14 text-2xl text-white font-medium shadow-2xl shadow-indigo-500/10">
                                        {/* Simulating typing "stripe.com" - we reuse urlText logic but override the visual */}
                                        <input
                                            type="text"
                                            value={urlText}
                                            readOnly
                                            className="bg-transparent outline-none border-none flex-1 text-white placeholder-gray-500"
                                        />
                                        <motion.div
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ duration: 0.8, repeat: Infinity }}
                                            className="w-0.5 h-8 bg-indigo-500 ml-1"
                                        />
                                    </div>
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 1 }}
                                        className="absolute inset-y-0 right-2 flex items-center"
                                    >
                                        <div className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2">
                                            Import <Wand2 className="w-4 h-4" />
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: BRAND EXTRACTION */}
                    {step === STEP_2_EXTRACT && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            {/* Brand DNA Card */}
                            <div className="relative w-80 bg-[#1E1E1E] rounded-xl border border-white/10 p-6 shadow-2xl z-20">
                                <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

                                <div className="flex items-center justify-between mb-6">
                                    <div className="w-12 h-12 bg-[#635BFF] rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-400">Brand Match</div>
                                        <div className="text-lg font-bold text-green-400">{Math.min(scanProgress + 20, 98)}%</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Color Palette</div>
                                        <div className="flex gap-2">
                                            <div className="w-8 h-8 rounded-md bg-[#635BFF]" />
                                            <div className="w-8 h-8 rounded-md bg-[#0A2540]" />
                                            <div className="w-8 h-8 rounded-md bg-[#00D4FF]" />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">Tone of Voice</div>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">Professional</span>
                                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">Technical</span>
                                            <span className="px-2 py-1 bg-white/5 rounded text-xs text-gray-300">Innovative</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Scanner Effect */}
                                <motion.div
                                    className="absolute inset-x-0 h-1 bg-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.5)] z-30"
                                    animate={{ top: ['0%', '100%'] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
                                />
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: CREATE (MONTAGE) */}
                    {step === STEP_3_CREATE && (
                        <motion.div
                            key="step3"
                            className="absolute inset-0 p-6 flex gap-4 items-center justify-center"
                        >
                            {/* LinkedIn Post - Realistic */}
                            <motion.div
                                initial={{ x: -50, opacity: 0, scale: 0.9 }}
                                animate={{ x: 0, opacity: 1, scale: 1 }}
                                transition={{ type: "spring", bounce: 0.4 }}
                                className="w-64 bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-200 text-black font-sans relative z-10"
                            >
                                {/* LI Header */}
                                <div className="p-3 flex items-start gap-2">
                                    <div className="w-10 h-10 bg-[#635BFF] rounded-sm text-white flex items-center justify-center font-bold text-lg">S</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-semibold text-sm leading-tight text-gray-900">Stripe</div>
                                        <div className="text-[10px] text-gray-500 truncate">Financial Infrastructure Platform</div>
                                        <div className="text-[10px] text-gray-500 flex items-center gap-1">2h • <Globe className="w-2 h-2" /></div>
                                    </div>
                                    <div className="text-gray-400">•••</div>
                                </div>
                                {/* LI Body */}
                                <div className="px-3 pb-2 text-[11px] text-gray-800 leading-snug">
                                    The new financial standard. Millions of companies rely on Stripe's infrastructure to scale their payments. 🚀 <span className="text-[#0A66C2]">#Fintech #Growth</span>
                                </div>
                                {/* LI Image - Stripe Style Gradient */}
                                <div className="w-full h-32 bg-[#635BFF] relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#635BFF] via-[#00D4FF] to-[#0A2540] opacity-90" />
                                    {/* Abstract shapes */}
                                    <motion.div
                                        animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                        className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg tracking-wider z-10">
                                        PAYMENTS 2.0
                                    </div>
                                </div>
                                {/* LI Footer */}
                                <div className="p-2 border-t border-gray-100 flex items-center justify-between text-gray-500">
                                    <div className="flex items-center gap-1 text-[10px]"><div className="w-3 h-3 bg-blue-500 rounded-full flex items-center justify-center text-[6px] text-white">👍</div> 1,240</div>
                                    <div className="text-[10px]">42 comments</div>
                                </div>
                                {/* Label */}
                                <div className="absolute top-2 right-2 bg-black/80 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm backdrop-blur-sm border border-white/20">
                                    LinkedIn
                                </div>
                            </motion.div>

                            {/* Instagram Reel - Realistic */}
                            <motion.div
                                initial={{ x: 50, opacity: 0, scale: 0.9 }}
                                animate={{ x: 0, opacity: 1, scale: 1 }}
                                transition={{ delay: 0.2, type: "spring", bounce: 0.4 }}
                                className="relative w-40 h-72 bg-black rounded-lg overflow-hidden shadow-2xl border border-gray-800 z-20"
                            >
                                {/* Reel Video Content - Animated */}
                                <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20"
                                        animate={{ opacity: [0.5, 0.8, 0.5] }}
                                        transition={{ duration: 3, repeat: Infinity }}
                                    />
                                    {/* Moving Text */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: 0.5, duration: 0.5 }}
                                            className="text-white text-xl font-black text-center leading-none"
                                        >
                                            DO IT<br />
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">FASTER.</span>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Reel UI Overlay */}
                                <div className="absolute inset-0 p-3 flex flex-col justify-between bg-gradient-to-b from-black/40 via-transparent to-black/60">
                                    <div className="flex justify-between items-center text-white">
                                        <div className="text-[10px] font-medium">Reels</div>
                                        <Instagram className="w-3 h-3" />
                                    </div>

                                    <div className="flex items-end">
                                        <div className="flex-1 text-white">
                                            <div className="flex items-center gap-2 mb-1">
                                                <div className="w-5 h-5 bg-[#635BFF] rounded-full border border-white flex items-center justify-center text-[8px] font-bold">S</div>
                                                <span className="text-[10px] font-semibold">stripe</span>
                                                <span className="text-[8px] border border-white/50 px-1 rounded">Follow</span>
                                            </div>
                                            <p className="text-[9px] font-light leading-tight mb-2">Scale faster with the world's best payment platform. 👇</p>
                                            <div className="flex items-center gap-1 text-[8px] opacity-80">
                                                <span className="animate-spin-slow">🎵</span> Original Audio
                                            </div>
                                        </div>
                                        {/* Right Actions */}
                                        <div className="flex flex-col gap-3 text-white items-center ml-2 text-[10px]">
                                            <div className="flex flex-col items-center gap-0.5">
                                                <div className="w-4 h-4">❤️</div>
                                                <span>24k</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-0.5">
                                                <div className="w-4 h-4">💬</div>
                                                <span>142</span>
                                            </div>
                                            <div className="w-4 h-4">✈️</div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* STEP 4: EDIT & OPTIMIZE */}
                    {step === STEP_4_EDIT && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                        >
                            <div className="w-96 bg-[#1A1A1A] rounded-xl border border-white/10 p-6 shadow-2xl relative">
                                {/* Chat Bubble animation */}
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    className="absolute -right-12 -top-12 bg-indigo-600 text-white p-3 rounded-2xl rounded-bl-none shadow-lg max-w-[180px] text-xs leading-relaxed z-30"
                                >
                                    <div className="flex items-center gap-1 mb-1 font-bold text-indigo-200">
                                        <MessageSquare className="w-3 h-3" /> Foundii AI
                                    </div>
                                    "I recommend shortening the hook for 15% more engagement."
                                </motion.div>

                                <div className="space-y-6">
                                    <div>
                                        <div className="flex justify-between text-xs text-gray-400 mb-2">
                                            <span>Tone: <strong className="text-white">Persuasive</strong></span>
                                        </div>
                                        <div className="h-1 bg-white/10 rounded-full cursor-pointer relative">
                                            <motion.div
                                                className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-indigo-500 rounded-full shadow-lg border-2 border-white"
                                                animate={{ left: ["20%", "70%", "65%"] }}
                                                transition={{ duration: 1.5, ease: "easeInOut" }}
                                            />
                                        </div>
                                    </div>

                                    <div className="p-3 bg-white/5 rounded-lg border border-white/5">
                                        <div className="text-xs text-gray-500">CTA Generation</div>
                                        <motion.div
                                            key="cta"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: 0.5 }}
                                            className="text-white text-sm mt-1"
                                        >
                                            "Start building your legacy today. Link in bio 🚀"
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 5: PUBLISH */}
                    {step === STEP_5_PUBLISH && (
                        <motion.div
                            key="step5"
                            className="absolute inset-0 flex items-center justify-center p-8"
                        >
                            <div className="flex gap-4">
                                <button className="px-6 py-3 rounded-lg bg-white/5 border border-white/10 text-gray-400 font-medium">
                                    Schedule
                                </button>
                                <motion.button
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ repeat: Infinity, duration: 1.5 }}
                                    className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold shadow-lg shadow-indigo-500/25 flex items-center gap-2"
                                >
                                    <Send className="w-4 h-4" />
                                    Publish Now
                                </motion.button>
                            </div>

                            {/* Fly away animation */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.2], x: 200, y: -200 }}
                                transition={{ delay: 1, duration: 0.8, ease: "anticipate" }}
                                className="absolute center w-20 h-28 bg-white rounded shadow-lg z-50 pointer-events-none"
                            />
                        </motion.div>
                    )}

                    {/* STEP 6: GROWTH (In-App Viral Effect) */}
                    {step === STEP_6_ANALYTICS && (
                        <motion.div
                            key="step6"
                            className="absolute inset-0 p-6 flex flex-col items-center justify-center bg-[#0F0F0F]"
                        >
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1.1 }}
                                transition={{ duration: 0.8 }}
                                className="relative w-72 bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-200 text-black font-sans z-10"
                            >
                                {/* LI Header */}
                                <div className="p-3 flex items-start gap-2 border-b border-gray-100">
                                    <div className="w-8 h-8 bg-[#635BFF] rounded-sm text-white flex items-center justify-center font-bold">S</div>
                                    <div className="flex-1">
                                        <div className="font-semibold text-xs text-gray-900">Stripe</div>
                                        <div className="text-[10px] text-gray-500">Just now • <Globe className="w-2 h-2 inline" /></div>
                                    </div>
                                    <div className="px-2 py-0.5 bg-green-100 text-green-700 text-[9px] font-bold rounded-full animate-pulse">
                                        VIRAL
                                    </div>
                                </div>

                                {/* Content Preview */}
                                <div className="w-full h-24 bg-[#635BFF] relative overflow-hidden flex items-center justify-center">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-[#635BFF] via-[#00D4FF] to-[#0A2540] opacity-90" />

                                    {/* Particle Effects (Likes popping) */}
                                    {[...Array(6)].map((_, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0, y: 0, x: 0 }}
                                            animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5], y: -50, x: (Math.random() - 0.5) * 60 }}
                                            transition={{ duration: 1, delay: i * 0.3, repeat: Infinity }}
                                            className="absolute text-xl"
                                        >
                                            {['👍', '❤️', '👏'][i % 3]}
                                        </motion.div>
                                    ))}

                                    <div className="text-white font-bold tracking-widest z-10 text-lg">PAYMENTS 2.0</div>
                                </div>

                                {/* Engagement Stats (Animating) */}
                                <div className="p-3 bg-slate-50 grid grid-cols-3 divide-x divide-gray-200">
                                    {/* Likes */}
                                    <div className="flex flex-col items-center px-1">
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 0.3 }}
                                            className="text-lg"
                                        >
                                            👍
                                        </motion.div>
                                        <div className="text-xs font-bold text-gray-700 mt-1">
                                            <Counter from={1240} to={8420} duration={2} />
                                        </div>
                                        <div className="text-[9px] text-gray-400">Likes</div>
                                    </div>

                                    {/* Comments */}
                                    <div className="flex flex-col items-center px-1">
                                        <motion.div
                                            animate={{ rotate: [0, 10, -10, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.5, delay: 0.1 }}
                                            className="text-lg"
                                        >
                                            �
                                        </motion.div>
                                        <div className="text-xs font-bold text-gray-700 mt-1">
                                            <Counter from={42} to={485} duration={2.2} />
                                        </div>
                                        <div className="text-[9px] text-gray-400">Comments</div>
                                    </div>

                                    {/* Shares */}
                                    <div className="flex flex-col items-center px-1">
                                        <motion.div
                                            animate={{ x: [0, 2, -2, 0] }}
                                            transition={{ repeat: Infinity, duration: 0.6, delay: 0.2 }}
                                            className="text-lg"
                                        >
                                            ✈️
                                        </motion.div>
                                        <div className="text-xs font-bold text-gray-700 mt-1">
                                            <Counter from={12} to={340} duration={2.4} />
                                        </div>
                                        <div className="text-[9px] text-gray-400">Shares</div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Growth Overlay */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.5 }}
                                className="absolute bottom-8 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2.5 rounded-full font-bold shadow-2xl flex items-center gap-2 border border-white/20"
                            >
                                <TrendingUp className="w-5 h-5" />
                                <span className="text-sm">Engagement Spiking!</span>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Minimal Progress Line */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-white/5">
                <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 15, ease: "linear" }}
                    className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
                />
            </div>
        </div>
    );
}

// Simple Counter Component for Number Animation
function Counter({ from, to, duration }: { from: number; to: number; duration: number }) {
    const [count, setCount] = useState(from);

    useEffect(() => {
        let startTime: number;
        let animationFrame: number;

        const update = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

            setCount(Math.floor(progress * (to - from) + from));

            if (progress < 1) {
                animationFrame = requestAnimationFrame(update);
            }
        };

        animationFrame = requestAnimationFrame(update);
        return () => cancelAnimationFrame(animationFrame);
    }, [from, to, duration]);

    return <span>{count.toLocaleString()}</span>;
}
