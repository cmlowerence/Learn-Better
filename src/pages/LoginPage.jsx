import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Keep this if you use it elsewhere
import SEO from '../components/SEO'; 
import { Lock, User, ArrowRight, Atom, Sparkles, UserX } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [passkey, setPasskey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth(); // We might override this logic
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // 1. Call your new Vercel Backend
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, passkey }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // 2. Save the data to LocalStorage so your app works as before
        localStorage.setItem('tgt_current_user', JSON.stringify({
           username: data.user.username,
           role: data.user.role,
           loginTime: new Date().toISOString()
        }));
        
        // 3. Restore History from Database
        if(data.user.quiz_history) {
           localStorage.setItem(`tgt_detailed_history_${data.user.username}`, JSON.stringify(data.user.quiz_history));
        }
        if(data.user.quiz_progress) {
           localStorage.setItem(`tgt_progress_${data.user.username}`, JSON.stringify(data.user.quiz_progress));
        }

        // 4. Update Context (Optional, if your context just reads localStorage, this works automatically)
        // login(username, passkey); 
        
        navigate('/');
      } else {
        setError(data.error || 'The credentials provided do not match the archives.');
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      <SEO title="Login" description="Secure access portal for TGT Explorer students." />
      
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-violet-600 rounded-full mix-blend-screen filter blur-[120px] opacity-20 animate-pulse delay-1000"></div>
      </div>

      <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl p-10 sm:p-12 max-w-md w-full relative z-10">
        <div className="text-center mb-10">
          <div className="bg-gradient-to-tr from-indigo-500 to-violet-600 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-indigo-500/30 transform rotate-6 hover:rotate-12 transition-transform duration-500">
            <Atom className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3 tracking-tight">TGT Explorer</h1>
          <p className="text-indigo-200 text-sm font-medium flex items-center justify-center gap-2">
            <Sparkles className="w-3.5 h-3.5" /> Database Connected
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-rose-500/10 text-rose-200 text-sm font-medium p-4 rounded-xl border border-rose-500/20 flex items-center gap-3">
              <span className="w-2 h-2 bg-rose-400 rounded-full flex-shrink-0 animate-pulse"></span>
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-indigo-300 group-focus-within:text-white transition-colors" />
               </div>
               <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-14 pr-5 py-4 bg-gray-900/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
                  placeholder="Username"
               />
            </div>

            <div className="relative group">
               <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-indigo-300 group-focus-within:text-white transition-colors" />
               </div>
               <input
                  type="password"
                  required
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  className="block w-full pl-14 pr-5 py-4 bg-gray-900/50 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all font-medium"
                  placeholder="Passkey"
               />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 rounded-2xl shadow-lg shadow-indigo-900/50 transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 group text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Authenticating...' : 'Authenticate'} 
            {!isLoading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-indigo-200/40 text-[10px] font-black uppercase tracking-widest mb-4">Or continue as guest</p>
            <button 
                onClick={() => navigate('/')}
                className="w-full bg-white/5 hover:bg-white/10 text-indigo-200 font-bold py-3.5 rounded-2xl border border-white/5 transition-all flex items-center justify-center gap-3 text-sm"
            >
              <div className="text-center mb-6">
  <p className="text-gray-400 text-sm">
    Don't have an account?{' '}
    <button 
      onClick={() => navigate('/signup')} 
      className="text-indigo-300 hover:text-white font-bold underline decoration-indigo-500/30 underline-offset-4 transition-all"
    >
      Create one
    </button>
  </p>
</div>

                <UserX className="w-4 h-4" /> Skip Login
            </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
