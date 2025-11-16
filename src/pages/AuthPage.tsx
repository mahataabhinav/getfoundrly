import { useState } from 'react';
import Logo from '../components/Logo';
import RobotChatbot from '../components/RobotChatbot';
import { supabase } from '../lib/supabase';

interface AuthPageProps {
  initialMode?: 'login' | 'signup';
  onBack: () => void;
  onSuccess: () => void;
}

export default function AuthPage({ initialMode = 'login', onBack, onSuccess }: AuthPageProps) {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              name: formData.name,
              display_name: formData.name,
              full_name: formData.name
            }
          }
        });

        if (signUpError) throw signUpError;

        if (data.user) {
          await supabase.auth.updateUser({
            data: {
              display_name: formData.name,
              full_name: formData.name
            }
          });
        }

        if (data.user && !data.session) {
          setMessage('Check your email to confirm your account.');
        } else if (data.session) {
          onSuccess();
        }
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password
        });

        if (signInError) throw signInError;
        onSuccess();
      }
    } catch (err: any) {
      if (mode === 'login') {
        setError('Invalid email or password');
      } else {
        setError(err.message || 'An error occurred during sign up');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (oauthError) throw oauthError;
    } catch (err: any) {
      setError(err.message || 'An error occurred with Google login');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/20 flex flex-col">
      <header className="px-6 py-6">
        <button onClick={onBack} className="cursor-pointer">
          <Logo variant="dark" iconSize={32} showWordmark={true} />
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-12 items-center">
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-8 md:p-10">
              <h1 className="text-3xl font-semibold text-[#1A1A1A] mb-8 tracking-tight">
                {mode === 'login' ? 'Welcome back' : 'Create your account'}
              </h1>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {error}
                </div>
              )}

              {message && (
                <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-xl text-sm">
                  {message}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'signup' && (
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]"
                      placeholder="Enter your name"
                      required
                      disabled={loading}
                    />
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all outline-none text-[#1A1A1A]"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                </div>

                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all flex items-center justify-center gap-3 text-[#1A1A1A] font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  Continue with Google
                </button>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">or</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-xl bg-[#1A1A1A] text-white font-medium hover:bg-gray-800 transition-all hover:shadow-lg hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
                >
                  {loading && (
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                  {loading ? 'Loading...' : (mode === 'login' ? 'Login' : 'Create Account')}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                  className="text-sm text-gray-600 hover:text-[#1A1A1A] transition-colors"
                >
                  {mode === 'login' ? (
                    <>
                      New to Foundrly? <span className="font-medium">Sign up</span>
                    </>
                  ) : (
                    <>
                      Already have an account? <span className="font-medium">Login</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex justify-center items-center">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-slate-100/30 rounded-full blur-3xl scale-150" />
              <RobotChatbot size={200} animate={true} gesture="wave" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
