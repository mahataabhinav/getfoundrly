import { useState, useEffect } from 'react';
import { X, Linkedin, Calendar, Clock, Check, Sparkles, ArrowLeft, Globe, MoreHorizontal, ThumbsUp, MessageCircle, Repeat2, Send as SendIcon, TrendingUp, BarChart3, RefreshCw } from 'lucide-react';
import RobotChatbot from '../RobotChatbot';
import { supabase } from '../../lib/supabase';
import { hasLinkedInConnection, getLinkedInAuthUrl, getValidAccessToken, postToLinkedIn, getLinkedInProfileInfo, scheduleLinkedInPost } from '../../lib/linkedin-oauth';
import { createContentSchedule, updateContentSchedule } from '../../lib/database';
import { updateContentItem } from '../../lib/database';

interface PublishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish: (scheduled: boolean, date?: string, time?: string) => void;
  post: string;
  brandName: string;
  brandId?: string;
  contentItemId?: string;
}

export default function PublishModal({ isOpen, onClose, onPublish, post, brandName, brandId, contentItemId }: PublishModalProps) {
  const [step, setStep] = useState<'connect' | 'preview' | 'schedule' | 'confirmPublish'>('preview');
  const [linkedinEmail, setLinkedinEmail] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  const [showAutoPublishConfirm, setShowAutoPublishConfirm] = useState(false);
  const [linkedInProfile, setLinkedInProfile] = useState<{
    profile_name: string;
    profile_picture_url: string | null;
    linkedin_profile_url: string | null;
  } | null>(null);

  const getUpcomingDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const upcomingDates = getUpcomingDates();

  // Helper function to get initials from name
  const getInitials = (name: string): string => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Get current user and check LinkedIn connection
  useEffect(() => {
    const initialize = async () => {
      // Debug logging: Modal opened
      console.log('[LinkedIn Debug]', {
        event: 'modal_check',
        status: 'initiated',
        timestamp: new Date().toISOString(),
        modal_opened: true,
        brand_id: brandId ? 'present' : 'missing',
        has_user: false, // Will update after getUser
      });

      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);

      // Check if LinkedIn is already connected
      if (brandId && user?.id) {
        try {
          // Debug logging: Connection check initiated
          console.log('[LinkedIn Debug]', {
            event: 'modal_check',
            status: 'checking_connection',
            timestamp: new Date().toISOString(),
            brand_id: brandId,
            user_id: user.id,
            connection_check_initiated: true,
          });

        const connected = await hasLinkedInConnection(brandId);
        setIsConnected(connected);
        if (connected) {
            // Fetch LinkedIn profile info
            try {
              const profileInfo = await getLinkedInProfileInfo(brandId);
              if (profileInfo) {
                setLinkedInProfile(profileInfo);
                
                // Debug logging: Profile info retrieved
                console.log('[LinkedIn Debug]', {
                  event: 'modal_check',
                  status: 'success',
                  timestamp: new Date().toISOString(),
                  brand_id: brandId,
                  user_id: user.id,
                  connection_result: true,
                  profile_info_retrieved: true,
                  profile_name: profileInfo.profile_name,
                  has_profile_picture: !!profileInfo.profile_picture_url,
                  has_profile_url: !!profileInfo.linkedin_profile_url,
                });
              } else {
                // Profile info not available, but connection exists
                console.warn('LinkedIn connected but profile info not available');
                
                // Debug logging: Profile info not available
                console.log('[LinkedIn Debug]', {
                  event: 'modal_check',
                  status: 'partial_success',
                  timestamp: new Date().toISOString(),
                  brand_id: brandId,
                  user_id: user.id,
                  connection_result: true,
                  profile_info_retrieved: false,
                  message: 'Connection exists but profile info not available',
                });
              }
            } catch (profileError) {
              console.error('Error fetching LinkedIn profile info:', profileError);
              
              // Debug logging: Profile info error
              console.log('[LinkedIn Debug]', {
                event: 'modal_check',
                status: 'profile_error',
                timestamp: new Date().toISOString(),
                brand_id: brandId,
                user_id: user.id,
                connection_result: true,
                profile_info_retrieved: false,
                error: profileError instanceof Error ? profileError.message : 'Unknown error',
              });
              // Continue without profile info - connection is still valid
            }
          setStep('preview');
        } else {
            // Debug logging: Not connected
            console.log('[LinkedIn Debug]', {
              event: 'modal_check',
              status: 'not_connected',
              timestamp: new Date().toISOString(),
              brand_id: brandId,
              user_id: user.id,
              connection_result: false,
              message: 'LinkedIn account not connected for this brand',
            });
            setStep('connect');
          }
        } catch (connectionError) {
          console.error('Error checking LinkedIn connection:', connectionError);
          
          // Debug logging: Connection check error
          console.log('[LinkedIn Debug]', {
            event: 'modal_check',
            status: 'error',
            timestamp: new Date().toISOString(),
            brand_id: brandId,
            user_id: user.id,
            connection_result: false,
            error: connectionError instanceof Error ? connectionError.message : 'Unknown error',
          });
          
          setIsConnected(false);
          setStep('connect');
        }
      } else {
        // Debug logging: Missing required data
        console.log('[LinkedIn Debug]', {
          event: 'modal_check',
          status: 'missing_data',
          timestamp: new Date().toISOString(),
          brand_id: brandId ? 'present' : 'missing',
          user_id: user?.id ? 'present' : 'missing',
          message: 'Missing brandId or userId, showing connect screen',
        });
        
        // If no brandId or userId, show connect screen
        setStep('connect');
      }
    };
    
    if (isOpen) {
      initialize();
    }
  }, [isOpen, brandId]);

  // Cleanup sessionStorage when modal closes or after successful OAuth
  useEffect(() => {
    if (!isOpen) {
      // Clean up LinkedIn-related sessionStorage when modal is closed
      // But only if we're not in the middle of an OAuth flow
      const shouldReopen = sessionStorage.getItem('linkedin_modal_should_reopen');
      if (!shouldReopen) {
        // Only clean up if modal was explicitly closed (not during OAuth redirect)
        sessionStorage.removeItem('linkedin_content_item_id');
        sessionStorage.removeItem('linkedin_post_content');
        sessionStorage.removeItem('linkedin_brand_name');
        sessionStorage.removeItem('linkedin_redirect_uri');
      }
    } else if (isOpen && isConnected && step === 'preview') {
      // After successful OAuth and showing preview, clean up sessionStorage
      // This ensures we don't leave stale data
      const urlParams = new URLSearchParams(window.location.search);
      const linkedinConnected = urlParams.get('linkedin_connected');
      if (linkedinConnected === 'true') {
        // Clean up after successful OAuth completion
        sessionStorage.removeItem('linkedin_content_item_id');
        sessionStorage.removeItem('linkedin_post_content');
        sessionStorage.removeItem('linkedin_brand_name');
        sessionStorage.removeItem('linkedin_modal_should_reopen');
        sessionStorage.removeItem('linkedin_redirect_uri');
      }
    }
  }, [isOpen, isConnected, step]);

  // Handle missing data after OAuth - try to restore from sessionStorage
  useEffect(() => {
    if (isOpen && isConnected && step === 'preview') {
      // If post is missing but we have contentItemId, try to restore from sessionStorage
      if (!post && contentItemId) {
        const storedPost = sessionStorage.getItem('linkedin_post_content');
        if (storedPost) {
          // Note: We can't directly set the post prop, but we can log a warning
          console.warn('Post content may be missing. Please regenerate the post if needed.');
        }
      }
      
      // If brandName is missing, try to restore from sessionStorage
      if (!brandName) {
        const storedBrandName = sessionStorage.getItem('linkedin_brand_name');
        if (storedBrandName) {
          // Note: We can't directly set the brandName prop, but we can log a warning
          console.warn('Brand name may be missing. Please check the brand selection.');
        }
      }
    }
  }, [isOpen, isConnected, step, post, contentItemId, brandName]);

  const recommendedTimes = [
    {
      dayOfWeek: upcomingDates[0].toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: upcomingDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: '9:12 AM',
      emoji: '⭐',
      label: 'Highest engagement window',
      metrics: [
        'Predicted +24% more reach',
        '+18% likes vs your median'
      ],
      reason: 'Best for thought-leadership posts',
      engagement: 92
    },
    {
      dayOfWeek: upcomingDates[1].toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: upcomingDates[1].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: '12:58 PM',
      emoji: '✨',
      label: 'Peak founder visibility',
      metrics: [
        '+19% impressions',
        '+22% more comments'
      ],
      reason: 'Strong for awareness content',
      engagement: 87
    },
    {
      dayOfWeek: upcomingDates[2].toLocaleDateString('en-US', { weekday: 'long' }),
      fullDate: upcomingDates[2].toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: '5:21 PM',
      emoji: '🌙',
      label: 'Maximum scroll time',
      metrics: [
        '+21% engagement clicks',
        'Great for testimonials/UGC'
      ],
      reason: 'Evening engagement peak',
      engagement: 84
    },
  ];

  const handleConnect = async () => {
    if (!userId || !brandId) {
      alert('Please ensure you are logged in and have a brand selected.');
      return;
    }

    try {
      // Store brandId in sessionStorage for OAuth callback
      sessionStorage.setItem('linkedin_brand_id', brandId);
      
      // Store modal state for reopening after OAuth
      if (contentItemId) {
        sessionStorage.setItem('linkedin_content_item_id', contentItemId);
      }
      if (post) {
        sessionStorage.setItem('linkedin_post_content', post);
      }
      if (brandName) {
        sessionStorage.setItem('linkedin_brand_name', brandName);
      }
      sessionStorage.setItem('linkedin_modal_should_reopen', 'true');
      // Set auto_publish flag to show confirmation dialog after OAuth
      sessionStorage.setItem('linkedin_auto_publish', 'true');
      
      // Redirect to LinkedIn OAuth
      const authUrl = getLinkedInAuthUrl();
      window.location.href = authUrl;
    } catch (error: any) {
      console.error('Error initiating LinkedIn OAuth:', error);
      
      // Check if it's a configuration error
      if (error.message?.includes('Client ID is not configured') || error.message?.includes('client_id')) {
        alert('LinkedIn OAuth is not configured. Please contact your administrator or check your environment variables.\n\nError: ' + error.message);
      } else if (error.message?.includes('Redirect URI') || error.message?.includes('redirect_uri')) {
        const currentOrigin = window.location.origin;
        const expectedUri = `${currentOrigin}/auth/linkedin/callback`;
        alert(`LinkedIn Redirect URI mismatch.\n\n` +
              `Expected redirect URI: ${expectedUri}\n\n` +
              `Please ensure this exact URI is registered in your LinkedIn Developer Portal:\n` +
              `1. Go to https://www.linkedin.com/developers/apps\n` +
              `2. Select your app\n` +
              `3. Go to "Auth" tab\n` +
              `4. Add this exact redirect URI: ${expectedUri}\n` +
              `5. Make sure it matches exactly (including http/https and port number)\n\n` +
              `Or set VITE_LINKEDIN_REDIRECT_URI in your .env file to match your registered URI.`);
      } else {
        alert('Failed to connect LinkedIn. Please try again.\n\nError: ' + (error.message || 'Unknown error'));
      }
    }
  };

  // Check for OAuth success/error messages in URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const linkedinConnected = urlParams.get('linkedin_connected');
    const oauthError = urlParams.get('error');
    const redirectUriError = urlParams.get('error') === 'redirect_uri_mismatch';
    const expectedUri = urlParams.get('expected');
    
    if (redirectUriError && expectedUri) {
      // Show redirect URI mismatch error
      alert(`LinkedIn Redirect URI Mismatch\n\n` +
            `The redirect URI must match exactly what's registered in LinkedIn Developer Portal.\n\n` +
            `Expected URI: ${decodeURIComponent(expectedUri)}\n\n` +
            `To fix this:\n` +
            `1. Go to https://www.linkedin.com/developers/apps\n` +
            `2. Select your app\n` +
            `3. Go to "Auth" tab → "Redirect URLs"\n` +
            `4. Add this exact URI: ${decodeURIComponent(expectedUri)}\n` +
            `5. Make sure it matches exactly (including http/https, port, and path)\n\n` +
            `Or set VITE_LINKEDIN_REDIRECT_URI in your .env file to match your registered URI.`);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    if (oauthError) {
      const errorDetails = urlParams.get('details');
      const scopeError = urlParams.get('error') === 'scope_not_authorized';
      const redirectError = urlParams.get('error') === 'redirect_uri_mismatch';
      const noBrandError = urlParams.get('error') === 'no_brand';
      
      if (noBrandError) {
        alert('LinkedIn connection failed: No brand selected. Please try again from the post generator.');
      } else if (redirectError) {
        const expectedUri = urlParams.get('expected');
        alert(`LinkedIn Redirect URI Mismatch\n\n` +
              `Expected redirect URI: ${expectedUri ? decodeURIComponent(expectedUri) : 'unknown'}\n\n` +
              `Please ensure this exact URI is registered in your LinkedIn Developer Portal.`);
      } else if (scopeError) {
        alert(`LinkedIn Scope Authorization Error\n\n` +
              `Error: ${errorDetails ? decodeURIComponent(errorDetails) : oauthError}\n\n` +
              `To fix this:\n` +
              `1. Go to https://www.linkedin.com/developers/apps\n` +
              `2. Select your app\n` +
              `3. Go to "Auth" tab → "Products"\n` +
              `4. Request access to "Sign In with LinkedIn using OpenID Connect" product\n` +
              `5. Or ensure "Marketing Developer Platform" product is approved\n` +
              `6. The app now only requests 'w_member_social' scope (required for posting)\n` +
              `7. Reconnect your LinkedIn account after permissions are updated.`);
      } else {
        const decodedDetails = errorDetails ? decodeURIComponent(errorDetails) : oauthError;
        alert(`LinkedIn OAuth Error\n\n` +
              `Error: ${decodedDetails}\n\n` +
              `Common causes:\n` +
              `- Invalid client ID or secret\n` +
              `- Redirect URI mismatch\n` +
              `- Missing required permissions\n` +
              `- Expired authorization code\n\n` +
              `Please check:\n` +
              `1. Your LinkedIn app configuration in Developer Portal\n` +
              `2. Environment variables (VITE_LINKEDIN_CLIENT_ID, VITE_LINKEDIN_CLIENT_SECRET)\n` +
              `3. Try disconnecting and reconnecting your LinkedIn account`);
      }
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    if (linkedinConnected === 'true' && brandId) {
      // Check if LinkedIn is now connected
      hasLinkedInConnection(brandId).then(async (connected) => {
        if (connected) {
          setIsConnected(true);
          // Fetch LinkedIn profile info after connection
          const profileInfo = await getLinkedInProfileInfo(brandId);
          if (profileInfo) {
            setLinkedInProfile(profileInfo);
          }
          
          // Check if auto_publish flag is set
          const autoPublish = urlParams.get('auto_publish');
          if (autoPublish === 'true' && post && contentItemId) {
            // Show auto-publish confirmation dialog
            setShowAutoPublishConfirm(true);
          } else {
            // Show preview step normally
            setStep('preview');
          }
        }
      });
      
      // Clean up URL (but keep params if reopen_modal is present - handled by LinkedInPostGenerator)
      const reopenModal = urlParams.get('reopen_modal');
      if (!reopenModal) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, [brandId]);

  const handlePublishNow = () => {
    if (isConnected) {
      setStep('confirmPublish');
    } else {
      setStep('connect');
    }
  };

  const handleConfirmPublish = async () => {
    if (!userId || !brandId || !contentItemId) {
      alert('Missing required information. Please try again.');
      return;
    }

    setIsPublishing(true);
    try {
      // Get valid access token and person URN
      const tokenData = await getValidAccessToken(brandId);
      if (!tokenData) {
        alert('LinkedIn connection expired or invalid. Please reconnect your LinkedIn account.');
        setIsConnected(false);
        setStep('connect');
        return;
      }

      // Post to LinkedIn (pass person URN to avoid API call)
      const result = await postToLinkedIn(tokenData.accessToken, post, {
        personUrn: tokenData.personUrn,
      });

      // Update content item status
      await updateContentItem(contentItemId, {
        status: 'published',
      });

      // Create schedule record
      await createContentSchedule({
        content_id: contentItemId,
        user_id: userId,
        brand_id: brandId,
        platform: 'linkedin',
        scheduled_at: new Date().toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        status: 'published',
        published_at: new Date().toISOString(),
        external_post_id: result.id,
        ai_recommended: false,
      });

      setShowSuccess(true);
      setTimeout(() => {
        onPublish(false);
        handleClose();
      }, 2500);
    } catch (error: any) {
      console.error('[PublishModal] Error publishing to LinkedIn:', error);
      console.error('[PublishModal] Error details:', {
        message: error?.message,
        stack: error?.stack,
        name: error?.name,
        fullError: error
      });
      
      // Handle specific error cases
      const errorMessage = error?.message || 'Unknown error';
      const errorStr = String(errorMessage).toLowerCase();
      
      // Check for token revocation or expiration (401 errors)
      if (errorStr.includes('revoked') || errorStr.includes('expired') || errorStr.includes('invalid token') || errorStr.includes('authentication failed') || errorStr.includes('401') || errorStr.includes('token used in the request has been revoked')) {
        alert(
          `Your LinkedIn connection has expired or been revoked.\n\n` +
          `This usually happens when:\n` +
          `- You disconnected the app in LinkedIn settings\n` +
          `- The token expired and needs to be refreshed\n` +
          `- You need to reconnect with updated permissions\n\n` +
          `Please reconnect your LinkedIn account to continue.`
        );
        setIsConnected(false);
        setStep('connect');
        return; // Exit early to prevent further processing
      } else if (errorStr.includes('permission') || errorStr.includes('scope') || errorStr.includes('permission denied') || errorStr.includes('403')) {
        alert('LinkedIn permissions are insufficient. Please reconnect and grant all required permissions.');
        setIsConnected(false);
        setStep('connect');
      } else if (errorStr.includes('rate limit') || errorStr.includes('429')) {
        alert('LinkedIn rate limit exceeded. Please try again in a few minutes.');
      } else if (errorStr.includes('edge function') || errorStr.includes('supabase')) {
        // Edge Function specific errors
        alert(
          `LinkedIn Post Edge Function Error\n\n` +
          `${errorMessage}\n\n` +
          `Please check:\n` +
          `1. The "linkedin-post" Edge Function is deployed in Supabase\n` +
          `2. Your Supabase project URL and keys are correct\n` +
          `3. Check the Edge Function logs in Supabase Dashboard for details\n\n` +
          `If the problem persists, try reconnecting your LinkedIn account.`
        );
      } else if (errorStr.includes('network error') || errorStr.includes('failed to fetch') || errorStr.includes('cors') || errorStr.includes('edge_function')) {
        // Network/CORS/Edge Function errors
        const isEdgeFunctionError = errorStr.includes('edge_function') || errorStr.includes('supabase');
        
        if (isEdgeFunctionError) {
          alert(
            `Edge Function Error: Unable to connect to Supabase Edge Function\n\n` +
            `${errorMessage}\n\n` +
            `Quick Fix Steps:\n` +
            `1. Go to Supabase Dashboard → Edge Functions\n` +
            `2. Check if "linkedin-post" function exists\n` +
            `3. If not, create it and deploy the code from:\n` +
            `   supabase/functions/linkedin-post/index.ts\n` +
            `4. Make sure you are logged in to the app\n` +
            `5. Check your .env file has:\n` +
            `   VITE_SUPABASE_URL=your-project-url\n` +
            `   VITE_SUPABASE_ANON_KEY=your-anon-key\n\n` +
            `See DEPLOY_LINKEDIN_OAUTH_STEP_BY_STEP.md for detailed instructions.`
          );
        } else {
          alert(
            `Network Error: Unable to connect to LinkedIn API\n\n` +
            `Error: ${errorMessage}\n\n` +
            `This might be due to:\n` +
            `- Edge Function not deployed or not accessible\n` +
            `- Network connectivity issues\n` +
            `- CORS restrictions\n` +
            `- LinkedIn API temporarily unavailable\n\n` +
            `Please check:\n` +
            `1. The "linkedin-post" Edge Function is deployed in Supabase\n` +
            `2. Your internet connection is stable\n` +
            `3. Try again in a moment\n\n` +
            `If the problem persists, try reconnecting your LinkedIn account.`
          );
        }
      } else if (errorStr.includes('urn') || errorStr.includes('author') || errorStr.includes('member')) {
        // Person URN format errors
        alert(
          `LinkedIn API Error: Invalid user ID format\n\n` +
          `${errorMessage}\n\n` +
          `This usually means your LinkedIn connection needs to be refreshed.\n` +
          `Please disconnect and reconnect your LinkedIn account.`
        );
        setIsConnected(false);
        setStep('connect');
      } else {
        // Generic error
        alert(
          `Failed to publish to LinkedIn\n\n` +
          `Error: ${errorMessage}\n\n` +
          `Please try again. If the problem persists:\n` +
          `1. Check your internet connection\n` +
          `2. Try reconnecting your LinkedIn account\n` +
          `3. Check the browser console for more details`
        );
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const handleScheduleConfirm = async () => {
    if (!userId || !brandId || !contentItemId || !selectedDate || !selectedTime) {
      alert('Please fill in all required fields.');
      return;
    }

    // Validate scheduled time is in the future
    const scheduledDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const now = new Date();
    if (scheduledDateTime <= now) {
      alert('Please select a date and time in the future.');
      return;
    }

    setIsScheduling(true);
    try {
      // Get valid access token
      const tokenData = await getValidAccessToken(brandId);
      if (!tokenData) {
        alert('LinkedIn connection expired or invalid. Please reconnect your LinkedIn account.');
        setIsConnected(false);
        setStep('connect');
        return;
      }

      // Schedule post using LinkedIn's native scheduling (creates DRAFT, publishes at scheduled time)
      const result = await scheduleLinkedInPost(tokenData.accessToken, post, scheduledDateTime, {
        personUrn: tokenData.personUrn,
      });

      // Update content item status
      await updateContentItem(contentItemId, {
        status: 'scheduled',
      });

      // Create schedule record with LinkedIn draft ID
      await createContentSchedule({
        content_id: contentItemId,
        user_id: userId,
        brand_id: brandId,
        platform: 'linkedin',
        scheduled_at: scheduledDateTime.toISOString(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        status: 'scheduled',
        external_post_id: result.draftId, // Store draft ID for later publishing
        ai_recommended: true,
        ai_recommendation_score: 85,
      });

      setShowSuccess(true);
      setTimeout(() => {
        onPublish(true, selectedDate, selectedTime);
        handleClose();
      }, 2500);
    } catch (error: any) {
      console.error('Error scheduling post:', error);
      
      // Handle specific error cases
      if (error.message?.includes('expired') || error.message?.includes('invalid token')) {
        alert('Your LinkedIn connection has expired. Please reconnect your account.');
        setIsConnected(false);
        setStep('connect');
      } else if (error.message?.includes('permission') || error.message?.includes('scope')) {
        alert('LinkedIn permissions are insufficient. Please reconnect and grant all required permissions.');
        setIsConnected(false);
        setStep('connect');
      } else if (error.message?.includes('rate limit')) {
        alert('LinkedIn rate limit exceeded. Please try again in a few minutes.');
      } else {
        alert(`Failed to schedule post: ${error.message || 'Unknown error'}. Please try again.`);
      }
    } finally {
      setIsScheduling(false);
    }
  };

  const handleClose = () => {
    setStep('connect');
    setLinkedinEmail('');
    setIsConnected(false);
    setSelectedDate('');
    setSelectedTime('');
    setShowSuccess(false);
    setShowAutoPublishConfirm(false);
    onClose();
  };

  if (!isOpen) return null;

  if (showSuccess) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mx-auto mb-6">
            <Check className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
            {step === 'schedule' ? 'Your post is scheduled!' : 'Your post is live!'}
          </h2>
          <p className="text-gray-600 mb-2">
            {step === 'schedule'
              ? `Will be published on ${selectedDate} at ${selectedTime}`
              : 'Successfully published to LinkedIn'}
          </p>
          <p className="text-sm text-gray-500 mb-6">
            You can track performance in Analytics.
          </p>
          <div className="flex justify-center">
            <RobotChatbot size={80} animate={true} gesture="celebrate" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden animate-scale-in">
        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <Linkedin className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-semibold text-[#1A1A1A]">Publish to LinkedIn</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto max-h-[calc(90vh-88px)]">
          {showAutoPublishConfirm && (
            <div className="space-y-6 animate-slide-in">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mx-auto mb-4">
                  <Linkedin className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                  Post to LinkedIn now?
                </h3>
                <p className="text-gray-600">
                  Your LinkedIn account is connected. Ready to publish this post?
                </p>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden max-w-2xl mx-auto">
                  <div className="p-4">
                    <div className="flex items-start gap-3 mb-3">
                      {linkedInProfile?.profile_picture_url ? (
                        <img 
                          src={linkedInProfile.profile_picture_url} 
                          alt={linkedInProfile.profile_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-sm">
                          {linkedInProfile?.profile_name ? getInitials(linkedInProfile.profile_name) : 'U'}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="font-semibold text-[#1A1A1A] text-sm">
                          {linkedInProfile?.profile_name || 'Your Name'}
                        </p>
                        <p className="text-xs text-gray-600">Founder at {brandName}</p>
                      </div>
                    </div>
                    <div className="mt-2 mb-3">
                      <p className="text-[#1A1A1A] text-sm whitespace-pre-wrap line-clamp-4">
                        {post.length > 200 ? `${post.substring(0, 200)}...` : post}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <RobotChatbot size={60} animate={true} gesture="thinking" />
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                    <p className="text-xs text-gray-700">Ready to publish? Just confirm!</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAutoPublishConfirm(false);
                    setStep('preview');
                  }}
                  className="flex-1 px-6 py-3 text-gray-600 hover:text-[#1A1A1A] transition-colors font-medium border border-gray-200 rounded-xl hover:bg-gray-50"
                >
                  No, Show Preview
                </button>
                <button
                  onClick={async () => {
                    setShowAutoPublishConfirm(false);
                    // Automatically trigger publish
                    await handleConfirmPublish();
                  }}
                  disabled={isPublishing}
                  className="flex-1 bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPublishing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    'Yes, Publish Now'
                  )}
                </button>
              </div>
            </div>
          )}

          {!showAutoPublishConfirm && step === 'connect' && !isConnected && (
            <div className="text-center space-y-6 animate-slide-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mx-auto">
                <Linkedin className="w-10 h-10 text-blue-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                  Connect Your LinkedIn Account
                </h3>
                <p className="text-gray-600 mb-2">
                  Connect your personal LinkedIn account to publish posts automatically. Each user connects their own LinkedIn account.
                </p>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left max-w-md mx-auto space-y-2">
                  <p className="text-sm text-blue-900 font-medium">
                    What to expect:
                  </p>
                  <ol className="text-sm text-blue-800 space-y-1.5 list-decimal list-inside ml-2">
                    <li>You'll be redirected to LinkedIn's secure login page</li>
                    <li>Sign in to LinkedIn with your email and password (or any method LinkedIn provides)</li>
                    <li>Authorize our app to post on your behalf</li>
                    <li>You'll be redirected back to complete the connection</li>
                  </ol>
                  <p className="text-xs text-blue-700 mt-3 pt-3 border-t border-blue-200">
                    <strong>🔒 Secure & Private:</strong> Your LinkedIn credentials are encrypted and stored securely. Only you can access your own LinkedIn account.
                  </p>
                </div>
              </div>
              <div className="max-w-md mx-auto">
                <button
                  onClick={handleConnect}
                  className="w-full bg-[#0A66C2] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#004182] transition-all hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Linkedin className="w-5 h-5" />
                  Connect Your LinkedIn Account
                </button>
                <p className="text-xs text-gray-500 mt-3">
                  You'll be redirected to LinkedIn's secure login page
                </p>
              </div>
              <div className="flex justify-center mt-8">
                <RobotChatbot size={60} animate={true} gesture="wave" />
              </div>
            </div>
          )}

          {step === 'connect' && isConnected && (
            <div className="text-center space-y-6 animate-slide-in">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center mx-auto">
                <Check className="w-10 h-10 text-green-600" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                  Connected!
                </h3>
                <p className="text-gray-600">Ready to publish.</p>
              </div>
              <div className="flex justify-center">
                <div className="relative">
                  <RobotChatbot size={60} animate={true} gesture="celebrate" />
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                    <p className="text-xs text-gray-700">Connected! Ready to publish.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {!showAutoPublishConfirm && step === 'preview' && (
            <div className="space-y-6 animate-slide-in">
              <div className="text-center">
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                  Here's how your post will look on LinkedIn
                </h3>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-200">
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden max-w-2xl mx-auto">
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start gap-3">
                        {linkedInProfile?.profile_picture_url ? (
                          <img 
                            src={linkedInProfile.profile_picture_url} 
                            alt={linkedInProfile.profile_name}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => {
                              // Fallback to initials if image fails to load
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                              const fallback = target.nextElementSibling as HTMLElement;
                              if (fallback) fallback.style.display = 'flex';
                            }}
                          />
                        ) : null}
                        <div 
                          className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-semibold text-lg ${linkedInProfile?.profile_picture_url ? 'hidden' : ''}`}
                        >
                          {linkedInProfile?.profile_name ? getInitials(linkedInProfile.profile_name) : 'U'}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold text-[#1A1A1A] text-[15px]">
                              {linkedInProfile?.profile_name || 'Your Name'}
                            </p>
                            <span className="text-gray-400 text-xs">• 1st</span>
                          </div>
                          <p className="text-xs text-gray-600">Founder at {brandName} | Brand Visibility Expert</p>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                            <span>1m</span>
                            <span>•</span>
                            <Globe className="w-3 h-3" />
                          </div>
                        </div>
                      </div>
                      <button className="p-1.5 hover:bg-gray-100 rounded transition-colors">
                        <MoreHorizontal className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>

                    <div className="mt-3 mb-4">
                      <pre className="whitespace-pre-wrap font-sans text-[#1A1A1A] leading-relaxed text-[14px]">{post}</pre>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-2 flex items-center justify-between text-xs text-gray-600">
                    <span>24 reactions</span>
                    <div className="flex items-center gap-3">
                      <span>8 comments</span>
                      <span>12 reposts</span>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 px-4 py-2 flex items-center justify-around">
                    <button className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded transition-colors">
                      <ThumbsUp className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Like</span>
                    </button>
                    <button className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded transition-colors">
                      <MessageCircle className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Comment</span>
                    </button>
                    <button className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded transition-colors">
                      <Repeat2 className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Repost</span>
                    </button>
                    <button className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded transition-colors">
                      <SendIcon className="w-5 h-5 text-gray-600" />
                      <span className="text-sm font-medium text-gray-700">Send</span>
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <RobotChatbot size={60} animate={true} gesture="thinking" />
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                    <p className="text-xs text-gray-700">Looks good? Let's publish or schedule it.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleClose}
                  className="px-6 py-3 text-gray-600 hover:text-[#1A1A1A] transition-colors font-medium"
                >
                  Edit in Editor
                </button>
                <button
                  onClick={() => setStep('connect')}
                  className="px-6 py-3 text-gray-600 hover:text-[#1A1A1A] transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep('schedule')}
                  className="flex-1 bg-gray-100 text-[#1A1A1A] py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all"
                >
                  Schedule for Later
                </button>
                <button
                  onClick={handlePublishNow}
                  className="flex-1 bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg"
                >
                  Publish Now
                </button>
              </div>
            </div>
          )}

          {!showAutoPublishConfirm && step === 'confirmPublish' && (
            <div className="space-y-6 animate-slide-in">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                  Ready to publish?
                </h3>
                <p className="text-gray-600">This is how your post will appear on LinkedIn</p>
              </div>

              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  {linkedInProfile?.profile_picture_url ? (
                    <img 
                      src={linkedInProfile.profile_picture_url} 
                      alt={linkedInProfile.profile_name}
                      className="w-12 h-12 rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold ${linkedInProfile?.profile_picture_url ? 'hidden' : ''}`}
                  >
                    {linkedInProfile?.profile_name ? getInitials(linkedInProfile.profile_name) : brandName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[#1A1A1A]">{linkedInProfile?.profile_name || brandName}</p>
                    <p className="text-sm text-gray-600">Founder at {brandName} • Just now</p>
                  </div>
                  <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                    <MoreHorizontal className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <p className="text-[#1A1A1A] whitespace-pre-wrap mb-4 leading-relaxed">{post}</p>

                <div className="flex items-center gap-6 pt-4 border-t border-gray-100 text-gray-600">
                  <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <ThumbsUp className="w-5 h-5" />
                    <span className="text-sm">Like</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-sm">Comment</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <Repeat2 className="w-5 h-5" />
                    <span className="text-sm">Repost</span>
                  </button>
                  <button className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                    <SendIcon className="w-5 h-5" />
                    <span className="text-sm">Send</span>
                  </button>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <RobotChatbot size={60} animate={true} gesture="celebrate" />
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                    <p className="text-xs text-gray-700">Ready to publish! Let's make it live.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep('preview')}
                  className="px-6 py-3 text-gray-600 hover:text-[#1A1A1A] transition-colors font-medium"
                >
                  Back
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 text-gray-600 hover:text-[#1A1A1A] transition-colors font-medium"
                >
                  Edit in Editor
                </button>
                <button
                  onClick={handleConfirmPublish}
                  disabled={isPublishing}
                  className="flex-1 bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isPublishing ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    'Confirm Publish'
                  )}
                </button>
              </div>
            </div>
          )}

          {!showAutoPublishConfirm && step === 'schedule' && (
            <div className="space-y-6 animate-slide-in">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setStep('preview')}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
                <div>
                  <h3 className="text-xl font-semibold text-[#1A1A1A]">
                    Schedule Your Post
                  </h3>
                  <p className="text-gray-600 text-sm">
                    Pick the perfect time to publish
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time
                  </label>
                  <input
                    type="time"
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none"
                  />
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-[#1A1A1A]">AI Recommended Times</h4>
                </div>
                <div className="space-y-3">
                  {recommendedTimes.map((rec, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedTime(rec.time)}
                      className="w-full p-4 bg-white hover:bg-gray-50 rounded-xl border border-gray-200 transition-all text-left group"
                    >
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-bold text-[#1A1A1A] text-base">{rec.emoji} {rec.dayOfWeek} • {rec.fullDate} • {rec.time}</p>
                            <div className="flex items-center gap-1 px-2 py-1 bg-blue-100 rounded-full">
                              <BarChart3 className="w-3 h-3 text-blue-600" />
                              <span className="text-xs font-bold text-blue-700">{rec.engagement}% match</span>
                            </div>
                          </div>
                          <div className="space-y-1">
                            {rec.metrics.map((metric, mIndex) => (
                              <p key={mIndex} className="text-xs text-gray-600">• {metric}</p>
                            ))}
                          </div>
                          <p className="text-xs text-gray-500 mt-2 italic">{rec.reason}</p>
                        </div>
                      </div>
                      <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all"
                          style={{ width: `${rec.engagement}%` }}
                        />
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <p className="text-sm text-gray-700">
                    Pick a recommended slot to maximize visibility. I'll handle the publishing.
                  </p>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="relative">
                  <RobotChatbot size={60} animate={true} gesture="thinking" />
                  <div className="absolute -top-12 right-0 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 max-w-xs">
                    <p className="text-xs text-gray-700">I'll publish automatically at the optimal time.</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleScheduleConfirm}
                  disabled={!selectedDate || !selectedTime || isScheduling}
                  className="flex-1 bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isScheduling ? (
                    <>
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      <span>Scheduling...</span>
                    </>
                  ) : (
                    'Confirm Schedule'
                  )}
                </button>
                <button
                  onClick={() => setStep('preview')}
                  className="px-6 py-3 text-gray-600 hover:text-[#1A1A1A] transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
