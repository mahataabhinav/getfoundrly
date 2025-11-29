import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import HeaderEnhanced from './components/HeaderEnhanced';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import ProductOverview from './pages/product/ProductOverview';
import LinkedInPage from './pages/product/create/LinkedInPage';
import PricingPage from './pages/PricingPage';
import SMBPage from './pages/solutions/SMBPage';
import ResourcesHub from './pages/resources/ResourcesHub';
import FAQPage from './pages/resources/FAQPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AuthCallback from './pages/AuthCallback';
import { supabase } from './lib/supabase';

function AppContent() {
  const [scrollY, setScrollY] = useState(0);
  const [initializing, setInitializing] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
      if (session && location.pathname === '/login') {
        navigate('/dashboard');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, location.pathname]);

  const checkAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      if (session && location.pathname === '/') {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setInitializing(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsAuthenticated(false);
    navigate('/login');
  };

  if (initializing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const isDashboard = location.pathname === '/dashboard';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-white text-gray-900 overflow-x-hidden">
      {!isDashboard && !isAuthPage && (
        <HeaderEnhanced
          scrollY={scrollY}
          onLoginClick={() => navigate('/login')}
          onSignupClick={() => navigate('/signup')}
        />
      )}

      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={
          <AuthPage
            initialMode="login"
            onBack={() => navigate('/')}
            onSuccess={() => navigate('/dashboard')}
          />
        } />
        <Route path="/signup" element={
          <AuthPage
            initialMode="signup"
            onBack={() => navigate('/')}
            onSuccess={() => navigate('/dashboard')}
          />
        } />
        <Route path="/dashboard" element={
          isAuthenticated ? (
            <Dashboard onLogout={handleLogout} />
          ) : (
            <AuthPage
              initialMode="login"
              onBack={() => navigate('/')}
              onSuccess={() => navigate('/dashboard')}
            />
          )
        } />
        <Route path="/product" element={<ProductOverview />} />
        <Route path="/product/create/linkedin" element={<LinkedInPage />} />
        <Route path="/product/create/*" element={<LinkedInPage />} />
        <Route path="/product/analyze/*" element={<ProductOverview />} />
        <Route path="/product/grow/*" element={<ProductOverview />} />
        <Route path="/solutions/smb" element={<SMBPage />} />
        <Route path="/solutions/business-owners" element={<SMBPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/resources" element={<ResourcesHub />} />
        <Route path="/resources/faq" element={<FAQPage />} />
        <Route path="/resources/*" element={<ResourcesHub />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/careers" element={<AboutPage />} />
        <Route path="/auth/linkedin/callback" element={<AuthCallback />} />
      </Routes>

      {!isDashboard && !isAuthPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
