import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import SEO from '../components/SEO';
import { Lock, User, UserPlus, Atom, Sparkles } from 'lucide-react';

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, passkey }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Redirect to login after success
        navigate('/login'); 
      } else {
        setError(data.error || 'Failed to create account.');
      }
    } catch (err) {
      setError('Connection failed. Please check your internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <SEO title="Sign Up" description="Create your TGT Explorer account." />
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-emerald-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-teal-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl p-10 sm:p-12 max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-tr from-emerald-500 to-teal-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/30 transform -rotate-6 hover:rotate-0 transition-transform duration-500">
            <UserPlus className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">Join TGT Explorer</h1>
          <p className="text-emerald-200 text-sm font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Start your journey
          </p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          {error && (
            <div className="bg-rose-500/10 text-rose-200 text-sm font-medium p-4 rounded-xl border border-rose-500/20 flex items-center gap-3">
              <span className="w-2 h-2 bg-rose-400 rounded-full flex-shrink-0 animate-pulse"></span>
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-emerald-300 group-focus-within:text-white transition-colors" />
               </div>
               <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-14 pr-5 py-4 bg-gray-900/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium"
                  placeholder="Choose Username"
               />
            </div>

            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-emerald-300 group-focus-within:text-white transition-colors" />
               </div>
               <input
                  type="password"
                  required
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  className="block w-full pl-14 pr-5 py-4 bg-gray-900/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all font-medium"
                  placeholder="Create Passkey (Min 6 chars)"
               />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-900/50 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group text-lg disabled:opacity-50"
          >
            {isLoading ? 'Creating Account...' : 'Sign Up Now'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-gray-400 text-sm mb-3">Already have an account?</p>
            <Link 
                to="/login"
                className="text-emerald-300 hover:text-white font-bold transition-colors"
            >
                Log In here
            </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
