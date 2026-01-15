import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Linkedin, Instagram, Mail, FileText } from 'lucide-react';

interface UpcomingPost {
    id: string;
    title: string;
    type: 'linkedin' | 'instagram' | 'email' | 'blog';
    date: string;
    time: string;
    thumbnail?: string;
    mediaType?: 'image' | 'video';
    previewText?: string;
    color: string;
}

const posts: UpcomingPost[] = [
    {
        id: '1',
        title: "Weekend recharging 🔋",
        type: 'instagram',
        date: 'Jan 17',
        time: '10:00 AM',
        thumbnail: '/mock-photo-1.png',
        mediaType: 'image',
        color: '[#E4405F]'
    },
    {
        id: '4',
        title: "The Agentic AI Revolution is Here",
        type: 'linkedin',
        date: 'Jan 19',
        time: '9:00 AM',
        thumbnail: '/mock-video-3.mp4',
        mediaType: 'video',
        color: '[#0077B5]'
    },
    {
        id: '5',
        title: "Community Update: New Features Live",
        type: 'email',
        date: 'Jan 19',
        time: '11:00 AM',
        previewText: "Hey Team! 🚀 We've just shipped the new analytics dashboard. You can now track your cross-platform growth in real-time. Plus, scheduling for Instagram Reels is finally here! Check it out and let us know what you think.",
        color: '[#EA4335]'
    },
    {
        id: '6',
        title: "Office Tour - New HQ",
        type: 'instagram',
        date: 'Jan 19',
        time: '1:00 PM',
        thumbnail: '/mock-photo-2.png',
        mediaType: 'image',
        color: '[#E4405F]'
    },
    {
        id: '8',
        title: "3 Tips for Better Design",
        type: 'instagram',
        date: 'Jan 20',
        time: '10:00 AM',
        thumbnail: '/mock-video-instagram.mp4',
        mediaType: 'video',
        color: '[#E4405F]'
    },
    {
        id: '9',
        title: "Customer Success Story: Acme Corp",
        type: 'linkedin',
        date: 'Jan 20',
        time: '3:00 PM',
        thumbnail: '/mock-video-2.mp4',
        mediaType: 'video',
        color: '[#0077B5]'
    },
];

export default function UpcomingCarousel() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { current } = scrollRef;
            const scrollAmount = 300;
            if (direction === 'left') {
                current.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
            } else {
                current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'linkedin': return <Linkedin className="w-4 h-4 text-[#0077B5]" />;
            case 'instagram': return <Instagram className="w-4 h-4 text-[#E4405F]" />;
            case 'email': return <Mail className="w-4 h-4 text-[#EA4335]" />;
            default: return <FileText className="w-4 h-4 text-emerald-500" />;
        }
    };

    return (
        <div className="w-full relative group">
            <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                    <Calendar className="w-8 h-8 text-[#CCFF00]" />
                    Upcoming Content
                </h2>
                <div className="flex gap-2">
                    <button onClick={() => scroll('left')} className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors">
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => scroll('right')} className="p-2 rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors">
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex gap-4 overflow-x-auto pb-6 scrollbar-hide snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {posts.map((post) => (
                    <div
                        key={post.id}
                        className="snap-start min-w-[400px] bg-[#18181B] border border-white/5 rounded-[32px] p-8 hover:border-[#CCFF00]/30 transition-all group/card cursor-pointer relative overflow-hidden flex flex-col justify-between"
                    >
                        <div className={`absolute top-0 left-0 w-1 h-full bg-${post.color.startsWith('[') ? '' : post.color}`} style={{ backgroundColor: post.color.startsWith('[') ? post.color.replace('[', '').replace(']', '') : '' }} />

                        <div className="flex justify-between items-start mb-6 pl-4">
                            <div className="flex items-center gap-3">
                                <span className="bg-zinc-900 p-2.5 rounded-xl border border-white/5">
                                    {getIcon(post.type)}
                                </span>
                                <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider">{post.type}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-white">{post.date}</p>
                                <p className="text-xs text-zinc-500">{post.time}</p>
                            </div>
                        </div>

                        <div className="pl-4">
                            <h3 className="text-lg font-bold text-zinc-100 line-clamp-2 leading-relaxed mb-4">
                                {post.title}
                            </h3>

                            {post.thumbnail && (
                                <div className="rounded-2xl overflow-hidden h-48 w-full mt-4 relative group/media">
                                    {post.mediaType === 'video' ? (
                                        <video
                                            src={post.thumbnail}
                                            className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 transition-opacity"
                                            autoPlay
                                            muted
                                            loop
                                            playsInline
                                        />
                                    ) : (
                                        <img
                                            src={post.thumbnail}
                                            alt=""
                                            className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 transition-opacity"
                                        />
                                    )}
                                </div>
                            )}

                            {post.previewText && !post.thumbnail && (
                                <div className="h-48 w-full mt-4 p-4 rounded-2xl bg-zinc-900/50 border border-white/5">
                                    <p className="text-sm text-zinc-400 leading-relaxed font-medium line-clamp-6">
                                        {post.previewText}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
