import { useState } from 'react';
import {
    Linkedin,
    Instagram,
    Mail,
    FileText,
    ChevronLeft,
    ChevronRight,
    Plus,
    Filter,
    CheckSquare,
    Play
} from 'lucide-react';

interface CalendarEvent {
    id: string;
    title: string;
    body?: string; // Excerpt
    type: 'linkedin' | 'instagram' | 'email' | 'blog';
    date: Date;
    status: 'scheduled' | 'published' | 'draft';
    thumbnail?: string;
    time: string;
    hasVideo?: boolean;
}

export default function ContentCalendar() {
    // Default to Dec 23, 2025 as per screenshot, or use today
    // For this specific request, I will anchor it to Dec 23, 2025 to match the mock data relevance, 
    // but in a real app this would initialize to `new Date()`. 
    // Given the previous context heavily uses Dec 2025, I will stick to that for the "demo" feel,
    // or better yet, make it dynamic but populate the mock data relative to the current view.
    // Let's use specific fixed dates for the mock to match the screenshot exactly.
    const [startDate, setStartDate] = useState(new Date('2025-12-23T00:00:00'));

    const generateMockEvents = (): CalendarEvent[] => {
        return [
            // Dec 23 (Tue)
            {
                id: '1',
                type: 'blog',
                title: "Elevate Your Startup's Presence with Automated BrandDNA Extraction",
                body: "Most startups struggle to stand out, losing hours crafting content that barely moves the needle. Foundrly's AI-powered BrandDNA extraction cuts through the noise...",
                date: new Date('2025-12-23'),
                time: '9:00am',
                status: 'scheduled'
            },
            {
                id: '2',
                type: 'linkedin',
                title: "Let Foundrly handle your brand DNA and content so you can grow effortlessly.",
                body: "Feeling overwhelmed by content creation? You're not alone.",
                date: new Date('2025-12-23'),
                time: '3:00pm',
                status: 'scheduled',
                thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=400'
            },
            // Dec 24 (Wed)
            {
                id: '3',
                type: 'email',
                title: "The Power of AI in Brand Building",
                body: "Struggling to grow your brand without adding more team members? Solopreneurs can boost brand visibility and supercharge content creation with AI...",
                date: new Date('2025-12-24'),
                time: '8:00am',
                status: 'draft'
            },
            {
                id: '4',
                type: 'instagram',
                title: "Cut content time by 70% and triple engagement",
                body: "How do you make your brand unforgettable without burning hours on content creation...",
                date: new Date('2025-12-24'),
                time: '10:00am',
                status: 'scheduled',
                thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=400'
            },
            {
                id: '5',
                type: 'blog',
                title: "Foundrly: Revolutionizing Your Content Workflow",
                body: "Discover how our new features can streamline your daily tasks...",
                date: new Date('2025-12-24'),
                time: '2:00pm',
                status: 'scheduled'
            },
            // Dec 25 (Thu)
            {
                id: '6',
                type: 'blog',
                title: "Unlocking Brand Growth: The Essential Role of AI Tools",
                body: "You spend hours crafting content that barely moves the needle. Traditional branding tactics no longer cut it—your startup needs smarter tools...",
                date: new Date('2025-12-25'),
                time: '9:00am',
                status: 'scheduled'
            },
            {
                id: '7',
                type: 'instagram',
                title: "Still invisible to your audience? That's costing you serious growth.",
                body: "",
                date: new Date('2025-12-25'),
                time: '10:00am',
                status: 'scheduled',
                thumbnail: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=400',
                hasVideo: true
            },
            // Dec 26 (Fri)
            {
                id: '8',
                type: 'blog',
                title: "Transform Your Brand from Invisible to Unstoppable with Foundrly's AI Magic 🚀",
                body: "You spend hours crafting content that barely moves the needle. Your brand stays invisible while competitors grab the spotlight...",
                date: new Date('2025-12-26'),
                time: '2:00pm',
                status: 'scheduled'
            },
            {
                id: '9',
                type: 'linkedin',
                title: "Stop Guessing and Start Growing with AI",
                body: "The brands that get noticed? They're not just lucky—they're AI-powered.",
                date: new Date('2025-12-26'),
                time: '3:00pm',
                status: 'scheduled',
                thumbnail: 'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&q=80&w=400'
            }
        ];
    };

    const events = generateMockEvents();

    const getFiveDays = (start: Date) => {
        const days = [];
        for (let i = 0; i < 5; i++) {
            const date = new Date(start);
            date.setDate(start.getDate() + i);
            days.push(date);
        }
        return days;
    };

    const weekDays = getFiveDays(startDate);

    const nextDays = () => {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() + 1); // Move 1 day or 5 days? Mockup has arrows next to 'Today'. usually means +1 or +1 week. Let's do +1 day for smooth scrolling feel.
        setStartDate(newDate);
    };

    const prevDays = () => {
        const newDate = new Date(startDate);
        newDate.setDate(startDate.getDate() - 1);
        setStartDate(newDate);
    };

    const getPlatformIcon = (type: string) => {
        switch (type) {
            case 'linkedin': return <Linkedin className="w-3.5 h-3.5 text-[#0077B5]" />;
            case 'instagram': return <Instagram className="w-3.5 h-3.5 text-[#E4405F]" />;
            case 'email': return <Mail className="w-3.5 h-3.5 text-[#EA4335]" />;
            case 'blog': return <FileText className="w-3.5 h-3.5 text-zinc-400" />;
            default: return null;
        }
    };

    const getPlatformLabel = (type: string) => {
        switch (type) {
            case 'linkedin': return 'Post';
            case 'instagram': return 'Post';
            case 'email': return 'Email';
            case 'blog': return 'Blog';
            default: return 'Post';
        }
    };

    const isToday = (date: Date) => {
        const today = new Date('2025-12-23T00:00:00'); // Mocking 'Today' as Dec 23 for the screenshot accuracy
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    return (
        <div className="bg-zinc-50/5 text-zinc-900 dark:text-zinc-100 rounded-[32px] p-6 animate-fade-in w-full overflow-hidden">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div className="flex items-center gap-4">
                    <h2 className="text-2xl font-bold text-white">Calendar</h2>

                    <div className="flex items-center gap-1 bg-zinc-900 rounded-full px-2 py-1 border border-zinc-800">
                        <button onClick={prevDays} className="p-1 hover:text-white text-zinc-500 transition-colors">
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        <span className="text-sm font-medium text-zinc-300 px-2 cursor-pointer hover:text-white transition-colors">Today</span>
                        <button onClick={nextDays} className="p-1 hover:text-white text-zinc-500 transition-colors">
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors">
                        Week View <ChevronLeft className="w-3 h-3 rotate-270" />
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors">
                        Filters <Filter className="w-3 h-3" />
                    </button>
                    <button className="flex items-center gap-2 text-sm font-medium text-zinc-400 hover:text-white px-3 py-2 rounded-lg hover:bg-zinc-900 transition-colors">
                        <CheckSquare className="w-3 h-3" /> Select Files
                    </button>
                    <button className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors">
                        <Plus className="w-4 h-4" /> Create New
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-zinc-800 border border-zinc-800 bg-[#18181B] rounded-xl overflow-hidden min-h-[600px]">
                {weekDays.map((dayDate, index) => {
                    const dayEvents = events.filter(e =>
                        e.date.getDate() === dayDate.getDate() &&
                        e.date.getMonth() === dayDate.getMonth() &&
                        e.date.getFullYear() === dayDate.getFullYear()
                    );

                    const isCurrentDay = isToday(dayDate);

                    return (
                        <div key={index} className="flex flex-col h-full bg-[#18181B]">
                            {/* Column Header */}
                            <div className={`p-4 border-b border-zinc-800 text-center ${isCurrentDay ? 'bg-zinc-800/30' : ''}`}>
                                {isCurrentDay ? (
                                    <div className="inline-block px-3 py-1 bg-[#0077B5] rounded-full text-white text-xs font-bold mb-1">
                                        {dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {dayDate.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </div>
                                ) : (
                                    <span className="text-zinc-500 text-sm font-medium">
                                        {dayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} {dayDate.toLocaleDateString('en-US', { weekday: 'short' })}
                                    </span>
                                )}
                            </div>

                            {/* Events List */}
                            <div className={`flex-1 p-3 space-y-3 ${isCurrentDay ? 'bg-zinc-900/10' : ''}`}>
                                {dayEvents.map(event => (
                                    <div key={event.id} className="bg-white rounded-xl p-0 overflow-hidden group hover:ring-2 hover:ring-indigo-500/50 transition-all border border-zinc-200/50">
                                        {/* Card Header area */}
                                        <div className="p-4 bg-white">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-2">
                                                    {getPlatformIcon(event.type)}
                                                    <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">
                                                        {getPlatformLabel(event.type)}
                                                    </span>
                                                </div>
                                                <span className="text-xs font-bold text-zinc-900">
                                                    {event.time}
                                                </span>
                                            </div>

                                            {/* Media */}
                                            {event.thumbnail && (
                                                <div className="mb-3 relative rounded-lg overflow-hidden aspect-square w-full">
                                                    <img
                                                        src={event.thumbnail}
                                                        alt="Post media"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    {event.hasVideo && (
                                                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors">
                                                            <div className="w-10 h-10 rounded-full bg-white/30 backdrop-blur-md flex items-center justify-center">
                                                                <Play className="w-5 h-5 text-white fill-white" />
                                                            </div>
                                                            <div className="absolute bottom-2 right-2 bg-black/70 px-1.5 py-0.5 rounded text-[10px] text-white font-medium">
                                                                00:07
                                                            </div>
                                                        </div>
                                                    )}
                                                    {/* AI overlay on image */}
                                                    <div className="absolute top-2 right-2 flex gap-1">
                                                        <div className="bg-black/60 backdrop-blur-md rounded-full p-1 border border-white/10">
                                                            <div className="w-3 h-3 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-full" />
                                                        </div>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Content */}
                                            <h3 className="text-base font-bold text-gray-900 leading-tight mb-2 font-display">
                                                {event.title}
                                            </h3>

                                            {event.body && (
                                                <p className="text-xs text-zinc-500 leading-relaxed line-clamp-4 mb-3">
                                                    {event.body}
                                                </p>
                                            )}

                                            {/* Footer / CTA */}
                                            <div className="flex items-center justify-between mt-auto pt-2">
                                                <button className="bg-zinc-100 hover:bg-zinc-200 text-zinc-600 text-[10px] font-bold px-2 py-1 rounded-md transition-colors">
                                                    Connect
                                                </button>
                                                {event.body && event.body.length > 50 && (
                                                    <span className="text-[10px] text-zinc-400">more</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
