import { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Linkedin, Instagram, Mail, FileText } from 'lucide-react';

interface UpcomingPost {
    id: string;
    title: string;
    type: 'linkedin' | 'instagram' | 'email' | 'blog';
    date: string;
    time: string;
    thumbnail?: string;
    color: string;
}

const posts: UpcomingPost[] = [
    {
        id: '1',
        title: "Elevate Your Startup's Presence with Automated BrandDNA Extraction",
        type: 'blog',
        date: 'Dec 23',
        time: '9:00 AM',
        color: 'emerald-500'
    },
    {
        id: '2',
        title: "Let Foundrly handle your brand DNA and content so you can grow effortlessly.",
        type: 'linkedin',
        date: 'Dec 23',
        time: '3:00 PM',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71',
        color: '[#0077B5]'
    },
    {
        id: '3',
        title: "The Power of AI in Brand Building",
        type: 'email',
        date: 'Dec 24',
        time: '8:00 AM',
        color: '[#EA4335]'
    },
    {
        id: '4',
        title: "Cut content time by 70%",
        type: 'instagram',
        date: 'Dec 24',
        time: '10:00 AM',
        thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113',
        color: '[#E4405F]'
    },
    {
        id: '5',
        title: "Foundrly Workflow Revolution",
        type: 'blog',
        date: 'Dec 24',
        time: '2:00 PM',
        color: 'emerald-500'
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
            <div className="flex items-center justify-between mb-4 px-2">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#CCFF00]" />
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
                        className="snap-start min-w-[300px] bg-[#18181B] border border-white/5 rounded-2xl p-5 hover:border-[#CCFF00]/30 transition-all group/card cursor-pointer relative overflow-hidden"
                    >
                        <div className={`absolute top-0 left-0 w-1 h-full bg-${post.color.startsWith('[') ? '' : post.color}`} style={{ backgroundColor: post.color.startsWith('[') ? post.color.replace('[', '').replace(']', '') : '' }} />

                        <div className="flex justify-between items-start mb-4 pl-3">
                            <div className="flex items-center gap-2">
                                <span className="bg-zinc-900 p-1.5 rounded-lg border border-white/5">
                                    {getIcon(post.type)}
                                </span>
                                <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">{post.type}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-white">{post.date}</p>
                                <p className="text-[10px] text-zinc-500">{post.time}</p>
                            </div>
                        </div>

                        <div className="pl-3">
                            <h3 className="text-sm font-bold text-zinc-100 line-clamp-2 leading-relaxed mb-3">
                                {post.title}
                            </h3>

                            {post.thumbnail && (
                                <div className="rounded-lg overflow-hidden h-32 w-full mt-3 relative">
                                    <img src={post.thumbnail} alt="" className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 transition-opacity" />
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
