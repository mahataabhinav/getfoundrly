import { X, Building2, MessageSquare, FileText, Package, Users, Award, Palette, Search, TrendingUp, Shield, CheckCircle2, AlertCircle, Clock, Image as ImageIcon, Video, BarChart3 } from 'lucide-react';
import type { BrandDNA } from '../../types/database';
import BrandDNAConfidenceBadge from './BrandDNAConfidenceBadge';

interface BrandDNAPreviewProps {
  brandDNA: BrandDNA;
  onClose?: () => void;
  onViewFull?: () => void;
  compact?: boolean;
}

export default function BrandDNAPreview({ 
  brandDNA, 
  onClose, 
  onViewFull,
  compact = false 
}: BrandDNAPreviewProps) {
  const dnaData = brandDNA.dna_data;

  const renderSection = (title: string, icon: any, content: React.ReactNode) => {
    const Icon = icon;
    return (
      <div className="border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Icon className="w-5 h-5 text-gray-700" />
          </div>
          <h3 className="text-lg font-semibold text-[#1A1A1A]">{title}</h3>
        </div>
        {content}
      </div>
    );
  };

  const renderField = (label: string, value: any, fieldPath: string) => {
    if (!value || (Array.isArray(value) && value.length === 0) || 
        (typeof value === 'object' && Object.keys(value).length === 0)) {
      return null;
    }

    const provenance = brandDNA.provenance.find(p => p.field === fieldPath);
    
    return (
      <div className="mb-4 last:mb-0">
        <div className="flex items-start justify-between mb-1">
          <label className="text-sm font-medium text-gray-700">{label}</label>
          {provenance && (
            <BrandDNAConfidenceBadge 
              trustScore={provenance.trust_score} 
              extractionMethod={provenance.extraction_method}
            />
          )}
        </div>
        <div className="text-[#1A1A1A]">
          {Array.isArray(value) ? (
            <div className="flex flex-wrap gap-2">
              {value.map((item, idx) => (
                <span key={idx} className="px-3 py-1 bg-gray-100 rounded-lg text-sm">
                  {typeof item === 'object' ? JSON.stringify(item) : String(item)}
                </span>
              ))}
            </div>
          ) : typeof value === 'object' ? (
            <pre className="text-sm bg-gray-50 p-3 rounded-lg overflow-x-auto">
              {JSON.stringify(value, null, 2)}
            </pre>
          ) : (
            <span>{String(value)}</span>
          )}
        </div>
      </div>
    );
  };

  const renderImages = () => {
    const images = dnaData.visual_identity?.example_imagery || [];
    if (images.length === 0) return null;

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {images.slice(0, 6).map((url, idx) => (
          <div key={idx} className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
            <img 
              src={url} 
              alt={`Brand image ${idx + 1}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        ))}
      </div>
    );
  };

  const renderVideos = () => {
    // Videos would be stored in metadata or a separate field
    // For now, we'll check if there are any video URLs in the data
    return null; // Can be enhanced later
  };

  return (
    <div className={compact ? '' : 'p-6'}>
      {/* Status Info - show in compact mode too */}
      <div className={`flex items-center gap-4 text-sm text-gray-600 mb-6 ${compact ? 'pb-4 border-b border-gray-200' : ''}`}>
        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
          brandDNA.status === 'complete' && brandDNA.completion_score >= 70
            ? 'bg-green-100 text-green-700'
            : brandDNA.status === 'needs_review'
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-blue-100 text-blue-700'
        }`}>
          {brandDNA.status === 'complete' && brandDNA.completion_score >= 70 ? (
            <CheckCircle2 className="w-3 h-3" />
          ) : brandDNA.status === 'needs_review' ? (
            <AlertCircle className="w-3 h-3" />
          ) : (
            <Clock className="w-3 h-3" />
          )}
          {brandDNA.status}
        </span>
        <span>•</span>
        <span>{brandDNA.completion_score}% complete</span>
        {brandDNA.last_crawled_at && (
          <>
            <span>•</span>
            <span>Last crawled: {new Date(brandDNA.last_crawled_at).toLocaleDateString()}</span>
          </>
        )}
      </div>

      {/* Content Sections */}
      <div className="space-y-6">
        {/* Identity Section */}
        {dnaData.identity && (
          renderSection('Identity', Building2, (
            <div className="space-y-3">
              {renderField('Official Name', dnaData.identity.official_name, 'identity.official_name')}
              {renderField('Tagline', dnaData.identity.tagline, 'identity.tagline')}
              {renderField('Elevator Pitch', dnaData.identity.elevator_pitch, 'identity.elevator_pitch')}
              {renderField('Year Founded', dnaData.identity.year_founded, 'identity.year_founded')}
              {renderField('Headquarters', dnaData.identity.headquarters, 'identity.headquarters')}
              {renderField('Company Size', dnaData.identity.company_size, 'identity.company_size')}
              {dnaData.identity.social_links && Object.keys(dnaData.identity.social_links).length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Social Links</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(dnaData.identity.social_links).map(([platform, url]) => (
                      url && (
                        <a 
                          key={platform}
                          href={url as string}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm hover:bg-blue-100 transition-colors"
                        >
                          {platform}
                        </a>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Voice Section */}
        {dnaData.voice && (
          renderSection('Voice & Tone', MessageSquare, (
            <div className="space-y-3">
              {renderField('Tone Descriptors', dnaData.voice.tone_descriptors, 'voice.tone_descriptors')}
              {renderField('Tone Intensity', dnaData.voice.tone_intensity, 'voice.tone_intensity')}
              {dnaData.voice.examples && (
                <>
                  {renderField('Micro Hook Example', dnaData.voice.examples.micro_hook, 'voice.examples.micro_hook')}
                  {renderField('Short Post Example', dnaData.voice.examples.short_post, 'voice.examples.short_post')}
                </>
              )}
              {renderField('Preferred Emojis', dnaData.voice.preferred_emojis, 'voice.preferred_emojis')}
              {renderField('Forbidden Words', dnaData.voice.forbidden_words, 'voice.forbidden_words')}
            </div>
          ))
        )}

        {/* Messaging Section */}
        {dnaData.messaging && (
          renderSection('Messaging', FileText, (
            <div className="space-y-3">
              {dnaData.messaging.value_props && dnaData.messaging.value_props.length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Value Propositions</label>
                  <div className="space-y-2">
                    {dnaData.messaging.value_props.map((prop, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-[#1A1A1A] mb-1">{prop.text}</p>
                        {prop.proof && (
                          <p className="text-xs text-gray-600">Proof: {prop.proof}</p>
                        )}
                        {prop.source && (
                          <a href={prop.source} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                            Source
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {renderField('Pillars', dnaData.messaging.pillars, 'messaging.pillars')}
              {renderField('Target Problems', dnaData.messaging.target_problems, 'messaging.target_problems')}
            </div>
          ))
        )}

        {/* Products Section */}
        {dnaData.products && dnaData.products.length > 0 && (
          renderSection('Products', Package, (
            <div className="space-y-4">
              {dnaData.products.map((product, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-[#1A1A1A] mb-2">{product.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  {product.pricing_model && (
                    <span className="inline-block px-2 py-1 bg-white rounded text-xs text-gray-700 mb-2">
                      {product.pricing_model}
                    </span>
                  )}
                  {product.differentiators && product.differentiators.length > 0 && (
                    <div className="mt-2">
                      <p className="text-xs font-medium text-gray-700 mb-1">Differentiators:</p>
                      <div className="flex flex-wrap gap-1">
                        {product.differentiators.map((diff, diffIdx) => (
                          <span key={diffIdx} className="px-2 py-0.5 bg-white rounded text-xs text-gray-600">
                            {diff}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}

        {/* Visual Identity Section */}
        {dnaData.visual_identity && (
          renderSection('Visual Identity', Palette, (
            <div className="space-y-4">
              {dnaData.visual_identity.color_palette && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Color Palette</label>
                  {dnaData.visual_identity.color_palette.hex_codes && (
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(dnaData.visual_identity.color_palette.hex_codes).map(([name, color]) => (
                        <div key={name} className="flex items-center gap-2">
                          <div 
                            className="w-12 h-12 rounded-lg border border-gray-200 shadow-sm"
                            style={{ backgroundColor: color as string }}
                          />
                          <span className="text-xs text-gray-600">{name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {renderField('Typography', dnaData.visual_identity.typography?.font_families, 'visual_identity.typography.font_families')}
              {renderImages()}
            </div>
          ))
        )}

        {/* Audience Section */}
        {dnaData.audience && (
          renderSection('Audience', Users, (
            <div className="space-y-4">
              {renderField('Primary Segments', dnaData.audience.primary_segments, 'audience.primary_segments')}
              {dnaData.audience.personas && dnaData.audience.personas.length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Personas</label>
                  <div className="space-y-3">
                    {dnaData.audience.personas.map((persona, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg">
                        <h4 className="font-semibold text-[#1A1A1A] mb-2">{persona.name} - {persona.role}</h4>
                        {renderField('Pain Points', persona.pain_points, `audience.personas.${idx}.pain_points`)}
                        {renderField('Goals', persona.goals, `audience.personas.${idx}.goals`)}
                        {renderField('Channels', persona.channels, `audience.personas.${idx}.channels`)}
                        {renderField('Preferred Messaging', persona.preferred_messaging, `audience.personas.${idx}.preferred_messaging`)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Proof Section */}
        {dnaData.proof && (
          renderSection('Proof', Award, (
            <div className="space-y-4">
              {dnaData.proof.metrics && dnaData.proof.metrics.length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Metrics</label>
                  <div className="grid grid-cols-2 gap-3">
                    {dnaData.proof.metrics.map((metric, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs text-gray-600">{metric.label}</p>
                        <p className="text-lg font-semibold text-[#1A1A1A]">{metric.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {dnaData.proof.testimonials && dnaData.proof.testimonials.length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Testimonials</label>
                  <div className="space-y-2">
                    {dnaData.proof.testimonials.slice(0, 3).map((testimonial, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-[#1A1A1A] italic mb-1">"{testimonial.quote}"</p>
                        <p className="text-xs text-gray-600">— {testimonial.attribution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {dnaData.proof.case_studies && dnaData.proof.case_studies.length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Case Studies</label>
                  <div className="space-y-2">
                    {dnaData.proof.case_studies.slice(0, 2).map((caseStudy, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-700 mb-1">Problem:</p>
                        <p className="text-sm text-[#1A1A1A] mb-2">{caseStudy.problem}</p>
                        <p className="text-xs font-medium text-gray-700 mb-1">Solution:</p>
                        <p className="text-sm text-[#1A1A1A] mb-2">{caseStudy.solution}</p>
                        <p className="text-xs font-medium text-gray-700 mb-1">Result:</p>
                        <p className="text-sm text-[#1A1A1A]">{caseStudy.result}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Creative Guidelines Section */}
        {dnaData.creative_guidelines && (
          renderSection('Creative Guidelines', FileText, (
            <div className="space-y-3">
              {renderField('Post Length Preferences', dnaData.creative_guidelines.post_length_preferences, 'creative_guidelines.post_length_preferences')}
              {renderField('Preferred Formats', dnaData.creative_guidelines.preferred_formats, 'creative_guidelines.preferred_formats')}
              {renderField('CTA Style', dnaData.creative_guidelines.cta_style, 'creative_guidelines.cta_style')}
              {dnaData.creative_guidelines.hashtag_strategy && (
                <>
                  {renderField('Branded Hashtags', dnaData.creative_guidelines.hashtag_strategy.branded_hashtags, 'creative_guidelines.hashtag_strategy.branded_hashtags')}
                  {renderField('Banned Hashtags', dnaData.creative_guidelines.hashtag_strategy.banned_hashtags, 'creative_guidelines.hashtag_strategy.banned_hashtags')}
                </>
              )}
            </div>
          ))
        )}

        {/* SEO Section */}
        {dnaData.seo && (
          renderSection('SEO', Search, (
            <div className="space-y-3">
              {renderField('Top Keywords', dnaData.seo.top_keywords, 'seo.top_keywords')}
              {renderField('Semantic Clusters', dnaData.seo.semantic_clusters, 'seo.semantic_clusters')}
              {renderField('Negative Keywords', dnaData.seo.negative_keywords, 'seo.negative_keywords')}
              {dnaData.seo.suggested_hashtags && Object.keys(dnaData.seo.suggested_hashtags).length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Suggested Hashtags</label>
                  <div className="space-y-2">
                    {Object.entries(dnaData.seo.suggested_hashtags).slice(0, 5).map(([keyword, hashtags]) => (
                      <div key={keyword} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-xs font-medium text-gray-700 mb-1">{keyword}</p>
                        <div className="flex flex-wrap gap-1">
                          {(hashtags as string[]).map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 bg-white rounded text-xs text-gray-700">{tag}</span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* Competitive Section */}
        {dnaData.competitive && (
          renderSection('Competitive', TrendingUp, (
            <div className="space-y-3">
              {dnaData.competitive.top_competitors && dnaData.competitive.top_competitors.length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Top Competitors</label>
                  <div className="space-y-2">
                    {dnaData.competitive.top_competitors.map((competitor, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm font-medium text-[#1A1A1A] mb-1">{competitor.name}</p>
                        {competitor.differentiation && (
                          <p className="text-xs text-gray-600">{competitor.differentiation}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {renderField('Market Trends', dnaData.competitive.market_trends, 'competitive.market_trends')}
              {renderField('Positioning Statement', dnaData.competitive.positioning_statement, 'competitive.positioning_statement')}
            </div>
          ))
        )}

        {/* Compliance Section */}
        {dnaData.compliance && (
          renderSection('Compliance', Shield, (
            <div className="space-y-3">
              {renderField('Allowed Claims', dnaData.compliance.allowed_claims, 'compliance.allowed_claims')}
              {renderField('Restricted Claims', dnaData.compliance.restricted_claims, 'compliance.restricted_claims')}
              {renderField('Required Disclaimers', dnaData.compliance.required_disclaimers, 'compliance.required_disclaimers')}
              {renderField('IP/Trademark Notes', dnaData.compliance.ip_trademark_notes, 'compliance.ip_trademark_notes')}
            </div>
          ))
        )}

        {/* Interaction History Section */}
        {dnaData.interaction_history && (
          renderSection('Interaction History', BarChart3, (
            <div className="space-y-3">
              {dnaData.interaction_history.post_performance && dnaData.interaction_history.post_performance.length > 0 && (
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Post Performance</label>
                  <div className="space-y-2">
                    {dnaData.interaction_history.post_performance.slice(0, 3).map((perf, idx) => (
                      <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700">{perf.platform}</span>
                          <span className="text-xs text-gray-500">{new Date(perf.date).toLocaleDateString()}</span>
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {Object.entries(perf.metrics).map(([metric, value]) => (
                            <div key={metric} className="text-center">
                              <p className="text-xs text-gray-600">{metric}</p>
                              <p className="text-sm font-semibold text-[#1A1A1A]">{String(value)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {renderField('Favorite Post Styles', dnaData.interaction_history.favorite_post_styles, 'interaction_history.favorite_post_styles')}
              {dnaData.interaction_history.content_calendar_preferences && (
                <>
                  {renderField('Cadence', dnaData.interaction_history.content_calendar_preferences.cadence, 'interaction_history.content_calendar_preferences.cadence')}
                  {renderField('Best Days', dnaData.interaction_history.content_calendar_preferences.best_days, 'interaction_history.content_calendar_preferences.best_days')}
                  {renderField('Best Times', dnaData.interaction_history.content_calendar_preferences.best_times, 'interaction_history.content_calendar_preferences.best_times')}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Footer Actions */}
      {onViewFull && (
        <div className="mt-6 pt-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={onViewFull}
            className="px-6 py-2 bg-[#1A1A1A] text-white rounded-xl font-medium hover:bg-gray-800 transition-all"
          >
            View Full Profile
          </button>
        </div>
      )}
    </div>
  );
}

