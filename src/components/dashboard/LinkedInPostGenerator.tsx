import { useState, useEffect } from 'react';
import { X, ArrowRight, RefreshCw, Edit, Sparkles, TrendingUp, BookOpen, Lightbulb, FileText, Rocket, Calendar, Zap, Image, Video, LayoutGrid, Send, Loader2 } from 'lucide-react';
import RobotChatbot from '../RobotChatbot';
import VoiceInput from '../VoiceInput';
import PostEditor from './PostEditor';
import PublishModal from './PublishModal';
import { supabase } from '../../lib/supabase';
import { findOrCreateBrand, createContentItem, updateContentItem, getBrand, updateBrand, getContentItem } from '../../lib/database';
import { generateLinkedInPost } from '../../lib/openai';
import { extractBrandProfile, getCachedBrandProfile, saveBrandProfile, type BrandProfile } from '../../lib/brand-extractor';
import { createBrandDNAFromExtraction, getBrandDNA } from '../../lib/brand-dna';
import BrandDNAPreview from './BrandDNAPreview';
import type { BrandDNA } from '../../types/database';
import { generateLinkedInPostEnhanced, regenerateLinkedInPost, type LinkedInPostContent } from '../../lib/openai-enhanced';
import { generateImages, generateVideoScript, getRecommendedAssetType, saveGeneratedImages, saveVideoScript, type GeneratedImage, type VideoScript } from '../../lib/asset-generator';
import ImagePicker from '../ImagePicker';
import { sendWebsiteDataToN8n, sendPostTypeSelectionToN8n } from '../../lib/n8n-webhook';
import type { Brand, ContentItem } from '../../types/database';

interface LinkedInPostGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
}

type PostType = {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
};

