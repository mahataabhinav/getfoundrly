import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Wand2, TrendingUp, Music, Layers, Type, Globe, Video, Loader2, Share2, Heart, MessageCircle, MoreHorizontal, Send, Linkedin, Instagram } from 'lucide-react';
import Logo from '../../Logo';

export default function ProductDemoAnimation() {
    const [step, setStep] = useState(0);
    const [promptText, setPromptText] = useState('');
    const [streamProgress, setStreamProgress] = useState(0);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Script Timing Constants
    const STEP_1_IMPORT = 0;        // 0-2s
    const STEP_2_INPUT = 1;         // 2-7s (Typing Prompt)
    const STEP_3_GENERATE = 2;      // 7-11s (Video Loading/Streaming)
    const STEP_4_EDIT = 3;          // 11-15s (Editing Overlay)
    const STEP_5_CHANNELS = 4;      // 15-20s (Multi-channel Viral)

    // Using a reliable Coverr video (Coffee pouring)
    const [videoSrc, setVideoSrc] = useState("https://cdn.coverr.co/videos/coverr-pouring-coffee-into-a-cup-2868/1080p.mp4");

    // Fallback to local mock video if external fails
    const handleVideoError = () => {
        console.warn("External video failed to load, falling back to local.");
        setVideoSrc("/mock-video.mp4");
    };

    useEffect(() => {
        let mounted = true;
        const mainSequence = async () => {
            while (mounted) {
                // RESET
                setStep(0);
                setPromptText('');
                setStreamProgress(0);

                // --- 0:00 - 0:02 : Step 1: Import ---
                await new Promise(r => setTimeout(r, 2000));

                if (!mounted) return;
                setStep(STEP_2_INPUT);

                // --- 0:02 - 0:07 : Step 2: User Input (Typing) ---
                const prompt = "Cinematic slow-motion pour of fresh roasted coffee. Warm lighting, steam rising, cozy minimalist cafe vibe. 4k resolution.";
                for (let i = 0; i <= prompt.length; i++) {
                    if (!mounted) return;
                    setPromptText(prompt.slice(0, i));
                    // Variable typing speed for realism
                    await new Promise(r => setTimeout(r, Math.random() * 30 + 20));
                }
                await new Promise(r => setTimeout(r, 1000)); // Pause after typing

                if (!mounted) return;
                setStep(STEP_3_GENERATE);

                // --- 0:07 - 0:11 : Step 3: Generate (Video Loading) ---
                const streamInterval = setInterval(() => {
                    setStreamProgress(prev => Math.min(prev + 2.5, 100));
                }, 40);
                await new Promise(r => setTimeout(r, 4000));
                clearInterval(streamInterval);

                if (!mounted) return;
                setStep(STEP_4_EDIT);

                // --- 0:11 - 0:15 : Step 4: Edit (Overlay) ---
                await new Promise(r => setTimeout(r, 4000));

                if (!mounted) return;
                setStep(STEP_5_CHANNELS);

                // --- 0:15 - 0:20 : Step 5: Multi-Channel ---
                await new Promise(r => setTimeout(r, 6000));
            }
        };

        mainSequence();
        return () => { mounted = false; };
    }, []);

    // Ensure video plays when available
    useEffect(() => {
        if ((step === STEP_3_GENERATE || step === STEP_4_EDIT || step === STEP_5_CHANNELS) && videoRef.current) {
            videoRef.current.play().catch(e => console.error("Video play failed:", e));
        }
    }, [step]);

    return (
        <div className="relative w-full aspect-video bg-[#0A0A0A] rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col font-sans select-none group">

            {/* Browser Bar */}
            <div className="h-8 bg-[#1a1a1a] border-b border-white/5 flex items-center px-4 gap-2 z-20 shrink-0 absolute top-0 left-0 right-0">
                <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                </div>
                <div className="flex-1 ml-4 h-5 bg-black/40 rounded flex items-center px-2 text-[10px] text-gray-500 font-mono">
                    getfoundrly.com/create
                </div>
            </div>

            {/* Step Indicator */}
            <div className="absolute top-12 left-0 right-0 z-30 flex justify-center pointer-events-none">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="px-3 py-1 bg-black/80 backdrop-blur-md rounded-full border border-white/10 text-[10px] font-medium text-white shadow-xl flex items-center gap-2"
                    >
                        {step === STEP_1_IMPORT && <><Globe className="w-3 h-3 text-blue-400" /> Step 1 • Import Brand</>}
                        {step === STEP_2_INPUT && <><Type className="w-3 h-3 text-purple-400" /> Step 2 • Describe Vision</>}
                        {step === STEP_3_GENERATE && <><Video className="w-3 h-3 text-pink-400" /> Step 3 • Generating Video</>}
                        {step === STEP_4_EDIT && <><Layers className="w-3 h-3 text-orange-400" /> Step 4 • AI Editing</>}
                        {step === STEP_5_CHANNELS && <><Share2 className="w-3 h-3 text-green-400" /> Step 5 • Omni-Channel</>}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Main Stage */}
            <div className="flex-1 relative overflow-hidden bg-[#0A0A0A] mt-8">
                <AnimatePresence mode="wait">

                    {/* STEP 1: IMPORT */}
                    {step === STEP_1_IMPORT && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            className="absolute inset-0 flex items-center justify-center bg-black"
                        >
                            <div className="w-full max-w-md px-8 text-center">
                                <motion.div
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="inline-block p-4 rounded-2xl bg-[#1A1A1A] border border-white/10 mb-6"
                                >
                                    <Logo variant="light" iconSize={48} showWordmark={false} />
                                </motion.div>
                                <h2 className="text-3xl font-bold text-white mb-2">Import Brand Assets</h2>
                                <p className="text-gray-400 mb-8">Enter your website URL to get started.</p>

                                <div className="relative mx-auto max-w-sm">
                                    <div className="w-full h-12 bg-[#1A1A1A] border border-white/20 rounded-lg flex items-center px-4 text-white">
                                        <Globe className="w-4 h-4 text-gray-500 mr-3" />
                                        <span>sevenoakscoffee.com</span>
                                        <div className="ml-auto w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                                    </div>
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 1.5, ease: "easeInOut" }}
                                        className="absolute bottom-0 left-0 h-0.5 bg-blue-500"
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: USER INPUT (Typing) */}
                    {step === STEP_2_INPUT && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="absolute inset-0 flex items-center justify-center bg-[#0F0F0F] p-8"
                        >
                            <div className="w-full max-w-2xl">
                                <div className="mb-4 flex items-center gap-2">
                                    <Sparkles className="w-4 h-4 text-purple-400" />
                                    <span className="text-sm font-medium text-gray-300">AI Video Prompt</span>
                                </div>
                                <div className="w-full min-h-[160px] bg-[#1A1A1A] rounded-xl border border-white/10 p-6 relative group border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.05)]">
                                    <div className="font-mono text-lg text-white/90 leading-relaxed whitespace-pre-wrap">
                                        {promptText}
                                        <motion.span
                                            animate={{ opacity: [1, 0] }}
                                            transition={{ duration: 0.8, repeat: Infinity }}
                                            className="inline-block w-2.5 h-5 bg-purple-500 ml-1 translate-y-1"
                                        />
                                    </div>

                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: promptText.length > 50 ? 1 : 0 }}
                                        className="absolute bottom-4 right-4"
                                    >
                                        <button className="bg-white text-black px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
                                            <Wand2 className="w-4 h-4" /> Generate
                                        </button>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3 & 4: GENERATE & EDIT (Real Video) */}
                    {(step === STEP_3_GENERATE || step === STEP_4_EDIT) && (
                        <motion.div
                            key="step3-4"
                            className="absolute inset-0 bg-black flex items-center justify-center overflow-hidden"
                        >
                            {/* THE REAL VIDEO */}
                            <video
                                ref={videoRef}
                                src={videoSrc}
                                className="w-full h-full object-cover"
                                loop
                                muted
                                playsInline
                                autoPlay
                                onError={handleVideoError}
                                crossOrigin="anonymous"
                                style={{
                                    filter: step === STEP_3_GENERATE && streamProgress < 80 ? `blur(${20 - (streamProgress / 5)}px)` : 'none',
                                    transition: 'filter 1s ease',
                                    opacity: step === STEP_3_GENERATE && streamProgress < 10 ? 0 : 1
                                }}
                            />

                            {/* Loading Overlay (Step 3) */}
                            {step === STEP_3_GENERATE && (
                                <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center z-10">
                                    <motion.div
                                        exit={{ opacity: 0, scale: 1.5 }}
                                        className="bg-black/40 backdrop-blur-xl border border-white/10 p-6 rounded-2xl flex flex-col items-center"
                                    >
                                        <Loader2 className="w-8 h-8 text-white animate-spin mb-3" />
                                        <div className="text-sm font-medium text-white mb-2">Generating Content</div>
                                        <div className="w-48 h-1 bg-white/20 rounded-full overflow-hidden">
                                            <motion.div
                                                className="h-full bg-white"
                                                initial={{ width: 0 }}
                                                animate={{ width: `${streamProgress}%` }}
                                            />
                                        </div>
                                    </motion.div>
                                </div>
                            )}

                            {/* Editing Overlay (Step 4) */}
                            {step === STEP_4_EDIT && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="absolute inset-0 pointer-events-none"
                                >
                                    {/* Timeline UI */}
                                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] bg-black/60 backdrop-blur-md rounded-xl border border-white/10 p-4 flex flex-col gap-3">
                                        <div className="flex justify-between items-center text-xs text-white/50 mb-1">
                                            <span>00:00</span>
                                            <div className="flex gap-2 text-white">
                                                <Layers className="w-3 h-3" />
                                                <Type className="w-3 h-3" />
                                                <Music className="w-3 h-3" />
                                            </div>
                                            <span>00:15</span>
                                        </div>

                                        {/* Tracks */}
                                        <div className="relative h-12 bg-white/5 rounded-lg overflow-hidden flex flex-col gap-1 p-1">
                                            <div className="h-4 bg-blue-500/40 rounded w-full border border-blue-500/20" />
                                            <div className="h-4 bg-purple-500/40 rounded w-2/3 border border-purple-500/20 flex items-center px-2 text-[8px] text-white">♫ Chill Lo-Fi</div>
                                        </div>

                                        {/* Playhead */}
                                        <motion.div
                                            className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-20"
                                            initial={{ left: "10%" }}
                                            animate={{ left: "80%" }}
                                            transition={{ duration: 4, ease: "linear" }}
                                        />
                                    </div>

                                    {/* Text Overlay Simulation */}
                                    {/* Removed "Pure. Bold." text per user request */}
                                </motion.div>
                            )}
                        </motion.div>
                    )}

                    {/* STEP 5: MULTI-CHANNEL VIRAL */}
                    {step === STEP_5_CHANNELS && (
                        <motion.div
                            key="step5"
                            className="absolute inset-0 bg-[#0F0F0F] flex items-center justify-center overflow-hidden"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <div className="flex items-center justify-center gap-8 w-full px-4">

                                {/* 1. LinkedIn (Left - Professional/Card) */}
                                <motion.div
                                    initial={{ x: -50, opacity: 0, scale: 0.9 }}
                                    animate={{ x: 0, opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className="w-72 bg-white rounded-lg overflow-hidden shadow-2xl border border-gray-200 flex flex-col shrink-0"
                                >
                                    {/* LinkedIn Header Badge */}
                                    <div className="bg-[#0077B5] px-3 py-1.5 flex items-center gap-1.5">
                                        <Linkedin className="w-3 h-3 text-white fill-white" />
                                        <span className="text-[10px] font-bold text-white tracking-wide">LINKEDIN</span>
                                    </div>

                                    {/* LI Header */}
                                    <div className="p-3 flex justify-between items-start border-b border-gray-100 bg-white">
                                        <div className="flex gap-2">
                                            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
                                                SO
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-1">
                                                    <span className="text-sm font-bold text-gray-900 leading-tight">Seven Oaks Coffee</span>
                                                    <span className="text-[10px] text-gray-500">• 1st</span>
                                                </div>
                                                <div className="text-[10px] text-gray-500 leading-tight">Roasting locally for global taste.</div>
                                                <div className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                                    2h • <Globe className="w-3 h-3 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <MoreHorizontal className="w-4 h-4 text-gray-500" />
                                    </div>

                                    {/* LI Check-in/Text */}
                                    <div className="px-3 py-2 text-xs text-gray-800">
                                        Excited to launch our new branding. Pure. Bold. <span className="text-blue-600 font-semibold">#sevenoaks #coffee</span>
                                    </div>

                                    {/* LI Video Area */}
                                    <div className="w-full aspect-square bg-gray-100 relative group">
                                        <video src="/mock-video.mp4" className="w-full h-full object-cover" muted loop playsInline autoPlay />
                                        {/* LI Brand Logo Overlay */}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-[10px] font-bold text-blue-800 shadow-sm border border-blue-100">
                                            Seven Oaks
                                        </div>
                                    </div>

                                    {/* LI Footer */}
                                    <div className="p-2 border-t border-gray-100">
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500 mb-2">
                                            <div className="flex -space-x-1">
                                                <div className="w-4 h-4 rounded-full bg-blue-100 flex items-center justify-center z-10 border border-white">👍</div>
                                                <div className="w-4 h-4 rounded-full bg-red-100 flex items-center justify-center border border-white">❤️</div>
                                            </div>
                                            <span>Abhinav Mahata and 842 others</span>
                                        </div>
                                        <div className="flex justify-between px-2 pt-2 border-t border-gray-100">
                                            <div className="flex flex-col items-center gap-0.5 group cursor-pointer">
                                                <div className="w-5 h-5 rounded hover:bg-gray-100 flex items-center justify-center"><Heart className="w-4 h-4 text-gray-500 group-hover:text-gray-700" /></div>
                                                <span className="text-[10px] text-gray-500 font-medium">Like</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-0.5 group cursor-pointer">
                                                <div className="w-5 h-5 rounded hover:bg-gray-100 flex items-center justify-center"><MessageCircle className="w-4 h-4 text-gray-500" /></div>
                                                <span className="text-[10px] text-gray-500 font-medium">Comment</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-0.5 group cursor-pointer">
                                                <div className="w-5 h-5 rounded hover:bg-gray-100 flex items-center justify-center"><Share2 className="w-4 h-4 text-gray-500" /></div>
                                                <span className="text-[10px] text-gray-500 font-medium">Share</span>
                                            </div>
                                            <div className="flex flex-col items-center gap-0.5 group cursor-pointer">
                                                <div className="w-5 h-5 rounded hover:bg-gray-100 flex items-center justify-center"><Send className="w-4 h-4 text-gray-500" /></div>
                                                <span className="text-[10px] text-gray-500 font-medium">Send</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* 2. Instagram (Center - Featured - Mobile View) */}
                                <motion.div
                                    initial={{ y: 50, opacity: 0, scale: 0.9 }}
                                    animate={{ y: 0, opacity: 1, scale: 1.1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                                    className="w-[280px] h-[500px] bg-black rounded-[32px] overflow-hidden shadow-2xl border-[4px] border-gray-900 relative z-30 shrink-0"
                                >
                                    {/* Status Bar Fake */}
                                    <div className="absolute top-0 w-full h-8 z-20 flex justify-between items-center px-4 pt-2">
                                        <span className="text-[10px] font-bold text-white">9:41</span>
                                        <div className="flex gap-1">
                                            <div className="w-3 h-3 bg-white rounded-full opacity-20" />
                                            <div className="w-3 h-3 bg-white rounded-full opacity-20" />
                                            <div className="w-5 h-3 bg-white rounded-sm opacity-80" />
                                        </div>
                                    </div>

                                    {/* Video Content */}
                                    <video src="/mock-video-instagram.mp4" className="w-full h-full object-cover" muted loop playsInline autoPlay />

                                    {/* Instagram Header Badge */}
                                    <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 backdrop-blur-md px-3 py-1 rounded-full z-40 border border-white/10">
                                        <Instagram className="w-3 h-3 text-white" />
                                        <span className="text-[10px] font-bold text-white">Instagram</span>
                                    </div>

                                    {/* IG Top Overlay */}
                                    <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent">
                                        <div className="text-white font-bold flex items-center gap-1">
                                            Reels <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
                                            <Video className="w-4 h-4 text-white" />
                                        </div>
                                    </div>

                                    {/* IG Right Actions */}
                                    <div className="absolute right-3 bottom-20 flex flex-col gap-5 items-center z-20">
                                        <div className="flex flex-col items-center gap-1">
                                            <Heart className="w-7 h-7 text-white drop-shadow-lg stroke-[1.5]" />
                                            <span className="text-white text-xs font-bold drop-shadow-md">42.5k</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <MessageCircle className="w-7 h-7 text-white drop-shadow-lg stroke-[1.5]" />
                                            <span className="text-white text-xs font-bold drop-shadow-md">842</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <Send className="w-7 h-7 text-white drop-shadow-lg stroke-[1.5] -rotate-12" />
                                        </div>
                                        <div className="flex flex-col items-center gap-1">
                                            <MoreHorizontal className="w-6 h-6 text-white drop-shadow-lg" />
                                        </div>
                                        <div className="w-7 h-7 rounded border-2 border-white overflow-hidden shadow-lg mt-2">
                                            <img src="https://ui-avatars.com/api/?name=SO&background=0D8ABC&color=fff" className="w-full h-full object-cover" alt="music" />
                                        </div>
                                    </div>

                                    {/* IG Bottom Info */}
                                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-12">
                                        <div className="flex items-center gap-3 mb-3">
                                            <div className="w-9 h-9 rounded-full border border-white/20 p-0.5 bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500">
                                                <div className="w-full h-full rounded-full bg-black flex items-center justify-center overflow-hidden border border-black">
                                                    <span className="text-xs font-bold text-white">SO</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col text-white">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-semibold text-shadow-sm">sevenoakscoffee</span>
                                                    <div className="bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-medium border border-white/10">Follow</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-white text-xs mb-3 font-light text-shadow-sm line-clamp-2">
                                            Morning rituals done right. ☕️✨ <span className="text-white/70">#coffee #morning #aesthetic</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/5">
                                                <Music className="w-3 h-3 text-white" />
                                                <div className="w-32 overflow-hidden relative">
                                                    <div className="text-[10px] text-white whitespace-nowrap">Original Audio • Seven Oaks trending</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* 3. TikTok (Right - Distinct UI) */}
                                <motion.div
                                    initial={{ x: 50, opacity: 0, scale: 0.9 }}
                                    animate={{ x: 0, opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="w-[280px] h-[500px] bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 shrink-0 relative"
                                >
                                    <video src="/mock-video-1.mp4" className="w-full h-full object-cover" muted loop playsInline autoPlay />

                                    {/* TikTok Header Badge */}
                                    <div className="absolute top-4 left-4 flex items-center gap-1.5 z-40">
                                        <div className="w-3 h-3 flex items-center justify-center relative">
                                            <div className="absolute inset-0 bg-[#00f2ea] rounded-full opacity-80 translate-x-[-1px]"></div>
                                            <div className="absolute inset-0 bg-[#ff0050] rounded-full opacity-80 translate-x-[1px]"></div>
                                            <div className="absolute inset-0 bg-white rounded-full mix-blend-multiply"></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-white shadow-black drop-shadow-md">TikTok</span>
                                    </div>

                                    {/* TikTok UI Elements */}
                                    <div className="absolute top-4 left-0 right-0 flex justify-center text-white/50 text-sm font-bold mix-blend-difference">
                                        Following | <span className="text-white border-b-2 border-white pb-0.5">For You</span>
                                    </div>

                                    {/* TikTok Right Actions */}
                                    <div className="absolute right-2 bottom-16 flex flex-col gap-4 items-center">
                                        <div className="relative mb-2">
                                            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center overflow-hidden border border-white">
                                                <span className="text-black font-bold text-xs">SO</span>
                                            </div>
                                            <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-[10px] text-white font-bold border border-white">+</div>
                                        </div>
                                        <div className="flex flex-col items-center gap-0.5">
                                            <Heart className="w-8 h-8 text-white fill-white shadow-lg" />
                                            <span className="text-white text-[10px] font-bold shadow-black drop-shadow-md">84.2k</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-0.5">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><MessageCircle className="w-5 h-5 text-white fill-white/90" /></div>
                                            <span className="text-white text-[10px] font-bold shadow-black drop-shadow-md">1042</span>
                                        </div>
                                        <div className="flex flex-col items-center gap-0.5">
                                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center"><Share2 className="w-5 h-5 text-white fill-white/80" /></div>
                                            <span className="text-white text-[10px] font-bold shadow-black drop-shadow-md">3.4k</span>
                                        </div>
                                        <div className="w-10 h-10 rounded-full bg-gray-900 border-4 border-gray-800 flex items-center justify-center overflow-hidden animate-spin-slow">
                                            <div className="w-6 h-6 rounded-full bg-gray-700" />
                                        </div>
                                    </div>

                                    {/* TikTok Bottom Text */}
                                    <div className="absolute bottom-4 left-3 right-16 text-white">
                                        <div className="font-bold text-sm shadow-black drop-shadow-md mb-1">@sevenoaks</div>
                                        <div className="text-xs leading-tight shadow-black drop-shadow-md text-white/90 mb-2">
                                            Wait for the drop... this roast is insane 🔥 <span className="font-bold">#coffee #fyp</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Music className="w-3 h-3 animate-pulse" />
                                            <div className="text-[10px] opacity-90 scrolling-text-container w-24">
                                                Trending Sound - Seven Oaks
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                            </div>

                            {/* Growth Badge */}
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 1 }}
                                className="absolute bottom-6 bg-green-500 text-black px-4 py-2 rounded-full font-bold text-sm shadow-xl flex items-center gap-2 z-40 hover:scale-105 transition-transform cursor-pointer"
                            >
                                <TrendingUp className="w-4 h-4" /> Multi-Channel Success
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Play Bar */}
            <div className={`h-1 bg-white/10 w-full absolute bottom-0 z-50 opacity-50`}>
                <motion.div
                    key={step}
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: getDuration(step), ease: "linear" }}
                    className="h-full bg-white"
                />
            </div>
        </div>
    );
}

// Helper to reset progress bar for each step
function getDuration(step: number) {
    if (step === 0) return 2;
    if (step === 1) return 5;
    if (step === 2) return 4;
    if (step === 3) return 4;
    if (step === 4) return 6;
    return 1;
}
