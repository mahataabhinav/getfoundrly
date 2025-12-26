import { useState, useEffect, useRef } from 'react';
import { Plus, Globe, CheckCircle2, AlertCircle, Clock, TrendingUp, MoreVertical, Eye, Trash2, X } from 'lucide-react';
import { getBrandDNAList, deleteBrand } from '../../lib/database';
import { supabase } from '../../lib/supabase';
import type { BrandDNA } from '../../types/database';

interface BrandDNAProfileListProps {
  onSelectProfile: (brandId: string) => void;
  onCreateNew: () => void;
}

export default function BrandDNAProfileList({
  onSelectProfile,
  onCreateNew
}: BrandDNAProfileListProps) {
  const [profiles, setProfiles] = useState<(BrandDNA & { brands?: { name: string; website_url: string } })[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const menuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const loadProfiles = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);
      const brandDNAList = await getBrandDNAList(user.id);
      setProfiles(brandDNAList as any);
    } catch (error) {
      console.error('Error loading BrandDNA profiles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfiles();
  }, []);

  // Refresh when component becomes visible (e.g., switching to BrandDNA tab)
  useEffect(() => {
    const handleFocus = () => {
      loadProfiles();
    };
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openMenuId) {
        const menuElement = menuRefs.current[openMenuId];
        if (menuElement && !menuElement.contains(event.target as Node)) {
          setOpenMenuId(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenuId]);

  const handleDelete = async (brandId: string) => {
    try {
      setDeleting(true);
      await deleteBrand(brandId);
      setDeleteConfirmId(null);
      setOpenMenuId(null);
      // Reload profiles
      await loadProfiles();
    } catch (error) {
      console.error('Error deleting brand:', error);
      alert('Failed to delete brand profile. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status: string, completionScore: number) => {
    if (status === 'complete' && completionScore >= 70) {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
          <CheckCircle2 className="w-3 h-3" />
          Complete
        </span>
      );
    }
    if (status === 'needs_review') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
          <AlertCircle className="w-3 h-3" />
          Needs Review
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
        <Clock className="w-3 h-3" />
        In Progress
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-zinc-500">Loading BrandDNA profiles...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">BrandDNA Profiles</h2>
          <p className="text-zinc-400 mt-1">Manage your brand knowledge base</p>
        </div>
        <button
          onClick={onCreateNew}
          className="flex items-center gap-2 px-4 py-2 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-all"
        >
          <Plus className="w-5 h-5" />
          Create New
        </button>
      </div>

      {profiles.length === 0 ? (
        <div className="bg-[#18181B] rounded-2xl border border-white/5 p-12 text-center">
          <Globe className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No BrandDNA profiles yet</h3>
          <p className="text-zinc-400 mb-6">Create your first BrandDNA profile to get started</p>
          <button
            onClick={onCreateNew}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-all"
          >
            <Plus className="w-5 h-5" />
            Create BrandDNA Profile
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {profiles.map((profile) => {
            // Handle both join formats: brands (array) or brands (object)
            const brandsData = (profile as any).brands;
            const brandName = Array.isArray(brandsData)
              ? (brandsData[0]?.name || 'Unknown Brand')
              : (brandsData?.name || 'Unknown Brand');
            const websiteUrl = Array.isArray(brandsData)
              ? (brandsData[0]?.website_url || '')
              : (brandsData?.website_url || '');

            return (
              <div
                key={profile.id}
                className="bg-[#18181B] rounded-2xl border border-white/5 p-6 hover:border-white/10 hover:shadow-lg transition-all group relative"
              >
                {/* Three-dot menu */}
                <div className="absolute top-4 right-4" ref={(el) => { menuRefs.current[profile.id] = el; }}>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenuId(openMenuId === profile.id ? null : profile.id);
                    }}
                    className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-zinc-500" />
                  </button>

                  {/* Dropdown menu */}
                  {openMenuId === profile.id && (
                    <div className="absolute right-0 top-10 bg-[#18181B] rounded-xl border border-white/10 shadow-lg z-50 min-w-[160px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          onSelectProfile(profile.brand_id);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 transition-colors first:rounded-t-xl"
                      >
                        <Eye className="w-4 h-4" />
                        View Profile
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenMenuId(null);
                          setDeleteConfirmId(profile.brand_id);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-colors last:rounded-b-xl"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {/* Card content */}
                <button
                  onClick={() => onSelectProfile(profile.brand_id)}
                  className="w-full text-left"
                >
                  <div className="flex items-start justify-between mb-4 pr-8">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-white truncate group-hover:text-[#CCFF00] transition-colors">
                        {brandName}
                      </h3>
                      {websiteUrl && (
                        <div className="flex items-center gap-1 mt-1 text-sm text-zinc-400">
                          <Globe className="w-3 h-3" />
                          <span className="truncate">{websiteUrl}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3">
                    {getStatusBadge(profile.status, profile.completion_score)}

                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-zinc-400">
                        <TrendingUp className="w-4 h-4" />
                        <span>{profile.completion_score}% complete</span>
                      </div>
                      <span className="text-zinc-500 text-xs">
                        {new Date(profile.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-[#18181B] rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl border border-white/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Delete Brand Profile</h3>
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="p-1 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>
            <p className="text-zinc-400 mb-6">
              Are you sure you want to delete this brand profile? This will permanently delete the brand and all associated BrandDNA data. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2 bg-white/5 text-white rounded-xl font-medium hover:bg-white/10 transition-all border border-white/5"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

