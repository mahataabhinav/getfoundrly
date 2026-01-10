import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

import ProductDemoAnimation from './ProductDemoAnimation';

export default function HeroSection({ onSignupClick }: { onSignupClick: () => void }) {

    return (
        <div className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0A0A0A] text-white">
            {/* Abstract Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        rotate: [0, 5, -5, 0],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute -top-[20%] -right-[10%] w-[800px] h-[800px] rounded-full bg-gradient-to-br from-indigo-600/20 to-purple-600/20 blur-3xl"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.1, 1],
                        x: [0, -50, 0],
                        opacity: [0.2, 0.4, 0.2]
                    }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-[20%] -left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-blue-600/20 to-cyan-600/20 blur-3xl"
                />

                {/* Grid Overlay */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,black,transparent)]"></div>
            </div>

            <div className="w-full px-4 md:px-12 relative z-10 pt-6 pb-6 max-w-[1920px] mx-auto">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-center lg:text-left">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-white/5 border border-white/10 mb-10 backdrop-blur-sm scale-125 origin-left"
                        >
                            <Sparkles className="w-5 h-5 text-purple-400" />
                            <span className="text-base font-medium text-purple-200">The Future of Founder Brand Building</span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="text-7xl md:text-9xl font-bold tracking-tight mb-10 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/60 leading-[0.9]"
                        >
                            Your AI Co-Founder for <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Brand and Visibility</span>
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="text-3xl text-gray-400 mb-14 max-w-3xl mx-auto lg:mx-0 leading-relaxed"
                        >
                            Foundrly extracts your BrandDNA and uses it to help you create content, analyze performance, and grow your brand on autopilot.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
                        >
                            <button
                                onClick={onSignupClick}
                                className="group relative px-12 py-6 bg-white text-black rounded-full font-bold text-2xl hover:bg-gray-100 transition-all shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_-15px_rgba(255,255,255,0.5)] overflow-hidden w-full sm:w-auto"
                            >
                                <span className="relative z-10 flex items-center justify-center gap-3">
                                    Start Free Trial
                                    <ArrowRight className="w-7 h-7 group-hover:translate-x-1 transition-transform" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/10 to-indigo-500/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </button>
                            <button
                                onClick={() => window.location.href = '/join-waitlist'}
                                className="px-12 py-6 bg-white/5 border border-white/10 text-white rounded-full font-bold text-2xl hover:bg-white/10 transition-all backdrop-blur-sm flex items-center justify-center gap-3 w-full sm:w-auto"
                            >
                                <Sparkles className="w-7 h-7 fill-current" />
                                Join Waitlist
                            </button>
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1.35 }}
                        transition={{ duration: 1, delay: 0.4 }}
                        className="relative hidden lg:block origin-center ml-10 translate-x-10"
                    >
                        {/* Abstract background blobs for the video container */}
                        <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl -z-10 animate-pulse" />
                        <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl -z-10" />

                        <ProductDemoAnimation />
                    </motion.div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30"
            >
                <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-2">
                    <div className="w-1 h-3 bg-current rounded-full" />
                </div>
            </motion.div>
        </div>
    );
}
