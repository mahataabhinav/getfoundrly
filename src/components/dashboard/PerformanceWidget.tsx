import { TrendingUp, Users, Eye, ArrowUpRight } from 'lucide-react';

export default function PerformanceWidget() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
            {/* Total Reach */}
            <div className="bg-[#18181B] rounded-[24px] p-6 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Eye className="w-12 h-12 text-blue-500" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                        <Eye className="w-4 h-4" />
                        <span className="text-sm font-medium">Total Reach</span>
                    </div>
                    <div className="flex items-end gap-3">
                        <h3 className="text-3xl font-bold text-white">12.5k</h3>
                        <span className="flex items-center text-xs font-bold text-emerald-400 mb-1.5 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                            <ArrowUpRight className="w-3 h-3 mr-0.5" /> 18%
                        </span>
                    </div>
                    {/* Mini Chart Visual */}
                    <div className="h-10 mt-4 flex items-end gap-1 opacity-50">
                        <div className="w-full bg-blue-500/20 h-[40%] rounded-sm" />
                        <div className="w-full bg-blue-500/40 h-[60%] rounded-sm" />
                        <div className="w-full bg-blue-500/30 h-[30%] rounded-sm" />
                        <div className="w-full bg-blue-500/60 h-[80%] rounded-sm" />
                        <div className="w-full bg-blue-500/50 h-[50%] rounded-sm" />
                        <div className="w-full bg-blue-500/80 h-[90%] rounded-sm" />
                        <div className="w-full bg-blue-500 h-[70%] rounded-sm" />
                    </div>
                </div>
            </div>

            {/* Engagement */}
            <div className="bg-[#18181B] rounded-[24px] p-6 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <TrendingUp className="w-12 h-12 text-[#CCFF00]" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-sm font-medium">Engagement</span>
                    </div>
                    <div className="flex items-end gap-3">
                        <h3 className="text-3xl font-bold text-white">4.2%</h3>
                        <span className="flex items-center text-xs font-bold text-emerald-400 mb-1.5 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                            <ArrowUpRight className="w-3 h-3 mr-0.5" /> 5%
                        </span>
                    </div>
                    {/* Mini Chart Visual */}
                    <div className="h-10 mt-4 flex items-end gap-1 opacity-50">
                        <div className="w-full bg-[#CCFF00]/20 h-[30%] rounded-sm" />
                        <div className="w-full bg-[#CCFF00]/40 h-[50%] rounded-sm" />
                        <div className="w-full bg-[#CCFF00]/60 h-[70%] rounded-sm" />
                        <div className="w-full bg-[#CCFF00]/30 h-[40%] rounded-sm" />
                        <div className="w-full bg-[#CCFF00]/80 h-[90%] rounded-sm" />
                        <div className="w-full bg-[#CCFF00] h-[60%] rounded-sm" />
                        <div className="w-full bg-[#CCFF00]/50 h-[45%] rounded-sm" />
                    </div>
                </div>
            </div>

            {/* Audience Growth */}
            <div className="bg-[#18181B] rounded-[24px] p-6 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Users className="w-12 h-12 text-purple-500" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-2 text-zinc-400 mb-2">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">Audience</span>
                    </div>
                    <div className="flex items-end gap-3">
                        <h3 className="text-3xl font-bold text-white">892</h3>
                        <span className="flex items-center text-xs font-bold text-emerald-400 mb-1.5 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                            <ArrowUpRight className="w-3 h-3 mr-0.5" /> +24
                        </span>
                    </div>
                    {/* Mini Chart Visual */}
                    <div className="h-10 mt-4 flex items-end gap-1 opacity-50">
                        <div className="w-full bg-purple-500/20 h-[20%] rounded-sm" />
                        <div className="w-full bg-purple-500/30 h-[30%] rounded-sm" />
                        <div className="w-full bg-purple-500/40 h-[40%] rounded-sm" />
                        <div className="w-full bg-purple-500/50 h-[50%] rounded-sm" />
                        <div className="w-full bg-purple-500/60 h-[60%] rounded-sm" />
                        <div className="w-full bg-purple-500/80 h-[80%] rounded-sm" />
                        <div className="w-full bg-purple-500 h-[90%] rounded-sm" />
                    </div>
                </div>
            </div>
        </div>
    );
}
