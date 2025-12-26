import {
    Linkedin,
    Instagram,
    Facebook,
    Mail,
    ArrowRight
} from 'lucide-react';
import { Connection } from '../../types/database';

interface ConnectAccountsSectionProps {
    connections: Connection[];
    onConnect: (platform: string) => void;
}

export default function ConnectAccountsSection({ connections, onConnect }: ConnectAccountsSectionProps) {
    const connectedPlatforms = new Set(connections.map(c => c.platform.toLowerCase()));

    const platforms = [
        {
            id: 'linkedin',
            name: 'LinkedIn',
            icon: Linkedin,
            color: '#0077B5', // LinkedIn Blue
            description: 'Auto-publish posts & analyze performance',
        },
        {
            id: 'instagram',
            name: 'Instagram',
            icon: Instagram,
            color: '#E4405F', // Instagram Pink/Red
            description: 'Schedule stories & reels automatically',
        },
        {
            id: 'facebook',
            name: 'Facebook',
            icon: Facebook,
            color: '#1877F2', // Facebook Blue
            description: 'Sync posts with your business page',
        },
        {
            id: 'email',
            name: 'Email Newsletter',
            icon: Mail,
            color: '#EA4335', // Google/Email Red
            description: 'Send weekly digests to subscribers',
        }
    ];

    // Filter out connected platforms
    const platformsToConnect = platforms.filter(p => !connectedPlatforms.has(p.id));

    if (platformsToConnect.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
                <div>
                    <h2 className="text-2xl font-bold text-white">Connect Channels</h2>
                    <p className="text-zinc-400 text-sm mt-1">Link your accounts to enable automated scheduling</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {platformsToConnect.map((platform) => (
                    <div
                        key={platform.id}
                        className="bg-[#18181B] rounded-[24px] p-6 border border-white/5 relative overflow-hidden group hover:border-white/10 transition-all"
                    >
                        {/* Hover Gradient Background */}
                        <div
                            className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
                            style={{ backgroundColor: platform.color }}
                        />

                        <div className="relative z-10 flex flex-col h-full justify-between">
                            <div>
                                <div
                                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-300"
                                    style={{ backgroundColor: `${platform.color} 15`, color: platform.color }}
                                >
                                    <platform.icon className="w-6 h-6" />
                                </div>

                                <h3 className="text-lg font-bold text-white mb-2">{platform.name}</h3>
                                <p className="text-zinc-500 text-sm leading-relaxed mb-6">
                                    {platform.description}
                                </p>
                            </div>

                            <button
                                onClick={() => onConnect(platform.id)}
                                className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2 group/btn"
                            >
                                Connect Now
                                <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
