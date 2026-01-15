import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Send } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function JoinWaitlistPage() {

    const [formData, setFormData] = useState({ name: '', email: '' });
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');
        setErrorMsg('');

        try {
            const { error } = await supabase
                .from('waitlist')
                .insert([
                    { name: formData.name, email: formData.email }
                ]);

            if (error) throw error;
            setStatus('success');
        } catch (error: any) {
            console.error('Error joining waitlist:', error);
            setStatus('error');
            setErrorMsg('Oof, something glitched. Try again?');
        }
    };

    return (
        <div className="min-h-screen bg-[#0A0A0A] text-white flex flex-col relative overflow-hidden pt-24">
            {/* Background Gradients */}
            <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

            {/* Nav */}
            <nav className="p-6 relative z-10">
                <Link
                    to="/"
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Home
                </Link>
            </nav>

            {/* Content */}
            <div className="flex-1 flex items-center justify-center p-6 relative z-10">
                <div className="w-full max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 mx-auto">
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span className="text-sm font-medium text-yellow-200">Early Access</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
                            Join the Hype
                        </h1>
                        <p className="text-xl text-gray-400">
                            Be the first to get access. No cap.
                        </p>
                    </motion.div>

                    {status === 'success' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-green-500/10 border border-green-500/20 rounded-3xl p-8 text-center"
                        >
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Sparkles className="w-8 h-8 text-green-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">You're on the list! 🚀</h3>
                            <p className="text-gray-300 text-lg mb-6">
                                Thanks for trusting us. We'll slide into your inbox the moment we drop. Get excited!
                            </p>
                            <Link
                                to="/"
                                className="text-white font-medium hover:text-green-400 transition-colors"
                            >
                                Back to Home →
                            </Link>
                        </motion.div>
                    ) : (
                        <motion.form
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            onSubmit={handleSubmit}
                            className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl"
                        >
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                        placeholder="name@example.com"
                                    />
                                </div>

                                {errorMsg && (
                                    <div className="text-red-400 text-sm">{errorMsg}</div>
                                )}

                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full bg-white text-black font-bold text-lg py-4 rounded-xl hover:bg-gray-200 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {status === 'submitting' ? (
                                        'Joining...'
                                    ) : (
                                        <>
                                            Join Waitlist <Send className="w-5 h-5" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.form>
                    )}
                </div>
            </div>
        </div>
    );
}
