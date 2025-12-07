import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { completeLinkedInOAuth } from '../lib/linkedin-oauth';

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const error = searchParams.get('error');

      if (error) {
        console.error('OAuth error:', error);
        const errorDescription = searchParams.get('error_description') || error;
        
        // Handle redirect_uri mismatch specifically
        if (errorDescription.includes('redirect_uri') || errorDescription.includes('redirect')) {
          const currentOrigin = window.location.origin;
          const expectedUri = `${currentOrigin}/auth/linkedin/callback`;
          navigate(`/dashboard?error=redirect_uri_mismatch&expected=${encodeURIComponent(expectedUri)}`);
        } else if (errorDescription.includes('Scope') || errorDescription.includes('scope') || errorDescription.includes('not authorized')) {
          // Handle scope authorization errors
          navigate(`/dashboard?error=scope_not_authorized&details=${encodeURIComponent(errorDescription)}`);
        } else {
          navigate(`/dashboard?error=oauth_failed&details=${encodeURIComponent(errorDescription)}`);
        }
        return;
      }

      if (code) {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            navigate('/login');
            return;
          }

          // Get brandId from sessionStorage (set before OAuth redirect)
          const brandId = sessionStorage.getItem('linkedin_brand_id');
          if (!brandId) {
            navigate('/dashboard?error=no_brand');
            return;
          }

          await completeLinkedInOAuth(code, user.id, brandId);
          
          // Check if modal should be reopened after OAuth
          const shouldReopenModal = sessionStorage.getItem('linkedin_modal_should_reopen');
          const autoPublish = sessionStorage.getItem('linkedin_auto_publish');
          const contentItemId = sessionStorage.getItem('linkedin_content_item_id');
          
          // Clear sessionStorage items (but keep content_item_id for now if reopening modal)
          sessionStorage.removeItem('linkedin_brand_id');
          sessionStorage.removeItem('linkedin_modal_should_reopen');
          sessionStorage.removeItem('linkedin_auto_publish');
          sessionStorage.removeItem('linkedin_redirect_uri'); // Clear redirect URI after successful OAuth
          
          // Redirect to dashboard with success message
          if (shouldReopenModal === 'true' && contentItemId) {
            // Build redirect URL with params
            const params = new URLSearchParams({
              linkedin_connected: 'true',
              reopen_modal: 'true',
              content_item_id: contentItemId,
            });
            
            // Add auto_publish param if flag is set
            if (autoPublish === 'true') {
              params.set('auto_publish', 'true');
            }
            
            navigate(`/dashboard?${params.toString()}`);
          } else {
            // Standard redirect without modal reopening
            navigate('/dashboard?linkedin_connected=true');
          }
        } catch (error: any) {
          console.error('Error completing OAuth:', error);
          
          // Extract error message
          let errorMessage = 'Unknown error';
          if (error?.message) {
            errorMessage = error.message;
          } else if (typeof error === 'string') {
            errorMessage = error;
          } else if (error?.error_description) {
            errorMessage = error.error_description;
          }
          
          // Navigate with detailed error
          navigate(`/dashboard?error=oauth_failed&details=${encodeURIComponent(errorMessage)}`);
        }
      } else {
        // No code, redirect to dashboard
        navigate('/dashboard');
      }
    };

    handleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600">Connecting LinkedIn...</p>
      </div>
    </div>
  );
}

