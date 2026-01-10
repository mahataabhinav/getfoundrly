import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Sparkles, CheckCircle, FileText, Calendar, BarChart3, Globe } from 'lucide-react';

export default function LeadGenTrial() {
    const [step, setStep] = useState<'input' | 'processing' | 'result'>('input');
    const [brandName, setBrandName] = useState('');
    const [url, setUrl] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setStep('processing');
        // Simulate AI processing
        setTimeout(() => {
            setStep('result');
        }, 2500);
    };

    return (
        <section className="py-32 bg-gradient-to-b from-[#0A0A0A] to-[#111] text-white overflow-hidden">
            <div className="w-full max-w-[1920px] mx-auto px-4 md:px-12">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-6xl md:text-8xl font-bold mb-8">
                            Experience Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">AI Co-Founder</span>
                        </h2>
                        <p className="text-gray-400 text-3xl leading-relaxed max-w-4xl mx-auto">
                            Enter your brand details below. Our AI will instantly analyze your digital footprint <br className="hidden md:block" />
                            and generate a tailored content strategy sample.
                        </p>
                    </motion.div>

                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-2 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                        {/* Background Glow */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />

                        <div className="relative bg-[#0F0F0F] rounded-[1.5rem] p-12 md:p-20 min-h-[500px] flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                {step === 'input' && (
                                    <motion.form
                                        key="input"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        transition={{ duration: 0.4 }}
                                        onSubmit={handleSubmit}
                                        className="w-full max-w-2xl space-y-10"
                                    >
                                        <div className="space-y-3">
                                            <label className="text-lg font-medium text-gray-300">Brand Name</label>
                                            <div className="relative">
                                                <Sparkles className="absolute left-6 top-6 w-6 h-6 text-gray-500" />
                                                <input
                                                    type="text"
                                                    value={brandName}
                                                    onChange={(e) => setBrandName(e.target.value)}
                                                    placeholder="e.g. Foundrly"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-6 pl-16 pr-6 text-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <label className="text-lg font-medium text-gray-300">Website URL</label>
                                            <div className="relative">
                                                <Globe className="absolute left-6 top-6 w-6 h-6 text-gray-500" />
                                                <input
                                                    type="text"
                                                    value={url}
                                                    onChange={(e) => setUrl(e.target.value)}
                                                    placeholder="e.g. foundrly.com"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-6 pl-16 pr-6 text-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            type="submit"
                                            className="w-full py-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold text-xl rounded-xl hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.6)] transition-all flex items-center justify-center gap-3 group"
                                        >
                                            <Sparkles className="w-6 h-6 group-hover:scale-110 transition-transform" />
                                            Generate Sample Plan
                                        </button>
                                        <p className="text-center text-sm text-gray-500">
                                            Free forever trial. No credit card required.
                                        </p>
                                    </motion.form>
                                )}

                                {step === 'processing' && (
                                    <motion.div
                                        key="processing"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        className="text-center"
                                    >
                                        <div className="relative w-32 h-32 mx-auto mb-10">
                                            <div className="absolute inset-0 border-t-2 border-indigo-500 rounded-full animate-spin"></div>
                                            <div className="absolute inset-2 border-r-2 border-purple-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Sparkles className="w-12 h-12 text-white animate-pulse" />
                                            </div>
                                        </div>
                                        <h3 className="text-3xl font-bold mb-4">Analyzing Brand DNA...</h3>
                                        <motion.div
                                            animate={{ opacity: [0.4, 1, 0.4] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="text-gray-400 text-lg"
                                        >
                                            Extracting tone of voice • Identifying key pillars • Drafting content
                                        </motion.div>
                                    </motion.div>
                                )}

                                {step === 'result' && (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="w-full max-w-5xl"
                                    >
                                        <div className="flex items-center gap-4 mb-10 bg-green-500/10 border border-green-500/20 px-8 py-6 rounded-2xl text-green-400 text-lg">
                                            <CheckCircle className="w-8 h-8 flex-shrink-0" />
                                            <span>Analysis Complete! We found 3 authority-building opportunities for <strong>{url || 'your brand'}</strong>.</span>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                                            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                                                <FileText className="w-8 h-8 text-indigo-400 mb-4" />
                                                <h4 className="font-semibold text-lg mb-2">Content Strategy</h4>
                                                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mb-2">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ delay: 0.2, duration: 1 }} className="h-full bg-indigo-500" />
                                                </div>
                                                <p className="text-sm text-gray-500">Generated 10+ hook ideas</p>
                                            </div>
                                            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                                                <Calendar className="w-8 h-8 text-purple-400 mb-4" />
                                                <h4 className="font-semibold text-lg mb-2">Posting Schedule</h4>
                                                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mb-2">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: '85%' }} transition={{ delay: 0.4, duration: 1 }} className="h-full bg-purple-500" />
                                                </div>
                                                <p className="text-sm text-gray-500">Optimal times identified</p>
                                            </div>
                                            <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
                                                <BarChart3 className="w-8 h-8 text-pink-400 mb-4" />
                                                <h4 className="font-semibold text-lg mb-2">Growth Projection</h4>
                                                <div className="h-2 w-full bg-gray-800 rounded-full overflow-hidden mb-2">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: '92%' }} transition={{ delay: 0.6, duration: 1 }} className="h-full bg-pink-500" />
                                                </div>
                                                <p className="text-sm text-gray-500">+240% engagement est.</p>
                                            </div>
                                        </div>

                                        <div className="text-center">
                                            <button className="w-full md:w-auto px-12 py-6 bg-white text-black font-bold text-xl rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center gap-3 mx-auto">
                                                Unlock Full Strategy & Start Trial
                                                <ArrowRight className="w-6 h-6" />
                                            </button>
                                            <p className="text-sm text-gray-500 mt-6">
                                                14-day free trial • Cancel anytime
                                            </p>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
