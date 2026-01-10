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
    // Start from Jan 10, 2026 as requested
    const [startDate, setStartDate] = useState(new Date('2026-01-10T00:00:00'));

    const generateMockEvents = (): CalendarEvent[] => {
        return [
            // Jan 10 (Sat) - Weekend Vibes
            {
                id: '1',
                type: 'instagram',
                title: "Weekend recharging 🔋",
                body: "Sometimes the best productivity hack is stepping away. #FounderLife",
                date: new Date('2026-01-10'),
                time: '10:00am',
                status: 'scheduled',
                thumbnail: 'https://images.unsplash.com/photo-1517865288-978fcb780652?auto=format&fit=crop&q=80&w=400',
                hasVideo: true
            },
            {
                id: '2',
                type: 'blog',
                title: "2026 Tech Trends Recap",
                body: "A quick look at what's shaping the industry as we kick off the year.",
                date: new Date('2026-01-10'),
                time: '2:00pm',
                status: 'published'
            },

            // Jan 11 (Sun) - Prep for Week
            {
                id: '3',
                type: 'linkedin',
                title: "Sunday Strategy Session",
                body: "Planning the roadmap for Q1. What's your top priority this week?",
                date: new Date('2026-01-11'),
                time: '4:00pm',
                status: 'scheduled',
                thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=400'
            },

            // Jan 12 (Mon) - Motivation & Announcements
            {
                id: '4',
                type: 'linkedin',
                title: "The Agentic AI Revolution is Here",
                body: "Why 2026 is the year AI agents officially replace static software.",
                date: new Date('2026-01-12'),
                time: '9:00am',
                status: 'scheduled',
                thumbnail: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400',
                hasVideo: true
            },
            {
                id: '5',
                type: 'email',
                title: "Community Update: New Features Live",
                body: "We just dropped the new dashboard. Check it out!",
                date: new Date('2026-01-12'),
                time: '11:00am',
                status: 'scheduled'
            },
            {
                id: '6',
                type: 'instagram',
                title: "Office Tour - New HQ",
                body: "A sneak peek at where the magic happens.",
                date: new Date('2026-01-12'),
                time: '1:00pm',
                status: 'scheduled',
                thumbnail: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=400'
            },

            // Jan 13 (Tue) - Educational Content
            {
                id: '7',
                type: 'blog',
                title: "How to Build an Audience in 2026",
                body: "The algorithms have changed. Here is the new playbook.",
                date: new Date('2026-01-13'),
                time: '8:00am',
                status: 'draft'
            },
            {
                id: '8',
                type: 'instagram',
                title: "3 Tips for Better Design",
                body: "Swipe through to see how we optimized our UI.",
                date: new Date('2026-01-13'),
                time: '10:00am',
                status: 'scheduled',
                thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&q=80&w=400'
            },
            {
                id: '9',
                type: 'linkedin',
                title: "Customer Success Story: Acme Corp",
                body: "How Acme Corp scaled 10x using Foundrly.",
                date: new Date('2026-01-13'),
                time: '3:00pm',
                status: 'scheduled',
                thumbnail: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=400'
            },

            // Jan 14 (Wed) - Viral/Fun Content
            {
                id: '10',
                type: 'instagram',
                title: "When the code works on the first try 🤯",
                body: "Rare footage of a bug-free deploy.",
                date: new Date('2026-01-14'),
                time: '12:00pm',
                status: 'scheduled',
                thumbnail: 'https://images.unsplash.com/photo-1531297461136-82lw8e2c0e8f?auto=format&fit=crop&q=80&w=400',
                hasVideo: true
            },
            {
                id: '11',
                type: 'linkedin',
                title: "Poll: Remote or Office?",
                body: "What is your team's policy in 2026?",
                date: new Date('2026-01-14'),
                time: '2:00pm',
                status: 'scheduled'
            },
            {
                id: '12',
                type: 'email',
                title: "Webinar Reminder: Growth Hacks",
                body: "Starting in 1 hour. Don't miss out.",
                date: new Date('2026-01-14'),
                time: '4:00pm',
                status: 'scheduled'
            },
            {
                id: '13',
                type: 'blog',
                title: "Why Founders Burn Out (and how to avoid it)",
                body: "Key takeaways from our latest podcast episode.",
                date: new Date('2026-01-14'),
                time: '6:00pm',
                status: 'draft'
            },
            {
                id: '14',
                type: 'linkedin',
                title: "Late Night Coding Session 💻",
                body: "Building the future, one line at a time.",
                date: new Date('2026-01-14'),
                time: '10:00pm',
                status: 'scheduled',
                thumbnail: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?auto=format&fit=crop&q=80&w=400'
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
        const today = new Date('2026-01-10T00:00:00'); // Mocking 'Today' as Jan 10, 2026
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    };

    return (
        <div className="bg-zinc-50/5 text-zinc-900 dark:text-zinc-100 rounded-[32px] p-6 animate-fade-in w-full h-full flex flex-col overflow-hidden">
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
            <div className="flex-1 grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-zinc-800 border border-zinc-800 bg-[#18181B] rounded-xl overflow-hidden">
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
                            <div className={`flex-1 p-3 space-y-3 overflow-y-auto scrollbar-hide ${isCurrentDay ? 'bg-zinc-900/10' : ''}`}>
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
