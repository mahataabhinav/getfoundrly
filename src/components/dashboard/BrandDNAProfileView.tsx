import { useState, useEffect } from 'react';
import { 
  ArrowLeft, Edit, RefreshCw, CheckCircle2, 
  User, Building2, MessageSquare, Package, 
  Users, Award, Palette, FileText, Search, 
  TrendingUp, Shield, BarChart3
} from 'lucide-react';
import { getBrandDNA } from '../../lib/database';
import { reCrawlBrandDNA, updateBrandDNAField } from '../../lib/brand-dna';
import BrandDNAConfidenceBadge from './BrandDNAConfidenceBadge';
import BrandDNAProvenance from './BrandDNAProvenance';
import BrandDNADiffView from './BrandDNADiffView';
import type { BrandDNA } from '../../types/database';

interface BrandDNAProfileViewProps {
  brandId: string;
  onBack: () => void;
  onEdit: () => void;
}

export default function BrandDNAProfileView({ 
  brandId, 
  onBack, 
  onEdit 
}: BrandDNAProfileViewProps) {
  const [brandDNA, setBrandDNA] = useState<BrandDNA | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('identity');
  const [isReCrawling, setIsReCrawling] = useState(false);
  const [diff, setDiff] = useState<Record<string, { old: any; new: any }> | null>(null);

  const tabs = [
    { id: 'identity', label: 'Identity', icon: Building2 },
    { id: 'voice', label: 'Voice & Tone', icon: MessageSquare },
    { id: 'messaging', label: 'Messaging', icon: FileText },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'audience', label: 'Audience', icon: Users },
    { id: 'proof', label: 'Proof', icon: Award },
    { id: 'visual', label: 'Visual Identity', icon: Palette },
    { id: 'creative', label: 'Creative Guidelines', icon: FileText },
    { id: 'seo', label: 'SEO', icon: Search },
    { id: 'competitive', label: 'Competitive', icon: TrendingUp },
    { id: 'compliance', label: 'Compliance', icon: Shield },
    { id: 'history', label: 'Interaction History', icon: BarChart3 },
  ];

  const loadBrandDNA = async () => {
    try {
      setLoading(true);
      const data = await getBrandDNA(brandId);
      setBrandDNA(data);
    } catch (error) {
      console.error('Error loading BrandDNA:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReCrawl = async () => {
    try {
      setIsReCrawling(true);
      const result = await reCrawlBrandDNA(brandId);
      setBrandDNA(result.brandDNA);
      setDiff(result.diff);
      setActiveTab('diff'); // Show diff view
    } catch (error) {
      console.error('Error re-crawling:', error);
      alert('Failed to re-crawl. Please try again.');
    } finally {
      setIsReCrawling(false);
    }
  };

  useEffect(() => {
    loadBrandDNA();
  }, [brandId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1A1A1A]"></div>
      </div>
    );
  }

  if (!brandDNA) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">BrandDNA not found</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:text-blue-700">
          Go back
        </button>
      </div>
    );
  }

  const renderTabContent = () => {
    const dnaData = brandDNA.dna_data;
    
    switch (activeTab) {
      case 'identity':
        return (
          <div className="space-y-4">
            <SectionField label="Official Name" value={dnaData.identity?.official_name} fieldPath="identity.official_name" brandDNA={brandDNA} />
            <SectionField label="Tagline" value={dnaData.identity?.tagline} fieldPath="identity.tagline" brandDNA={brandDNA} />
            <SectionField label="Elevator Pitch" value={dnaData.identity?.elevator_pitch} fieldPath="identity.elevator_pitch" brandDNA={brandDNA} />
            <SectionField label="Year Founded" value={dnaData.identity?.year_founded} fieldPath="identity.year_founded" brandDNA={brandDNA} />
            <SectionField label="Headquarters" value={dnaData.identity?.headquarters} fieldPath="identity.headquarters" brandDNA={brandDNA} />
          </div>
        );
      case 'voice':
        return (
          <div className="space-y-4">
            <SectionField label="Tone Descriptors" value={dnaData.voice?.tone_descriptors?.join(', ')} fieldPath="voice.tone_descriptors" brandDNA={brandDNA} />
            <SectionField label="Tone Intensity" value={dnaData.voice?.tone_intensity} fieldPath="voice.tone_intensity" brandDNA={brandDNA} />
            <SectionField label="Micro Hook Example" value={dnaData.voice?.examples?.micro_hook} fieldPath="voice.examples.micro_hook" brandDNA={brandDNA} />
            <SectionField label="Short Post Example" value={dnaData.voice?.examples?.short_post} fieldPath="voice.examples.short_post" brandDNA={brandDNA} />
            <SectionField label="Preferred Emojis" value={dnaData.voice?.preferred_emojis?.join(', ')} fieldPath="voice.preferred_emojis" brandDNA={brandDNA} />
            <SectionField label="Forbidden Words" value={dnaData.voice?.forbidden_words?.join(', ')} fieldPath="voice.forbidden_words" brandDNA={brandDNA} />
            <SectionField label="Punctuation Rules" value={dnaData.voice?.punctuation_rules} fieldPath="voice.punctuation_rules" brandDNA={brandDNA} />
          </div>
        );
      case 'messaging':
        return (
          <div className="space-y-4">
            {dnaData.messaging?.value_props && dnaData.messaging.value_props.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">Value Propositions</label>
                {dnaData.messaging.value_props.map((prop, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <SectionField label="Value Prop" value={prop.text} fieldPath={`messaging.value_props.${idx}.text`} brandDNA={brandDNA} />
                    {prop.proof && <SectionField label="Proof" value={prop.proof} fieldPath={`messaging.value_props.${idx}.proof`} brandDNA={brandDNA} />}
                    {prop.source && <SectionField label="Source" value={prop.source} fieldPath={`messaging.value_props.${idx}.source`} brandDNA={brandDNA} />}
                  </div>
                ))}
              </div>
            )}
            <SectionField label="Pillars" value={dnaData.messaging?.pillars?.join(', ')} fieldPath="messaging.pillars" brandDNA={brandDNA} />
            <SectionField label="Target Problems" value={dnaData.messaging?.target_problems?.join(', ')} fieldPath="messaging.target_problems" brandDNA={brandDNA} />
            {dnaData.messaging?.elevator_benefits && Object.keys(dnaData.messaging.elevator_benefits).length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 block">Elevator Benefits</label>
                {Object.entries(dnaData.messaging.elevator_benefits).map(([audience, benefit]) => (
                  <SectionField key={audience} label={`${audience.charAt(0).toUpperCase() + audience.slice(1)}`} value={benefit} fieldPath={`messaging.elevator_benefits.${audience}`} brandDNA={brandDNA} />
                ))}
              </div>
            )}
          </div>
        );
      case 'products':
        return (
          <div className="space-y-4">
            {dnaData.products && dnaData.products.length > 0 ? (
              dnaData.products.map((product, idx) => (
                <div key={idx} className="border border-gray-200 rounded-lg p-4">
                  <SectionField label="Product Name" value={product.name} fieldPath={`products.${idx}.name`} brandDNA={brandDNA} />
                  <SectionField label="Description" value={product.description} fieldPath={`products.${idx}.description`} brandDNA={brandDNA} />
                  <SectionField label="Pricing Model" value={product.pricing_model} fieldPath={`products.${idx}.pricing_model`} brandDNA={brandDNA} />
                  <SectionField label="Differentiators" value={product.differentiators?.join(', ')} fieldPath={`products.${idx}.differentiators`} brandDNA={brandDNA} />
                  <SectionField label="Product URL" value={product.product_url} fieldPath={`products.${idx}.product_url`} brandDNA={brandDNA} />
                </div>
              ))
            ) : (
              <div className="text-gray-400 italic text-center py-8">No products found</div>
            )}
          </div>
        );
      case 'audience':
        return (
          <div className="space-y-4">
            <SectionField label="Primary Segments" value={dnaData.audience?.primary_segments?.join(', ')} fieldPath="audience.primary_segments" brandDNA={brandDNA} />
            {dnaData.audience?.personas && dnaData.audience.personas.length > 0 && (
              <div className="space-y-4">
                <label className="text-sm font-medium text-gray-700 block">Personas</label>
                {dnaData.audience.personas.map((persona, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <SectionField label="Name" value={persona.name} fieldPath={`audience.personas.${idx}.name`} brandDNA={brandDNA} />
                    <SectionField label="Role" value={persona.role} fieldPath={`audience.personas.${idx}.role`} brandDNA={brandDNA} />
                    <SectionField label="Pain Points" value={persona.pain_points?.join(', ')} fieldPath={`audience.personas.${idx}.pain_points`} brandDNA={brandDNA} />
                    <SectionField label="Goals" value={persona.goals?.join(', ')} fieldPath={`audience.personas.${idx}.goals`} brandDNA={brandDNA} />
                    <SectionField label="Channels" value={persona.channels?.join(', ')} fieldPath={`audience.personas.${idx}.channels`} brandDNA={brandDNA} />
                    <SectionField label="Preferred Messaging" value={persona.preferred_messaging} fieldPath={`audience.personas.${idx}.preferred_messaging`} brandDNA={brandDNA} />
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'proof':
        return (
          <div className="space-y-4">
            {dnaData.proof?.metrics && dnaData.proof.metrics.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">Metrics</label>
                <div className="grid grid-cols-2 gap-3">
                  {dnaData.proof.metrics.map((metric, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4">
                      <SectionField label={metric.label} value={metric.value} fieldPath={`proof.metrics.${idx}.value`} brandDNA={brandDNA} />
                      {metric.source_url && (
                        <a href={metric.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 block">
                          Source
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {dnaData.proof?.testimonials && dnaData.proof.testimonials.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">Testimonials</label>
                {dnaData.proof.testimonials.map((testimonial, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <SectionField label="Quote" value={testimonial.quote} fieldPath={`proof.testimonials.${idx}.quote`} brandDNA={brandDNA} />
                    <SectionField label="Attribution" value={testimonial.attribution} fieldPath={`proof.testimonials.${idx}.attribution`} brandDNA={brandDNA} />
                    {testimonial.source_url && (
                      <a href={testimonial.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 block">
                        Source
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
            {dnaData.proof?.case_studies && dnaData.proof.case_studies.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">Case Studies</label>
                {dnaData.proof.case_studies.map((caseStudy, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <SectionField label="Problem" value={caseStudy.problem} fieldPath={`proof.case_studies.${idx}.problem`} brandDNA={brandDNA} />
                    <SectionField label="Solution" value={caseStudy.solution} fieldPath={`proof.case_studies.${idx}.solution`} brandDNA={brandDNA} />
                    <SectionField label="Result" value={caseStudy.result} fieldPath={`proof.case_studies.${idx}.result`} brandDNA={brandDNA} />
                    {caseStudy.source_url && (
                      <a href={caseStudy.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 block">
                        Source
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
            {dnaData.proof?.press_mentions && dnaData.proof.press_mentions.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">Press Mentions</label>
                {dnaData.proof.press_mentions.map((mention, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <SectionField label="Title" value={mention.title} fieldPath={`proof.press_mentions.${idx}.title`} brandDNA={brandDNA} />
                    <SectionField label="Excerpt" value={mention.excerpt} fieldPath={`proof.press_mentions.${idx}.excerpt`} brandDNA={brandDNA} />
                    {mention.url && (
                      <a href={mention.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 block">
                        Read Article
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
            {dnaData.proof?.awards && dnaData.proof.awards.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">Awards</label>
                {dnaData.proof.awards.map((award, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <SectionField label="Award Name" value={award.name} fieldPath={`proof.awards.${idx}.name`} brandDNA={brandDNA} />
                    <SectionField label="Year" value={award.year?.toString()} fieldPath={`proof.awards.${idx}.year`} brandDNA={brandDNA} />
                    {award.url && (
                      <a href={award.url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline mt-2 block">
                        View Award
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
            {(!dnaData.proof || (!dnaData.proof.metrics?.length && !dnaData.proof.testimonials?.length && !dnaData.proof.case_studies?.length && !dnaData.proof.press_mentions?.length && !dnaData.proof.awards?.length)) && (
              <div className="text-gray-400 italic text-center py-8">No proof data found</div>
            )}
          </div>
        );
      case 'visual':
        return (
          <div className="space-y-4">
            {dnaData.visual_identity?.logos && dnaData.visual_identity.logos.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">Logos</label>
                <div className="grid grid-cols-3 gap-4">
                  {dnaData.visual_identity.logos.map((logo, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-4 text-center">
                      <img src={logo.url} alt={`Logo ${logo.variant}`} className="max-h-24 mx-auto mb-2" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      <p className="text-xs text-gray-600">{logo.variant} ({logo.format})</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {dnaData.visual_identity?.color_palette && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">Color Palette</label>
                {dnaData.visual_identity.color_palette.hex_codes && (
                  <div className="flex flex-wrap gap-4">
                    {Object.entries(dnaData.visual_identity.color_palette.hex_codes).map(([name, color]) => (
                      <div key={name} className="flex items-center gap-2">
                        <div className="w-16 h-16 rounded-lg border border-gray-200 shadow-sm" style={{ backgroundColor: color as string }} />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{name}</p>
                          <p className="text-xs text-gray-500">{color as string}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                {dnaData.visual_identity.color_palette.primary && (
                  <div className="mt-4">
                    <label className="text-xs font-medium text-gray-700 block mb-2">Primary Colors</label>
                    <div className="flex gap-2">
                      {dnaData.visual_identity.color_palette.primary.map((color, idx) => (
                        <div key={idx} className="w-12 h-12 rounded border border-gray-200" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                )}
                {dnaData.visual_identity.color_palette.secondary && (
                  <div className="mt-4">
                    <label className="text-xs font-medium text-gray-700 block mb-2">Secondary Colors</label>
                    <div className="flex gap-2">
                      {dnaData.visual_identity.color_palette.secondary.map((color, idx) => (
                        <div key={idx} className="w-12 h-12 rounded border border-gray-200" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
            <SectionField label="Typography" value={dnaData.visual_identity?.typography?.font_families?.join(', ')} fieldPath="visual_identity.typography.font_families" brandDNA={brandDNA} />
            <SectionField label="Font Substitutes" value={dnaData.visual_identity?.typography?.font_substitutes?.join(', ')} fieldPath="visual_identity.typography.font_substitutes" brandDNA={brandDNA} />
            {dnaData.visual_identity?.image_style_guide && (
              <div className="space-y-2">
                <SectionField label="Photography vs Illustration" value={dnaData.visual_identity.image_style_guide.photography_vs_illustration} fieldPath="visual_identity.image_style_guide.photography_vs_illustration" brandDNA={brandDNA} />
                <SectionField label="Mood" value={dnaData.visual_identity.image_style_guide.mood} fieldPath="visual_identity.image_style_guide.mood" brandDNA={brandDNA} />
                <SectionField label="Filters" value={dnaData.visual_identity.image_style_guide.filters} fieldPath="visual_identity.image_style_guide.filters" brandDNA={brandDNA} />
              </div>
            )}
            {dnaData.visual_identity?.example_imagery && dnaData.visual_identity.example_imagery.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">Example Imagery</label>
                <div className="grid grid-cols-3 gap-4">
                  {dnaData.visual_identity.example_imagery.slice(0, 9).map((url, idx) => (
                    <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                      <img src={url} alt={`Example ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                    </div>
                  ))}
                </div>
              </div>
            )}
            <SectionField label="Alt Text Guidelines" value={dnaData.visual_identity?.alt_text_guidelines} fieldPath="visual_identity.alt_text_guidelines" brandDNA={brandDNA} />
            <SectionField label="Default Alt Text Templates" value={dnaData.visual_identity?.default_alt_text_templates?.join(', ')} fieldPath="visual_identity.default_alt_text_templates" brandDNA={brandDNA} />
          </div>
        );
      case 'creative':
        return (
          <div className="space-y-4">
            <SectionField label="Post Length Preferences" value={dnaData.creative_guidelines?.post_length_preferences} fieldPath="creative_guidelines.post_length_preferences" brandDNA={brandDNA} />
            <SectionField label="Preferred Formats" value={dnaData.creative_guidelines?.preferred_formats?.join(', ')} fieldPath="creative_guidelines.preferred_formats" brandDNA={brandDNA} />
            <SectionField label="CTA Style" value={dnaData.creative_guidelines?.cta_style} fieldPath="creative_guidelines.cta_style" brandDNA={brandDNA} />
            <SectionField label="CTA Grammar Rules" value={dnaData.creative_guidelines?.cta_grammar_rules} fieldPath="creative_guidelines.cta_grammar_rules" brandDNA={brandDNA} />
            {dnaData.creative_guidelines?.hashtag_strategy && (
              <div className="space-y-2">
                <SectionField label="Branded Hashtags" value={dnaData.creative_guidelines.hashtag_strategy.branded_hashtags?.join(', ')} fieldPath="creative_guidelines.hashtag_strategy.branded_hashtags" brandDNA={brandDNA} />
                <SectionField label="Banned Hashtags" value={dnaData.creative_guidelines.hashtag_strategy.banned_hashtags?.join(', ')} fieldPath="creative_guidelines.hashtag_strategy.banned_hashtags" brandDNA={brandDNA} />
              </div>
            )}
            {dnaData.creative_guidelines?.accessibility_rules && (
              <div className="space-y-2">
                <SectionField label="Contrast Ratio" value={dnaData.creative_guidelines.accessibility_rules.contrast_ratio} fieldPath="creative_guidelines.accessibility_rules.contrast_ratio" brandDNA={brandDNA} />
                <SectionField label="Alt Text Required" value={dnaData.creative_guidelines.accessibility_rules.alt_text_required ? 'Yes' : 'No'} fieldPath="creative_guidelines.accessibility_rules.alt_text_required" brandDNA={brandDNA} />
              </div>
            )}
          </div>
        );
      case 'seo':
        return (
          <div className="space-y-4">
            <SectionField label="Top Keywords" value={dnaData.seo?.top_keywords?.join(', ')} fieldPath="seo.top_keywords" brandDNA={brandDNA} />
            <SectionField label="Semantic Clusters" value={dnaData.seo?.semantic_clusters?.join(', ')} fieldPath="seo.semantic_clusters" brandDNA={brandDNA} />
            <SectionField label="Negative Keywords" value={dnaData.seo?.negative_keywords?.join(', ')} fieldPath="seo.negative_keywords" brandDNA={brandDNA} />
            {dnaData.seo?.suggested_hashtags && Object.keys(dnaData.seo.suggested_hashtags).length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">Suggested Hashtags</label>
                {Object.entries(dnaData.seo.suggested_hashtags).map(([keyword, hashtags]) => (
                  <div key={keyword} className="border border-gray-200 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">{keyword}</p>
                    <div className="flex flex-wrap gap-2">
                      {hashtags.map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-700">{tag}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      case 'competitive':
        return (
          <div className="space-y-4">
            {dnaData.competitive?.top_competitors && dnaData.competitive.top_competitors.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">Top Competitors</label>
                {dnaData.competitive.top_competitors.map((competitor, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <SectionField label="Competitor Name" value={competitor.name} fieldPath={`competitive.top_competitors.${idx}.name`} brandDNA={brandDNA} />
                    <SectionField label="Differentiation" value={competitor.differentiation} fieldPath={`competitive.top_competitors.${idx}.differentiation`} brandDNA={brandDNA} />
                  </div>
                ))}
              </div>
            )}
            <SectionField label="Market Trends" value={dnaData.competitive?.market_trends?.join(', ')} fieldPath="competitive.market_trends" brandDNA={brandDNA} />
            <SectionField label="Positioning Statement" value={dnaData.competitive?.positioning_statement} fieldPath="competitive.positioning_statement" brandDNA={brandDNA} />
          </div>
        );
      case 'compliance':
        return (
          <div className="space-y-4">
            <SectionField label="Allowed Claims" value={dnaData.compliance?.allowed_claims?.join(', ')} fieldPath="compliance.allowed_claims" brandDNA={brandDNA} />
            <SectionField label="Restricted Claims" value={dnaData.compliance?.restricted_claims?.join(', ')} fieldPath="compliance.restricted_claims" brandDNA={brandDNA} />
            <SectionField label="Required Disclaimers" value={dnaData.compliance?.required_disclaimers?.join(', ')} fieldPath="compliance.required_disclaimers" brandDNA={brandDNA} />
            <SectionField label="IP/Trademark Notes" value={dnaData.compliance?.ip_trademark_notes} fieldPath="compliance.ip_trademark_notes" brandDNA={brandDNA} />
          </div>
        );
      case 'history':
        return (
          <div className="space-y-4">
            {dnaData.interaction_history?.post_performance && dnaData.interaction_history.post_performance.length > 0 && (
              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-700 block">Post Performance</label>
                {dnaData.interaction_history.post_performance.map((perf, idx) => (
                  <div key={idx} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">{perf.platform}</span>
                      <span className="text-xs text-gray-500">{new Date(perf.date).toLocaleDateString()}</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mt-2">
                      {Object.entries(perf.metrics).map(([metric, value]) => (
                        <div key={metric} className="text-center">
                          <p className="text-xs text-gray-600">{metric}</p>
                          <p className="text-sm font-semibold text-[#1A1A1A]">{value}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
            <SectionField label="Favorite Post Styles" value={dnaData.interaction_history?.favorite_post_styles?.join(', ')} fieldPath="interaction_history.favorite_post_styles" brandDNA={brandDNA} />
            {dnaData.interaction_history?.content_calendar_preferences && (
              <div className="space-y-2">
                <SectionField label="Cadence" value={dnaData.interaction_history.content_calendar_preferences.cadence} fieldPath="interaction_history.content_calendar_preferences.cadence" brandDNA={brandDNA} />
                <SectionField label="Best Days" value={dnaData.interaction_history.content_calendar_preferences.best_days?.join(', ')} fieldPath="interaction_history.content_calendar_preferences.best_days" brandDNA={brandDNA} />
                <SectionField label="Best Times" value={dnaData.interaction_history.content_calendar_preferences.best_times?.join(', ')} fieldPath="interaction_history.content_calendar_preferences.best_times" brandDNA={brandDNA} />
              </div>
            )}
            {(!dnaData.interaction_history || (!dnaData.interaction_history.post_performance?.length && !dnaData.interaction_history.favorite_post_styles?.length && !dnaData.interaction_history.content_calendar_preferences)) && (
              <div className="text-gray-400 italic text-center py-8">No interaction history data yet</div>
            )}
          </div>
        );
      default:
        return <div className="text-gray-600">Section content coming soon...</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-gray-600 hover:text-[#1A1A1A] transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Profiles
        </button>
        <div className="flex gap-2">
          <button
            onClick={handleReCrawl}
            disabled={isReCrawling}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-[#1A1A1A] rounded-xl font-medium hover:bg-gray-200 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isReCrawling ? 'animate-spin' : ''}`} />
            Re-crawl
          </button>
          <button
            onClick={onEdit}
            className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] text-white rounded-xl font-medium hover:bg-gray-800 transition-all"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-[#1A1A1A] mb-2">BrandDNA Profile</h2>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>Status: {brandDNA.status}</span>
            <span>•</span>
            <span>Completion: {brandDNA.completion_score}%</span>
            {brandDNA.last_crawled_at && (
              <>
                <span>•</span>
                <span>Last crawled: {new Date(brandDNA.last_crawled_at).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>

        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-[#1A1A1A] text-[#1A1A1A] font-medium'
                    : 'border-transparent text-gray-600 hover:text-[#1A1A1A]'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="p-6">
          {activeTab === 'diff' && diff ? (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Changes from Re-crawl</h3>
              {Object.entries(diff).map(([field, changes]) => (
                <BrandDNADiffView
                  key={field}
                  field={field}
                  oldValue={changes.old}
                  newValue={changes.new}
                  onAccept={async () => {
                    // Accept change
                    await updateBrandDNAField(brandId, field, changes.new);
                    await loadBrandDNA();
                    setDiff(null);
                  }}
                  onReject={() => {
                    // Reject change - remove from diff
                    const newDiff = { ...diff };
                    delete newDiff[field];
                    setDiff(Object.keys(newDiff).length > 0 ? newDiff : null);
                  }}
                />
              ))}
            </div>
          ) : (
            renderTabContent()
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for rendering section fields
function SectionField({ 
  label, 
  value, 
  fieldPath, 
  brandDNA 
}: { 
  label: string; 
  value: any; 
  fieldPath: string;
  brandDNA: BrandDNA;
}) {
  const provenance = brandDNA.provenance.find(p => p.field === fieldPath);
  
  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <div className="flex items-start justify-between mb-2">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {provenance && (
          <BrandDNAConfidenceBadge 
            trustScore={provenance.trust_score} 
            extractionMethod={provenance.extraction_method}
          />
        )}
      </div>
      <div className="text-[#1A1A1A] mb-2">
        {value || <span className="text-gray-400 italic">Not set</span>}
      </div>
      {provenance && (
        <BrandDNAProvenance provenance={provenance} compact />
      )}
    </div>
  );
}

