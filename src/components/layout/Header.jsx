import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Menu, LogOut, LayoutDashboard, LogIn } from 'lucide-react';
import UserAvatar from '../ui/UserAvatar';

const Header = ({ toggleSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-100 sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-3">
            <button onClick={toggleSidebar} className="p-2 rounded-xl hover:bg-gray-100 lg:hidden transition-colors">
              <Menu className="w-6 h-6 text-gray-600" />
            </button>
            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform duration-300">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 hidden sm:block tracking-tight">
                TGT Explorer
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
             {user ? (
               <div className="flex items-center gap-3 pl-1 pr-4 py-1 rounded-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow bg-white">
                  {/* Clickable Avatar to go to stats */}
                  <button onClick={() => navigate('/leaderboard')} className="transition-transform hover:scale-110">
                    <UserAvatar avatarId={user.avatarId} size="sm" />
                  </button>

                  <div className="h-4 w-px bg-gray-200"></div>
                  
                  <button 
                    onClick={() => navigate('/leaderboard')}
                    className="flex items-center gap-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-wide"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Stats
                  </button>
                  
                  <div className="h-4 w-px bg-gray-200"></div>
                  
                  <button 
                    onClick={logout} 
                    title="Logout" 
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                     <LogOut className="w-4 h-4" />
                  </button>
               </div>
             ) : (
                <button 
                  onClick={() => navigate('/login')}
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-0.5"
                >
                  <LogIn className="w-4 h-4" /> Login
                </button>
             )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
