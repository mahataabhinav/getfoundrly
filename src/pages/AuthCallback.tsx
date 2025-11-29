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
        navigate('/dashboard?error=oauth_failed');
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
          
          // Clear sessionStorage
          sessionStorage.removeItem('linkedin_brand_id');
          
          // Redirect to dashboard with success message
          navigate('/dashboard?linkedin_connected=true');
        } catch (error) {
          console.error('Error completing OAuth:', error);
          navigate('/dashboard?error=oauth_failed');
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

