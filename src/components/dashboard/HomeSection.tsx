import { useState, useEffect } from 'react';
import { ArrowRight, TrendingUp, ArrowUp, ArrowDown, Calendar, FileText } from 'lucide-react';
import RobotChatbot from '../RobotChatbot';
import { supabase } from '../../lib/supabase';
import { generatePersonalizedWelcome } from '../../lib/openai';
import { getContentItemsByUser, getContentItem, getBrand } from '../../lib/database';
import PostEditor from './PostEditor';
import type { ContentItem } from '../../types/database';
import type { GeneratedImage } from '../../lib/asset-generator';

export default function HomeSection() {
  const [firstName, setFirstName] = useState<string>('');
  const [loadingUser, setLoadingUser] = useState(true);
  const [personalizedMessage, setPersonalizedMessage] = useState<string>('');
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loadingContent, setLoadingContent] = useState(true);
  const [analytics, setAnalytics] = useState([
    { label: 'Visibility Score', value: '0', max: '100', trend: '+0%' },
    { label: 'Top Performing Post', value: '0', sublabel: 'views', trend: '+0%' },
    { label: 'Keyword Opportunities', value: '0', sublabel: 'new', trend: 'new' },
    { label: 'Competitor Movement', value: '0', sublabel: 'trending topics', trend: 'watch' },
  ]);
  const [showPostEditor, setShowPostEditor] = useState(false);
  const [editingPost, setEditingPost] = useState<ContentItem | null>(null);
  const [editingBrandName, setEditingBrandName] = useState<string>('');
  const [editingImage, setEditingImage] = useState<GeneratedImage | null>(null);
  const [loadingPost, setLoadingPost] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchContentItems();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const metadata = session.user.user_metadata;
        const fullName = metadata?.full_name || metadata?.name || metadata?.display_name || '';

        if (fullName) {
          const firstNameExtracted = fullName.split(' ')[0];
          setFirstName(firstNameExtracted);
          
          // Generate personalized welcome message
          try {
            const message = await generatePersonalizedWelcome(firstNameExtracted);
            setPersonalizedMessage(message);
          } catch (error) {
            console.error('Error generating personalized message:', error);
            setPersonalizedMessage(`Ready to boost visibility today?`);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchContentItems = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) return;

      const items = await getContentItemsByUser(session.user.id);
      setContentItems(items);
      calculateAnalytics(items);
    } catch (error) {
      console.error('Error fetching content items:', error);
    } finally {
      setLoadingContent(false);
    }
  };

  const calculateAnalytics = (items: ContentItem[]) => {
    const totalPosts = items.length;
    const publishedPosts = items.filter(item => item.status === 'published').length;
    const draftPosts = items.filter(item => item.status === 'generated' || item.status === 'edited').length;
    const scheduledPosts = items.filter(item => item.status === 'scheduled').length;

    // Calculate visibility score (0-100) based on content activity
    // Formula: (published * 40 + scheduled * 30 + draft * 20 + total * 10) / max(1, total) * 2
    const visibilityScore = Math.min(100, Math.round(
      (publishedPosts * 40 + scheduledPosts * 30 + draftPosts * 20 + totalPosts * 10) / Math.max(1, totalPosts) * 2
    ));

    // Get most recent post for "Top Performing Post"
    const mostRecent = items.length > 0 ? items[0] : null;
    const topPostViews = mostRecent ? Math.floor(Math.random() * 5000) + 100 : 0; // Placeholder until we have real metrics

    // Calculate keyword opportunities (based on unique topics/titles)
    const uniqueTopics = new Set(items.map(item => item.topic || item.title).filter(Boolean));
    const keywordOpportunities = uniqueTopics.size;

    // Competitor movement (placeholder - would need competitor tracking)
    const competitorMovement = Math.min(10, Math.floor(totalPosts / 3));

    setAnalytics([
      { 
        label: 'Visibility Score', 
        value: visibilityScore.toString(), 
        max: '100', 
        trend: visibilityScore > 50 ? `+${Math.floor((visibilityScore - 50) / 5)}%` : '+0%' 
      },
      { 
        label: 'Top Performing Post', 
        value: topPostViews > 0 ? `+${(topPostViews / 1000).toFixed(1)}k` : '0', 
        sublabel: 'views', 
        trend: topPostViews > 0 ? '+12%' : '+0%' 
      },
      { 
        label: 'Keyword Opportunities', 
        value: keywordOpportunities.toString(), 
        sublabel: 'new', 
        trend: 'new' 
      },
      { 
        label: 'Competitor Movement', 
        value: competitorMovement.toString(), 
        sublabel: 'trending topics', 
        trend: 'watch' 
      },
    ]);
  };

  const quickActions = [
    { title: 'Create LinkedIn Post', type: 'LinkedIn', preview: '📱' },
    { title: 'Create Instagram Ad', type: 'Instagram', preview: '📸' },
    { title: 'Create Newsletter', type: 'Email', preview: '✉️' },
  ];

  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  const formatStatus = (status: string): string => {
    const statusMap: Record<string, string> = {
      'generated': 'Draft',
      'edited': 'Draft',
      'scheduled': 'Scheduled',
      'published': 'Posted',
      'failed': 'Failed',
    };
    return statusMap[status] || status.charAt(0).toUpperCase() + status.slice(1);
  };

  const formatPlatform = (platform: string): string => {
    const platformMap: Record<string, string> = {
      'linkedin': 'LinkedIn',
      'instagram': 'Instagram',
      'email': 'Newsletter',
      'blog': 'Blog',
    };
    return platformMap[platform.toLowerCase()] || platform;
  };

  // Get recent content items for the queue (limit to 10 most recent)
  const contentQueue = contentItems.slice(0, 10).map(item => ({
    id: item.id,
    title: item.title || item.topic || 'Untitled Post',
    status: formatStatus(item.status),
    date: formatDate(item.created_at),
    platform: formatPlatform(item.platform),
    rawStatus: item.status,
  }));

  const getWelcomeMessage = () => {
    if (loadingUser) {
      return 'Welcome back 👋';
    }
    return firstName ? `Welcome back, ${firstName} 👋` : 'Welcome back 👋';
  };

  const handleContentItemClick = async (itemId: string) => {
    setLoadingPost(true);
    try {
      const contentItem = await getContentItem(itemId);
      if (!contentItem) {
        console.error('Content item not found');
        return;
      }

      // Get brand name
      const brand = await getBrand(contentItem.brand_id);
      const brandName = brand?.name || 'Your Brand';

      // Extract image from metadata if available
      let image: GeneratedImage | null = null;
      if (contentItem.metadata?.selectedImage) {
        image = contentItem.metadata.selectedImage;
      } else if (contentItem.media_url) {
        // Create a GeneratedImage from media_url
        image = {
          id: `media_${contentItem.id}`,
          url: contentItem.media_url,
          prompt: contentItem.metadata?.imagePrompt || '',
          variation: 'primary' as const,
          metadata: {
            provider: contentItem.metadata?.imageProvider || 'dalle',
          },
        };
      }

      setEditingPost(contentItem);
      setEditingBrandName(brandName);
      setEditingImage(image);
      setShowPostEditor(true);
    } catch (error) {
      console.error('Error loading post:', error);
    } finally {
      setLoadingPost(false);
    }
  };

  const handleSaveFromEditor = async (post: string, image?: GeneratedImage | null) => {
    if (!editingPost) return;

    try {
      const { updateContentItem } = await import('../../lib/database');
      await updateContentItem(editingPost.id, {
        body: post,
        status: 'edited',
        metadata: {
          ...editingPost.metadata,
          selectedImage: image || null,
        },
      });

      // Refresh content items
      await fetchContentItems();
      setShowPostEditor(false);
      setEditingPost(null);
      setEditingImage(null);
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  if (showPostEditor && editingPost) {
    return (
      <PostEditor
        initialPost={editingPost.body || ''}
        brandName={editingBrandName}
        selectedImage={editingImage}
        onClose={() => {
          setShowPostEditor(false);
          setEditingPost(null);
          setEditingImage(null);
        }}
        onSave={handleSaveFromEditor}
        onImageChange={(image) => setEditingImage(image)}
      />
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-slate-50 to-blue-50/30 rounded-3xl p-6 md:p-8 border border-gray-100">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#1A1A1A] mb-2 break-words">
              {getWelcomeMessage()}
            </h1>
            <p className="text-sm md:text-base text-gray-600">Here's what's happening with your visibility today</p>
          </div>
          <div className="hidden md:block flex-shrink-0">
            <RobotChatbot size={80} animate={true} gesture="wave" />
          </div>
        </div>
        <div className="mt-6 bg-white/60 backdrop-blur-sm rounded-2xl p-4 border border-gray-100 inline-block">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Foundi says:</span> "{personalizedMessage || 'Ready to boost visibility today?'}"
          </p>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <button
              key={action.title}
              className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg hover:scale-[1.02] transition-all text-left group"
            >
              <div className="text-4xl mb-4">{action.preview}</div>
              <h3 className="font-medium text-[#1A1A1A] mb-1">{action.title}</h3>
              <p className="text-sm text-gray-500">{action.type}</p>
              <div className="mt-4 flex items-center gap-2 text-sm text-gray-700 group-hover:text-[#1A1A1A] transition-colors">
                <span>Generate</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Analytics Snapshot</h2>
        <div className="grid md:grid-cols-4 gap-4">
          {analytics.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-100"
            >
              <p className="text-sm text-gray-600 mb-2">{stat.label}</p>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-3xl font-semibold text-[#1A1A1A]">{stat.value}</span>
                {stat.max && <span className="text-gray-500">/ {stat.max}</span>}
              </div>
              {stat.sublabel && <p className="text-sm text-gray-500">{stat.sublabel}</p>}
              {stat.trend && stat.trend.includes('%') && (
                <div className="flex items-center gap-1 mt-2 text-sm text-green-600">
                  <ArrowUp className="w-4 h-4" />
                  <span>{stat.trend}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50/50 to-slate-50/50 rounded-2xl p-6 border border-gray-100">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2">Foundi Recommendations</h3>
            <p className="text-gray-700 leading-relaxed">
              Based on your audience trends, posting about <span className="font-medium">'AI productivity for SMBs'</span> may drive <span className="font-medium text-blue-600">+34% engagement</span>.
            </p>
          </div>
        </div>
        <button className="bg-[#1A1A1A] text-white px-6 py-2.5 rounded-full hover:bg-gray-800 transition-all hover:shadow-lg text-sm font-medium">
          Generate Post
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Content Queue</h2>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {loadingContent ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading content...</p>
            </div>
          ) : contentQueue.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-2">No content items yet</p>
              <p className="text-sm text-gray-400">Create your first post to see it here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Title
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                      Platform
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contentQueue.map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-gray-50 transition-colors cursor-pointer"
                      onClick={() => handleContentItemClick(item.id)}
                    >
                      <td className="px-6 py-4 text-sm text-[#1A1A1A] font-medium">{item.title}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                            item.rawStatus === 'scheduled'
                              ? 'bg-blue-100 text-blue-700'
                              : item.rawStatus === 'generated' || item.rawStatus === 'edited'
                              ? 'bg-gray-100 text-gray-700'
                              : item.rawStatus === 'published'
                              ? 'bg-green-100 text-green-700'
                              : item.rawStatus === 'failed'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{item.platform}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