export default function LinkedInPostGenerator({ isOpen, onClose }: LinkedInPostGeneratorProps) {
  const [step, setStep] = useState(1);
  const [brandData, setBrandData] = useState({ name: '', url: '' });
  const [selectedType, setSelectedType] = useState<string>('');
  const [context, setContext] = useState({ topic: '', details: '' });
  const [generatedPost, setGeneratedPost] = useState('');
  const [generatedContent, setGeneratedContent] = useState<LinkedInPostContent | null>(null);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [brandProfile, setBrandProfile] = useState<BrandProfile | null>(null);
  const [contentItem, setContentItem] = useState<ContentItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractionStatus, setExtractionStatus] = useState<string>('');
  const [extractionError, setExtractionError] = useState<string | null>(null);
  const [selectedVariation, setSelectedVariation] = useState<'main' | 'versionA' | 'versionB'>('main');
  const [activeAssetTab, setActiveAssetTab] = useState<'images' | 'videos'>('images');
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [generatedVideo, setGeneratedVideo] = useState<VideoScript | null>(null);
  const [isGeneratingAssets, setIsGeneratingAssets] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<VideoScript | null>(null);
  const [showImagePreview, setShowImagePreview] = useState(false);
  const [showVideoPreview, setShowVideoPreview] = useState(false);
  const [imageProvider, setImageProvider] = useState<'dalle' | 'gemini' | 'seedream'>('dalle');
  const [imageGenerationError, setImageGenerationError] = useState<string | null>(null);
  const [isGeneratingImages, setIsGeneratingImages] = useState(false);
  const [isGeneratingVideos, setIsGeneratingVideos] = useState(false);
  const [videoGenerationError, setVideoGenerationError] = useState<string | null>(null);
  const [showBrandDNAPreview, setShowBrandDNAPreview] = useState(false);
  const [extractedBrandDNA, setExtractedBrandDNA] = useState<BrandDNA | null>(null);

  const postTypes: PostType[] = [
    { id: 'thought-leadership', title: 'Thought Leadership', description: 'Share expert insights', icon: Lightbulb, color: 'from-blue-500 to-blue-600' },
    { id: 'authority', title: 'Authority Building', description: 'Establish credibility', icon: TrendingUp, color: 'from-purple-500 to-purple-600' },
    { id: 'storytelling', title: 'Storytelling', description: 'Connect through stories', icon: BookOpen, color: 'from-pink-500 to-pink-600' },
    { id: 'value-tips', title: 'Value / Tips', description: 'Share actionable advice', icon: Sparkles, color: 'from-green-500 to-green-600' },
    { id: 'case-study', title: 'Case Study', description: 'Show real results', icon: FileText, color: 'from-orange-500 to-orange-600' },
    { id: 'announcement', title: 'Announcement', description: 'Launch something new', icon: Rocket, color: 'from-red-500 to-red-600' },
    { id: 'event', title: 'Event Post', description: 'Promote gatherings', icon: Calendar, color: 'from-cyan-500 to-cyan-600' },
    { id: 'trending', title: 'Trending Angle', description: 'Ride the wave', icon: Zap, color: 'from-yellow-500 to-yellow-600' },
    { id: 'carousel', title: 'Carousel Script', description: 'Multi-slide content', icon: FileText, color: 'from-indigo-500 to-indigo-600' },
  ];

  const suggestedImages = [
    { id: 1, label: 'Brand Aesthetic' },
    { id: 2, label: 'Data Visualization' },
    { id: 3, label: 'Team Photo' },
  ];

  const suggestedVideos = [
    { id: 1, label: 'Talking Head' },
    { id: 2, label: 'B-Roll Montage' },
  ];

  // Get current user on mount
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || null);
    };
    getUser();
  }, []);

  // Detect OAuth completion and reopen modal
  useEffect(() => {
    const checkOAuthCompletion = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const linkedinConnected = urlParams.get('linkedin_connected');
      const reopenModal = urlParams.get('reopen_modal');
      const contentItemId = urlParams.get('content_item_id');

      // Only proceed if we have the required params
      // Note: We check even if LinkedInPostGenerator is not open, to ensure modal opens
      if (linkedinConnected === 'true' && reopenModal === 'true' && contentItemId) {
        // Immediately reopen modal (don't wait for content fetch)
        setShowPublishModal(true);

        try {
          // Fetch the content item from database
          const fetchedContentItem = await getContentItem(contentItemId);

          if (fetchedContentItem) {
            // Restore content item state
            setContentItem(fetchedContentItem);

            // Restore generated post from content item or sessionStorage
            const storedPost = sessionStorage.getItem('linkedin_post_content');
            if (fetchedContentItem.body) {
              setGeneratedPost(fetchedContentItem.body);
            } else if (storedPost) {
              setGeneratedPost(storedPost);
            }

            // Restore brand data from sessionStorage or current brand state
            const storedBrandName = sessionStorage.getItem('linkedin_brand_name');
            if (storedBrandName) {
              setBrandData(prev => ({ ...prev, name: storedBrandName }));
            }

            // Ensure brand is set if we have brand_id in content item
            if (fetchedContentItem.brand_id && !brand) {
              const fetchedBrand = await getBrand(fetchedContentItem.brand_id);
              if (fetchedBrand) {
                setBrand(fetchedBrand);
                setBrandData(prev => ({ ...prev, name: fetchedBrand.name, url: fetchedBrand.website_url || '' }));
              }
            }
          }
        } catch (error) {
          console.error('Error reopening modal after OAuth:', error);
          // Try to restore from sessionStorage as fallback
          const storedPost = sessionStorage.getItem('linkedin_post_content');
          const storedBrandName = sessionStorage.getItem('linkedin_brand_name');

          if (storedPost) {
            setGeneratedPost(storedPost);
          }
          if (storedBrandName) {
            setBrandData(prev => ({ ...prev, name: storedBrandName }));
          }
        } finally {
          // Clear URL params after processing
          window.history.replaceState({}, document.title, window.location.pathname);

          // Clean up sessionStorage (but keep for PublishModal to use)
          // PublishModal will clean up after it processes the auto_publish flag
        }
      }
    };

    checkOAuthCompletion();
  }, [brand]);

  const handleStep1Continue = async () => {
    if (brandData.name && brandData.url && userId) {
      setIsSaving(true);
      setIsExtracting(true);
      setExtractionError(null);

      try {
        // Find or create brand
        const brandRecord = await findOrCreateBrand(userId, brandData.name, brandData.url);
        setBrand(brandRecord);

        // Send website data to n8n webhook (non-blocking)
        sendWebsiteDataToN8n({
          websiteName: brandData.name,
          websiteUrl: brandData.url,
          userId: userId,
          brandId: brandRecord.id,
        }).catch((error) => {
          // Log error but don't block the flow
          console.error('Failed to send data to n8n:', error);
        });

        // Check for cached brand profile
        let profile = await getCachedBrandProfile(brandRecord.id);

        if (!profile) {
          // Extract brand profile from website
          try {
            profile = await extractBrandProfile(brandData.name, brandData.url);
            await saveBrandProfile(brandRecord.id, profile);
          } catch (error: any) {
            console.error('Error extracting brand profile:', error);
            setExtractionError(error.message || 'Failed to extract brand profile. Continuing with basic generation...');
            // Continue anyway with empty profile
            profile = {} as BrandProfile;
          }
        }

        setBrandProfile(profile);

        // If extraction failed (empty profile), skip BrandDNA and proceed to Step 2
        if (Object.keys(profile).length === 0) {
          setStep(2);
          setIsSaving(false);
          setIsExtracting(false);
          return;
        }

        // Auto-create BrandDNA if it doesn't exist
        try {
          const existingBrandDNA = await getBrandDNA(brandRecord.id);
          if (!existingBrandDNA) {
            // Create BrandDNA from extraction
            setExtractionStatus('Scraping website with Firecrawl...');
            const newBrandDNA = await createBrandDNAFromExtraction(brandRecord.id, userId, brandData.name, brandData.url);
            console.log('BrandDNA created successfully');
            setExtractedBrandDNA(newBrandDNA);
            setExtractionStatus('');
            // Show preview before proceeding
            setShowBrandDNAPreview(true);
          } else {
            setExtractedBrandDNA(existingBrandDNA);
            setExtractionStatus('');
            // Show preview if BrandDNA already exists
            setShowBrandDNAPreview(true);
          }
        } catch (error) {
          // Log error but don't block the flow
          console.error('Error checking/creating BrandDNA:', error);
          setExtractionStatus('');
          // Continue to next step even if BrandDNA creation fails
          setStep(2);
        }
      } catch (error) {
        console.error('Error saving brand:', error);
        alert('Failed to save brand. Please try again.');
      } finally {
        setIsSaving(false);
        setIsExtracting(false);
      }
    }
  };

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);

    // Send post type selection to n8n webhook (non-blocking)
    const selectedPostType = postTypes.find(type => type.id === typeId);
    if (selectedPostType && brandData.name && brandData.url) {
      sendPostTypeSelectionToN8n({
        postType: typeId,
        postTypeTitle: selectedPostType.title,
        websiteName: brandData.name,
        websiteUrl: brandData.url,
      }).catch((error) => {
        // Log error but don't block the flow
        console.error('Failed to send post type selection to n8n:', error);
      });
    }

    setTimeout(() => setStep(3), 300);
  };

  const generatePost = async (): Promise<LinkedInPostContent> => {
    if (!brand || !brandProfile) {
      throw new Error('Brand or brand profile not found');
    }

    try {
      // Use enhanced generation with brand profile
      const enhancedContent = await generateLinkedInPostEnhanced({
        brandName: brandData.name,
        brandUrl: brandData.url,
        brandProfile: brandProfile,
        postType: selectedType,
        topic: context.topic,
        contextDetails: context.details || undefined,
      });

      return enhancedContent;
    } catch (error) {
      console.error('Error generating enhanced AI post:', error);
      // Fallback to basic generation if enhanced fails
      try {
        const basicPost = await generateLinkedInPost({
          brandName: brandData.name,
          brandUrl: brandData.url,
          postType: selectedType,
          topic: context.topic,
          contextDetails: context.details || undefined,
          brandTone: brandProfile?.brandTone || undefined,
        });

        // Convert basic post to enhanced format
        return {
          postText: basicPost,
          structure: {
            hook: basicPost.split('\n\n')[0] || '',
            body: basicPost.split('\n\n').slice(1, -1).join('\n\n') || '',
            cta: basicPost.split('\n\n').slice(-1)[0] || '',
          },
          imagePrompts: {
            primary: `Professional LinkedIn post image for ${brandData.name} about ${context.topic}`,
            alternate1: `Alternative image option 1 for ${brandData.name}`,
            alternate2: `Alternative image option 2 for ${brandData.name}`,
          },
          hashtags: basicPost.match(/#\w+/g) || ['#Leadership', '#Business'],
          variations: {
            versionA: basicPost,
            versionB: basicPost,
          },
        };
      } catch (fallbackError) {
        // Ultimate fallback
        const fallbackText = `🚀 ${context.topic}

Here's what most ${brandData.name} customers don't realize:

${context.details || 'The key is building authentic connections with your audience.'}

What's your biggest visibility challenge right now? Drop it in the comments 👇

#Leadership #BrandVisibility #Marketing`;

        return {
          postText: fallbackText,
          structure: {
            hook: fallbackText.split('\n\n')[0] || '',
            body: fallbackText.split('\n\n').slice(1, -1).join('\n\n') || '',
            cta: fallbackText.split('\n\n').slice(-1)[0] || '',
          },
          imagePrompts: {
            primary: `Professional LinkedIn post image for ${brandData.name}`,
            alternate1: `Alternative image option 1`,
            alternate2: `Alternative image option 2`,
          },
          hashtags: ['#Leadership', '#BrandVisibility', '#Marketing'],
          variations: {
            versionA: fallbackText,
            versionB: fallbackText,
          },
        };
      }
    }
  };

  const handleGeneratePost = async () => {
    if (!userId || !brand || !brandProfile) return;

    setIsSaving(true);
    try {
      // Generate enhanced post content using AI
      const enhancedContent = await generatePost();
      setGeneratedContent(enhancedContent);
      setGeneratedPost(enhancedContent.postText);
      setSelectedVariation('main');

      // Create content item in database with enhanced metadata
      const contentRecord = await createContentItem({
        user_id: userId,
        brand_id: brand.id,
        type: 'linkedin_post',
        platform: 'linkedin',
        body: enhancedContent.postText,
        post_type: selectedType,
        post_type_id: selectedType,
        topic: context.topic,
        context_details: context.details || null,
        status: 'generated',
        ai_model: 'gpt-4o',
        metadata: {
          enhancedContent: {
            structure: enhancedContent.structure,
            imagePrompts: enhancedContent.imagePrompts,
            videoPrompt: enhancedContent.videoPrompt,
            hashtags: enhancedContent.hashtags,
            variations: enhancedContent.variations,
          },
        },
      });

      setContentItem(contentRecord);

      // Auto-select recommended asset type
      const recommendedType = getRecommendedAssetType(selectedType);
      setActiveAssetTab(recommendedType === 'video' ? 'videos' : 'images');

      // Auto-generate images and videos immediately after post generation
      if (brandProfile) {
        // Generate both images and videos in parallel
        autoGenerateAssets();
      }

      setStep(4);
    } catch (error) {
      console.error('Error generating/saving content:', error);
      alert('Failed to generate post. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Auto-generate images and videos in parallel
   */
  const autoGenerateAssets = async () => {
    if (!userId || !brand || !brandProfile) return;

    // Generate images and videos in parallel
    setIsGeneratingImages(true);
    setIsGeneratingVideos(true);
    setImageGenerationError(null);
    setVideoGenerationError(null);

    try {
      // Parallel generation
      const [imagesResult, videoResult] = await Promise.allSettled([
        generateImages({
          brandProfile,
          brandName: brandData.name,
          postType: selectedType,
          topic: context.topic,
          contextDetails: context.details || undefined,
          imagePrompt: generatedContent?.imagePrompts?.primary,
          provider: imageProvider,
        }),
        generateVideoScript({
          brandProfile,
          postType: selectedType,
          topic: context.topic,
          contextDetails: context.details || undefined,
          targetDuration: '30s',
        }),
      ]);

      // Handle images result
      if (imagesResult.status === 'fulfilled') {
        setGeneratedImages(imagesResult.value);
        setImageGenerationError(null);
        // Auto-select first image
        if (imagesResult.value.length > 0) {
          setSelectedImage(imagesResult.value[0]);
        }
      } else {
        console.error('Error generating images:', imagesResult.reason);
        setImageGenerationError(imagesResult.reason?.message || 'Couldn\'t generate images. Try again.');
      }

      // Handle video result
      if (videoResult.status === 'fulfilled') {
        setGeneratedVideo(videoResult.value);
        setVideoGenerationError(null);
        setSelectedVideo(videoResult.value);
      } else {
        console.error('Error generating video:', videoResult.reason);
        setVideoGenerationError(videoResult.reason?.message || 'Couldn\'t generate video script. Try again.');
      }
    } catch (error: any) {
      console.error('Error in auto-generate assets:', error);
      setImageGenerationError(error.message || 'Couldn\'t generate assets. Try again.');
      setVideoGenerationError(error.message || 'Couldn\'t generate assets. Try again.');
    } finally {
      setIsGeneratingImages(false);
      setIsGeneratingVideos(false);
      setIsGeneratingAssets(false);
    }
  };

  // Legacy function for manual generation (kept for compatibility, but not used in UI)
  const handleGenerateImages = async () => {
    if (!userId || !brand || !brandProfile) return;

    setIsGeneratingAssets(true);
    setImageGenerationError(null);
    try {
      const images = await generateImages({
        brandProfile,
        brandName: brandData.name,
        postType: selectedType,
        topic: context.topic,
        contextDetails: context.details || undefined,
        imagePrompt: generatedContent?.imagePrompts?.primary,
        provider: imageProvider,
      });

      setGeneratedImages(images);
      setImageGenerationError(null);

      // Auto-select first image
      if (images.length > 0) {
        setSelectedImage(images[0]);
      }
    } catch (error: any) {
      console.error('Error generating images:', error);
      setImageGenerationError(error.message || 'Couldn\'t generate images. Try again.');
    } finally {
      setIsGeneratingAssets(false);
    }
  };

  // Legacy function for manual generation (kept for compatibility, but not used in UI)
  const handleGenerateVideo = async () => {
    if (!userId || !brand || !brandProfile) return;

    setIsGeneratingVideos(true);
    setVideoGenerationError(null);
    try {
      const video = await generateVideoScript({
        brandProfile,
        postType: selectedType,
        topic: context.topic,
        contextDetails: context.details || undefined,
        targetDuration: '30s',
      });

      setGeneratedVideo(video);
      setSelectedVideo(video);
      setVideoGenerationError(null);
    } catch (error: any) {
      console.error('Error generating video script:', error);
      setVideoGenerationError(error.message || 'Couldn\'t generate video script. Try again.');
    } finally {
      setIsGeneratingVideos(false);
    }
  };

  const handleAttachImage = async (image: GeneratedImage) => {
    if (!userId || !brand || !contentItem) return;

    try {
      setIsSaving(true);

      // Save images to storage
      const savedAssets = await saveGeneratedImages([image], userId, brand.id, contentItem.id);

      if (savedAssets.length > 0) {
        // Update content item with attached image
        await updateContentItem(contentItem.id, {
          media_url: savedAssets[0].storage_path,
          media_type: 'image',
          metadata: {
            ...contentItem.metadata,
            attachedImage: {
              id: savedAssets[0].id,
              variation: image.variation,
              prompt: image.prompt,
            },
          },
        });

        alert('Image attached successfully!');
        setShowImagePreview(false);
      }
    } catch (error) {
      console.error('Error attaching image:', error);
      alert('Failed to attach image. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAttachVideo = async (video: VideoScript) => {
    if (!userId || !brand || !contentItem) return;

    try {
      setIsSaving(true);

      // Save video script to content metadata
      await saveVideoScript(video, userId, brand.id, contentItem.id);

      // Update content item
      await updateContentItem(contentItem.id, {
        media_type: 'video',
        metadata: {
          ...contentItem.metadata,
          attachedVideo: {
            id: video.id,
            title: video.title,
          },
        },
      });

      alert('Video script attached successfully!');
      setShowVideoPreview(false);
    } catch (error) {
      console.error('Error attaching video:', error);
      alert('Failed to attach video script. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    if (!contentItem || !brand || !brandProfile) return;

    setIsRegenerating(true);
    try {
      // Regenerate post using enhanced regeneration
      const newContent = await regenerateLinkedInPost({
        brandName: brandData.name,
        brandUrl: brandData.url,
        brandProfile: brandProfile,
        postType: selectedType,
        topic: context.topic,
        contextDetails: context.details || undefined,
      });

      setGeneratedContent(newContent);
      setGeneratedPost(newContent.postText);
      setSelectedVariation('main');

      // Update content item
      await updateContentItem(contentItem.id, {
        body: newContent.postText,
        status: 'generated',
        metadata: {
          enhancedContent: {
            structure: newContent.structure,
            imagePrompts: newContent.imagePrompts,
            videoPrompt: newContent.videoPrompt,
            hashtags: newContent.hashtags,
            variations: newContent.variations,
          },
        },
      });
    } catch (error) {
      console.error('Error regenerating post:', error);
      alert('Failed to regenerate post. Please try again.');
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleSaveFromEditor = async (editedPost: string, image?: GeneratedImage | null) => {
    setGeneratedPost(editedPost);

    // Update selected image if changed
    if (image !== undefined) {
      setSelectedImage(image);
    }

    if (contentItem) {
      try {
        const updates: any = {
          body: editedPost,
          status: 'edited',
        };

        // Update image if provided
        if (image) {
          updates.media_url = image.url;
          updates.media_type = 'image';
          updates.metadata = {
            ...contentItem.metadata,
            attachedImage: {
              id: image.id,
              variation: image.variation,
              prompt: image.prompt,
              provider: image.metadata?.provider || 'dalle',
            },
          };
        } else if (image === null) {
          // Image was removed
          updates.media_url = null;
          updates.media_type = null;
          if (contentItem.metadata) {
            const { attachedImage, ...restMetadata } = contentItem.metadata;
            updates.metadata = restMetadata;
          }
        }

        await updateContentItem(contentItem.id, updates);
      } catch (error) {
        console.error('Error saving edited post:', error);
      }
    }

    setShowEditor(false);
  };

  const handlePublish = (scheduled: boolean, date?: string, time?: string) => {
    setShowPublishModal(false);
    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setBrandData({ name: '', url: '' });
    setSelectedType('');
    setContext({ topic: '', details: '' });
    setGeneratedPost('');
    setGeneratedContent(null);
    setBrandProfile(null);
    setSelectedVariation('main');
    setExtractionError(null);
    setActiveAssetTab('images');
    setGeneratedImages([]);
    setGeneratedVideo(null);
    setSelectedImage(null);
    setSelectedVideo(null);
    setShowImagePreview(false);
    setShowVideoPreview(false);
    setImageGenerationError(null);
    setVideoGenerationError(null);
    setIsGeneratingImages(false);
    setIsGeneratingVideos(false);
    setShowEditor(false);
    setShowPublishModal(false);
    onClose();
  };

  const getCurrentPostText = (): string => {
    if (!generatedContent) return generatedPost;

    switch (selectedVariation) {
      case 'versionA':
        return generatedContent.variations.versionA;
      case 'versionB':
        return generatedContent.variations.versionB;
      default:
        return generatedContent.postText;
    }
  };

  if (!isOpen) return null;

  if (showEditor) {
    return (
      <PostEditor
        initialPost={getCurrentPostText()}
        brandName={brandData.name}
        selectedImage={selectedImage}
        onClose={() => setShowEditor(false)}
        onSave={handleSaveFromEditor}
        onImageChange={(image) => setSelectedImage(image)}
      />
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden animate-scale-in">
          <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-[#1A1A1A]">LinkedIn Post Generator</h2>
                <p className="text-sm text-gray-500">Step {step} of 4</p>
              </div>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-88px)]">
            {/* BrandDNA Preview Modal */}
            {showBrandDNAPreview && extractedBrandDNA && (
              <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/30 backdrop-blur-sm overflow-y-auto">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl my-4 flex flex-col max-h-[calc(100vh-2rem)] overflow-hidden">
                  {/* Header - Fixed */}
                  <div className="flex-shrink-0 p-6 border-b border-gray-200 bg-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-[#1A1A1A]">BrandDNA Extracted Successfully</h2>
                        <p className="text-sm text-gray-600 mt-1">Review the extracted brand information below</p>
                      </div>
                      <button
                        onClick={() => {
                          setShowBrandDNAPreview(false);
                          setStep(2);
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto min-h-0">
                    <div className="p-6">
                      <BrandDNAPreview
                        brandDNA={extractedBrandDNA}
                        compact={true}
                      />
                    </div>
                  </div>

                  {/* Footer - Fixed */}
                  <div className="flex-shrink-0 p-6 border-t border-gray-200 bg-white">
                    <div className="flex justify-end gap-3">
                      <button
                        onClick={() => {
                          setShowBrandDNAPreview(false);
                          setStep(2);
                        }}
                        className="px-6 py-2.5 bg-[#1A1A1A] text-white rounded-xl font-medium hover:bg-gray-800 transition-all flex items-center gap-2"
                      >
                        <span>Continue to Post Type</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="p-8 space-y-6 animate-slide-in">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                    Start by entering your website
                  </h3>
                  <p className="text-gray-600">
                    Foundrly analyzes your brand tone, audience, keywords & positioning.
                  </p>
                </div>

                <div className="max-w-lg mx-auto space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website Name
                    </label>
                    <VoiceInput
                      value={brandData.name}
                      onChange={(value) => setBrandData({ ...brandData, name: value })}
                      placeholder="e.g., Acme Inc."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    <VoiceInput
                      value={brandData.url}
                      onChange={(value) => setBrandData({ ...brandData, url: value })}
                      placeholder="https://example.com"
                    />
                  </div>

                  <button
                    onClick={handleStep1Continue}
                    disabled={!brandData.name || !brandData.url || isSaving}
                    className="w-full bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {isSaving ? (
                      <>
                        {isExtracting ? (
                          <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>{extractionStatus || 'Analyzing your brand with Firecrawl...'}</span>
                          </>
                        ) : (
                          <>
                            <RefreshCw className="w-5 h-5 animate-spin" />
                            <span>Saving...</span>
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <span>Continue</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>

                  {extractionError && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">{extractionError}</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-center mt-8">
                  <div className="relative">
                    <RobotChatbot size={60} animate={true} gesture="wave" />
                    <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                      <p className="text-xs text-gray-700">Let me scan your brand in seconds.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="p-8 space-y-6 animate-slide-in">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                    Choose Your Post Type
                  </h3>
                  <p className="text-gray-600">
                    Pick the style that matches your message.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto">
                  {postTypes.map((type) => {
                    const Icon = type.icon;
                    return (
                      <button
                        key={type.id}
                        onClick={() => handleTypeSelect(type.id)}
                        className="group bg-white rounded-2xl p-6 border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all hover:-translate-y-1 text-left"
                      >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${type.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h4 className="font-semibold text-[#1A1A1A] mb-1">{type.title}</h4>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="p-8 space-y-6 animate-slide-in">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-semibold text-[#1A1A1A] mb-2">
                    What is this post about?
                  </h3>
                  <p className="text-gray-600">
                    Share your topic and any context to help me craft the perfect post.
                  </p>
                </div>

                <div className="max-w-lg mx-auto space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Post topic or idea
                    </label>
                    <VoiceInput
                      value={context.topic}
                      onChange={(value) => setContext({ ...context, topic: value })}
                      placeholder="e.g., Why most startups fail at brand visibility"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Optional context (audience, tone, goal)
                    </label>
                    <VoiceInput
                      value={context.details}
                      onChange={(value) => setContext({ ...context, details: value })}
                      placeholder="Add any specific details, target audience, or key points you want to include..."
                      multiline
                      rows={4}
                    />
                  </div>

                  <button
                    onClick={handleGeneratePost}
                    disabled={!context.topic || isSaving}
                    className="w-full bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span>Generate Post</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="flex justify-center mt-8">
                  <div className="relative">
                    <RobotChatbot size={60} animate={true} gesture="thinking" />
                    <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 max-w-xs">
                      <p className="text-xs text-gray-700">Give me anything — even a rough thought — I'll turn it into gold.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="p-8 space-y-6 animate-slide-in">
                <div className="space-y-6">
                  {/* Variation Selector */}
                  {generatedContent && (
                    <div className="flex gap-2 p-2 bg-gray-50 rounded-xl">
                      <button
                        onClick={() => setSelectedVariation('main')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${selectedVariation === 'main'
                          ? 'bg-[#1A1A1A] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        Main Version
                      </button>
                      <button
                        onClick={() => setSelectedVariation('versionA')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${selectedVariation === 'versionA'
                          ? 'bg-[#1A1A1A] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        Version A
                      </button>
                      <button
                        onClick={() => setSelectedVariation('versionB')}
                        className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all ${selectedVariation === 'versionB'
                          ? 'bg-[#1A1A1A] text-white'
                          : 'bg-white text-gray-700 hover:bg-gray-100'
                          }`}
                      >
                        Version B
                      </button>
                    </div>
                  )}

                  <div className={`transition-opacity duration-300 ${isRegenerating ? 'opacity-50' : 'opacity-100'}`}>
                    <div className="bg-white rounded-2xl border border-gray-200 p-6">
                      <div className="flex items-start gap-3 mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-800 to-gray-600 flex items-center justify-center text-white font-semibold">
                          S
                        </div>
                        <div>
                          <p className="font-semibold text-[#1A1A1A]">Sarah Johnson</p>
                          <p className="text-sm text-gray-600">Founder at {brandData.name}</p>
                          <p className="text-xs text-gray-500">Just now</p>
                        </div>
                      </div>

                      {/* Selected Image Preview */}
                      {selectedImage && (
                        <div className="mb-4 rounded-lg overflow-hidden">
                          <img
                            src={selectedImage.url}
                            alt="Post image"
                            className="w-full object-cover max-h-96"
                          />
                        </div>
                      )}

                      <div className="prose prose-sm max-w-none">
                        <pre className="whitespace-pre-wrap font-sans text-[#1A1A1A] leading-relaxed">
                          {getCurrentPostText()}
                        </pre>
                      </div>

                      {/* Hashtags */}
                      {generatedContent && generatedContent.hashtags.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex flex-wrap gap-2">
                            {generatedContent.hashtags.map((tag, idx) => (
                              <span key={idx} className="text-sm text-blue-600 font-medium">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleRegenerate}
                      disabled={isRegenerating}
                      className="flex-1 bg-gray-100 text-[#1A1A1A] py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw className={`w-5 h-5 ${isRegenerating ? 'animate-spin' : ''}`} />
                      Regenerate
                    </button>
                    <button
                      onClick={() => setShowEditor(true)}
                      className="flex-1 bg-gray-100 text-[#1A1A1A] py-3 px-6 rounded-xl font-medium hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                      <Edit className="w-5 h-5" />
                      Edit in Editor
                    </button>
                    <button
                      onClick={() => setShowPublishModal(true)}
                      className="flex-1 bg-[#1A1A1A] text-white py-3 px-6 rounded-xl font-medium hover:bg-gray-800 transition-all hover:shadow-lg flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Publish
                    </button>
                  </div>

                  {/* Assets Section with Tabs */}
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-semibold text-[#1A1A1A] flex items-center gap-2">
                        <LayoutGrid className="w-5 h-5" />
                        Assets
                      </h4>
                      <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                        <button
                          onClick={() => setActiveAssetTab('images')}
                          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeAssetTab === 'images'
                            ? 'bg-white text-[#1A1A1A] shadow-sm'
                            : 'text-gray-600 hover:text-[#1A1A1A]'
                            }`}
                        >
                          <Image className="w-4 h-4 inline mr-1.5" />
                          Images
                        </button>
                        <button
                          onClick={() => setActiveAssetTab('videos')}
                          className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeAssetTab === 'videos'
                            ? 'bg-white text-[#1A1A1A] shadow-sm'
                            : 'text-gray-600 hover:text-[#1A1A1A]'
                            }`}
                        >
                          <Video className="w-4 h-4 inline mr-1.5" />
                          Videos
                        </button>
                      </div>
                    </div>

                    {/* Images Tab */}
                    {activeAssetTab === 'images' && (
                      <div className="space-y-4">
                        {/* Choose an Image Section Header */}
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-sm font-semibold text-[#1A1A1A]">Choose an Image</h5>
                          {/* Provider Selection */}
                          <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
                            <button
                              onClick={() => setImageProvider('dalle')}
                              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${imageProvider === 'dalle'
                                ? 'bg-white text-[#1A1A1A] shadow-sm'
                                : 'text-gray-600 hover:text-[#1A1A1A]'
                                }`}
                            >
                              DALL-E
                            </button>
                            <button
                              onClick={() => setImageProvider('gemini')}
                              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${imageProvider === 'gemini'
                                ? 'bg-white text-[#1A1A1A] shadow-sm'
                                : 'text-gray-600 hover:text-[#1A1A1A]'
                                }`}
                            >
                              Gemini
                            </button>
                            <button
                              onClick={() => setImageProvider('seedream')}
                              className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${imageProvider === 'seedream'
                                ? 'bg-white text-[#1A1A1A] shadow-sm'
                                : 'text-gray-600 hover:text-[#1A1A1A]'
                                }`}
                            >
                              SeedDream
                            </button>
                          </div>
                        </div>

                        {/* Image Picker Component */}
                        <ImagePicker
                          images={generatedImages}
                          selectedImage={selectedImage}
                          onSelect={(image) => {
                            setSelectedImage(image);
                            setShowImagePreview(true);
                          }}
                          isLoading={isGeneratingImages}
                          error={imageGenerationError}
                          onRetry={() => autoGenerateAssets()}
                        />
                      </div>
                    )}

                    {/* Videos Tab */}
                    {activeAssetTab === 'videos' && (
                      <div className="space-y-4">
                        {isGeneratingVideos ? (
                          <div className="bg-gray-50 rounded-xl p-8 border border-gray-200 text-center">
                            <Loader2 className="w-12 h-12 text-gray-400 mx-auto mb-3 animate-spin" />
                            <p className="text-sm text-gray-600 mb-1">Foundi is generating your visuals...</p>
                            <p className="text-xs text-gray-500">Creating video script and storyboard</p>
                          </div>
                        ) : videoGenerationError ? (
                          <div className="bg-red-50 rounded-xl p-6 border border-red-200 text-center">
                            <Video className="w-12 h-12 text-red-400 mx-auto mb-3" />
                            <p className="text-sm text-red-800 mb-2">{videoGenerationError}</p>
                            <p className="text-xs text-red-600 mb-4">Couldn't generate video script. Try again.</p>
                            <button
                              onClick={() => autoGenerateAssets()}
                              className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-all flex items-center gap-2 mx-auto"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Try Again
                            </button>
                          </div>
                        ) : !generatedVideo ? (
                          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 text-center">
                            <Video className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                            <p className="text-sm text-gray-600">Video script will be generated automatically</p>
                          </div>
                        ) : (
                          <div
                            onClick={() => {
                              setSelectedVideo(generatedVideo);
                              setShowVideoPreview(true);
                            }}
                            className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border-2 border-blue-200 cursor-pointer hover:border-blue-300 transition-all"
                          >
                            <div className="flex items-start gap-4">
                              <img
                                src={generatedVideo.thumbnailPlaceholder}
                                alt="Video thumbnail"
                                className="w-32 h-20 object-cover rounded-lg"
                              />
                              <div className="flex-1">
                                <h5 className="font-semibold text-[#1A1A1A] mb-2">{generatedVideo.title}</h5>
                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{generatedVideo.script.substring(0, 150)}...</p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                  <span>{generatedVideo.scenes.length} scenes</span>
                                  <span>•</span>
                                  <span>{generatedVideo.metadata.duration}</span>
                                  <span>•</span>
                                  <span className="capitalize">{generatedVideo.metadata.style}</span>
                                </div>
                              </div>
                              <div className="text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                </svg>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <div className="relative">
                      <RobotChatbot size={60} animate={true} gesture="thinking" />
                      <div className="absolute -top-12 right-0 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg border border-gray-200 whitespace-nowrap">
                        <p className="text-xs text-gray-700">Want something different? Try regenerate or edit.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-8 py-4 border-t border-gray-100 flex justify-between items-center">
            <div className="flex gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${i === step ? 'bg-[#1A1A1A] w-8' : 'bg-gray-300'
                    }`}
                />
              ))}
            </div>
            {step > 1 && step < 4 && (
              <button
                onClick={() => setStep(step - 1)}
                className="text-gray-600 hover:text-[#1A1A1A] text-sm font-medium transition-colors"
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>

      <PublishModal
        isOpen={showPublishModal}
        onClose={() => setShowPublishModal(false)}
        onPublish={handlePublish}
        post={generatedPost}
        brandName={brandData.name}
        brandId={brand?.id}
        contentItemId={contentItem?.id}
        mediaType={
          selectedVideo ? 'video' :
            selectedImage ? 'image' :
              'none'
        }
        mediaUrls={
          selectedVideo ? [selectedVideo.thumbnailPlaceholder] : // For video, we might want the script ID or similar, but sending thumbnail for now as placeholder
            selectedImage ? [selectedImage.url] :
              []
        }
      />

      {/* Image Preview Modal */}
      {showImagePreview && selectedImage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Image Preview</h3>
              <button
                onClick={() => setShowImagePreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6">
              <img
                src={selectedImage.url}
                alt={selectedImage.variation}
                className="w-full rounded-lg mb-4"
              />
              <div className="space-y-2 mb-6">
                <p className="text-sm font-medium text-gray-700">Variation: <span className="capitalize text-[#1A1A1A]">{selectedImage.variation}</span></p>
                <p className="text-sm text-gray-600">{selectedImage.prompt}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowImagePreview(false)}
                  className="flex-1 bg-gray-100 text-[#1A1A1A] py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAttachImage(selectedImage)}
                  disabled={isSaving}
                  className="flex-1 bg-[#1A1A1A] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Attaching...</span>
                    </>
                  ) : (
                    <>
                      <span>Attach to Post</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Preview Modal */}
      {showVideoPreview && selectedVideo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full my-8">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-[#1A1A1A]">Video Script Preview</h3>
              <button
                onClick={() => setShowVideoPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <div className="p-6 space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <div>
                <img
                  src={selectedVideo.thumbnailPlaceholder}
                  alt="Video thumbnail"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <h4 className="text-xl font-semibold text-[#1A1A1A] mb-2">{selectedVideo.title}</h4>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                  <span>{selectedVideo.scenes.length} scenes</span>
                  <span>•</span>
                  <span>{selectedVideo.metadata.duration}</span>
                  <span>•</span>
                  <span className="capitalize">{selectedVideo.metadata.style}</span>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-[#1A1A1A] mb-3">Script</h5>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{selectedVideo.script}</p>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-[#1A1A1A] mb-3">Scenes</h5>
                <div className="space-y-3">
                  {selectedVideo.scenes.map((scene) => (
                    <div key={scene.sceneNumber} className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-blue-900">Scene {scene.sceneNumber}</span>
                        <span className="text-xs text-blue-700">{scene.duration}</span>
                      </div>
                      <p className="text-sm text-gray-800 mb-2">{scene.description}</p>
                      {scene.dialogue && (
                        <p className="text-sm text-gray-700 italic mb-2">"{scene.dialogue}"</p>
                      )}
                      {scene.visualCues.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {scene.visualCues.map((cue, idx) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {cue}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-[#1A1A1A] mb-3">Storyboard</h5>
                <div className="grid grid-cols-2 gap-3">
                  {selectedVideo.storyboard.map((frame) => (
                    <div key={frame.frameNumber} className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-purple-900">Frame {frame.frameNumber}</span>
                        {frame.cameraAngle && (
                          <span className="text-xs text-purple-700">{frame.cameraAngle}</span>
                        )}
                      </div>
                      <p className="text-xs text-gray-800 mb-2">{frame.description}</p>
                      {frame.visualElements.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {frame.visualElements.map((element, idx) => (
                            <span key={idx} className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded">
                              {element}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowVideoPreview(false)}
                  className="flex-1 bg-gray-100 text-[#1A1A1A] py-2.5 px-4 rounded-lg font-medium hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAttachVideo(selectedVideo)}
                  disabled={isSaving}
                  className="flex-1 bg-[#1A1A1A] text-white py-2.5 px-4 rounded-lg font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Attaching...</span>
                    </>
                  ) : (
                    <>
                      <span>Attach to Post</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
